import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Calculator, FileText, Video, ArrowRight, Lightbulb, TrendingUp, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Resources — Guides, Calculator & Knowledge Center | Sunlit Energy',
  description:
    'Learn everything about solar energy in Nigeria. Guides, solar savings calculator, blog articles, video tutorials, and a comprehensive knowledge center for homeowners and businesses.',
  keywords:
    'solar energy guide nigeria, solar calculator nigeria, solar resources, how to go solar nigeria, solar investment guide lagos',
  alternates: { canonical: 'https://sunlit.energy/resources' },
  openGraph: {
    title: 'Solar Resources — Sunlit Energy Nigeria',
    description: 'Guides, calculators, and knowledge for your solar journey in Nigeria.',
    url: 'https://sunlit.energy/resources',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const RESOURCE_HUBS = [
  {
    icon: Calculator,
    title: 'Solar System Sizing Calculator',
    tagline: 'Engineering Tool',
    desc: 'Estimate your monthly electricity cost savings, solar array capacity, and battery autonomy in Nigeria. Enter your current load and location.',
    cta: 'Launch Calculator',
    href: '/tools/solar-system-sizing',
    badge: 'FREE TOOL',
    color: '#00490e',
  },
  {
    icon: BookOpen,
    title: 'Solar Buying Guide',
    tagline: 'Complete Guide',
    desc: 'The definitive guide to buying solar in Nigeria — what to look for, how to avoid scams, and the 12 questions to ask certified installers.',
    cta: 'Read Guide',
    href: '/blog/how-to-choose-the-right-solar-installer-in-lagos',
    badge: 'GUIDE',
    color: '#0f631b',
  },
  {
    icon: Shield,
    title: 'Escrow Protection Center',
    tagline: 'Trust & Governance',
    desc: 'Understand exactly how Sunlit\'s audited milestone escrow framework protects your project capital from day one to final commissioning.',
    cta: 'Explore Trust Center',
    href: '/trust',
    badge: 'SECURITY',
    color: '#1d6d24',
  },
  {
    icon: TrendingUp,
    title: 'Commercial Solar ROI Analysis',
    tagline: 'Investment Modeling',
    desc: 'Deep-dive into the financial case for solar in Nigeria — payback periods, IRR, diesel displacement modeling, and energy independence.',
    cta: 'Read Analysis',
    href: '/blog/solar-roi-in-nigeria-real-numbers-for-2026',
    badge: 'FINANCE',
    color: '#00490e',
  },
  {
    icon: FileText,
    title: 'Blog & Market Insights',
    tagline: 'Stay Informed',
    desc: 'Solar news, market trends, policy updates, installer spotlights, and project case studies from across Nigeria.',
    cta: 'Read Blog',
    href: '/blog',
    badge: 'BLOG',
    color: '#0f631b',
  },
  {
    icon: Lightbulb,
    title: 'Engineering Tools Suite',
    tagline: 'Technical Calculation',
    desc: 'Access our complete suite of solar engineering calculators: load estimation, battery capacity sizing, cable loss, and inverter matching.',
    cta: 'Explore Tools Suite',
    href: '/tools',
    badge: 'TOOLS',
    color: '#1d6d24',
  },
];

const LEARNING_TOPICS = [
  { title: 'Why 2026 Is Nigeria\'s Most Important Year for Solar', time: '8 min read', category: 'Basics', href: '/blog/why-2026-is-nigerias-most-important-year' },
  { title: 'Grid-Tied vs Off-Grid vs Hybrid Solar Architectures', time: '8 min read', category: 'Basics', href: '/blog/grid-tied-vs-off-grid-vs-hybrid-solar' },
  { title: 'How to Choose the Right Solar Installer in Lagos', time: '7 min read', category: 'Buying', href: '/blog/how-to-choose-the-right-solar-installer-in-lagos' },
  { title: 'LiFePO4 vs Lead-Acid Batteries: Technical Breakdown', time: '9 min read', category: 'Technology', href: '/blog/lifepo4-vs-lead-acid-batteries-nigeria' },
  { title: 'Commercial & Industrial Solar ROI Modeling in Lagos', time: '10 min read', category: 'Business', href: '/blog/solar-roi-in-nigeria-real-numbers-for-2026' },
  { title: 'How Milestone Escrow Protects Solar Buyers & Installers', time: '5 min read', category: 'Platform', href: '/trust' },
  { title: 'Solar System Sizing & Load Analysis Calculator', time: '3 min tool', category: 'Technology', href: '/tools/solar-system-sizing' },
  { title: 'Preventive Solar Maintenance & Remote Telemetry', time: '5 min read', category: 'Maintenance', href: '/services#maintenance' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Basics: 'rgba(0,73,14,0.08)',
  Buying: 'rgba(15,99,27,0.08)',
  Technology: 'rgba(29,109,36,0.08)',
  Business: 'rgba(0,73,14,0.06)',
  Platform: 'rgba(15,99,27,0.06)',
  Maintenance: 'rgba(29,109,36,0.06)',
};

export default function ResourcesPage() {
  return (
    <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: 0 }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        aria-label="Resources hero"
        style={{
          padding: '6rem 1.5rem 4rem',
          background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)',
          textAlign: 'center',
          borderBottom: '1px solid rgba(191, 202, 186, 0.2)',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,73,14,0.08)', borderRadius: '9999px',
            padding: '0.375rem 1rem', marginBottom: '1.5rem',
          }}>
            <BookOpen size={14} color="#00490e" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Resource Center
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b',
            letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.25rem',
          }}>
            Everything You Need to Go Solar in Nigeria
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem',
            color: '#40493d', lineHeight: 1.7,
          }}>
            Guides, tools, and knowledge to help homeowners, businesses, and investors make confident solar decisions.
          </p>
        </div>
      </section>

      {/* ── Resource Hubs ─────────────────────────────────────────── */}
      <section aria-label="Resource hubs" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
              Solar Learning Hub
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d', marginTop: '1rem', maxWidth: '560px', margin: '1rem auto 0' }}>
              Curated resources built specifically for the Nigerian solar market.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {RESOURCE_HUBS.map((hub) => (
              <div
                key={hub.title}
                style={{
                  background: '#fff', borderRadius: '18px', padding: '2rem',
                  border: '1px solid rgba(191, 202, 186, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <hub.icon size={24} color={hub.color} />
                  </div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.6875rem', fontWeight: 700,
                    color: hub.color, background: `rgba(0,73,14,0.08)`,
                    borderRadius: '9999px', padding: '0.25rem 0.625rem',
                    letterSpacing: '0.06em',
                  }}>
                    {hub.badge}
                  </span>
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#40493d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  {hub.tagline}
                </div>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1875rem', color: '#1a1c1b', lineHeight: 1.3, marginBottom: '0.875rem' }}>
                  {hub.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65, flexGrow: 1, marginBottom: '1.5rem' }}>
                  {hub.desc}
                </p>
                <Link
                  href={hub.href}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                    color: '#00490e', textDecoration: 'none',
                  }}
                >
                  {hub.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning Center Articles ──────────────────────────────── */}
      <section aria-label="Learning center" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', color: '#1a1c1b', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Solar Knowledge Center
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#40493d' }}>
              Essential reads for anyone considering solar in Nigeria.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {LEARNING_TOPICS.map((topic) => (
              <Link
                key={topic.title}
                href={topic.href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem', background: '#f9f9f6', borderRadius: '12px',
                  border: '1px solid rgba(191, 202, 186, 0.2)',
                  textDecoration: 'none', transition: 'all 200ms ease',
                  gap: '1rem',
                }}
              >
                <div>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.6875rem', fontWeight: 600,
                    color: '#00490e', background: CATEGORY_COLORS[topic.category] || 'rgba(0,73,14,0.06)',
                    borderRadius: '9999px', padding: '0.2rem 0.625rem', marginRight: '0.625rem',
                  }}>
                    {topic.category}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 500, color: '#1a1c1b' }}>
                    {topic.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                    {topic.time}
                  </span>
                  <ArrowRight size={16} color="#00490e" />
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem', borderRadius: '9999px',
                border: '1.5px solid #00490e', color: '#00490e',
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: '0.9375rem', textDecoration: 'none',
              }}
            >
              View All Articles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section aria-label="Get started" style={{
        padding: '5rem 1.5rem',
        background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Ready to Make the Switch?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            Join thousands of Nigerians on the waitlist for Nigeria&apos;s most trusted solar marketplace.
          </p>
          <Link
            href="/waitlist"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '1rem 2.25rem', borderRadius: '9999px',
              background: '#fff', color: '#00490e',
              fontFamily: 'Inter, sans-serif', fontWeight: 700,
              fontSize: '1rem', textDecoration: 'none',
            }}
          >
            Join the Waitlist <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}
