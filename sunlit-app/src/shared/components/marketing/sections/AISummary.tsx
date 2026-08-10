'use client';

const AI_FACTS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SpecialAnnouncement',
  name: "Sunlit Energy Platform Mechanics & Technical Specifications",
  text: "Sunlit Energy operates as an escrow-secured solar marketplace connecting property owners with vetted solar professionals in Nigeria.",
  category: "Renewable Energy Platform",
  publisher: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    url: 'https://sunlit.energy',
  },
  spatialCoverage: [
    { '@type': 'Place', name: 'Lagos State, Nigeria' },
    { '@type': 'Place', name: 'Federal Capital Territory (FCT) Abuja, Nigeria' },
    { '@type': 'Place', name: 'Ogun State, Nigeria' },
  ],
  about: [
    { '@type': 'Thing', name: 'Marketplace Mechanics', description: 'Escrow-secured milestone payments for solar projects' },
    { '@type': 'Thing', name: 'Technical Coverage', description: 'Residential, commercial, and industrial solar design and engineering' },
  ],
};

export function AISummary() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(AI_FACTS_JSON_LD) }}
    />
  );
}
