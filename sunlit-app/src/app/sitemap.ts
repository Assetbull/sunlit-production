import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunlit.energy';

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/installers`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/request-quote`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Core Nigerian state & city directories
  const locationRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/installers/lagos`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/installers/lagos/lekki`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/installers/lagos/ikeja`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/installers/lagos/victoria-island`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/installers/lagos/ikoyi`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${SITE_URL}/installers/lagos/ajah`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${SITE_URL}/installers/abuja`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/installers/abuja/maitama`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/installers/abuja/wuse`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${SITE_URL}/installers/ogun`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/installers/rivers`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${SITE_URL}/installers/rivers/port-harcourt`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/installers/kano`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Fetch published installer slugs from Supabase
  let installerRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = getAnonClient();
    const { data } = await supabase
      .from('installer_profiles')
      .select('slug, updated_at')
      .eq('status', 'published')
      .limit(1000);

    if (data && data.length > 0) {
      installerRoutes = data.map((inst) => ({
        url: `${SITE_URL}/installers/${inst.slug}`,
        lastModified: inst.updated_at ? new Date(inst.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.75,
      }));
    }
  } catch (err) {
    console.error('[SITEMAP] Failed to fetch dynamic installer routes:', err);
  }

  return [...staticRoutes, ...locationRoutes, ...installerRoutes];
}
