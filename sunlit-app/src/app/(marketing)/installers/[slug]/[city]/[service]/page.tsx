/**
 * /installers/[state]/[city]/[service] — Service + Location Discovery Page
 * 
 * Locked Canonical Hierarchy: Layer 5 (Location + Service Intent)
 * e.g. https://sunlit.energy/installers/lagos/lekki/commercial-solar
 * 
 * Reusable for all Nigerian states, cities, and canonical solar services.
 */

import { Metadata } from 'next';
import { generateBreadcrumbStructuredData } from '@/core/public-directory/StructuredDataService';
import { StateDirectoryClient } from '../../StateDirectoryClient';
import { getCanonicalUrl, getSiteUrl } from '@/shared/utils/site-url';

interface Props {
  params: Promise<{ slug: string; city: string; service: string }>;
}

function formatName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const CANONICAL_SERVICES: Record<string, string> = {
  'commercial-solar': 'Commercial Solar Installation & EPC',
  'residential-solar': 'Residential Solar Systems',
  'battery-storage': 'Battery Storage Systems (BESS)',
  'microgrids': 'Microgrid & Mini-Grid Engineering',
  'solar-maintenance': 'Solar Maintenance & Operations (O&M)',
  'solar-epc': 'Solar EPC Contracting',
  'ev-infrastructure': 'EV Charging Infrastructure',
  'solar-panel-installation': 'Solar Panel Installation',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: state, city, service } = await params;
  const cityName = formatName(city);
  const stateName = formatName(state);
  const serviceName = CANONICAL_SERVICES[service.toLowerCase()] || formatName(service);

  return {
    title: `${serviceName} in ${cityName}, ${stateName} | Verified Installers — Sunlit Energy`,
    description: `Compare verified EPC contractors and solar companies specializing in ${serviceName.toLowerCase()} in ${cityName}, ${stateName}. View completed local installations, SunlitScore ratings, and request instant quotes.`,
    alternates: {
      canonical: getCanonicalUrl(`/installers/${state.toLowerCase()}/${city.toLowerCase()}/${service.toLowerCase()}`),
    },
    openGraph: {
      title: `${serviceName} in ${cityName}, ${stateName} — Sunlit Energy`,
      description: `Find top-rated solar installers for ${serviceName.toLowerCase()} in ${cityName}, ${stateName}.`,
      url: getCanonicalUrl(`/installers/${state.toLowerCase()}/${city.toLowerCase()}/${service.toLowerCase()}`),
      siteName: 'Sunlit Energy',
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function ServiceLocationDirectoryPage({ params }: Props) {
  const { slug: state, city, service } = await params;
  const stateSlug = state.toLowerCase();
  const citySlug = city.toLowerCase();
  const serviceSlug = service.toLowerCase();
  const stateName = formatName(state);
  const cityName = formatName(city);
  const serviceName = CANONICAL_SERVICES[serviceSlug] || formatName(serviceSlug);

  const locationLabel = `${cityName}, ${stateName}`;
  const pageTitle = `${serviceName} in ${locationLabel}`;

  const breadcrumbs = generateBreadcrumbStructuredData([
    { label: 'Home', href: '/' },
    { label: 'Installers', href: '/installers' },
    { label: stateName, href: `/installers/${stateSlug}` },
    { label: cityName, href: `/installers/${stateSlug}/${citySlug}` },
    { label: serviceName, href: `/installers/${stateSlug}/${citySlug}/${serviceSlug}` },
  ]);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: `Verified ${serviceName.toLowerCase()} services provided by certified solar installers and EPC contractors in ${locationLabel}, Nigeria.`,
    provider: {
      '@type': 'Organization',
      name: 'Sunlit Energy',
      url: getSiteUrl(),
    },
    areaServed: {
      '@type': 'City',
      name: cityName,
      containedInPlace: {
        '@type': 'State',
        name: stateName,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceSchema, breadcrumbs]),
        }}
      />
      <StateDirectoryClient
        stateSlug={stateSlug}
        stateName={`${serviceName} • ${cityName}, ${stateName}`}
      />
    </>
  );
}
