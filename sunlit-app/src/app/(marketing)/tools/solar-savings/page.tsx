import { Metadata } from 'next';
import { SolarSavingsClient } from './SolarSavingsClient';
import { TOOLS_CONTENT } from '@/lib/engineering/marketing/toolsContent';
import { EngineeringStructuredData } from '@/shared/components/tools/EngineeringStructuredData';

const content = TOOLS_CONTENT['solar-savings'];

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  alternates: { canonical: content.seo.canonical },
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    url: content.seo.canonical,
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function SolarSavingsPage() {
  return (
    <>
      <EngineeringStructuredData content={content} />
      <SolarSavingsClient />
    </>
  );
}
