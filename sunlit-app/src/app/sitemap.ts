import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getSiteUrl } from '@/shared/utils/site-url';

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const SITE_URL = getSiteUrl();

  // Static marketing & product routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/locations/lagos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/locations/abuja`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/locations/ogun`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/tools/solar-system-sizing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/tools/battery-capacity`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/load-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/cable-sizing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/roi-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/testimonials`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/waitlist`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/request-quote`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/trust`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/why-2026-is-nigerias-most-important-year`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog/solar-roi-in-nigeria-real-numbers-for-2026`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog/how-to-choose-the-right-solar-installer-in-lagos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog/lifepo4-vs-lead-acid-batteries-nigeria`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog/grid-tied-vs-off-grid-vs-hybrid-solar`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog/understanding-solar-escrow-nigeria`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/installers`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
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
    if (supabase) {
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
    }
  } catch (err) {
    console.error('[SITEMAP] Failed to fetch dynamic installer routes:', err);
  }

  return [...staticRoutes, ...locationRoutes, ...installerRoutes];
}
