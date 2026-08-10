import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, Building2, Home, Factory, MapPin, Zap, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Case Studies & Engineering Models — Nigeria | Sunlit Energy',
  description:
    'Explore illustrative case studies and modeled solar engineering scenarios across Nigeria. See modeled diesel displacement and milestone escrow workflows for Lekki, Maitama, and Ota facilities.',
  keywords:
    'solar case studies nigeria, commercial solar roi nigeria, lekki solar model, industrial solar ota case study, solar installer benchmarks abuja',
  alternates: { canonical: 'https://sunlit.energy/testimonials' },
  openGraph: {
    title: 'Solar Energy Case Studies & Engineering Models — Sunlit Energy Nigeria',
    description:
      'Modeled performance benchmarks, diesel displacement metrics, and escrow workflows across Nigerian residential, commercial, and industrial installations.',
    url: 'https://sunlit.energy/testimonials',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Case Studies Nigeria — Sunlit Energy',
    description:
      'Modeled project benchmarks: up to 85% diesel displacement and zero-risk milestone escrow across Nigerian residential and commercial installations.',
  },
};

const CASE_STUDIES = [
  {
    id: 'lekki-residential',
    title: '15kVA Hybrid Solar + 20kWh LiFePO4 Retrofit',
    clientType: 'Illustrative Residential Scenario',
    location: 'Lekki Phase 1, Lagos',
    icon: Home,
    badge: 'Modeled Residential Scenario',
    metrics: [
      { label: 'Modeled Fuel Savings', value: '₦420,000 / mo' },
      { label: 'Modeled Gen Offset', value: 'Up to 92%' },
      { label: 'Standard Delivery', value: '14–21 Days' },
    ],
    summary:
      'Engineering model for a 5-bedroom duplex switching from prime diesel generation to a continuous hybrid solar and LiFePO4 battery configuration, backed by milestone-gated escrow releases.',
    author: 'Modeled Profile: High-Density Residential Property',
    role: 'Residential Energy Model',
    systemSpecs: '15kVA Hybrid Inverter · 20.4kWh LiFePO4 Storage · 24 × 550W Tier-1 Mono PERC Panels',
  },
  {
    id: 'maitama-commercial',
    title: '45kVA Commercial Microgrid & Peak Shaving',
    clientType: 'Illustrative Commercial Scenario',
    location: 'Maitama, Abuja (FCT)',
    icon: Building2,
    badge: 'Modeled Commercial Scenario',
    metrics: [
      { label: 'Modeled OPEX Reduction', value: '₦8.4M / yr' },
      { label: 'Modeled Payback Period', value: '2.8 Years' },
      { label: 'Target Uptime', value: '99.98%' },
    ],
    summary:
      'Commercial deployment model demonstrating synchronized 3-phase solar microgrids designed to protect sensitive IT server rooms and eliminate corporate generator noise in diplomatic zones.',
    author: 'Modeled Profile: Multi-Floor Corporate Office',
    role: 'Commercial Facility Model',
    systemSpecs: '3 × 15kVA 3-Phase Synchronized Inverters · 60kWh HV LiFePO4 Rack · 80 × 550W Bifacial Panels',
  },
  {
    id: 'ota-industrial',
    title: '120kW Industrial Solar + Diesel Hybrid Synchronization',
    clientType: 'Illustrative Industrial Scenario',
    location: 'Ota Industrial Zone, Ogun State',
    icon: Factory,
    badge: 'Modeled Industrial Scenario',
    metrics: [
      { label: 'Daytime Diesel Offset', value: 'Up to 78%' },
      { label: 'Modeled Monthly Savings', value: '₦2.8M / mo' },
      { label: 'Modeled CO2 Offset', value: '142 Tonnes / yr' },
    ],
    summary:
      'Heavy industrial scenario analyzing fuel-saver synchronization with existing Cummins/Perkins diesel generators to reduce factory daytime electricity tariffs without production interruptions.',
    author: 'Modeled Profile: Agro-Allied Manufacturing Plant',
    role: 'Industrial Engineering Model',
    systemSpecs: '120kW Solar Array · Fuel Save Controller · Smart Zero-Export Grid Intertie',
  },
];

const STATS = [
  { value: 'Up to 85%', label: 'Modeled Diesel Displacement' },
  { value: '100%', label: 'Milestone Escrow Protection' },
  { value: '6,000+', label: 'LiFePO4 Cycle Warranty Standard' },
  { value: '₦0', label: 'Upfront Capital Risk' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Sunlit Energy Solar Case Studies & Engineering Models',
  url: 'https://sunlit.energy/testimonials',
  description: 'Illustrative solar energy case studies and engineering models across Lagos, Abuja, and Ogun State.',
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
        name: '15kVA Hybrid Solar + 20kWh LiFePO4 Residential Model',
        description: 'Illustrative residential solar installation model in Lekki Phase 1, Lagos.',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '45kVA Commercial Microgrid & Peak Shaving Model',
        description: 'Illustrative commercial solar installation model in Maitama, Abuja.',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '120kW Industrial Solar + Diesel Hybrid Synchronization Model',
        description: 'Illustrative industrial solar installation model in Ota Industrial Zone, Ogun State.',
      },
    ],
  },
};

export default function TestimonialsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          aria-label="Case studies hero"
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
              <ShieldCheck size={14} color="#00490e" />
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
                Engineering Demonstration &amp; Models
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
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
                  Modeled Case Studies &amp; Engineering Scenarios
                </h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#40493d', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Explore how Nigerian homeowners, corporate facilities, and industrial plants transition to clean solar power using verified engineering sizing, milestone-protected escrow payments, and modeled fuel savings.
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
                    Request Verified Bids <ArrowRight size={16} />
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
                      background: 'transparent',
                    }}
                  >
                    Calculate Your Custom Load
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: '#fdfbf7',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid rgba(191,202,186,0.3)',
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
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Case Studies Grid ─────────────────────────────────────── */}
        <section aria-label="Detailed case studies" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3.5rem' }}>
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
                Demonstration &amp; Engineering Scenarios
              </span>
              <h2
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: '#1a1c1b',
                  letterSpacing: '-0.02em',
                }}
              >
                Modeled Project Deployment Archetypes
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {CASE_STUDIES.map((cs) => {
                const Icon = cs.icon;
                return (
                  <article
                    key={cs.id}
                    style={{
                      background: '#fff',
                      borderRadius: '24px',
                      border: '1px solid rgba(191,202,186,0.3)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      overflow: 'hidden',
                      padding: '2.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#00490e',
                              background: 'rgba(0,73,14,0.08)',
                              borderRadius: '9999px',
                              padding: '0.25rem 0.75rem',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {cs.badge}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#707a6c', fontSize: '0.8125rem' }}>
                            <MapPin size={13} color="#00490e" /> {cs.location}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 800,
                            fontSize: '1.5rem',
                            color: '#1a1c1b',
                            lineHeight: 1.25,
                          }}
                        >
                          {cs.title}
                        </h3>
                      </div>

                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(0,73,14,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00490e',
                        }}
                      >
                        <Icon size={24} />
                      </div>
                    </div>

                    {/* Metrics Banner */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        background: '#f9f9f6',
                        borderRadius: '14px',
                        padding: '1.25rem 1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(191,202,186,0.25)',
                      }}
                    >
                      {cs.metrics.map((m) => (
                        <div key={m.label}>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#707a6c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {m.label}
                          </div>
                          <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#00490e', marginTop: '0.125rem' }}>
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Description */}
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        color: '#40493d',
                        lineHeight: 1.7,
                        marginBottom: '1.25rem',
                        borderLeft: '3px solid #00490e',
                        paddingLeft: '1rem',
                      }}
                    >
                      {cs.summary}
                    </div>

                    {/* Author & System Specs Footer */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid rgba(191,202,186,0.2)',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1a1c1b' }}>
                          {cs.author}
                        </div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                          {cs.role} · {cs.clientType}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          color: '#40493d',
                          background: '#f4f4f1',
                          borderRadius: '8px',
                          padding: '0.375rem 0.75rem',
                          border: '1px solid rgba(191,202,186,0.3)',
                        }}
                      >
                        <strong>Hardware Baseline:</strong> {cs.systemSpecs}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section
          aria-label="Start your solar project"
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
              Ready to Model Your Solar Transition?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Submit your property details to receive verified proposals from certified installers in your city. 100% escrow protection on all project milestones.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/request-quote"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.25rem',
                  borderRadius: '9999px',
                  background: '#fff',
                  color: '#00490e',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                }}
              >
                Request Verified Bids <ArrowRight size={18} />
              </Link>
              <Link
                href="/waitlist"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.25rem',
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
                Join Waitlist
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
