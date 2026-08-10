import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Activity,
  Server,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  HardHat,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sunlit Trust & Security Center — Enterprise Energy Governance | Sunlit Energy',
  description:
    'Explore Sunlit Energy trust architecture, milestone escrow protection, installer vetting standards, hardware compliance, and platform security integrity.',
  keywords:
    'sunlit trust center, solar escrow security nigeria, installer vetting standards, nemsa compliance, energy platform security',
  alternates: { canonical: 'https://sunlit.energy/trust' },
  openGraph: {
    title: 'Sunlit Trust & Security Center — Enterprise Energy Governance',
    description:
      'Milestone escrow architecture, installer vetting protocols, and hardware compliance across Nigeria.',
    url: 'https://sunlit.energy/trust',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const PILLARS = [
  {
    icon: Lock,
    title: 'Milestone Escrow Architecture',
    tag: 'Financial Governance',
    description:
      'Capital is held in segregated, audited escrow accounts. Funds release only when physical project milestones pass mutual digital signoff and testing protocols.',
    points: [
      'Zero upfront payment risk to unverified contractors',
      'Milestone-gated disbursements (Design, Delivery, Commissioning)',
      'Automated cryptographic audit trails and dispute resolution',
    ],
  },
  {
    icon: HardHat,
    title: 'Installer Accreditation & Vetting',
    tag: 'Technical Quality',
    description:
      'Only installers and EPC firms with validated corporate registration (CAC), lead engineer NEMSA certification, and verifiable track records are admitted to the network.',
    points: [
      'CAC corporate entity and tax clearance verification',
      'NEMSA certified electrical engineering personnel',
      'Continuous performance scoring and milestone completion SLAs',
    ],
  },
  {
    icon: Cpu,
    title: 'Hardware & Design Compliance',
    tag: 'Engineering Rigor',
    description:
      'Standardized system sizing algorithms, Tier-1 hardware baseline requirements, and mandatory Single-Line Diagram (SLD) verification.',
    points: [
      'Tier-1 BloombergNEF solar module standards',
      'Grade-A LiFePO4 cells with Smart BMS thermal management',
      'Mandatory DC/AC surge protection and earthing impedance standards',
    ],
  },
  {
    icon: Server,
    title: 'Platform Security & Privacy',
    tag: 'Data Integrity',
    description:
      'End-to-end data encryption, role-based access control (RBAC), and strict privacy compliance protecting enterprise telemetry and financial documents.',
    points: [
      'TLS 1.3 encryption in transit and AES-256 at rest',
      'Strict NDPR (Nigeria Data Protection Regulation) compliance',
      'Immutable audit logging for bids, contracts, and fund releases',
    ],
  },
];

const COMPLIANCE_ITEMS = [
  {
    standard: 'NEMSA',
    title: 'Nigerian Electricity Management Services Agency',
    description: 'Lead electrical engineers accredited for high-voltage and microgrid safety compliance.',
  },
  {
    standard: 'CAC',
    title: 'Corporate Affairs Commission',
    description: 'Audited Nigerian business entity status for all participating EPC firms and installers.',
  },
  {
    standard: 'NDPR',
    title: 'Nigeria Data Protection Regulation',
    description: 'Comprehensive personal and financial telemetry data sovereignty and user privacy enforcement.',
  },
  {
    standard: 'IEC / ISO',
    title: 'IEC 61215 & IEC 62109 Hardware Standards',
    description: 'Strict component benchmarks for solar modules, inverters, and battery safety.',
  },
];

export default function TrustPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Sunlit Trust & Security Center',
            url: 'https://sunlit.energy/trust',
            description:
              'Enterprise trust architecture, milestone escrow governance, and technical accreditation standards for solar projects in Nigeria.',
            publisher: {
              '@type': 'Organization',
              name: 'Sunlit Energy',
              url: 'https://sunlit.energy',
            },
          }),
        }}
      />

      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* ── Hero Section ──────────────────────────────────────────── */}
        <section
          style={{
            padding: '5rem 1.5rem 4rem',
            background: 'linear-gradient(180deg, #f6f3eb 0%, #faf8f3 100%)',
            borderBottom: '1px solid rgba(191,202,186,0.3)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
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
                Trust &amp; Governance Architecture
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                color: '#1a1c1b',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                maxWidth: '900px',
                margin: '0 auto 1.5rem',
              }}
            >
              Institutional Integrity for African Clean Energy
            </h1>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
                color: '#40493d',
                lineHeight: 1.7,
                maxWidth: '750px',
                margin: '0 auto 2.5rem',
              }}
            >
              Sunlit Energy enforces bank-grade milestone escrow, stringent engineering accreditation, and transparent component standards to eliminate procurement risk.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/request-quote"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
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
                Start an Escrow-Protected Project <ArrowRight size={16} />
              </Link>
              <Link
                href="/faq"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
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
                Read Security FAQ
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pillars Grid ──────────────────────────────────────────── */}
        <section style={{ padding: '5rem 1.5rem', background: '#faf8f3' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Core Pillars
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
                Engineered for Total Project Protection
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    style={{
                      background: '#fff',
                      borderRadius: '20px',
                      padding: '2rem',
                      border: '1px solid rgba(191,202,186,0.3)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'rgba(0,73,14,0.08)',
                            color: '#00490e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={22} />
                        </div>
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#00490e',
                            background: 'rgba(0,73,14,0.08)',
                            borderRadius: '9999px',
                            padding: '0.25rem 0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {p.tag}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: 'Manrope, sans-serif',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          color: '#1a1c1b',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {p.title}
                      </h3>

                      <p
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9375rem',
                          color: '#40493d',
                          lineHeight: 1.65,
                          marginBottom: '1.5rem',
                        }}
                      >
                        {p.description}
                      </p>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {p.points.map((pt, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#1a1c1b' }}>
                          <CheckCircle2 size={15} color="#00490e" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Compliance Standards ──────────────────────────────────── */}
        <section style={{ padding: '5rem 1.5rem', background: '#f4f4f1', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#00490e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Accreditation &amp; Compliance
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
                Regulatory &amp; Technical Baselines
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {COMPLIANCE_ITEMS.map((c) => (
                <div
                  key={c.standard}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid rgba(191,202,186,0.3)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      color: '#00490e',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {c.standard}
                  </div>
                  <h4
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      color: '#1a1c1b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {c.title}
                  </h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.6 }}>
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────── */}
        <section
          style={{
            padding: '4.5rem 1.5rem',
            background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                marginBottom: '1rem',
              }}
            >
              Build with Complete Security
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.0625rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.65,
                marginBottom: '2rem',
              }}
            >
              Protect your capital and solar project delivery with Sunlit’s audited milestone escrow framework.
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
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
