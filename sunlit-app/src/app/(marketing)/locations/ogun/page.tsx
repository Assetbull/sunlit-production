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
  Factory,
  Building,
} from 'lucide-react';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';

export const metadata: Metadata = {
  title: 'Solar Energy in Ogun State Nigeria — Industrial & Residential Solar | Sunlit Energy',
  description:
    'Solar energy solutions for Ogun State (Ota Industrial Zone, Abeokuta, Sagamu, Ijebu-Ode, Mowe/Ibafo). Verified EPC contractors, diesel displacement ROI, and milestone escrow payment protection.',
  keywords:
    'solar energy ogun state, industrial solar ota, solar installer abeokuta, solar power sagamu, solar installer mowe ibafo, solar price ogun state nigeria',
  alternates: { canonical: 'https://sunlit.energy/locations/ogun' },
  openGraph: {
    title: 'Solar Energy in Ogun State — Sunlit Energy Nigeria',
    description:
      "Ogun State's solar marketplace. Industrial microgrids, commercial facilities, and residential solar with 100% milestone escrow protection.",
    url: 'https://sunlit.energy/locations/ogun',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Energy in Ogun State Nigeria — Sunlit Energy',
    description:
      'Connect with verified solar installers in Ogun State with 100% milestone escrow payment security.',
  },
};

const OGUN_CORRIDORS = [
  {
    name: 'Ota Industrial Zone & Sango-Ota',
    directoryUrl: '/installers/ogun',
    context: 'Heavy manufacturing plants, plastics extrusion, chemical processing, and logistics warehouses requiring multi-hundred kilowatt diesel displacement.',
    typicalSystem: '100kVA – 1MW+ Industrial Microgrid',
  },
  {
    name: 'Abeokuta & Ibara Urban Hub',
    directoryUrl: '/installers/ogun',
    context: 'State capital residential estates, government institutions, university campuses, and commercial offices.',
    typicalSystem: '5kVA – 25kVA Residential/Commercial Hybrid',
  },
  {
    name: 'Sagamu, Interchange & Ijebu-Ode',
    directoryUrl: '/installers/ogun',
    context: 'Logistics hubs, agricultural processing plants, cold storage facilities, and highway commercial service plazas.',
    typicalSystem: '30kVA – 250kVA Commercial Three-Phase',
  },
  {
    name: 'Mowe, Ibafo & Magboro Commuter Zone',
    directoryUrl: '/installers/ogun',
    context: 'High-growth commuter residential housing estates seeking 24/7 solar autonomy with LiFePO4 battery storage.',
    typicalSystem: '3.5kVA – 10kVA Residential Hybrid',
  },
];

const SYSTEM_GUIDELINES = [
  {
    name: 'Residential Solar (3.5kVA – 10kVA)',
    range: '₦2,800,000 – ₦9,500,000',
    coverage: 'Powers lighting, refrigerators, home entertainment, security systems, water pumping, and inverter ACs.',
    target: 'Homes and housing estates in Mowe, Ibafo, and Abeokuta.',
  },
  {
    name: 'Commercial Solar (15kVA – 80kVA)',
    range: '₦14,000,000 – ₦75,000,000',
    coverage: 'Powers cold rooms, grain mills, hospitality venues, commercial banks, and private hospitals.',
    target: 'Commercial enterprises in Sagamu, Abeokuta, and Ijebu-Ode.',
  },
  {
    name: 'Industrial Microgrids (100kVA – 1MW+)',
    range: '₦85,000,000 – ₦700,000,000+',
    coverage: 'Displaces heavy industrial diesel generator fuel, stabilizes voltage, and lowers production cost per unit.',
    target: 'Factories, steel mills, plastics manufacturing, and logistics warehouses in Ota Industrial Zone.',
  },
];

const FAQS = [
  {
    question: 'How quickly does an industrial solar installation pay for itself in Ogun State?',
    answer:
      'For factories and cold storage facilities in Ota and Sagamu operating on continuous diesel generator power, the typical payback period ranges from 2.5 to 4 years, after which the solar system delivers virtually free electricity for its remaining 20+ year lifespan.',
  },
  {
    question: 'Can solar systems in Ogun State integrate with existing industrial generators?',
    answer:
      'Yes. Verified EPC contractors on Sunlit deploy hybrid solar controllers that seamlessly synchronize solar panel production, battery storage, and existing diesel generator sets to maximize fuel savings automatically.',
  },
  {
    question: 'How does Sunlit protect project financing in Ogun State?',
    answer:
      'All commercial and residential projects utilize Sunlit’s milestone escrow framework. Funds are held securely and released only when agreed technical milestones (e.g. mounting, inverter wiring, commissioning) pass verification.',
  },
  {
    question: 'Are installers equipped to handle ground-mount arrays on large factory grounds in Ota?',
    answer:
      'Yes. Sunlit verified EPC contractors handle both rooftop installations and utility-scale ground-mount solar arrays, including soil resistivity tests, civil foundation works, and lightning protection systems.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Sunlit Energy Ogun State',
    description:
      'Solar energy marketplace serving Ogun State with industrial and residential verified installers and milestone escrow payments.',
    url: 'https://sunlit.energy/locations/ogun',
    telephone: '+234-800-SUNLIT',
    priceRange: '₦₦₦',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abeokuta',
      addressRegion: 'Ogun State',
      addressCountry: 'NG',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 7.1475, longitude: 3.3619 },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Ota' },
      { '@type': 'AdministrativeArea', name: 'Abeokuta' },
      { '@type': 'AdministrativeArea', name: 'Sagamu' },
      { '@type': 'AdministrativeArea', name: 'Ijebu-Ode' },
      { '@type': 'AdministrativeArea', name: 'Mowe' },
      { '@type': 'AdministrativeArea', name: 'Ibafo' },
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
      { '@type': 'ListItem', position: 3, name: 'Ogun State', item: 'https://sunlit.energy/locations/ogun' },
    ],
  },
];

export default function OgunPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* Contextual Back Navigation */}
        <ContextualBackNav href="/locations" label="Service Areas" />

        {/* Hero Section */}
        <section
          aria-label="Ogun hero"
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
                Ogun State · Active Industrial Hub
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
                  Industrial & Residential Solar in Ogun State
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
                  Ogun State’s manufacturing corridor and commuter residential communities benefit from high solar
                  returns. Connect with verified EPC contractors and residential solar installers with milestone escrow
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
                    Request Solar Quotes in Ogun <ArrowRight size={16} />
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
                  { value: '1MW+', label: 'Industrial Microgrid Scale' },
                  { value: '100%', label: 'Escrow Milestone Funding' },
                  { value: '70%+', label: 'Diesel Fuel Reduction' },
                  { value: '₦0', label: 'Upfront Financial Risk' },
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

        {/* Ogun Energy Landscape */}
        <section aria-label="Ogun energy profile" style={{ padding: '4.5rem 1.5rem', background: '#f7fbf1' }}>
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
                Industrial Energy Profile
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
                Transforming Manufacturing Economics in Ogun State
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.7 }}>
                As Nigeria’s manufacturing heartland, Ogun State factories endure heavy diesel generation expenses and
                unstable transmission lines. Solar microgrids allow industrial facilities to stabilize power quality,
                protect machinery from phase imbalances, and achieve rapid operational payback.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: Factory,
                  title: 'Heavy Industrial Power',
                  desc: 'Deploy 100kVA to multi-megawatt rooftop and ground-mount solar arrays engineered for continuous industrial manufacturing in Ota and Sagamu.',
                },
                {
                  icon: TrendingUp,
                  title: 'High Financial Payback',
                  desc: 'Displacing continuous diesel generator runtime yields rapid project amortization within 2.5 to 4 years for commercial energy users.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Milestone Protected Delivery',
                  desc: 'Every project is protected by Sunlit escrow milestone disbursements, holding contractors to documented engineering quality standards.',
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

        {/* Corridors We Serve */}
        <section
          id="corridors"
          aria-label="Ogun corridors"
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
                Industrial & Regional Corridors
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
                Ogun State Service Areas
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {OGUN_CORRIDORS.map((c) => (
                <div
                  key={c.name}
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
                    {c.name}
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
                    {c.context}
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
                    Typical System: {c.typicalSystem}
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href={c.directoryUrl}
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
                      View Verified Installers in {c.name.split('&')[0].trim()} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Guidelines & Sizing */}
        <section
          aria-label="Ogun solar pricing guide"
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
                Typical Solar System Ranges for Ogun State
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65 }}>
                Estimated turnkey costs including industrial-grade monocrystalline modules, multi-string commercial inverters,
                high-voltage battery storage, and complete engineering commissioning.
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

        {/* FAQs */}
        <section
          aria-label="Ogun solar FAQs"
          style={{ padding: '5rem 1.5rem', background: '#faf8f3', borderTop: '1px solid rgba(191,202,186,0.3)' }}
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
                Solar Power in Ogun State
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
          aria-label="Ogun CTA"
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
              Deploy Industrial & Residential Solar in Ogun State
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
              Get matched with verified EPC contractors and residential solar installers in your Ogun State corridor.
              Milestone escrow protection on every project.
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
                href="/installers/ogun"
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
                Browse Ogun Directory
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
