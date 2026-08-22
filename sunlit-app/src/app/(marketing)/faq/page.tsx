import { Metadata } from 'next';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = {
  title: 'Solar Energy FAQs in Nigeria — Pricing, Sizing, Escrow & Installers | Sunlit Energy',
  description:
    'Authoritative answers to common questions on solar energy in Nigeria: system pricing (3kVA–100kVA+), milestone-based escrow payments, installer vetting, battery autonomy, diesel savings, and regional coverage in Lagos, Abuja, and Ogun State.',
  keywords:
    'solar faq nigeria, solar installation cost lagos, solar battery sizing, solar inverter price abuja, milestone escrow solar nigeria, vetted solar installers lekki, lifepo4 vs lead acid nigeria',
  alternates: { canonical: 'https://sunlit.energy/faq' },
  openGraph: {
    title: 'Solar Energy FAQs — Sunlit Energy Nigeria',
    description:
      'Everything you need to know about solar sizing, verified installers, milestone payment protection, and clean energy economics in Nigeria.',
    url: 'https://sunlit.energy/faq',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Energy FAQs Nigeria — Sunlit Energy',
    description:
      'Get clear, deterministic answers about solar system pricing, escrow protection, and verified installer matching across Nigeria.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Sunlit Energy and how does it protect solar buyers in Nigeria?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sunlit Energy is Nigeria’s solar energy marketplace and infrastructure platform. We protect buyers by holding project funds in a secure milestone-based escrow account. Installers are only paid when you inspect and approve verified stage deliverables (site survey, structural mounting, electrical commissioning, and final sign-off).',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a solar system cost in Nigeria in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Solar system pricing in Nigeria depends on daily kilowatt-hour demand and battery storage capacity. A typical 3kVA–5kVA residential system with LiFePO4 battery storage ranges from ₦2.5M to ₦6.5M. A 10kVA–15kVA duplex setup ranges from ₦7M to ₦16M, and commercial systems (20kVA–100kVA+) range from ₦18M to ₦90M+. Sunlit enables you to receive 3+ competitive bids from vetted installers to get optimal market pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Sunlit Energy verify solar installers and EPC contractors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Installers undergo a strict multi-tier vetting process: Corporate Affairs Commission (CAC) business verification, technical certification audits (COREN, NEMSA, Council of Registered Engineers), equipment supplier authorization checks, reference customer audits, and in-person review of past installations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are LiFePO4 batteries recommended over traditional tubular lead-acid batteries?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lithium Iron Phosphate (LiFePO4) batteries deliver 6,000+ cycles at 80%–90% Depth of Discharge (DoD), lasting 10–15 years under Nigerian ambient temperatures. In contrast, lead-acid or gel batteries degrade within 1–3 years (500–1,200 cycles at 50% DoD), making LiFePO4 significantly cheaper on a Levelized Cost of Storage (LCOS) basis.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which locations in Nigeria does Sunlit Energy serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sunlit operates primary hubs in Lagos State (Lekki, Victoria Island, Ikeja, Ikoyi, Surulere, Ajah), Abuja FCT (Maitama, Wuse, Garki, Asokoro, Gwarinpa), and Ogun State (Abeokuta, Ota, Sagamu, Mowe/Ibafo), with active expansion across Port Harcourt, Ibadan, Kano, and nationwide.',
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
