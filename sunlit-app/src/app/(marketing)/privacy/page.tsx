import { Metadata } from 'next';
import { LegalDocumentLayout } from '@/shared/components/legal/LegalDocumentLayout';
import { LEGAL_DOCUMENTS } from '@/lib/legal/legal-registry';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sunlit Energy',
  description:
    'Authoritative Privacy Policy and Nigeria Data Protection Act (NDPA 2023) compliance framework for Sunlit Energy.',
};

export default function PrivacyPage() {
  const document = LEGAL_DOCUMENTS.privacy;

  return <LegalDocumentLayout document={document} />;
}
