import { Metadata } from 'next';
import { LegalDocumentLayout } from '@/shared/components/legal/LegalDocumentLayout';
import { LEGAL_DOCUMENTS } from '@/lib/legal/legal-registry';

export const metadata: Metadata = {
  title: 'Terms of Service | Sunlit Energy',
  description:
    'Authoritative Terms of Service and contractual marketplace rules for Sunlit Energy solar engineering and escrow services.',
};

export default function TermsPage() {
  const document = LEGAL_DOCUMENTS.terms;

  return <LegalDocumentLayout document={document} />;
}
