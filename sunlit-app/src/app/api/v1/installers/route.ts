/**
 * GET /api/v1/installers — Public installer directory search
 * POST /api/v1/installers — Create installer profile (authenticated)
 * 
 * Public GET returns PublicInstallerCardView[] only.
 * POST requires authenticated installer session.
 * 
 * Rate-limited by IP for public access.
 * All mutations audit-logged.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { InstallerService, type InstallerSearchFilters } from '@/core/installer/InstallerService';
import { parseSessionCookie } from '@/shared/auth/sunlit-session';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('your-project-id') || key.includes('your-service-role-key')) {
    return null;
  }
  return createClient(url, key);
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project-id') || key.includes('your-anon-key')) {
    return null;
  }
  return createClient(url, key);
}

/**
 * GET /api/v1/installers
 * 
 * Public endpoint — no authentication required.
 * Returns PublicInstallerCardView[] with pagination.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: InstallerSearchFilters = {
      query: searchParams.get('q') || undefined,
      state: searchParams.get('state') || undefined,
      city: searchParams.get('city') || undefined,
      services: searchParams.get('services')?.split(',').filter(Boolean) || undefined,
      verification_level: searchParams.get('verification') as InstallerSearchFilters['verification_level'] || undefined,
      min_rating: searchParams.get('min_rating') ? parseFloat(searchParams.get('min_rating')!) : undefined,
      min_score: searchParams.get('min_score') ? parseFloat(searchParams.get('min_score')!) : undefined,
      residential: searchParams.get('residential') === 'true' || undefined,
      commercial: searchParams.get('commercial') === 'true' || undefined,
      industrial: searchParams.get('industrial') === 'true' || undefined,
      battery_storage: searchParams.get('battery_storage') === 'true' || undefined,
      availability: searchParams.get('availability') as InstallerSearchFilters['availability'] || undefined,
      sort_by: (searchParams.get('sort') as InstallerSearchFilters['sort_by']) || 'score',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!), 50) : 20,
    };

    const supabase = getAnonClient();
    const service = new InstallerService(supabase);
    const result = await service.search(filters);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[API] GET /api/v1/installers error:', error);
    return NextResponse.json(
      { error: 'Failed to search installers' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/installers
 * 
 * Authenticated endpoint — requires installer session.
 * Creates a new installer profile with immutable slug.
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication required
    const raw = request.cookies.get('sunlit_session')?.value;
    const session = parseSessionCookie(raw);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // RBAC: only installers and epc_contractors can create profiles
    if (!['installer', 'epc_contractor', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Input validation
    if (!body.business_name || typeof body.business_name !== 'string' || body.business_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'business_name is required (minimum 2 characters)' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const service = new InstallerService(supabase);
    
    const profile = await service.create({
      user_id: session.user_id,
      business_name: body.business_name.trim(),
      business_type: body.business_type || (session.role === 'epc_contractor' ? 'epc_contractor' : 'installer'),
      business_description: body.business_description,
      headquarters_state: body.headquarters_state,
      headquarters_city: body.headquarters_city,
      public_email: body.public_email,
      public_phone: body.public_phone,
      website_url: body.website_url,
    });

    // Audit log
    console.log(`[AUDIT] INSTALLER_PROFILE_CREATED user=${session.user_id} slug=${profile.slug}`);

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/v1/installers error:', error);
    return NextResponse.json(
      { error: 'Failed to create installer profile' },
      { status: 500 }
    );
  }
}
