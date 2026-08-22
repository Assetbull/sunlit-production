import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Zap, Globe, Users, TrendingUp, Code } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers at Sunlit Energy — Join Nigeria\'s Solar Revolution',
  description:
    'Join the team building Nigeria\'s most trusted solar energy marketplace. Roles in engineering, product, operations, and business development. Remote-first with Lagos hub.',
  keywords:
    'sunlit energy careers, solar energy jobs nigeria, solar tech jobs lagos, renewable energy careers, clean energy startup jobs nigeria',
  alternates: { canonical: 'https://sunlit.energy/careers' },
  openGraph: {
    title: 'Careers — Sunlit Energy Nigeria',
    description: 'Help build Nigeria\'s solar energy future. View open roles.',
    url: 'https://sunlit.energy/careers',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const VALUES = [
  { icon: Zap, title: 'Move Fast', desc: 'We execute quickly and learn from results. Bureaucracy is the enemy of impact.' },
  { icon: Globe, title: 'Think Big', desc: "We're building infrastructure for all of Nigeria — then beyond. Small thinking has no place here." },
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

const DEPT_COLORS: Record<string, { bg: string; color: string }> = {
  Engineering: { bg: 'rgba(0,73,14,0.08)', color: '#00490e' },
  Product: { bg: 'rgba(15,99,27,0.08)', color: '#0f631b' },
  Operations: { bg: 'rgba(29,109,36,0.08)', color: '#1d6d24' },
  Partnerships: { bg: 'rgba(77,102,28,0.08)', color: '#4d661c' },
  Growth: { bg: 'rgba(15,99,27,0.08)', color: '#0f631b' },
  Marketing: { bg: 'rgba(29,109,36,0.08)', color: '#1d6d24' },
};

export default function CareersPage() {
  return (
    <>
      <main style={{ background: '#f9f9f6', minHeight: '100vh' }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          aria-label="Careers hero"
          style={{ padding: '6rem 1.5rem 5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', position: 'relative', overflow: 'hidden' }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem' }}>
              <Code size={14} color="rgba(255,255,255,0.9)" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>We&apos;re Hiring</span>
            </div>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1.25rem', maxWidth: '700px' }}>
              Build the Energy Infrastructure Nigeria Deserves
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.1875rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: '580px', marginBottom: '2.5rem' }}>
              We&apos;re building Nigeria&apos;s most trusted solar marketplace from the ground up. Every role here has a direct impact on how millions of Nigerians access clean, reliable energy.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#open-roles" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none' }}>
                View Open Roles <ArrowRight size={16} />
              </a>
              <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent' }}>
                About Us
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              {[{ v: '8', l: 'Open Roles' }, { v: 'Remote', l: 'Work Policy' }, { v: 'Lagos', l: 'HQ Hub' }, { v: '2026', l: 'Founding Year' }].map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em' }}>{s.v}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values / Culture ──────────────────────────────────────── */}
        <section aria-label="Culture and values" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>How We Work</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                Our Operating Principles
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {VALUES.map((val) => (
                <div key={val.title} style={{ background: '#fff8f5', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(191,202,186,0.4)', transition: 'all 150ms cubic-bezier(0.2,0,0,1)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <val.icon size={24} color="#00490e" />
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', marginBottom: '0.625rem' }}>{val.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65 }}>{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ─────────────────────────────────────────────── */}
        <section aria-label="Benefits and perks" style={{ padding: '5rem 1.5rem', background: '#f7fbf1' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>Why Join</span>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                  Work That Matters. A Team That Delivers.
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.7 }}>
                  This isn&apos;t a legacy company. We move fast, build for real users, and hold each other accountable. Every engineer, designer, and operator directly shapes how Nigeria accesses clean energy.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { title: 'Remote-First', desc: 'Work from anywhere, meet in Lagos' },
                  { title: 'Competitive Pay', desc: 'Market-rate + equity for early hires' },
                  { title: 'Mission-Driven', desc: 'Direct impact on Nigeria\'s energy future' },
                  { title: 'Fast Growth', desc: 'Build your career as we scale' },
                  { title: 'Health Cover', desc: 'HMO for you and family' },
                  { title: 'Annual Leave', desc: '21 days + public holidays' },
                ].map((b) => (
                  <div key={b.title} style={{ background: '#fff8f5', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(191,202,186,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 150ms cubic-bezier(0.2,0,0,1)' }}>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1a1c1b', marginBottom: '0.25rem' }}>{b.title}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#40493d' }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Open Roles ────────────────────────────────────────────── */}
        <section id="open-roles" aria-label="Open roles" style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                Open Roles
              </h2>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#00490e', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.25rem 0.875rem' }}>
                {OPEN_ROLES.length} positions
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {OPEN_ROLES.map((role) => {
                const deptStyle = DEPT_COLORS[role.dept] || { bg: 'rgba(64,73,61,0.08)', color: '#40493d' };
                return (
                  <div
                    key={role.title}
                    style={{
                      background: '#fff8f5', borderRadius: '14px', padding: '1.5rem 2rem',
                      border: '1px solid rgba(191,202,186,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      flexWrap: 'wrap', gap: '1rem',
                      transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', marginBottom: '0.5rem' }}>{role.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: deptStyle.color, background: deptStyle.bg, borderRadius: '9999px', padding: '0.2rem 0.75rem' }}>{role.dept}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#40493d' }}>
                          <MapPin size={12} /> {role.location}
                        </span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#40493d' }}>{role.type}</span>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', flexShrink: 0 }}
                    >
                      Apply <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section aria-label="Careers CTA" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Don&apos;t See Your Role?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              We&apos;re always interested in exceptional talent. Send us your CV and tell us how you can help build Nigeria&apos;s energy future.
            </p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
              Send Us Your CV <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
