/**
 * Installer Intelligence Network — Database Types
 * 
 * These types define the public-facing Installer Intelligence layer.
 * They represent the READ-OPTIMIZED PUBLIC PROJECTION over the private
 * Sunlit platform data, per the approved architecture:
 * 
 *   PRIVATE SUNLIT PLATFORM → approved public projection → PUBLIC DIRECTORY
 * 
 * Design decisions:
 * - Slug format: company-name-short-opaque-id (immutable, URL-safe)
 * - Public profiles expose ONLY approved public fields
 * - Private fields (KYC, CAC, NIN, etc.) are NEVER in these types
 * - Internal Supabase IDs are not exposed in public responses
 */

// =============================================
// Installer Profile (Public Layer)
// =============================================

export type InstallerProfileStatus = 'draft' | 'published' | 'suspended';
export type VerificationLevel = 'unverified' | 'basic' | 'standard' | 'advanced' | 'enterprise';
export type InstallerType = 'installer' | 'epc_contractor';
export type AvailabilityStatus = 'accepting_projects' | 'limited_availability' | 'not_accepting' | 'unavailable';

export interface InstallerProfile {
  id: string;
  user_id: string;
  organization_id?: string;
  
  // Slug: immutable canonical URL identifier
  slug: string; // e.g. "solarcraft-energy-a8f42c"
  
  // Public identity
  business_name: string;
  business_description?: string;
  business_type: InstallerType;
  logo_url?: string;
  cover_image_url?: string;
  website_url?: string;
  
  // Public contact (only designated public contact info)
  public_email?: string;
  public_phone?: string;
  
  // Location
  headquarters_state?: string;
  headquarters_city?: string;
  headquarters_address?: string; // Only if explicitly set as public
  
  // Capabilities
  residential: boolean;
  commercial: boolean;
  industrial: boolean;
  battery_storage: boolean;
  microgrid: boolean;
  ev_infrastructure: boolean;
  system_size_min_kw?: number;
  system_size_max_kw?: number;
  
  // Trust & verification
  verification_level: VerificationLevel;
  verified_at?: string;
  verification_expires_at?: string;
  
  // Score
  sunlit_score?: number; // 0-100, computed by InstallerScoreService
  score_version?: string;
  score_calculated_at?: string;
  
  // Activity & freshness
  availability_status: AvailabilityStatus;
  availability_updated_at?: string;
  last_project_at?: string;
  last_review_at?: string;
  last_activity_at?: string;
  profile_updated_at?: string;
  
  // Stats (aggregated, not raw data)
  completed_projects_count: number;
  active_projects_count: number;
  total_capacity_installed_kw: number;
  average_rating?: number; // 1-5
  review_count: number;
  years_experience?: number;
  
  // Social
  linkedin_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  
  // Status
  status: InstallerProfileStatus;
  published_at?: string;
  
  // Warranty & maintenance
  offers_warranty: boolean;
  warranty_description?: string;
  offers_maintenance: boolean;
  maintenance_description?: string;
  offers_financing: boolean;
  financing_description?: string;
  
  // Audit
  created_at: string;
  updated_at: string;
  created_by: string;
}

// =============================================
// Public Projection (what the API actually returns)
// =============================================

/**
 * PublicInstallerView — the ONLY shape returned by public API endpoints.
 * This is a strict subset of InstallerProfile.
 * NEVER return the raw InstallerProfile to public consumers.
 */
export interface PublicInstallerView {
  slug: string;
  business_name: string;
  business_description?: string;
  business_type: InstallerType;
  logo_url?: string;
  cover_image_url?: string;
  website_url?: string;
  public_email?: string;
  public_phone?: string;
  headquarters_state?: string;
  headquarters_city?: string;
  residential: boolean;
  commercial: boolean;
  industrial: boolean;
  battery_storage: boolean;
  microgrid: boolean;
  ev_infrastructure: boolean;
  system_size_min_kw?: number;
  system_size_max_kw?: number;
  verification_level: VerificationLevel;
  verified_at?: string;
  sunlit_score?: number;
  availability_status: AvailabilityStatus;
  completed_projects_count: number;
  total_capacity_installed_kw: number;
  average_rating?: number;
  review_count: number;
  years_experience?: number;
  linkedin_url?: string;
  offers_warranty: boolean;
  offers_maintenance: boolean;
  offers_financing: boolean;
  last_activity_at?: string;
  published_at?: string;
  // Relations (loaded separately)
  services?: PublicServiceView[];
  service_areas?: PublicServiceAreaView[];
  certifications?: PublicCertificationView[];
}

/**
 * PublicInstallerCardView — minimal card for directory listings.
 */
export interface PublicInstallerCardView {
  slug: string;
  business_name: string;
  business_type: InstallerType;
  logo_url?: string;
  headquarters_state?: string;
  headquarters_city?: string;
  verification_level: VerificationLevel;
  sunlit_score?: number;
  availability_status: AvailabilityStatus;
  completed_projects_count: number;
  average_rating?: number;
  review_count: number;
  residential: boolean;
  commercial: boolean;
  industrial: boolean;
  services?: string[]; // service names only
}

// =============================================
// Installer Services
// =============================================

export type ServiceCategory =
  | 'solar_installation'
  | 'commercial_solar'
  | 'industrial_solar'
  | 'battery_storage'
  | 'microgrids'
  | 'solar_maintenance'
  | 'ev_infrastructure'
  | 'energy_audit'
  | 'system_design'
  | 'monitoring';

export interface InstallerService {
  id: string;
  installer_id: string;
  service_id: string;
  description?: string;
  created_at: string;
}

export interface ServiceTaxonomy {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface PublicServiceView {
  slug: string;
  name: string;
  category: ServiceCategory;
  description?: string;
}

// =============================================
// Service Areas
// =============================================

export interface InstallerServiceArea {
  id: string;
  installer_id: string;
  state: string;
  city?: string;
  is_primary: boolean;
  created_at: string;
}

export interface PublicServiceAreaView {
  state: string;
  city?: string;
  is_primary: boolean;
}

// =============================================
// Installer Capabilities
// =============================================

export interface InstallerCapability {
  id: string;
  installer_id: string;
  technology: string; // e.g. "monocrystalline", "lithium-ion"
  equipment_brands?: string[];
  capacity_min_kw?: number;
  capacity_max_kw?: number;
  created_at: string;
}

// =============================================
// Certifications
// =============================================

export type CertificationStatus = 'pending' | 'verified' | 'expired' | 'rejected';

export interface InstallerCertification {
  id: string;
  installer_id: string;
  name: string;
  issuing_body: string;
  certificate_number?: string;
  issued_at?: string;
  expires_at?: string;
  status: CertificationStatus;
  verified_at?: string;
  verified_by?: string;
  document_url?: string; // Private storage - signed URL only
  created_at: string;
  updated_at: string;
}

export interface PublicCertificationView {
  name: string;
  issuing_body: string;
  issued_at?: string;
  expires_at?: string;
  status: CertificationStatus;
  verified_at?: string;
}

// =============================================
// Verification
// =============================================

export type VerificationSignal =
  | 'cac_verified'
  | 'identity_verified'
  | 'address_verified'
  | 'technical_verified'
  | 'portfolio_verified'
  | 'project_verified'
  | 'certification_verified'
  | 'review_verified'
  | 'insurance_verified'
  | 'warranty_verified';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface InstallerVerification {
  id: string;
  installer_id: string;
  signal: VerificationSignal;
  status: VerificationStatus;
  verified_at?: string;
  verified_by?: string;
  expires_at?: string;
  evidence_url?: string; // Private storage
  notes?: string; // Internal only
  created_at: string;
  updated_at: string;
}

// =============================================
// Installer Score
// =============================================

export interface InstallerScore {
  id: string;
  installer_id: string;
  total_score: number; // 0-100
  version: string;
  calculated_at: string;
  
  // Component scores
  technical_capability: number;     // weight: 25%
  verified_experience: number;      // weight: 20%
  customer_satisfaction: number;    // weight: 20%
  response_reliability: number;     // weight: 10%
  completion_reliability: number;   // weight: 10%
  experience: number;               // weight: 10%
  documentation_verification: number; // weight: 5%
  
  // Metadata
  evidence_snapshot: Record<string, unknown>;
  created_at: string;
}

export interface InstallerScoreConfig {
  id: string;
  version: string;
  weights: {
    technical_capability: number;
    verified_experience: number;
    customer_satisfaction: number;
    response_reliability: number;
    completion_reliability: number;
    experience: number;
    documentation_verification: number;
  };
  is_active: boolean;
  created_at: string;
}

// =============================================
// Activity
// =============================================

export type ActivityEventType =
  | 'installer_created'
  | 'installer_verified'
  | 'installer_updated'
  | 'project_created'
  | 'project_verified'
  | 'project_completed'
  | 'review_created'
  | 'review_verified'
  | 'service_added'
  | 'service_area_added'
  | 'certification_verified'
  | 'availability_updated'
  | 'portfolio_updated'
  | 'installer_response'
  | 'project_updated';

export interface InstallerActivity {
  id: string;
  installer_id: string;
  event_type: ActivityEventType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  is_public: boolean;
  is_moderated: boolean;
  created_at: string;
}

// =============================================
// Public Projects
// =============================================

export type PublicProjectStatus = 'draft' | 'published' | 'archived';

export interface PublicProject {
  id: string;
  installer_id: string;
  slug: string;
  title: string;
  description?: string;
  customer_type: 'residential' | 'commercial' | 'industrial';
  state?: string;
  city?: string;
  system_size_kw?: number;
  battery_capacity_kwh?: number;
  technology?: string;
  equipment_details?: Record<string, unknown>;
  completion_date?: string;
  images?: string[];
  verification_status: VerificationStatus;
  status: PublicProjectStatus;
  created_at: string;
  updated_at: string;
}

// =============================================
// Public Reviews
// =============================================

export type ReviewModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type ReviewerType = 'verified_customer' | 'verified_project' | 'unverified';

export interface PublicReview {
  id: string;
  installer_id: string;
  project_id?: string;
  reviewer_user_id: string;
  reviewer_type: ReviewerType;
  rating: number; // 1-5
  title?: string;
  content?: string;
  moderation_status: ReviewModerationStatus;
  installer_response?: string;
  installer_response_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// Locations
// =============================================

export interface Location {
  id: string;
  state: string;
  state_slug: string;
  city?: string;
  city_slug?: string;
  latitude?: number;
  longitude?: number;
  installer_count: number;
  project_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// Saved Installers (authenticated users)
// =============================================

export interface SavedInstaller {
  id: string;
  user_id: string;
  installer_id: string;
  created_at: string;
}

// =============================================
// Search Events (analytics)
// =============================================

export interface InstallerSearchEvent {
  id: string;
  query?: string;
  filters?: Record<string, unknown>;
  results_count: number;
  user_id?: string;
  session_id?: string;
  created_at: string;
}

// =============================================
// RFQ Matches (extends existing matching engine)
// =============================================

export interface RfqMatch {
  id: string;
  rfq_id: string;
  installer_id: string;
  match_score: number; // 0-100
  match_reasons: MatchReason[];
  algorithm_version: string;
  created_at: string;
}

export interface MatchReason {
  signal: string;
  label: string;
  met: boolean;
  weight: number;
}

// =============================================
// Admin Moderation
// =============================================

export type ModerationAction = 
  | 'verify_installer'
  | 'reject_verification'
  | 'approve_review'
  | 'reject_review'
  | 'flag_profile'
  | 'suspend_profile'
  | 'unsuspend_profile'
  | 'verify_project'
  | 'verify_certification'
  | 'recalculate_score';

export interface ModerationQueueItem {
  id: string;
  entity_type: 'installer' | 'review' | 'project' | 'certification';
  entity_id: string;
  action: ModerationAction;
  status: 'pending' | 'completed' | 'skipped';
  admin_user_id?: string;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

// =============================================
// Installer Documents (Private - NEVER public)
// =============================================

export type DocumentType = 
  | 'cac_certificate'
  | 'identity_document'
  | 'tax_clearance'
  | 'insurance_certificate'
  | 'professional_license'
  | 'portfolio_evidence'
  | 'bank_verification'
  | 'other';

export interface InstallerDocument {
  id: string;
  installer_id: string;
  document_type: DocumentType;
  file_url: string; // Private Supabase storage - signed URL access only
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  verified_by?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// Knowledge Articles (Sanity CMS references)
// =============================================

export interface KnowledgeRelation {
  id: string;
  sanity_article_id: string; // Sanity document ID
  entity_type: 'installer' | 'location' | 'service' | 'project';
  entity_id: string;
  created_at: string;
}
