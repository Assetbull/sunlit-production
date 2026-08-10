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
  Building2,
  Landmark,
} from 'lucide-react';
import { ContextualBackNav } from '@/shared/components/navigation/ContextualBackNav';

export const metadata: Metadata = {
  title: 'Solar Energy in Abuja (FCT) Nigeria — Vetted Installers & Escrow Protection | Sunlit Energy',
  description:
    'Verified solar installers in Abuja FCT (Maitama, Wuse II, Garki, Asokoro, Gwarinpa, Jabi). Compare competitive quotes, protect funds with milestone escrow payments, and deploy institutional-grade solar systems.',
  keywords:
    'solar energy abuja, solar installer maitama, solar panel wuse abuja, solar installers asokoro, solar fct nigeria, commercial solar gwarinpa, solar price abuja nigeria',
  alternates: { canonical: 'https://sunlit.energy/locations/abuja' },
  openGraph: {
    title: 'Solar Energy in Abuja (FCT) — Sunlit Energy Nigeria',
    description:
      "Abuja's solar marketplace. Verified installers, milestone escrow security, and institutional engineering for residences, embassies, and commercial centers.",
    url: 'https://sunlit.energy/locations/abuja',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Energy in Abuja Nigeria — Sunlit Energy',
    description:
      'Connect with verified solar installers in Abuja with 100% milestone escrow payment security.',
  },
};

const ABUJA_DISTRICTS = [
  {
    name: 'Maitama, Guzape & Asokoro',
    directoryUrl: '/installers/abuja/maitama',
    context: 'Diplomatic missions, executive residences, and private estates requiring silent, uninterrupted LiFePO4 battery hybrid systems.',
    typicalSystem: '10kVA – 30kVA Premium Hybrid',
  },
  {
    name: 'Wuse II & Central Business District',
    directoryUrl: '/installers/abuja/wuse',
    context: 'Commercial headquarters, financial institutions, private clinics, and hospitality venues seeking diesel displacement.',
    typicalSystem: '20kVA – 100kVA Commercial Three-Phase',
  },
  {
    name: 'Garki District & Area 1–11',
    directoryUrl: '/installers/abuja',
    context: 'Government parastatals, commercial office buildings, consultancy firms, and residential apartments.',
    typicalSystem: '7.5kVA – 25kVA Hybrid',
  },
  {
    name: 'Gwarinpa Estate & Life Camp',
    directoryUrl: '/installers/abuja',
    context: 'High-density residential housing estates and mixed commercial retail centers requiring dependable backup.',
    typicalSystem: '5kVA – 15kVA Residential Hybrid',
  },
  {
    name: 'Jabi, Utako & Mabushi',
    directoryUrl: '/installers/abuja',
    context: 'Commercial shopping plazas, distribution centers, logistics hubs, and residential serviced apartments.',
    typicalSystem: '15kVA – 50kVA Hybrid',
  },
  {
    name: 'Lugbe, Kubwa & Satellite Corridors',
    directoryUrl: '/installers/abuja',
    context: 'Fast-growing residential corridors and modern housing developments building clean solar power from ground up.',
    typicalSystem: '3.5kVA – 10kVA Hybrid',
  },
];

const SYSTEM_GUIDELINES = [
  {
    name: 'Residential Hybrid (3.5kVA – 10kVA)',
    range: '₦3,000,000 – ₦10,500,000',
    coverage: 'Powers lighting, refrigerators, home entertainment, security systems, water pumping, and bedroom air conditioning.',
    target: 'Duplexes, detached homes, and serviced apartments in Maitama, Gwarinpa, and Lugbe.',
  },
  {
    name: 'Commercial Solar (15kVA – 80kVA)',
    range: '₦15,000,000 – ₦85,000,000',
    coverage: 'Powers central office air conditioning, computer servers, retail refrigeration, and specialized medical suites.',
    target: 'Commercial offices, embassies, clinics, and schools in CBD, Wuse II, and Jabi.',
  },
  {
    name: 'Institutional Microgrids (100kVA – 1MW+)',
    range: '₦90,000,000 – ₦700,000,000+',
    coverage: 'Displaces heavy multi-megawatt diesel generators for hospitals, government complexes, and data facilities.',
    target: 'Public institutions, logistics centers, and large hotel complexes across FCT.',
  },
];

const FAQS = [
  {
    question: 'Why is solar energy particularly effective in Abuja?',
    answer:
      'Abuja benefits from high average annual solar irradiance (5.5 to 6.0 peak sun hours per day) with minimal coastal haze. This allows solar panel arrays in Abuja to generate high daily kilowatt-hour yields year-round.',
  },
  {
    question: 'How do milestone escrow payments work for Abuja projects?',
    answer:
      'You deposit milestone funds into escrow before work begins. Payments are released to the installer only after physical inspection and sign-off on delivered milestones (equipment on-site, mechanical installation, electrical commissioning).',
  },
  {
    question: 'Can solar systems power air conditioning in Abuja residences?',
    answer:
      'Yes. Properly sized hybrid solar systems with modern inverter-grade air conditioners and high-C-rate LiFePO4 batteries reliably run air conditioning during both daytime hours and overnight backup periods.',
  },
  {
    question: 'Do installers handle Development Control and estate permits in FCT?',
    answer:
      'Verified installers on Sunlit produce electrical schematics, load calculations, and structural roof documentation required for estate facility managers and FCTA Development Control compliance.',
  },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Sunlit Energy Abuja',
    description:
      'Solar energy marketplace serving Abuja FCT with verified installers, engineering design, and milestone escrow payments.',
    url: 'https://sunlit.energy/locations/abuja',
    telephone: '+234-800-SUNLIT',
    priceRange: '₦₦₦',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressRegion: 'Federal Capital Territory',
      addressCountry: 'NG',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 9.0765, longitude: 7.3986 },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Maitama' },
      { '@type': 'AdministrativeArea', name: 'Asokoro' },
      { '@type': 'AdministrativeArea', name: 'Wuse' },
      { '@type': 'AdministrativeArea', name: 'Garki' },
      { '@type': 'AdministrativeArea', name: 'Gwarinpa' },
      { '@type': 'AdministrativeArea', name: 'Jabi' },
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
      { '@type': 'ListItem', position: 3, name: 'Abuja FCT', item: 'https://sunlit.energy/locations/abuja' },
    ],
  },
];

export default function AbujaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* Contextual Back Navigation */}
        <ContextualBackNav href="/locations" label="Service Areas" />

        {/* Hero Section */}
        <section
          aria-label="Abuja hero"
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
                Abuja FCT · Active Service Hub
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
                  Solar Energy Solutions in Abuja
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
                  Connect with verified solar installers across the Federal Capital Territory. From Maitama, Wuse II, and
                  Asokoro to Gwarinpa and Lugbe — access competitive bids with milestone escrow protection.
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
                    Request Solar Quotes in Abuja <ArrowRight size={16} />
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
                  { value: '5.8 kWh', label: 'Peak Sun Hours / m²' },
                  { value: '100%', label: 'Escrow Milestone Funding' },
                  { value: 'Tier-1', label: 'Equipment Specifications' },
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

        {/* Abuja Energy Landscape */}
        <section aria-label="Abuja energy profile" style={{ padding: '4.5rem 1.5rem', background: '#f7fbf1' }}>
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
                Solar Energy Potential in the Federal Capital
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.7 }}>
                Abuja experiences higher solar insolation than coastal regions, yielding fast return-on-investment for
                rooftop solar installations. Residential duplexes, corporate embassies, and government facilities leverage
                hybrid solar systems with LiFePO4 batteries for clean, quiet, 24/7 power independence.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: Sun,
                  title: 'Superior Solar Irradiance',
                  desc: 'Abuja averages nearly 6 hours of peak sunlight daily, providing solar modules with maximum generation efficiency during working hours.',
                },
                {
                  icon: Landmark,
                  title: 'Executive & Institutional Demands',
                  desc: 'Diplomatic missions, private hospitals, and corporate headquarters require zero-noise, high-reliability power systems without generator exhaust.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Standardized Escrow Protection',
                  desc: 'Sunlit protects every project in Abuja by holding funds in escrow until milestone sign-off and electrical commissioning are validated.',
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

        {/* Districts We Serve */}
        <section
          id="districts"
          aria-label="Abuja districts"
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
                District Coverage
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
                Abuja Districts & Service Areas
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {ABUJA_DISTRICTS.map((d) => (
                <div
                  key={d.name}
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
                    {d.name}
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
                    {d.context}
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
                    Typical System: {d.typicalSystem}
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href={d.directoryUrl}
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
                      View Verified Installers in {d.name.split(',')[0]} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Guidelines & Sizing */}
        <section
          aria-label="Abuja solar pricing guide"
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
                Typical Solar System Ranges for Abuja
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65 }}>
                Estimated turnkey costs including premium Tier-1 monocrystalline panels, hybrid pure sine wave inverters,
                LiFePO4 battery modules, and certified installation.
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
          aria-label="Abuja solar FAQs"
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
                Solar Power in Abuja
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
          aria-label="Abuja CTA"
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
              Ready for Clean, Reliable Solar in Abuja?
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
              Connect with verified solar installers in your Abuja district. Request competitive quotes with 100% milestone
              escrow security.
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
                href="/installers/abuja"
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
                Browse Abuja Directory
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
