import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDocumentLayout } from '@/shared/components/legal/LegalDocumentLayout';
import { LEGAL_DOCUMENTS } from '@/lib/legal/legal-registry';

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(LEGAL_DOCUMENTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCUMENTS[slug];
  if (!doc) return { title: 'Policy Not Found | Sunlit Energy' };

  return {
    title: `${doc.title} | Sunlit Energy`,
    description: doc.summary,
  };
}

export default async function DynamicLegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const doc = LEGAL_DOCUMENTS[slug];

  if (!doc) {
    notFound();
  }

  return <LegalDocumentLayout document={doc} />;
}
