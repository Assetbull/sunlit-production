import { Metadata } from 'next';
import { RefinedLandingPageClient } from '@/shared/components/marketing/RefinedLandingPageClient';

export const metadata: Metadata = {
  title: "Sunlit Energy — Next-Generation Enterprise Public Platform",
  description:
    "Sunlit Energy connects energy projects, engineering, installers, infrastructure, and intelligence into one operating ecosystem across Africa.",
  keywords:
    'solar energy nigeria, solar installer lagos, solar finance abuja, solar panel cost lagos, clean energy nigeria, solar power lekki, offgrid solar nigeria, epc contractor nigeria',
  alternates: {
    canonical: 'https://sunlit.energy',
  },
  openGraph: {
    title: "Sunlit Energy — Next-Generation Enterprise Public Platform",
    description:
      "Powering Africa's next energy infrastructure. Connecting buyers, certified installers, and reliable financing to build resilient, sustainable energy systems.",
    url: 'https://sunlit.energy',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sunlit.energy/#organization',
        name: 'Sunlit Energy',
        url: 'https://sunlit.energy',
        logo: 'https://sunlit.energy/images/logo.png',
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
        '@id': 'https://sunlit.energy/#website',
        url: 'https://sunlit.energy',
        name: 'Sunlit Energy',
        publisher: {
          '@id': 'https://sunlit.energy/#organization',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://sunlit.energy/#localbusiness',
        name: 'Sunlit Energy Nigeria',
        image: 'https://sunlit.energy/images/cover.jpg',
        url: 'https://sunlit.energy',
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
