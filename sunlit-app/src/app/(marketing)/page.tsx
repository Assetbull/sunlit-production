import { Metadata } from 'next';
import { RefinedLandingPageClient } from '@/shared/components/marketing/RefinedLandingPageClient';
import { getCanonicalUrl, getSiteUrl } from '@/shared/utils/site-url';

export const metadata: Metadata = {
  title: "Sunlit Energy — Next-Generation Enterprise Public Platform",
  description:
    "Sunlit Energy connects energy projects, engineering, installers, infrastructure, and intelligence into one operating ecosystem across Africa.",
  keywords:
    'solar energy nigeria, solar installer lagos, solar finance abuja, solar panel cost lagos, clean energy nigeria, solar power lekki, offgrid solar nigeria, epc contractor nigeria',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: "Sunlit Energy — Next-Generation Enterprise Public Platform",
    description:
      "Powering Africa's next energy infrastructure. Connecting buyers, certified installers, and reliable financing to build resilient, sustainable energy systems.",
    url: getCanonicalUrl('/'),
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunlit Energy',
    description:
      "Powering Africa's next energy infrastructure. Connecting buyers, certified installers, and reliable financing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLandingPage() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Sunlit Energy',
        url: siteUrl,
        logo: `${siteUrl}/images/logo.png`,
        description: "Nigeria's premier renewable energy infrastructure operating platform.",
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Lagos, Nigeria',
          addressLocality: 'Lagos',
          addressCountry: 'NG',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Sunlit Energy',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: 'Sunlit Energy Nigeria',
        image: `${siteUrl}/images/cover.jpg`,
        url: siteUrl,
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Lekki Phase 1',
          addressLocality: 'Lagos',
          addressRegion: 'Lagos State',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 6.4281,
          longitude: 3.4219,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RefinedLandingPageClient />
    </>
  );
}
