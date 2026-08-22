import { Metadata } from 'next';
import { CableSizingClient } from './CableSizingClient';
import { TOOLS_CONTENT } from '@/lib/engineering/marketing/toolsContent';
import { EngineeringStructuredData } from '@/shared/components/tools/EngineeringStructuredData';

const content = TOOLS_CONTENT['cable-sizing'];

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

export default function CableSizingPage() {
  return (
    <>
      <EngineeringStructuredData content={content} />
      <CableSizingClient />
    </>
  );
}
