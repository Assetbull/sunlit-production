import { Metadata } from 'next';
import { SolarPanelSizingClient } from './SolarPanelSizingClient';
import { TOOLS_CONTENT } from '@/lib/engineering/marketing/toolsContent';
import { EngineeringStructuredData } from '@/shared/components/tools/EngineeringStructuredData';

const content = TOOLS_CONTENT['solar-panel-sizing'];

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

export default function SolarPanelSizingPage() {
  return (
    <>
      <EngineeringStructuredData content={content} />
      <SolarPanelSizingClient />
    </>
  );
}
