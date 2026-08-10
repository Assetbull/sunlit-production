import { Metadata } from 'next';
import { RefinedLandingPageClient } from '@/shared/components/marketing/RefinedLandingPageClient';
import { getCanonicalUrl, getSiteUrl } from '@/shared/utils/site-url';

export const metadata: Metadata = {
  title: 'Sunlit Energy — Solar Energy Marketplace & Infrastructure Platform Nigeria',
  description:
    'Nigeria’s trusted solar energy platform. Connect with vetted solar installers and EPC contractors in Lagos, Abuja, and Ogun. Milestone-based escrow payments, precision sizing tools, and transparent bids.',
  keywords:
    'solar energy marketplace nigeria, solar installers lagos, solar installer abuja, solar panel price nigeria, commercial solar ogun state, solar inverter sizing, vetted solar contractors nigeria, solar escrow payment',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Sunlit Energy — Nigeria’s Premier Solar Energy Marketplace',
    description:
      'Connecting homeowners, commercial enterprises, and certified solar installers. Milestone-secured payments, engineering-grade sizing tools, and verified project delivery across Nigeria.',
    url: getCanonicalUrl('/'),
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunlit Energy — Solar Marketplace Nigeria',
    description:
      'Connecting homes and businesses with vetted solar installers, escrow-protected milestone payments, and verified engineering standards across Nigeria.',
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
        legalName: 'Sunlit Global Energy Co. Ltd.',
        url: siteUrl,
        logo: `${siteUrl}/images/logo.png`,
        description:
          "Nigeria's renewable energy marketplace and engineering operations platform connecting project owners with vetted installers, suppliers, and milestone-protected escrow financing.",
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Lekki Phase 1',
          addressLocality: 'Lagos',
          addressRegion: 'Lagos State',
          addressCountry: 'NG',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+234-800-SUNLIT',
          contactType: 'customer service',
          areaServed: 'NG',
          availableLanguage: ['en'],
        },
        sameAs: [
          'https://twitter.com/sunlitenergy',
          'https://linkedin.com/company/sunlitenergy',
          'https://facebook.com/sunlitenergy',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Sunlit Energy',
        description: 'Solar energy marketplace and engineering platform for Nigeria.',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/tools?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#localbusiness`,
        name: 'Sunlit Energy Nigeria',
        image: `${siteUrl}/images/cover.jpg`,
        url: siteUrl,
        priceRange: '₦₦₦',
        telephone: '+234-800-SUNLIT',
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
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Lagos State' },
          { '@type': 'AdministrativeArea', name: 'Federal Capital Territory (Abuja)' },
          { '@type': 'AdministrativeArea', name: 'Ogun State' },
        ],
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
