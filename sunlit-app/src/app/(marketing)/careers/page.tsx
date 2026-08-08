import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Users, Zap, Globe, Code, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers at Sunlit Energy — Join Nigeria\'s Solar Revolution',
  description:
    'Join the team building Nigeria\'s most trusted solar energy marketplace. Roles in engineering, product, operations, and business development. Remote-first with Lagos hub.',
  keywords:
    'sunlit energy careers, solar energy jobs nigeria, solar tech jobs lagos, renewable energy careers, clean energy startup jobs nigeria',
  alternates: { canonical: 'https://sunlitenergy.com/careers' },
  openGraph: {
    title: 'Careers — Sunlit Energy Nigeria',
    description: 'Help build Nigeria\'s solar energy future. View open roles.',
    url: 'https://sunlitenergy.com/careers',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const VALUES = [
  { icon: Zap, title: 'Move Fast', desc: 'We execute quickly and learn from results. Bureaucracy is the enemy of impact.' },
  { icon: Globe, title: 'Think Big', desc: 'We\'re building infrastructure for all of Nigeria — then beyond. Small thinking has no place here.' },
  { icon: Users, title: 'Team First', desc: 'We win together and own our mistakes together. No individual star culture.' },
  { icon: TrendingUp, title: 'Data Driven', desc: 'Opinions are inputs. Data is the decision-maker. We build measurement into everything.' },
];

const OPEN_ROLES = [
  { title: 'Senior Backend Engineer (Node.js + Supabase)', dept: 'Engineering', location: 'Lagos / Remote', type: 'Full-time' },
  { title: 'Frontend Engineer (Next.js + React)', dept: 'Engineering', location: 'Lagos / Remote', type: 'Full-time' },
  { title: 'Mobile Engineer (React Native)', dept: 'Engineering', location: 'Lagos / Remote', type: 'Full-time' },
  { title: 'Product Designer (UI/UX)', dept: 'Product', location: 'Lagos / Remote', type: 'Full-time' },
  { title: 'Solar Operations Manager', dept: 'Operations', location: 'Lagos, Nigeria', type: 'Full-time' },
  { title: 'Installer Relations Lead', dept: 'Partnerships', location: 'Lagos, Nigeria', type: 'Full-time' },
  { title: 'Business Development Manager', dept: 'Growth', location: 'Lagos, Nigeria', type: 'Full-time' },
  { title: 'Marketing & Content Lead', dept: 'Marketing', location: 'Lagos / Remote', type: 'Full-time' },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: 'rgba(0,73,14,0.08)',
  Product: 'rgba(15,99,27,0.08)',
  Operations: 'rgba(29,109,36,0.08)',
  Partnerships: 'rgba(0,73,14,0.06)',
  Growth: 'rgba(15,99,27,0.06)',
  Marketing: 'rgba(29,109,36,0.06)',
};

export default function CareersPage() {
  return (
    <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: 0 }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        aria-label="Careers hero"
        style={{
          padding: '6rem 1.5rem 5rem',
          background: 'linear-gradient(135deg, #00490e 0%, #0f631b 50%, #1d6d24 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(136,217,130,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.15)', borderRadius: '9999px',
            padding: '0.375rem 1rem', marginBottom: '1.5rem',
          }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              We&apos;re Hiring
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.5rem',
          }}>
            Build the Future of Energy in Nigeria
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
            color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '600px',
            margin: '0 auto 2.5rem',
          }}>
            Join a mission-driven team transforming how Nigeria buys, finances, and manages solar energy. Every role has direct impact at scale.
          </p>
          <Link
            href="#open-roles"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2.25rem', borderRadius: '9999px',
              background: '#fff', color: '#00490e',
              fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '1rem', textDecoration: 'none',
            }}
          >
            View Open Roles <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────────────── */}
      <section aria-label="Company values" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
              How We Work
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {VALUES.map((val) => (
              <div
                key={val.title}
                style={{
                  background: '#f9f9f6', borderRadius: '16px', padding: '2rem',
                  border: '1px solid rgba(191, 202, 186, 0.2)',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <val.icon size={24} color="#00490e" />
                </div>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', marginBottom: '0.625rem' }}>
                  {val.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ─────────────────────────────────────────────── */}
      <section id="open-roles" aria-label="Open positions" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: '#1a1c1b', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Open Positions
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d' }}>
              We&apos;re growing quickly and always looking for exceptional people. Don&apos;t see your role? Send us your CV anyway.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {OPEN_ROLES.map((role) => (
              <Link
                key={role.title}
                href="/contact"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff', borderRadius: '14px', padding: '1.5rem 2rem',
                  border: '1px solid rgba(191, 202, 186, 0.2)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 200ms ease', gap: '1.5rem',
                }}>
                  <div>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1a1c1b', marginBottom: '0.5rem' }}>
                      {role.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                        color: '#00490e', background: DEPT_COLORS[role.dept] || 'rgba(0,73,14,0.06)',
                        borderRadius: '9999px', padding: '0.2rem 0.625rem',
                      }}>
                        {role.dept}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <MapPin size={13} color="#707a6c" />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>{role.location}</span>
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>{role.type}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} color="#00490e" style={{ flexShrink: 0 }} />
                </div>
              </Link>
            ))}
          </div>

          <div style={{
            marginTop: '2.5rem', padding: '2rem',
            background: 'rgba(0,73,14,0.06)', borderRadius: '16px',
            border: '1px solid rgba(0,73,14,0.12)',
            textAlign: 'center',
          }}>
            <Code size={28} color="#00490e" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', marginBottom: '0.5rem' }}>
              Don&apos;t See Your Role?
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', marginBottom: '1.25rem' }}>
              We&apos;re always open to exceptional talent. Send your CV and a note about what you&apos;d build.
            </p>
            <Link
              href="mailto:careers@sunlitenergy.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: '9999px',
                background: 'linear-gradient(135deg, #00490e, #0f631b)',
                color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: '0.9375rem', textDecoration: 'none',
              }}
            >
              careers@sunlitenergy.com <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
