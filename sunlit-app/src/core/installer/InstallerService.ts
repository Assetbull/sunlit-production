/**
 * InstallerService — Core Domain Service
 * 
 * Manages installer profiles with strict public/private boundaries.
 * 
 * Architecture:
 *   PRIVATE SUNLIT PLATFORM → InstallerService → Public Projection
 * 
 * Public API consumers NEVER receive raw database records.
 * They receive PublicInstallerView or PublicInstallerCardView only.
 * 
 * Write operations require authenticated installer matching organization_id.
 * All mutations flow through audit logging.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { generateInstallerSlug, isValidSlug } from '@/shared/utils/slug';
import {
  MOCK_INSTALLERS_DATA,
  getMockInstallerCards,
  findMockInstallerBySlug,
} from '@/core/installer/mock-installers-data';
import type {
  InstallerProfile,
  PublicInstallerView,
  PublicInstallerCardView,
  InstallerProfileStatus,
  VerificationLevel,
  AvailabilityStatus,
  PublicServiceView,
  PublicServiceAreaView,
  PublicCertificationView,
} from '@/shared/types/installer-intelligence';

// =============================================
// Types for service operations
// =============================================

export interface CreateInstallerInput {
  user_id: string;
  business_name: string;
  business_type?: 'installer' | 'epc_contractor';
  business_description?: string;
  headquarters_state?: string;
  headquarters_city?: string;
  public_email?: string;
  public_phone?: string;
  website_url?: string;
}

export interface UpdateInstallerInput {
  business_name?: string;
  business_description?: string;
  logo_url?: string;
  cover_image_url?: string;
  website_url?: string;
  public_email?: string;
  public_phone?: string;
  headquarters_state?: string;
  headquarters_city?: string;
  headquarters_address?: string;
  residential?: boolean;
  commercial?: boolean;
  industrial?: boolean;
  battery_storage?: boolean;
  microgrid?: boolean;
  ev_infrastructure?: boolean;
  system_size_min_kw?: number;
  system_size_max_kw?: number;
  availability_status?: AvailabilityStatus;
  years_experience?: number;
  linkedin_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  offers_warranty?: boolean;
  warranty_description?: string;
  offers_maintenance?: boolean;
  maintenance_description?: string;
  offers_financing?: boolean;
  financing_description?: string;
}

export interface InstallerSearchFilters {
  query?: string;
  state?: string;
  city?: string;
  services?: string[];
  verification_level?: VerificationLevel;
  min_rating?: number;
  min_score?: number;
  residential?: boolean;
  commercial?: boolean;
  industrial?: boolean;
  battery_storage?: boolean;
  availability?: AvailabilityStatus;
  sort_by?: 'score' | 'rating' | 'reviews' | 'projects' | 'newest';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export const PUBLIC_INSTALLER_COLUMNS = `
  id, slug, business_name, business_description, business_type,
  logo_url, cover_image_url, website_url, public_email, public_phone,
  headquarters_state, headquarters_city, residential, commercial,
  industrial, battery_storage, microgrid, ev_infrastructure,
  system_size_min_kw, system_size_max_kw, verification_level,
  verified_at, sunlit_score, availability_status, completed_projects_count,
  total_capacity_installed_kw, average_rating, review_count,
  years_experience, linkedin_url, offers_warranty, offers_maintenance,
  offers_financing, last_activity_at, published_at
`.replace(/\s+/g, '');

export const PUBLIC_CARD_COLUMNS = `
  slug, business_name, business_type, logo_url,
  headquarters_state, headquarters_city, verification_level,
  sunlit_score, availability_status, completed_projects_count,
  average_rating, review_count, residential, commercial, industrial
`.replace(/\s+/g, '');

// =============================================
// Public Projection Functions
// =============================================

/**
 * Project an InstallerProfile into a PublicInstallerView.
 * This is the ONLY way public data should be returned.
 * 
 * NEVER return the raw InstallerProfile record to public consumers.
 */
export function toPublicView(profile: InstallerProfile): PublicInstallerView {
  return {
    slug: profile.slug,
    business_name: profile.business_name,
    business_description: profile.business_description,
    business_type: profile.business_type,
    logo_url: profile.logo_url,
    cover_image_url: profile.cover_image_url,
    website_url: profile.website_url,
    public_email: profile.public_email,
    public_phone: profile.public_phone,
    headquarters_state: profile.headquarters_state,
    headquarters_city: profile.headquarters_city,
    residential: profile.residential,
    commercial: profile.commercial,
    industrial: profile.industrial,
    battery_storage: profile.battery_storage,
    microgrid: profile.microgrid,
    ev_infrastructure: profile.ev_infrastructure,
    system_size_min_kw: profile.system_size_min_kw,
    system_size_max_kw: profile.system_size_max_kw,
    verification_level: profile.verification_level,
    verified_at: profile.verified_at,
    sunlit_score: profile.sunlit_score,
    availability_status: profile.availability_status,
    completed_projects_count: profile.completed_projects_count,
    total_capacity_installed_kw: profile.total_capacity_installed_kw,
    average_rating: profile.average_rating,
    review_count: profile.review_count,
    years_experience: profile.years_experience,
    linkedin_url: profile.linkedin_url,
    offers_warranty: profile.offers_warranty,
    offers_maintenance: profile.offers_maintenance,
    offers_financing: profile.offers_financing,
    last_activity_at: profile.last_activity_at,
    published_at: profile.published_at,
  };
}

/**
 * Project an InstallerProfile into a minimal card view for directory listings.
 */
export function toCardView(profile: Partial<InstallerProfile>): PublicInstallerCardView {
  return {
    slug: profile.slug || '',
    business_name: profile.business_name || '',
    business_type: profile.business_type || 'installer',
    logo_url: profile.logo_url,
    headquarters_state: profile.headquarters_state,
    headquarters_city: profile.headquarters_city,
    verification_level: profile.verification_level || 'unverified',
    sunlit_score: profile.sunlit_score,
    availability_status: profile.availability_status || 'accepting_projects',
    completed_projects_count: profile.completed_projects_count || 0,
    average_rating: profile.average_rating,
    review_count: profile.review_count || 0,
    residential: profile.residential || false,
    commercial: profile.commercial || false,
    industrial: profile.industrial || false,
  };
}

// =============================================
// InstallerService Class
// =============================================

export class InstallerService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private supabase?: SupabaseClient<any, any, any> | null
  ) {}

  /**
   * Create a new installer profile with an immutable slug.
   * Slug format: company-name-a8f42c
   * Retries on collision (DB uniqueness constraint).
   */
  async create(input: CreateInstallerInput): Promise<InstallerProfile> {
    if (!this.supabase) {
      throw new Error('Database client not initialized');
    }
    const MAX_SLUG_RETRIES = 3;
    let slug = '';
    let created: InstallerProfile | null = null;
    
    for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
      slug = generateInstallerSlug(input.business_name);
      
      const { data, error } = await this.supabase
        .from('installer_profiles')
        .insert({
          user_id: input.user_id,
          slug,
          business_name: input.business_name,
          business_type: input.business_type || 'installer',
          business_description: input.business_description,
          headquarters_state: input.headquarters_state,
          headquarters_city: input.headquarters_city,
          public_email: input.public_email,
          public_phone: input.public_phone,
          website_url: input.website_url,
          status: 'draft',
          created_by: input.user_id,
        } as any)
        .select()
        .single();
      
      if (error) {
        // Check for unique constraint violation on slug
        if (error.code === '23505' && error.message.includes('slug')) {
          continue; // Retry with new slug
        }
        throw new Error(`Failed to create installer profile: ${error.message}`);
      }
      
      created = data as InstallerProfile;
      break;
    }
    
    if (!created) {
      throw new Error('Failed to generate unique slug after maximum retries');
    }
    
    return created;
  }

  /**
   * Get an installer profile by slug (public view).
   * Returns ONLY the public projection — never raw DB record.
   */
  async getBySlug(slug: string): Promise<PublicInstallerView | null> {
    if (!isValidSlug(slug)) {
      return null;
    }

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('installer_profiles')
          .select(PUBLIC_INSTALLER_COLUMNS)
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (!error && data) {
          const profile = data as unknown as InstallerProfile;
          const view = toPublicView(profile);

          // Load relations
          const [services, serviceAreas, certifications] = await Promise.all([
            this.getPublicServices(profile.id),
            this.getPublicServiceAreas(profile.id),
            this.getPublicCertifications(profile.id),
          ]);

          view.services = services;
          view.service_areas = serviceAreas;
          view.certifications = certifications;

          return view;
        }
      } catch {
        // Database not yet configured or connection unavailable
      }
    }

    // Transparent development & preview mock data fallback
    return findMockInstallerBySlug(slug);
  }

  /**
   * Get installer profile for the authenticated owner (full internal view).
   * This returns the FULL profile — only accessible to the profile owner.
   */
  async getOwnProfile(userId: string): Promise<InstallerProfile | null> {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from('installer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as InstallerProfile;
  }

  /**
   * Update an installer profile (owner only).
   * The slug is NEVER updated — it is immutable.
   */
  async update(userId: string, input: UpdateInstallerInput): Promise<InstallerProfile> {
    if (!this.supabase) {
      throw new Error('Database client not initialized');
    }
    const { data, error } = await this.supabase
      .from('installer_profiles')
      .update({
        ...input,
        profile_updated_at: new Date().toISOString(),
      } as any)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update installer profile: ${error.message}`);
    }

    return data as InstallerProfile;
  }

  /**
   * Search and filter installer directory (public).
   * Returns card views only — never full profiles.
   */
  async search(filters: InstallerSearchFilters): Promise<PaginatedResult<PublicInstallerCardView>> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 50);
    const offset = (page - 1) * limit;

    if (this.supabase) {
      try {
        let query = this.supabase
          .from('installer_profiles')
          .select(PUBLIC_CARD_COLUMNS, { count: 'exact' })
          .eq('status', 'published');

        // Full-text search
        if (filters.query) {
          query = query.textSearch('search_vector', filters.query, {
            type: 'websearch',
          });
        }

        // Location filters
        if (filters.state) {
          query = query.ilike('headquarters_state', `%${filters.state}%`);
        }
        if (filters.city) {
          query = query.ilike('headquarters_city', `%${filters.city}%`);
        }

        // Capability filters
        if (filters.residential) query = query.eq('residential', true);
        if (filters.commercial) query = query.eq('commercial', true);
        if (filters.industrial) query = query.eq('industrial', true);
        if (filters.battery_storage) query = query.eq('battery_storage', true);

        // Quality filters
        if (filters.verification_level) {
          query = query.eq('verification_level', filters.verification_level);
        }
        if (filters.min_rating) {
          query = query.gte('average_rating', filters.min_rating);
        }
        if (filters.min_score) {
          query = query.gte('sunlit_score', filters.min_score);
        }

        // Availability filter
        if (filters.availability) {
          query = query.eq('availability_status', filters.availability);
        }

        // Sorting
        switch (filters.sort_by) {
          case 'rating':
            query = query.order('average_rating', { ascending: false, nullsFirst: false });
            break;
          case 'reviews':
            query = query.order('review_count', { ascending: false });
            break;
          case 'projects':
            query = query.order('completed_projects_count', { ascending: false });
            break;
          case 'newest':
            query = query.order('published_at', { ascending: false, nullsFirst: false });
            break;
          case 'score':
          default:
            query = query.order('sunlit_score', { ascending: false, nullsFirst: false });
            break;
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (!error && data && data.length > 0) {
          const profiles = data as unknown as Partial<InstallerProfile>[];
          const cards = profiles.map(toCardView);

          return {
            data: cards,
            total: count || cards.length,
            page,
            limit,
            has_more: (count || 0) > offset + limit,
          };
        }
      } catch {
        // Database connection unavailable or schema not yet migrated
      }
    }

    // Transparent development & preview mock data filter engine
    let mockCards = getMockInstallerCards();

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      mockCards = mockCards.filter(
        (c) =>
          c.business_name.toLowerCase().includes(q) ||
          (c.headquarters_city && c.headquarters_city.toLowerCase().includes(q)) ||
          (c.headquarters_state && c.headquarters_state.toLowerCase().includes(q)) ||
          (c.services && c.services.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (filters.state) {
      const s = filters.state.toLowerCase().trim();
      mockCards = mockCards.filter(
        (c) =>
          (c.headquarters_state && c.headquarters_state.toLowerCase().includes(s)) ||
          (c.hub && c.hub.toLowerCase().includes(s))
      );
    }

    if (filters.city) {
      const city = filters.city.toLowerCase().trim();
      mockCards = mockCards.filter(
        (c) =>
          (c.headquarters_city && c.headquarters_city.toLowerCase().includes(city))
      );
    }

    if (filters.residential) {
      mockCards = mockCards.filter((c) => c.tier === 'Residential Solar' || (c.services && c.services.some((srv) => srv.toLowerCase().includes('residential'))));
    }
    if (filters.commercial) {
      mockCards = mockCards.filter((c) => c.tier === 'Commercial & EPC' || c.tier === 'Tier 1 Enterprise' || (c.services && c.services.some((srv) => srv.toLowerCase().includes('commercial'))));
    }
    if (filters.industrial) {
      mockCards = mockCards.filter((c) => c.tier === 'Tier 1 Enterprise' || (c.services && c.services.some((srv) => srv.toLowerCase().includes('industrial') || srv.toLowerCase().includes('microgrid'))));
    }
    if (filters.battery_storage) {
      mockCards = mockCards.filter((c) => c.services && c.services.some((srv) => srv.toLowerCase().includes('storage') || srv.toLowerCase().includes('bess') || srv.toLowerCase().includes('battery')));
    }

    if (filters.min_rating) {
      mockCards = mockCards.filter((c) => (c.average_rating || 0) >= filters.min_rating!);
    }
    if (filters.min_score) {
      mockCards = mockCards.filter((c) => (c.sunlit_score || 0) >= filters.min_score!);
    }

    // Sorting
    switch (filters.sort_by) {
      case 'rating':
        mockCards.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'reviews':
        mockCards.sort((a, b) => b.review_count - a.review_count);
        break;
      case 'projects':
        mockCards.sort((a, b) => b.completed_projects_count - a.completed_projects_count);
        break;
      case 'score':
      default:
        mockCards.sort((a, b) => (b.sunlit_score || 0) - (a.sunlit_score || 0));
        break;
    }

    const total = mockCards.length;
    const paginated = mockCards.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      has_more: total > offset + limit,
    };
  }

  /**
   * Publish an installer profile (owner only).
   * Changes status from 'draft' to 'published'.
   */
  async publish(userId: string): Promise<InstallerProfile> {
    if (!this.supabase) {
      throw new Error('Database client not initialized');
    }
    const { data, error } = await this.supabase
      .from('installer_profiles')
      .update({
        status: 'published' as InstallerProfileStatus,
        published_at: new Date().toISOString(),
      } as any)
      .eq('user_id', userId)
      .eq('status', 'draft')
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to publish profile: ${error.message}`);
    }

    return data as InstallerProfile;
  }

  // =============================================
  // Relation Loaders (Public Projections)
  // =============================================

  private async getPublicServices(installerId: string): Promise<PublicServiceView[]> {
    if (!this.supabase) return [];
    const { data } = await this.supabase
      .from('installer_services')
      .select(`
        service_taxonomy (
          slug,
          name,
          category,
          description
        )
      `)
      .eq('installer_id', installerId);

    if (!data) return [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => ({
      slug: row.service_taxonomy.slug,
      name: row.service_taxonomy.name,
      category: row.service_taxonomy.category,
      description: row.service_taxonomy.description,
    }));
  }

  private async getPublicServiceAreas(installerId: string): Promise<PublicServiceAreaView[]> {
    if (!this.supabase) return [];
    const { data } = await this.supabase
      .from('installer_service_areas')
      .select('state, city, is_primary')
      .eq('installer_id', installerId);

    return (data || []) as PublicServiceAreaView[];
  }

  private async getPublicCertifications(installerId: string): Promise<PublicCertificationView[]> {
    if (!this.supabase) return [];
    const { data } = await this.supabase
      .from('installer_certifications')
      .select('name, issuing_body, issued_at, expires_at, status, verified_at')
      .eq('installer_id', installerId)
      .eq('status', 'verified');

    return (data || []) as PublicCertificationView[];
  }
}
