/**
 * Seed Script — Populate Supabase with Realistic Installer Intelligence Mock Data
 * 
 * Usage:
 *   npx tsx scripts/seed-installer-intelligence.ts
 *   or via package script: npm run seed:installers
 */

import { createClient } from '@supabase/supabase-js';
import { MOCK_INSTALLERS_DATA } from '../src/core/installer/mock-installers-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('⚠️  Supabase environment variables not set. Skipping live DB seed.');
  console.log('✅  In-memory mock data engine is active for all development & preview routes.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  console.log('🌱 Starting Sunlit Installer Intelligence Database Seed...');

  for (const inst of MOCK_INSTALLERS_DATA) {
    console.log(`Inserting installer profile: ${inst.business_name} (${inst.slug})...`);

    // Insert profile
    const { data: profile, error: profileError } = await supabase
      .from('installer_profiles')
      .upsert(
        {
          slug: inst.slug,
          business_name: inst.business_name,
          business_type: inst.business_type,
          business_description: inst.business_description,
          headquarters_state: inst.headquarters_state,
          headquarters_city: inst.headquarters_city,
          verification_level: inst.verification_level,
          sunlit_score: inst.sunlit_score,
          average_rating: inst.average_rating,
          review_count: inst.review_count,
          completed_projects_count: inst.completed_projects_count,
          total_capacity_installed_kw: inst.total_capacity_installed_kw,
          availability_status: inst.availability_status,
          years_experience: inst.years_experience,
          residential: inst.residential,
          commercial: inst.commercial,
          industrial: inst.industrial,
          battery_storage: inst.battery_storage,
          microgrid: inst.microgrid,
          ev_infrastructure: inst.ev_infrastructure,
          offers_warranty: inst.offers_warranty,
          offers_maintenance: inst.offers_maintenance,
          offers_financing: inst.offers_financing,
          status: 'published',
          published_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (profileError) {
      console.error(`Error inserting profile ${inst.slug}:`, profileError.message);
      continue;
    }

    const installerId = profile.id;

    // Insert services
    if (inst.services && inst.services.length > 0) {
      for (const srv of inst.services) {
        await supabase.from('installer_services').upsert(
          {
            installer_id: installerId,
            service_id: srv.slug,
            description: srv.description,
          },
          { onConflict: 'installer_id,service_id' }
        );
      }
    }

    // Insert service areas
    if (inst.service_areas && inst.service_areas.length > 0) {
      for (const area of inst.service_areas) {
        await supabase.from('installer_service_areas').insert({
          installer_id: installerId,
          state: area.state,
          city: area.city,
          is_primary: area.is_primary,
        });
      }
    }
  }

  console.log('🎉 Successfully seeded Sunlit Installer Intelligence dataset!');
}

seed().catch((err) => {
  console.error('❌ Seed script failed:', err);
  process.exit(1);
});
