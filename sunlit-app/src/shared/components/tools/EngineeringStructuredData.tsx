import React from 'react';
import { ToolPageContent } from '@/lib/engineering/marketing/toolsContent';

interface EngineeringStructuredDataProps {
  content: ToolPageContent;
}

export function EngineeringStructuredData({ content }: EngineeringStructuredDataProps) {
  const schemaList = [
    // SoftwareApplication / WebApplication Schema
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: content.name,
      operatingSystem: 'All',
      applicationCategory: 'BusinessApplication',
      url: content.seo.canonical,
      description: content.seo.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NGN',
      },
      creator: {
        '@type': 'Organization',
        name: 'Sunlit Energy',
        url: 'https://sunlit.energy',
      },
    },
    // BreadcrumbList Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://sunlit.energy',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Engineering Tools',
          item: 'https://sunlit.energy/tools',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.name,
          item: content.seo.canonical,
        },
      ],
    },
    // FAQPage Schema
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <>
      {schemaList.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
