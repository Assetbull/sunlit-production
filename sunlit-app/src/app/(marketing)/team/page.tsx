import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, ShieldCheck, Zap, HardHat, Cpu, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Team & Leadership — Sunlit Energy Nigeria',
  description:
    'Meet the engineering leaders, energy market specialists, and operators building Nigeria’s premier solar infrastructure platform.',
  keywords:
    'sunlit energy team, solar engineering leadership lagos, renewable energy team nigeria, clean energy operators',
  alternates: { canonical: 'https://sunlit.energy/team' },
  openGraph: {
    title: 'Our Team & Leadership — Sunlit Energy Nigeria',
    description: 'Meet the team building Nigeria’s next energy infrastructure.',
    url: 'https://sunlit.energy/team',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const LEADERSHIP = [
  {
    name: 'Executive Leadership',
    role: 'Platform Strategy & Operations',
    department: 'Executive',
    bio: 'Pioneering digital escrow protocols, installer standardization, and decentralized infrastructure scaling across West Africa.',
    badge: 'Operations & Strategy',
  },
  {
    name: 'Systems & CAD Engineering',
    role: 'Solar Design & Grid Intertie',
    department: 'Engineering',
    bio: 'Standardizing single-line diagrams (SLD), hybrid fuel-saver synchronization, and high-voltage LiFePO4 rack architectures.',
    badge: 'NEMSA Certified',
  },
  {
    name: 'EPC Quality & Accreditation',
    role: 'Installer Operations & Safety',
    department: 'Operations',
    bio: 'Overseeing installer vetting, on-site quality audits, and contractor SLA compliance across Lagos, Abuja, and Ogun State.',
    badge: 'Quality Assurance',
  },
  {
    name: 'Software & Telemetry Systems',
    role: 'Digital Platform & IoT',
    department: 'Technology',
    bio: 'Building real-time generation telemetry, milestone cryptographic verification, and the Sunlit calculation engine suite.',
    badge: 'Core Technology',
  },
];

const PILLARS = [
  {
    icon: HardHat,
    title: 'NEMSA-Certified Rigor',
    desc: 'Engineering oversight on every multi-phase solar deployment and industrial intertie.',
  },
  {
    icon: ShieldCheck,
    title: 'Escrow Governance',
    desc: 'Transparent milestone releases protecting capital for project owners and contractors alike.',
  },
  {
    icon: Cpu,
    title: 'Digital Engineering Tools',
    desc: 'In-house sizing algorithms built specifically for Nigerian solar irradiance and grid dynamics.',
  },
];

export default function TeamPage() {
  return (
    <>
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          style={{
            padding: '5rem 1.5rem 4rem',
            background: 'linear-gradient(180deg, #f6f3eb 0%, #faf8f3 100%)',
            borderBottom: '1px solid rgba(191,202,186,0.3)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
              <Zap size={14} color="#00490e" />
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
                Our Team &amp; Mission
              </span>
            </div>

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
              The People Powering Nigeria’s Solar Transformation
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
              We are a team of electrical engineers, renewable energy operators, software architects, and escrow specialists committed to transparent, reliable clean power across Africa.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/careers"
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
                Join Our Team <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
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
                About Sunlit Energy
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pillars ──────────────────────────────────────────────── */}
        <section style={{ padding: '4rem 1.5rem', background: '#fff', borderBottom: '1px solid rgba(191,202,186,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
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
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', marginBottom: '0.375rem' }}>
                        {p.title}
                      </h3>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#40493d', lineHeight: 1.6 }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Team Functional Areas ─────────────────────────────────── */}
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
                Functional Teams
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
                Multidisciplinary Energy &amp; Engineering Operations
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {LEADERSHIP.map((m) => (
                <div
                  key={m.name}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
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
                        {m.badge}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: '#1a1c1b',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {m.name}
                    </h3>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#707a6c',
                        marginBottom: '1rem',
                      }}
                    >
                      {m.role}
                    </div>

                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9375rem',
                        color: '#40493d',
                        lineHeight: 1.65,
                      }}
                    >
                      {m.bio}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(191,202,186,0.2)' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#707a6c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Department: {m.department}
                    </span>
                  </div>
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
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                marginBottom: '1rem',
              }}
            >
              Want to Join Our Mission?
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
              Explore open opportunities across software, operations, and renewable energy engineering.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/careers"
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
                View Open Positions <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
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
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
