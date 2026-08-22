import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunlit.energy';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/installers',
          '/installers/*',
          '/services',
          '/services/*',
          '/about',
          '/resources',
          '/tools',
          '/request-quote',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/admin',
          '/admin/*',
          '/mock-login',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
