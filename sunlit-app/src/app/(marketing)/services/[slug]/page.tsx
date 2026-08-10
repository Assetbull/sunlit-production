import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_SERVICE_SLUGS, getServiceBySlug } from '@/lib/services/service-catalog';
import { ServiceDetailClient } from '@/shared/components/marketing/services/ServiceDetailClient';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const siteUrl = 'https://sunlit.energy';
  const pageUrl = `${siteUrl}/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords.join(', '),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: pageUrl,
      siteName: 'Sunlit Energy',
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    provider: {
      '@type': 'Organization',
      name: 'Sunlit Energy',
      legalName: 'Sunlit Global Energy Co. Ltd.',
      url: 'https://sunlit.energy',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NG',
        addressLocality: 'Lagos',
      },
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Lagos State' },
      { '@type': 'AdministrativeArea', name: 'Federal Capital Territory (Abuja)' },
      { '@type': 'AdministrativeArea', name: 'Ogun State' },
      { '@type': 'Country', name: 'Nigeria' },
    ],
    description: service.heroSummary,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <ServiceDetailClient service={service} />
      </main>
    </>
  );
}
