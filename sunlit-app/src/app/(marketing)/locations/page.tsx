import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldCheck, Zap, Users, Building, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Service Areas in Nigeria — Lagos, Abuja & Ogun State | Sunlit Energy',
  description:
    'Explore Sunlit Energy service coverage across Nigeria. Active regional hubs in Lagos State, Abuja FCT, and Ogun State with verified solar installers, milestone escrow protection, and transparent pricing.',
  alternates: { canonical: 'https://sunlit.energy/locations' },
  openGraph: {
    title: 'Service Areas in Nigeria — Sunlit Energy',
    description:
      'Connecting property owners and commercial enterprises with verified local solar installers across Lagos, Abuja, and Ogun State with milestone escrow protection.',
    url: 'https://sunlit.energy/locations',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Service Areas in Nigeria — Sunlit Energy',
    description:
      'Explore Sunlit solar service hubs in Lagos, Abuja, and Ogun State. 100% milestone escrow payment security.',
  },
};

interface ServiceHub {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  summary: string;
  neighborhoods: Array<{ name: string; href: string }>;
  keyServices: string[];
  featured?: boolean;
}

const ACTIVE_HUBS: ServiceHub[] = [
  {
    slug: 'lagos',
    name: 'Lagos State',
    badge: 'Commercial Hub',
    tagline: 'Lekki · Victoria Island · Ikoyi · Ikeja · Surulere · Ajah',
    summary:
      'High-density residential estates, corporate headquarters, and commercial centers seeking relief from Band A grid tariffs and diesel generator operating expenses.',
    neighborhoods: [
      { name: 'Lekki Phase 1 & Chevron', href: '/installers/lagos/lekki' },
      { name: 'Victoria Island', href: '/installers/lagos/victoria-island' },
      { name: 'Ikoyi', href: '/installers/lagos/ikoyi' },
      { name: 'Ikeja & Maryland', href: '/installers/lagos/ikeja' },
      { name: 'Ajah & Sangotedo', href: '/installers/lagos/ajah' },
    ],
    keyServices: ['Residential Solar', 'Commercial Solar', 'Battery Storage (LiFePO4)', 'Solar Maintenance'],
    featured: true,
  },
  {
    slug: 'abuja',
    name: 'Abuja (FCT)',
    badge: 'Federal Capital Hub',
    tagline: 'Maitama · Wuse II · Garki · Asokoro · Gwarinpa · Jabi',
    summary:
      'Federal Capital Territory demand spanning executive residential duplexes, diplomatic missions, and commercial properties requiring continuous, stable solar microgrids.',
    neighborhoods: [
      { name: 'Maitama', href: '/installers/abuja/maitama' },
      { name: 'Wuse II & Central Area', href: '/installers/abuja/wuse' },
      { name: 'Garki District', href: '/locations/abuja#districts' },
      { name: 'Asokoro & Guzape', href: '/locations/abuja#districts' },
      { name: 'Gwarinpa Estate', href: '/locations/abuja#districts' },
    ],
    keyServices: ['Residential Hybrid Solar', 'Institutional Solar', 'Energy Audits', 'Battery Storage'],
    featured: false,
  },
  {
    slug: 'ogun',
    name: 'Ogun State',
    badge: 'Industrial Corridor',
    tagline: 'Ota · Sagamu · Abeokuta · Ijebu-Ode · Mowe / Ibafo',
    summary:
      'Nigeria’s primary manufacturing and logistics corridor where manufacturing plants, cold chain storage, and growing commuter communities benefit from high solar payback.',
    neighborhoods: [
      { name: 'Ota Industrial Zone', href: '/locations/ogun#corridors' },
      { name: 'Sagamu & Interchange', href: '/locations/ogun#corridors' },
      { name: 'Abeokuta Urban Hub', href: '/locations/ogun#corridors' },
      { name: 'Mowe & Ibafo Corridor', href: '/locations/ogun#corridors' },
    ],
    keyServices: ['Industrial Solar (100kW+)', 'Commercial Solar', 'Agro-Solar Microgrids', 'Residential Backup'],
    featured: false,
  },
];

const PLANNED_EXPANSIONS = [
  { city: 'Port Harcourt', state: 'Rivers State', context: 'Oil & gas logistics, commercial retail & residential estates' },
  { city: 'Ibadan', state: 'Oyo State', context: 'Agro-processing, universities, commercial centers & residential developments' },
  { city: 'Benin City', state: 'Edo State', context: 'Commercial logistics, manufacturing & residential corridors' },
  { city: 'Enugu', state: 'Enugu State', context: 'Regional commerce, hospitality & residential estates' },
  { city: 'Kano', state: 'Kano State', context: 'Commercial trading hubs, light manufacturing & solar water pumping' },
  { city: 'Kaduna', state: 'Kaduna State', context: 'Industrial complexes, agriculture & institutional power' },
];

export default function LocationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Sunlit Energy Service Areas in Nigeria',
            url: 'https://sunlit.energy/locations',
            description:
              'Directory of solar energy service hubs and verified installer networks operating across Lagos, Abuja, and Ogun State.',
            publisher: {
              '@type': 'Organization',
              name: 'Sunlit Energy',
              url: 'https://sunlit.energy',
            },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Lagos State Solar Energy Hub',
                  url: 'https://sunlit.energy/locations/lagos',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Abuja FCT Solar Energy Hub',
                  url: 'https://sunlit.energy/locations/abuja',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Ogun State Solar Energy Hub',
                  url: 'https://sunlit.energy/locations/ogun',
                },
              ],
            },
          }),
        }}
      />

      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section
          aria-label="Service areas hero"
          style={{
            padding: '5rem 1.5rem 4rem',
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
                marginBottom: '1.5rem',
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
                Service Areas · Nigeria
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
                    lineHeight: 1.1,
                    marginBottom: '1.25rem',
                  }}
                >
                  Solar Energy Service Areas Across Nigeria
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
                  Sunlit connects residential, commercial, and industrial property owners with verified local solar
                  installers. Every project is backed by milestone escrow protection, transparent engineering
                  assessments, and milestone delivery oversight.
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
                    Request Project Quotes <ArrowRight size={16} />
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
                    Size Your System First
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { value: '3', label: 'Active Regional Hubs' },
                  { value: '100%', label: 'Escrow Milestone Protection' },
                  { value: '₦0', label: 'Upfront Financial Risk' },
                  { value: '25+ yrs', label: 'Equipment Lifecycle Support' },
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
                        fontSize: '1.875rem',
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

        {/* Active Hubs Section */}
        <section aria-label="Active service hubs" style={{ padding: '5rem 1.5rem', background: '#f7fbf1' }}>
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
                Coverage By Region
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
                Active Solar Service Hubs
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              {ACTIVE_HUBS.map((hub) => (
                <div
                  key={hub.slug}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fff8f5',
                    borderRadius: '20px',
                    border: hub.featured ? '2px solid rgba(0,73,14,0.3)' : '1px solid rgba(191,202,186,0.4)',
                    boxShadow: hub.featured ? '0 8px 32px rgba(0,73,14,0.08)' : '0 4px 16px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: hub.featured
                        ? 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)'
                        : 'linear-gradient(135deg, #f0e6e0 0%, #f7fbf1 100%)',
                      padding: '2rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        background: hub.featured ? 'rgba(255,255,255,0.2)' : 'rgba(0,73,14,0.08)',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.75rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: hub.featured ? '#fff' : '#00490e',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {hub.badge}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 800,
                        fontSize: '1.875rem',
                        color: hub.featured ? '#fff' : '#1a1c1b',
                        letterSpacing: '-0.02em',
                        marginBottom: '0.375rem',
                      }}
                    >
                      {hub.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: hub.featured ? 'rgba(255,255,255,0.8)' : '#40493d',
                      }}
                    >
                      {hub.tagline}
                    </p>
                  </div>

                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9375rem',
                        color: '#40493d',
                        lineHeight: 1.65,
                        marginBottom: '1.5rem',
                      }}
                    >
                      {hub.summary}
                    </p>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <div
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#00490e',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '0.625rem',
                        }}
                      >
                        Local Neighborhoods & Corridors
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {hub.neighborhoods.map((n) => (
                          <Link
                            key={n.name}
                            href={n.href}
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.8125rem',
                              color: '#1a1c1b',
                              background: '#f4ece6',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              border: '1px solid rgba(191,202,186,0.3)',
                              transition: 'all 120ms ease',
                            }}
                          >
                            {n.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <div
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#00490e',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: '0.625rem',
                        }}
                      >
                        Available Services
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {hub.keyServices.map((svc) => (
                          <span
                            key={svc}
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                              color: '#40493d',
                              background: 'rgba(0,73,14,0.05)',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '6px',
                            }}
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link
                        href={`/locations/${hub.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#00490e',
                          textDecoration: 'none',
                        }}
                      >
                        Explore {hub.name} Page <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Sunlit Geographic Matching Works */}
        <section
          aria-label="How Sunlit operates"
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
                Local Delivery Architecture
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
                How We Deliver Solar Projects in Every Hub
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', lineHeight: 1.65 }}>
                We combine regional solar engineering standards with milestone payment protection to ensure your solar
                installation performs as promised.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  step: '01',
                  title: 'Energy Assessment',
                  desc: 'We analyze your electricity bills, diesel expenditure, roof structure, and appliance load to calculate your ideal system size.',
                },
                {
                  step: '02',
                  title: 'Competitive Local Bids',
                  desc: 'Verified installers licensed in your specific city submit structured technical proposals based on the standardized specification.',
                },
                {
                  step: '03',
                  title: 'Escrow Milestone Funding',
                  desc: 'You fund project milestones into secure escrow. Money is only released after you inspect and approve each stage.',
                },
                {
                  step: '04',
                  title: 'Commissioning & Monitoring',
                  desc: 'Installations undergo quality checklists, inverter configuration, battery balance testing, and long-term performance tracking.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    background: '#fff8f5',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.4)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      color: '#00490e',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.step}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.0625rem',
                      color: '#1a1c1b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Expansion Hubs */}
        <section
          aria-label="Planned service hubs"
          style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
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
                Expansion Roadmap
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
                Planned Regional Service Hubs
              </h2>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#40493d',
                  marginTop: '0.5rem',
                  maxWidth: '700px',
                }}
              >
                We are actively vetting solar engineering teams and local EPC partners in these key commercial centers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {PLANNED_EXPANSIONS.map((item) => (
                <div
                  key={item.city}
                  style={{
                    background: '#fff8f5',
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    border: '1px solid rgba(191,202,186,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1a1c1b' }}>
                      {item.city}
                    </div>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#707a6c',
                        background: '#f0e6e0',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#00490e', fontWeight: 600, marginBottom: '0.375rem' }}>
                    {item.state}
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#556050', lineHeight: 1.5 }}>
                    {item.context}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conversion CTA */}
        <section
          aria-label="Service areas CTA"
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
              Start Your Solar Project in Nigeria
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
              Whether you are powering a private residence, an apartment complex, or an industrial factory, Sunlit
              provides verified installers and milestone escrow protection.
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
                href="/tools/solar-system-sizing"
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
                Calculate System Size
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
