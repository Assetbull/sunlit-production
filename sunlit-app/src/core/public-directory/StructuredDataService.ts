/**
 * Structured Data Service — Schema.org JSON-LD Generators
 * 
 * Generates schema.org structured data for public installer pages.
 * Used for Google Search, AI search, and rich snippet visibility.
 * 
 * Architecture: Pure functions — no side effects, no DB access.
 * Takes public projection types only (never raw DB records).
 */

import type {
  PublicInstallerView,
  PublicInstallerCardView,
  PublicServiceView,
} from '@/shared/types/installer-intelligence';
import { getSiteUrl } from '@/shared/utils/site-url';

const SITE_URL = getSiteUrl();
const ORG_NAME = 'Sunlit Energy';

// =============================================
// Installer Profile — LocalBusiness Schema
// =============================================

export function generateInstallerStructuredData(installer: PublicInstallerView) {
  const url = `${SITE_URL}/installers/${installer.slug}`;
  
  const structured: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}#business`,
    name: installer.business_name,
    url,
    description: installer.business_description,
    image: installer.logo_url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: installer.headquarters_city,
      addressRegion: installer.headquarters_state,
      addressCountry: 'NG',
    },
    areaServed: installer.service_areas?.map((area) => ({
      '@type': 'City',
      name: area.city || area.state,
      containedInPlace: {
        '@type': 'State',
        name: area.state,
      },
    })),
  };

  // Contact
  if (installer.public_phone) {
    structured.telephone = installer.public_phone;
  }
  if (installer.public_email) {
    structured.email = installer.public_email;
  }

  // Aggregate rating
  if (installer.average_rating && installer.review_count > 0) {
    structured.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: installer.average_rating,
      reviewCount: installer.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Services offered
  if (installer.services && installer.services.length > 0) {
    structured.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${installer.business_name} Services`,
      itemListElement: installer.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
        },
      })),
    };
  }

  // SameAs (social links)
  const sameAs: string[] = [];
  if (installer.website_url) sameAs.push(installer.website_url);
  if (installer.linkedin_url) sameAs.push(installer.linkedin_url);
  if (sameAs.length > 0) {
    structured.sameAs = sameAs;
  }

  return structured;
}

// =============================================
// Installer Directory — ItemList Schema
// =============================================

export function generateDirectoryStructuredData(
  installers: PublicInstallerCardView[],
  location?: { state?: string; city?: string }
) {
  const locationLabel = location?.city
    ? `${location.city}, ${location.state}`
    : location?.state || 'Nigeria';

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Verified Solar Installers in ${locationLabel}`,
    description: `Find trusted, verified solar energy installers and EPC contractors in ${locationLabel}. Compare ratings, projects, and certifications.`,
    numberOfItems: installers.length,
    itemListElement: installers.map((installer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/installers/${installer.slug}#business`,
        name: installer.business_name,
        url: `${SITE_URL}/installers/${installer.slug}`,
        image: installer.logo_url,
        address: {
          '@type': 'PostalAddress',
          addressLocality: installer.headquarters_city,
          addressRegion: installer.headquarters_state,
          addressCountry: 'NG',
        },
        ...(installer.average_rating && installer.review_count > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: installer.average_rating,
                reviewCount: installer.review_count,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      },
    })),
  };
}

// =============================================
// Breadcrumb Schema
// =============================================

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

// =============================================
// Service Page Schema
// =============================================

export function generateServiceStructuredData(service: PublicServiceView) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    serviceType: service.category,
  };
}

// =============================================
// Location Page Schema
// =============================================

export function generateLocationStructuredData(
  state: string,
  city?: string,
  installerCount?: number
) {
  const locationName = city ? `${city}, ${state}` : state;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Solar Installers in ${locationName} — Sunlit Energy`,
    description: `Find ${installerCount || ''} verified solar installers and EPC contractors in ${locationName}, Nigeria. Compare ratings, projects, and certifications.`,
    isPartOf: {
      '@type': 'WebSite',
      name: ORG_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        addressRegion: state,
        addressCountry: 'NG',
      },
    },
  };
}

// =============================================
// Organization Schema (site-wide)
// =============================================

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: "Nigeria's premier solar energy marketplace connecting homeowners with verified installers.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    sameAs: [
      // Social profiles would go here
    ],
  };
}
