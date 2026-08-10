/**
 * /installers/[state]/[city] — City Directory Page
 * 
 * Stitch Source of Truth: city-directory-lekki.html (screen f8cdced8)
 * 
 * Hyper-local directory page for specific cities/neighborhoods (e.g. Lekki, Ikeja, Maitama).
 * Structured data includes GeoCoordinates and BreadcrumbList.
 */

import { Metadata } from 'next';
import { generateLocationStructuredData, generateBreadcrumbStructuredData } from '@/core/public-directory/StructuredDataService';
import { StateDirectoryClient } from '../StateDirectoryClient';

interface Props {
  params: Promise<{ slug: string; city: string }>;
}

function formatName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: state, city } = await params;
  const cityName = formatName(city);
  const stateName = formatName(state);

  return {
    title: `Top Solar Installers in ${cityName}, ${stateName} | Sunlit Energy`,
    description: `Compare verified solar energy installers and EPC contractors operating in ${cityName}, ${stateName}. View completed local solar installations, verified ratings, and request instant quotes.`,
    alternates: {
      canonical: `https://sunlit.energy/installers/${state.toLowerCase()}/${city.toLowerCase()}`,
    },
    openGraph: {
      title: `Solar Installers in ${cityName}, ${stateName} — Sunlit Energy`,
      description: `Find top-rated solar installers in ${cityName}, ${stateName}. Compare SunlitScore ratings and get quotes.`,
      url: `https://sunlit.energy/installers/${state.toLowerCase()}/${city.toLowerCase()}`,
      siteName: 'Sunlit Energy',
      locale: 'en_NG',
      type: 'website',
    },
  };
}

export default async function CityDirectoryPage({ params }: Props) {
  const { slug: state, city } = await params;
  const stateSlug = state.toLowerCase();
  const citySlug = city.toLowerCase();
  const stateName = formatName(state);
  const cityName = formatName(city);

  const structuredData = generateLocationStructuredData(stateName, cityName, 18);
  const breadcrumbs = generateBreadcrumbStructuredData([
    { label: 'Home', href: '/' },
    { label: 'Installers', href: '/installers' },
    { label: stateName, href: `/installers/${stateSlug}` },
    { label: cityName, href: `/installers/${stateSlug}/${citySlug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, breadcrumbs]),
        }}
      />
      <StateDirectoryClient stateSlug={stateSlug} stateName={`${cityName}, ${stateName}`} />
    </>
  );
}
