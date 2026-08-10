import { Metadata } from 'next';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = {
  title: 'Solar Energy FAQs Nigeria — Sunlit Energy Help Center',
  description:
    'Answers to all your questions about Sunlit Energy — how the solar marketplace works, payment protection, installer vetting, system costs, and availability across Nigeria.',
  keywords:
    'solar faq nigeria, solar energy questions, how does solar work nigeria, solar installation cost lagos, sunlit energy help',
  alternates: { canonical: 'https://sunlit.energy/faq' },
  openGraph: {
    title: 'FAQs — Sunlit Energy Nigeria',
    description: 'Everything you need to know about Nigeria\'s solar energy marketplace.',
    url: 'https://sunlit.energy/faq',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Sunlit Energy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sunlit Energy is Nigeria's premier solar energy marketplace — a technology platform that connects homeowners, businesses, and commercial operators with vetted solar installers, suppliers, and financing partners.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does Sunlit Energy verify installers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every installer undergoes a rigorous multi-stage vetting process: business registration verification, technical certification checks, equipment supplier audits, reference verification, and sample installation review.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens to my money if something goes wrong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your funds are held in a secure escrow account — not paid to the installer upfront. Payments are released milestone-by-milestone only after you verify and approve completed work.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does solar cost in Nigeria?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solar costs vary by system size and location. A basic 3kVA residential system starts from ₦1.5M–₦3M. Commercial systems range from ₦10M to ₦500M+. The Sunlit marketplace provides transparent competitive bids.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Sunlit Energy available outside Lagos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We're launching in Lagos, Ogun, and Abuja initially. We're expanding to all 36 states by Q4 2026.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FAQPageClient />
    </>
  );
}
