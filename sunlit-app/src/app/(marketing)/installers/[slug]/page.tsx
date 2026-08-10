/**
 * /installers/[slug] — Universal Dynamic Route for Installer Profiles, State Directories & Service Hubs
 * 
 * Handles:
 * 1. State Directories (e.g. /installers/lagos, /installers/abuja)
 * 2. Service Hubs (e.g. /installers/commercial-solar, /installers/battery-storage)
 * 3. Installer Intelligence Profiles (e.g. /installers/solarcraft-energy-a8f42c)
 * 
 * Stitch Sources:
 * - installer-homepage.html (Profile)
 * - solar-installers-lagos.html (State Directory)
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { InstallerService } from '@/core/installer/InstallerService';
import {
  generateInstallerStructuredData,
  generateLocationStructuredData,
  generateBreadcrumbStructuredData,
} from '@/core/public-directory/StructuredDataService';
import { InstallerProfileClient } from './InstallerProfileClient';
import { StateDirectoryClient } from './StateDirectoryClient';

import { getCanonicalUrl } from '@/shared/utils/site-url';

function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const NIGERIAN_STATES: Record<string, string> = {
  lagos: 'Lagos',
  abuja: 'Abuja (FCT)',
  ogun: 'Ogun',
  rivers: 'Rivers',
  kano: 'Kano',
  oyo: 'Oyo',
  enugu: 'Enugu',
  kaduna: 'Kaduna',
  delta: 'Delta',
  edo: 'Edo',
  anambra: 'Anambra',
  imo: 'Imo',
  kwara: 'Kwara',
  osun: 'Osun',
  ondo: 'Ondo',
};

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  // 1. Check if it is a State Directory
  if (NIGERIAN_STATES[lowerSlug]) {
    const stateName = NIGERIAN_STATES[lowerSlug];
    return {
      title: `Solar Installers in ${stateName} | Verified EPCs & Solar Companies — Sunlit Energy`,
      description: `Find certified, verified solar energy installers and EPC contractors in ${stateName}, Nigeria. Compare SunlitScores, real projects, warranties, and verified customer reviews.`,
      alternates: {
        canonical: getCanonicalUrl(`/installers/${lowerSlug}`),
      },
      openGraph: {
        title: `Verified Solar Installers in ${stateName} — Sunlit Energy`,
        description: `Find top-rated solar installers and EPC contractors in ${stateName}, Nigeria.`,
        url: getCanonicalUrl(`/installers/${lowerSlug}`),
        siteName: 'Sunlit Energy',
        locale: 'en_NG',
        type: 'website',
      },
    };
  }

  // 2. Check if it is a Service Directory
  if (CANONICAL_SERVICES[lowerSlug]) {
    const serviceName = CANONICAL_SERVICES[lowerSlug];
    return {
      title: `${serviceName} in Nigeria | Verified Solar Installers — Sunlit Energy`,
      description: `Find certified EPC contractors and solar companies specializing in ${serviceName.toLowerCase()} across Nigeria. Compare SunlitScores, warranties, and customer reviews.`,
      alternates: {
        canonical: getCanonicalUrl(`/installers/${lowerSlug}`),
      },
      openGraph: {
        title: `${serviceName} in Nigeria — Sunlit Energy`,
        description: `Compare certified installers specializing in ${serviceName.toLowerCase()}.`,
        url: getCanonicalUrl(`/installers/${lowerSlug}`),
        siteName: 'Sunlit Energy',
        locale: 'en_NG',
        type: 'website',
      },
    };
  }

  // 3. Otherwise, query Installer Profile by slug
  const supabase = getAnonClient();
  const service = new InstallerService(supabase);
  const installer = await service.getBySlug(slug);

  if (!installer) {
    return { title: 'Installer Not Found — Sunlit Energy' };
  }

  const locationLabel = [installer.headquarters_city, installer.headquarters_state]
    .filter(Boolean)
    .join(', ');

  return {
    title: `${installer.business_name} — Verified Solar Installer${locationLabel ? ` in ${locationLabel}` : ''} | Sunlit Energy`,
    description:
      installer.business_description ||
      `${installer.business_name} is a verified ${installer.business_type === 'epc_contractor' ? 'EPC contractor' : 'solar installer'}${locationLabel ? ` in ${locationLabel}` : ''} on the Sunlit Energy platform. View their projects, certifications, and reviews.`,
    alternates: {
      canonical: getCanonicalUrl(`/installers/${slug}`),
    },
    openGraph: {
      title: `${installer.business_name} — Sunlit Energy`,
      description: installer.business_description || `Verified solar installer on Sunlit Energy`,
      url: getCanonicalUrl(`/installers/${slug}`),
      siteName: 'Sunlit Energy',
      locale: 'en_NG',
      type: 'profile',
      images: installer.cover_image_url ? [{ url: installer.cover_image_url }] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function InstallerOrStatePage({ params }: PageProps) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  // 1. Render State Directory if slug matches a state
  if (NIGERIAN_STATES[lowerSlug]) {
    const stateName = NIGERIAN_STATES[lowerSlug];
    const structuredData = generateLocationStructuredData(stateName, undefined, 45);
    const breadcrumbs = generateBreadcrumbStructuredData([
      { label: 'Home', href: '/' },
      { label: 'Installers', href: '/installers' },
      { label: stateName, href: `/installers/${lowerSlug}` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([structuredData, breadcrumbs]),
          }}
        />
        <StateDirectoryClient stateSlug={lowerSlug} stateName={stateName} />
      </>
    );
  }

  // 2. Render Service Hub if slug matches a canonical service
  if (CANONICAL_SERVICES[lowerSlug]) {
    const serviceName = CANONICAL_SERVICES[lowerSlug];
    const breadcrumbs = generateBreadcrumbStructuredData([
      { label: 'Home', href: '/' },
      { label: 'Installers', href: '/installers' },
      { label: serviceName, href: `/installers/${lowerSlug}` },
    ]);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbs]),
          }}
        />
        <StateDirectoryClient stateSlug="all" stateName={serviceName} />
      </>
    );
  }

  // 3. Render Installer Profile
  const supabase = getAnonClient();
  const service = new InstallerService(supabase);
  const installer = await service.getBySlug(slug);

  if (!installer) {
    notFound();
  }

  const installerSchema = generateInstallerStructuredData(installer);
  const breadcrumbs = generateBreadcrumbStructuredData([
    { label: 'Home', href: '/' },
    { label: 'Installers', href: '/installers' },
    ...(installer.headquarters_state
      ? [{ label: installer.headquarters_state, href: `/installers/${installer.headquarters_state.toLowerCase()}` }]
      : []),
    { label: installer.business_name, href: `/installers/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([installerSchema, breadcrumbs]),
        }}
      />
      <InstallerProfileClient installer={installer} />
    </>
  );
}
