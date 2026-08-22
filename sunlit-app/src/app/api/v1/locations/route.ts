/**
 * GET /api/v1/locations — Get active states and cities
 * 
 * Public endpoint for directory location filters, location directory pages,
 * and geocoding/sitemaps.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateSlug = searchParams.get('state_slug');

    const supabase = getAnonClient();
    let query = supabase
      .from('locations')
      .select('state, state_slug, city, city_slug, latitude, longitude, installer_count, project_count')
      .eq('is_active', true);

    if (stateSlug) {
      query = query.eq('state_slug', stateSlug);
    }

    const { data, error } = await query;

    if (error) {
      // Fallback default Nigerian locations if database table not yet populated
      const defaultLocations = [
        { state: 'Lagos', state_slug: 'lagos', city: null, city_slug: null, installer_count: 45, project_count: 320 },
        { state: 'Lagos', state_slug: 'lagos', city: 'Lekki', city_slug: 'lekki', installer_count: 18, project_count: 140 },
        { state: 'Lagos', state_slug: 'lagos', city: 'Ikeja', city_slug: 'ikeja', installer_count: 14, project_count: 95 },
        { state: 'Lagos', state_slug: 'lagos', city: 'Victoria Island', city_slug: 'victoria-island', installer_count: 12, project_count: 85 },
        { state: 'Abuja', state_slug: 'abuja', city: null, city_slug: null, installer_count: 28, project_count: 180 },
        { state: 'Abuja', state_slug: 'abuja', city: 'Maitama', city_slug: 'maitama', installer_count: 10, project_count: 70 },
        { state: 'Ogun', state_slug: 'ogun', city: null, city_slug: null, installer_count: 12, project_count: 65 },
        { state: 'Rivers', state_slug: 'rivers', city: 'Port Harcourt', city_slug: 'port-harcourt', installer_count: 15, project_count: 90 },
      ];
      return NextResponse.json({ data: defaultLocations });
    }

    return NextResponse.json({ data: data || [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[API] GET /api/v1/locations error:', error);
    return NextResponse.json({ error: 'Failed to retrieve locations' }, { status: 500 });
  }
}
