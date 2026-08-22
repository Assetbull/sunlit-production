/**
 * GET /api/v1/services-taxonomy — Canonical service taxonomy
 * 
 * Public endpoint for service filters and service-specific directory pages.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function GET() {
  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('service_taxonomy')
      .select('name, slug, category, description, icon, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      // Fallback canonical services
      const fallbackServices = [
        { name: 'Solar Panel Installation', slug: 'solar-panel-installation', category: 'solar_installation', icon: 'solar_power' },
        { name: 'Commercial Solar Systems', slug: 'commercial-solar-systems', category: 'commercial_solar', icon: 'business' },
        { name: 'Industrial Solar Solutions', slug: 'industrial-solar-solutions', category: 'industrial_solar', icon: 'factory' },
        { name: 'Battery Storage Systems', slug: 'battery-storage-systems', category: 'battery_storage', icon: 'battery_charging_full' },
        { name: 'Microgrid Design & Installation', slug: 'microgrid-design-installation', category: 'microgrids', icon: 'grid_on' },
        { name: 'Solar Maintenance & Repair', slug: 'solar-maintenance-repair', category: 'solar_maintenance', icon: 'build' },
        { name: 'EV Charging Infrastructure', slug: 'ev-charging-infrastructure', category: 'ev_infrastructure', icon: 'ev_station' },
      ];
      return NextResponse.json({ data: fallbackServices });
    }

    return NextResponse.json({ data: data || [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[API] GET /api/v1/services-taxonomy error:', error);
    return NextResponse.json({ error: 'Failed to retrieve services taxonomy' }, { status: 500 });
  }
}
