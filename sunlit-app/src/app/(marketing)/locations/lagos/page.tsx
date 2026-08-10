import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Sun,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Zap,
  TrendingUp,
  Building,
  HelpCircle,
  Calculator,
  Layers,
} from 'lucide-react';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';

export const metadata: Metadata = {
  title: 'Solar Energy in Lagos Nigeria — Vetted Installers & Escrow Protection | Sunlit Energy',
  description:
    'Connect with verified solar installers across Lagos State (Lekki, Victoria Island, Ikoyi, Ikeja, Surulere, Ajah). Compare competitive bids, secure projects with milestone escrow payments, and access engineering-backed solar systems.',
  keywords:
    'solar energy lagos, solar installer lekki, solar panel victoria island, solar installer ikeja, solar price lagos nigeria, lifepo4 battery lagos, commercial solar surulere',
  alternates: { canonical: 'https://sunlit.energy/locations/lagos' },
  openGraph: {
    title: 'Solar Energy in Lagos — Sunlit Energy Nigeria',
    description:
      "Lagos State's solar marketplace. Verified installers, milestone escrow protection, and engineering oversight from Lekki to Ikeja.",
    url: 'https://sunlit.energy/locations/lagos',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Energy in Lagos Nigeria — Sunlit Energy',
    description:
      'Connect with verified solar installers in Lagos with 100% milestone escrow payment security.',
  },
};

const LAGOS_NEIGHBORHOODS = [
  {
    name: 'Lekki Phase 1, Chevron & Ajah',
    directoryUrl: '/installers/lagos/lekki',
    context: 'High-density residential estates, duplexes, and commercial retail requiring hybrid solar and LiFePO4 battery backup.',
    typicalSystem: '5kVA – 15kVA Hybrid',
  },
  {
    name: 'Victoria Island & Oniru',
    directoryUrl: '/installers/lagos/victoria-island',
    context: 'Corporate headquarters, boutique hotels, embassies, and commercial towers seeking diesel displacement.',
    typicalSystem: '20kVA – 100kVA Commercial',
  },
  {
    name: 'Ikoyi & Banana Island',
    directoryUrl: '/installers/lagos/ikoyi',
    context: 'Luxury residential penthouses, executive estates, and private offices with high energy density and silent backup needs.',
    typicalSystem: '10kVA – 30kVA Premium Hybrid',
  },
  {
    name: 'Ikeja, GRA & Maryland',
    directoryUrl: '/installers/lagos/ikeja',
    context: 'State capital commercial centers, healthcare facilities, private hospitals, and corporate office parks.',
    typicalSystem: '15kVA – 80kVA Three-Phase',
  },
  {
    name: 'Surulere, Yaba & Gbagada',
    directoryUrl: '/installers/lagos',
    context: 'Technology hubs, creative studios, shared office spaces, and multi-unit residential properties.',
    typicalSystem: '5kVA – 20kVA Hybrid',
  },
  {
    name: 'Ajah, Sangotedo & Ibeju-Lekki',
    directoryUrl: '/installers/lagos/ajah',
    context: 'Fast-expanding residential communities and industrial corridors seeking full off-grid and hybrid energy independence.',
    typicalSystem: '3.5kVA – 10kVA Hybrid',
  },
];

const SYSTEM_GUIDELINES = [
  {
    name: 'Residential Solar (3.5kVA – 10kVA)',
    range: '₦2,800,000 – ₦9,500,000',
    coverage: 'Powers lighting, refrigerators, home entertainment, water pumps, and essential inverter ACs.',
    target: 'Apartments, semi-detached homes, and family duplexes in Lekki, Ikeja, and Yaba.',
  },
  {
    name: 'Commercial Solar (15kVA – 80kVA)',
    range: '₦14,000,000 – ₦75,000,000',
    coverage: 'Powers multi-zone office air conditioning, server infrastructure, retail lighting, and medical diagnostic equipment.',
    target: 'Offices, clinics, schools, and boutique hotels in Victoria Island, Ikeja, and Surulere.',
  },
  {
    name: 'Industrial Microgrids (100kVA – 1MW+)',
    range: '₦85,000,000 – ₦650,000,000+',
    coverage: 'Displaces heavy diesel generators for manufacturing facilities, logistics warehouses, and processing centers.',
    target: 'Industrial facilities in Ikeja Industrial Estate, Ikorodu, and Ibeju-Lekki.',
  },
];

const FAQS = [
  {
    question: 'How does Sunlit verify solar installers in Lagos?',
    answer:
      'Every installer on Sunlit undergoes a multi-stage verification process that includes CAC business registration validation, electrical engineering certifications, insurance verification, and review of previously commissioned solar projects across Lagos.',
  },
  {
    question: 'How do milestone escrow payments protect my project in Lagos?',
    answer:
      'When you accept a proposal, you fund project milestones into secure escrow. Payments are released only after you and your designated engineering team inspect and approve each completed stage (e.g., equipment delivery, mounting, commissioning).',
  },
  {
    question: 'Can solar systems withstand the coastal climate in Lekki and Victoria Island?',
    answer:
      'Yes. Installers on Sunlit use marine-grade anodized aluminum mounting structures, IP65-rated inverters, and corrosion-resistant fasteners specifically suited for coastal Lagos environments.',
  },
  {
    question: 'Do residential estates in Lagos allow solar panel installation on rooftops?',
    answer:
      'Most residential estates in Lagos (including Lekki Phase 1, Magodo, and Ikoyi) encourage rooftop solar installations. Verified installers handle structural roof assessments and provide the single-line diagrams (SLDs) required for estate approvals.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Sunlit Energy Lagos',
    description:
      'Solar energy marketplace serving Lagos State with verified installers, engineering assessments, and milestone escrow payments.',
    url: 'https://sunlit.energy/locations/lagos',
    telephone: '+234-800-SUNLIT',
    priceRange: '₦₦₦',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 6.5244, longitude: 3.3792 },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Lekki' },
      { '@type': 'AdministrativeArea', name: 'Victoria Island' },
      { '@type': 'AdministrativeArea', name: 'Ikoyi' },
      { '@type': 'AdministrativeArea', name: 'Ikeja' },
      { '@type': 'AdministrativeArea', name: 'Surulere' },
      { '@type': 'AdministrativeArea', name: 'Ajah' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sunlit.energy' },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: 'https://sunlit.energy/locations' },
      { '@type': 'ListItem', position: 3, name: 'Lagos State', item: 'https://sunlit.energy/locations/lagos' },
    ],
  },
];

export default function LagosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* Contextual Back Navigation */}
        <ContextualBackNav href="/locations" label="Service Areas" />

        {/* Hero Section */}
        <section
          aria-label="Lagos hero"
          style={{
            padding: '4rem 1.5rem 3.5rem',
            background: 'linear-gradient(180deg, #f6f3eb 0%, #faf8f3 100%)',
            borderBottom: '1px solid rgba(191,202,186,0.3)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(0,73,14,0.08)',
                borderRadius: '9999px',
                padding: '0.375rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              <MapPin size={14} color="#00490e" />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Lagos State · Active Service Hub
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 800,
                    fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                    color: '#1a1c1b',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                    marginBottom: '1.25rem',
                  }}
                >
                  Solar Energy Solutions in Lagos
                </h1>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    color: '#40493d',
                    lineHeight: 1.7,
                    marginBottom: '2rem',
                  }}
                >
                  Connect with verified solar installers across Lagos. From residential estates in Lekki and Ikoyi to
                  commercial headquarters in Victoria Island and Ikeja — compare competitive bids with milestone escrow
                  protection.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link
                    href="/request-quote"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(0,73,14,0.2)',
                    }}
                  >
                    Request Solar Quotes in Lagos <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/tools/solar-system-sizing"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '9999px',
                      border: '1.5px solid rgba(191,202,186,0.5)',
                      color: '#1a1c1b',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      background: '#fff',
                    }}
                  >
                    Size Your System
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { value: 'Band A', label: 'Tariff Relief Target' },
                  { value: '100%', label: 'Escrow Milestone Funding' },
                  { value: 'LiFePO4', label: 'Standard Battery Chemistry' },
                  { value: '₦0', label: 'Upfront Contractor Risk' },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: '#fff8f5',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid rgba(191,202,186,0.4)',
                      boxShadow: '0 2px 8px rgba(0,73,14,0.04)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.75rem',
                        color: '#00490e',
                        letterSpacing: '-0.02em',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#40493d' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lagos Energy Landscape */}
        <section aria-label="Lagos energy context" style={{ padding: '4.5rem 1.5rem', background: '#f7fbf1' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ maxWidth: '760px', marginBottom: '3rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Local Energy Profile
              </span>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1c1b',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                Navigating Lagos’s Energy Economics
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.7 }}>
                Lagos residents and businesses face frequent grid tariff revisions and volatile diesel fuel costs.
                Installing an engineered solar power system stabilizes monthly energy expenses, protects sensitive
                electronics, and provides silent, uninterrupted electricity for homes and commercial operations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: TrendingUp,
                  title: 'Displacing Generator Fuel',
                  desc: 'Running diesel or petrol generators in Lagos costs up to ₦350–₦450 per kilowatt-hour. Hybrid solar systems reduce generator runtime by 70% to 90%.',
                },
                {
                  icon: Zap,
                  title: 'Grid Tariff Resilience',
                  desc: 'Band A feeder tariffs make solar energy generation and daytime self-consumption significantly more cost-effective than utility grid dependence.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Coastal Corrosion Standards',
                  desc: 'Roofs in Lekki, Oniru, and Victoria Island require anodized mounting hardware and sealed IP65 electronics to resist maritime salt air and humidity.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: '#fff8f5',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.4)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(0,73,14,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <item.icon size={20} color="#00490e" />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                      color: '#1a1c1b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods We Serve with Direct Directory Links */}
        <section
          id="neighborhoods"
          aria-label="Lagos neighborhoods"
          style={{ padding: '5rem 1.5rem', background: '#faf8f3', borderTop: '1px solid rgba(191,202,186,0.3)' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Local Coverage
              </span>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1c1b',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Lagos Neighborhoods & Service Districts
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {LAGOS_NEIGHBORHOODS.map((n) => (
                <div
                  key={n.name}
                  style={{
                    background: '#fff8f5',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.1875rem',
                      color: '#1a1c1b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {n.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#40493d',
                      lineHeight: 1.6,
                      marginBottom: '1rem',
                    }}
                  >
                    {n.context}
                  </p>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#00490e',
                      fontWeight: 600,
                      marginBottom: '1.25rem',
                    }}
                  >
                    Typical System: {n.typicalSystem}
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href={n.directoryUrl}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#00490e',
                        textDecoration: 'none',
                      }}
                    >
                      View Verified Installers in {n.name.split(',')[0]} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Guidelines & Pricing Overview */}
        <section
          aria-label="Lagos solar pricing guide"
          style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Investment Guide
              </span>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1c1b',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                Typical Solar System Ranges for Lagos
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65 }}>
                Indicative turnkey project costs including Tier-1 solar modules, pure sine wave inverters, LiFePO4 battery
                storage, professional installation, and protective switchgear.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {SYSTEM_GUIDELINES.map((item, idx) => (
                <div
                  key={item.name}
                  style={{
                    background: idx === 0 ? 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)' : '#fff8f5',
                    borderRadius: '20px',
                    padding: '2.25rem',
                    border: idx === 0 ? 'none' : '1px solid rgba(191,202,186,0.4)',
                    color: idx === 0 ? '#fff' : '#1a1c1b',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: idx === 0 ? 'rgba(255,255,255,0.75)' : '#00490e',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.875rem',
                      color: idx === 0 ? '#ceee93' : '#00490e',
                      letterSpacing: '-0.02em',
                      marginBottom: '1rem',
                    }}
                  >
                    {item.range}
                  </div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: idx === 0 ? 'rgba(255,255,255,0.85)' : '#40493d',
                      lineHeight: 1.6,
                      marginBottom: '1rem',
                    }}
                  >
                    {item.coverage}
                  </p>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: idx === 0 ? 'rgba(255,255,255,0.65)' : '#707a6c',
                    }}
                  >
                    Best for: {item.target}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Sunlit Works in Lagos */}
        <section
          aria-label="How Sunlit operates in Lagos"
          style={{ padding: '5rem 1.5rem', background: '#faf8f3', borderTop: '1px solid rgba(191,202,186,0.3)' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Project Execution
              </span>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1c1b',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                5-Step Escrow Workflow for Lagos Projects
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65 }}>
                Eliminate installer uncertainty. You control milestone disbursements from project initiation to final commissioning.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                { step: '01', title: 'Load Assessment', desc: 'Input your energy requirements or utility bill to determine exact kilowatt and battery storage capacity.' },
                { step: '02', title: 'Vetted Bidding', desc: 'Licensed Lagos solar contractors submit detailed quotes with equipment specifications and warranties.' },
                { step: '03', title: 'Milestone Escrow', desc: 'Deposit funds into an escrow account. Installers receive payment only after verified milestone approval.' },
                { step: '04', title: 'Quality Delivery', desc: 'Installation adheres to Nigerian electrical standards with structural roof checks and battery load testing.' },
                { step: '05', title: 'Commissioning', desc: 'System handover with inverter monitoring app setup, warranty certificates, and ongoing support.' },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    background: '#fff8f5',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.4)',
                  }}
                >
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#00490e', marginBottom: '0.75rem' }}>
                    {s.step}
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', marginBottom: '0.5rem' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.6 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section
          aria-label="Lagos solar FAQs"
          style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}
        >
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Frequently Asked Questions
              </span>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1c1b',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Solar Power in Lagos
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {FAQS.map((faq) => (
                <div
                  key={faq.question}
                  style={{
                    background: '#fff8f5',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.4)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      color: '#1a1c1b',
                      marginBottom: '0.625rem',
                    }}
                  >
                    {faq.question}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion CTA */}
        <section
          aria-label="Lagos CTA"
          style={{
            padding: '5rem 1.5rem',
            background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '1.25rem',
              }}
            >
              Ready for Reliable Solar Power in Lagos?
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.0625rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
              }}
            >
              Get matched with verified solar installers in your Lagos neighborhood. Receive competitive proposals with 100% milestone escrow payment security.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/request-quote"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  background: '#fff',
                  color: '#00490e',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                }}
              >
                Request Competitive Quotes <ArrowRight size={18} />
              </Link>
              <Link
                href="/installers/lagos"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  background: 'transparent',
                }}
              >
                Browse Lagos Directory
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
