import { Metadata } from 'next';
import { LandingPageClient } from '@/shared/components/marketing/LandingPageClient';

export const metadata: Metadata = {
  title: 'Home',
  description:
    "Sunlit Energy connects homeowners, businesses, installers, EPC contractors, suppliers and financing partners into one intelligent renewable energy marketplace.",
  keywords:
    'solar energy nigeria, solar installer lagos, solar finance abuja, solar panel cost lagos, clean energy nigeria, solar power lekki, offgrid solar nigeria',
  alternates: {
    canonical: 'https://sunlitenergy.com',
  },
  openGraph: {
    title: 'Sunlit Energy',
    description:
      "Sunlit Energy connects homeowners, businesses, installers, EPC contractors, suppliers and financing partners into one intelligent renewable energy marketplace.",
    url: 'https://sunlitenergy.com',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunlit Energy',
    description:
      "Sunlit Energy connects homeowners, businesses, installers, EPC contractors, suppliers and financing partners into one intelligent renewable energy marketplace.",
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
        '@id': 'https://sunlitenergy.com/#organization',
        name: 'Sunlit Energy',
        url: 'https://sunlitenergy.com',
        logo: 'https://sunlitenergy.com/images/logo.png',
        description: "Nigeria's premier solar energy marketplace.",
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Lagos, Nigeria',
          addressLocality: 'Lagos',
          addressCountry: 'NG',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sunlitenergy.com/#website',
        url: 'https://sunlitenergy.com',
        name: 'Sunlit Energy',
        publisher: {
          '@id': 'https://sunlitenergy.com/#organization',
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://sunlitenergy.com/#localbusiness',
        name: 'Sunlit Energy Nigeria',
        image: 'https://sunlitenergy.com/images/cover.jpg',
        telephone: '',
        url: 'https://sunlitenergy.com',
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
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does Sunlit Energy verify installers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Every installer undergoes a multi-stage vetting process: business registration verification, technical certification checks, equipment supplier audits, reference calls with previous clients, and sample installations.',
            },
          },
          {
            '@type': 'Question',
            name: 'What happens to my money if something goes wrong?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Your funds are held in a secure escrow account — not paid to the installer upfront. Payments are released milestone-by-milestone only after you verify and approve completed work.',
            },
          },
          {
            '@type': 'Question',
            name: 'How long does it take to get solar installed?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most residential systems are installed within 2–6 weeks from bid acceptance. Timeline depends on system size, component availability, and permitting in your area. Your project dashboard includes estimated delivery windows.',
            },
          },
          {
            '@type': 'Question',
            name: 'What types of solar systems does Sunlit support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "We support all system types: grid-tied, off-grid, hybrid, and solar-plus-storage. Whether you're a homeowner wanting backup power or a business looking to cut electricity costs, we have solutions.",
            },
          },
          {
            '@type': 'Question',
            name: 'Is Sunlit Energy available outside Lagos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "We're launching in Lagos, Ogun, and Abuja in the initial phase. We're actively expanding to all 36 states by Q4 2026. Join our waitlist and select your state — you'll be notified when service arrives.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPageClient />
    </>
  );
}
