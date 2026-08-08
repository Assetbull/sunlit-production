import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Users, Target, Globe, ShieldCheck, Zap, Award, Building2, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Sunlit Energy — Nigeria\'s Premier Solar Marketplace',
  description:
    'Sunlit Energy is building Nigeria\'s most trusted solar energy marketplace — connecting homeowners, businesses, and installers through a secure, transparent, and technology-driven platform.',
  keywords:
    'about sunlit energy, solar marketplace nigeria, renewable energy company lagos, trusted solar installers, solar energy platform',
  alternates: { canonical: 'https://sunlitenergy.com/about' },
  openGraph: {
    title: 'About Sunlit Energy',
    description: 'Nigeria\'s premier solar energy marketplace — building trust through technology.',
    url: 'https://sunlitenergy.com/about',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const STATS = [
  { value: '500+', label: 'Vetted Installers', desc: 'Verified professionals across Nigeria' },
  { value: '3', label: 'Launch Cities', desc: 'Lagos, Abuja, and Ogun State' },
  { value: '₦0', label: 'Upfront Risk', desc: 'Escrow-protected payment system' },
  { value: '2026', label: 'Launch Year', desc: 'Early access opening soon' },
];

const TEAM_VALUES = [
  {
    icon: ShieldCheck,
    title: 'Trust First',
    desc: 'Every installer is multi-stage vetted. Every payment is escrow-protected. Trust is our product.',
  },
  {
    icon: Zap,
    title: 'Radical Transparency',
    desc: 'Milestone-based payments mean you see every stage before releasing any funds.',
  },
  {
    icon: Globe,
    title: 'Built for Nigeria',
    desc: 'Designed from the ground up for the Nigerian market — local knowledge, global standards.',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    desc: 'Every installer, supplier, and professional on our platform helps power Nigeria\'s future.',
  },
  {
    icon: Target,
    title: 'Mission-Aligned',
    desc: 'We exist to accelerate Nigeria\'s transition to reliable, clean, affordable energy.',
  },
  {
    icon: Heart,
    title: 'Long-Term Thinking',
    desc: 'We\'re building infrastructure, not just a startup. Every decision is made for the long run.',
  },
];

const LEADERSHIP = [
  { name: 'Founder & CEO', role: 'Solar infrastructure and marketplace design' },
  { name: 'Head of Operations', role: 'Installation network and logistics' },
  { name: 'Head of Engineering', role: 'Platform architecture and AI systems' },
  { name: 'Head of Partnerships', role: 'Installer and supplier relationships' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Sunlit Energy',
  url: 'https://sunlitenergy.com/about',
  description: 'Sunlit Energy is Nigeria\'s premier solar energy marketplace.',
  publisher: {
    '@type': 'Organization',
    name: 'Sunlit Energy',
    url: 'https://sunlitenergy.com',
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: 0 }}>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section
          aria-label="About hero"
          style={{
            padding: '6rem 1.5rem 5rem',
            background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)',
            borderBottom: '1px solid rgba(191, 202, 186, 0.2)',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(0,73,14,0.08)', borderRadius: '9999px',
              padding: '0.375rem 1rem', marginBottom: '1.5rem',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00490e', display: 'inline-block' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Our Story
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b',
              letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.5rem',
            }}>
              Building Nigeria&apos;s Most Trusted Solar Ecosystem
            </h1>

            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
              color: '#40493d', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 2.5rem',
            }}>
              We recognized a broken system — unverified installers, no price transparency, no payment protection. Sunlit Energy was built to fix every part of it.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem', borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: '0.9375rem', textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,73,14,0.2)',
                  transition: 'all 200ms ease',
                }}
              >
                Get in Touch <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem', borderRadius: '9999px',
                  border: '1.5px solid rgba(191, 202, 186, 0.5)',
                  color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent',
                }}
              >
                Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <section aria-label="Key metrics" style={{ padding: '4rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {STATS.map((stat) => (
              <div key={stat.value} style={{
                textAlign: 'center', padding: '2rem 1.5rem',
                background: '#f9f9f6', borderRadius: '16px',
                border: '1px solid rgba(191, 202, 186, 0.2)',
              }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#00490e', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1a1c1b', marginBottom: '0.375rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ─────────────────────────────────────────────── */}
        <section aria-label="Our mission" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              {/* Left */}
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>
                  Our Mission
                </span>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                  Making Solar Simple, Safe, and Accessible to Every Nigerian
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  Nigeria has some of the highest solar potential in the world — yet millions of homes and businesses remain dependent on expensive, unreliable diesel generators.
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.7 }}>
                  Sunlit Energy is the infrastructure layer that changes this. We connect project owners with vetted installers, protect every payment through escrow, and provide a single platform to manage the entire energy journey.
                </p>
              </div>

              {/* Right — The Problem & Solution */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { problem: 'Unverified installers', solution: 'Multi-stage vetting process', icon: ShieldCheck },
                  { problem: 'No payment protection', solution: 'Escrow-secured milestone payments', icon: Award },
                  { problem: 'No pricing transparency', solution: 'Competitive bid marketplace', icon: Target },
                  { problem: 'No project oversight', solution: 'Real-time tracking dashboard', icon: Building2 },
                ].map((item) => (
                  <div
                    key={item.problem}
                    style={{
                      background: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem',
                      border: '1px solid rgba(191, 202, 186, 0.2)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={20} color="#00490e" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c', marginBottom: '0.25rem', textDecoration: 'line-through' }}>
                        {item.problem}
                      </div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 600, color: '#1a1c1b' }}>
                        {item.solution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ──────────────────────────────────────────────── */}
        <section aria-label="Our values" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>
                What We Stand For
              </span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Our Core Values
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {TEAM_VALUES.map((val) => (
                <div
                  key={val.title}
                  style={{
                    background: '#f9f9f6', borderRadius: '16px', padding: '2rem',
                    border: '1px solid rgba(191, 202, 186, 0.2)',
                    transition: 'all 250ms ease',
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

        {/* ── Leadership ──────────────────────────────────────────── */}
        <section aria-label="Leadership team" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>
                The Team
              </span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                Built by Energy & Technology Experts
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {LEADERSHIP.map((member) => (
                <div
                  key={member.name}
                  style={{
                    background: '#fff', borderRadius: '16px', padding: '2rem',
                    border: '1px solid rgba(191, 202, 186, 0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem',
                    background: 'linear-gradient(135deg, rgba(0,73,14,0.1) 0%, rgba(15,99,27,0.2) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Users size={28} color="#00490e" />
                  </div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1a1c1b', marginBottom: '0.375rem' }}>
                    {member.name}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section aria-label="Join Sunlit" style={{
          padding: '5rem 1.5rem',
          background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Join the Solar Revolution
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Whether you&apos;re a homeowner, business, installer, or investor — there&apos;s a place for you in the Sunlit ecosystem.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/waitlist"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem 2rem', borderRadius: '9999px',
                  background: '#fff', color: '#00490e',
                  fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: '1rem', textDecoration: 'none',
                }}
              >
                Join Waitlist <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '1rem 2rem', borderRadius: '9999px',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: '1rem', textDecoration: 'none', background: 'transparent',
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
