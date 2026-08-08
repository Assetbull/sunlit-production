import { Metadata } from 'next';
import Link from 'next/link';
import {
  Home, Building2, Factory, Wrench, Battery, Sun,
  Zap, Search, ArrowRight, DollarSign, ShieldCheck, EvCharger
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Services Nigeria — Residential, Commercial & Industrial | Sunlit Energy',
  description:
    'End-to-end solar installation services across Nigeria. Residential solar, commercial solar, industrial solar, battery storage, EV charging, energy audits, and solar financing through Nigeria\'s leading marketplace.',
  keywords:
    'solar services nigeria, residential solar lagos, commercial solar nigeria, industrial solar, battery storage nigeria, solar installation, solar financing',
  alternates: { canonical: 'https://sunlitenergy.com/services' },
  openGraph: {
    title: 'Solar Services — Sunlit Energy Nigeria',
    description: 'From rooftop residential solar to megawatt industrial infrastructure. All on one platform.',
    url: 'https://sunlitenergy.com/services',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const SERVICES = [
  {
    id: 'residential-solar',
    icon: Home,
    tag: 'Best For: Homeowners',
    title: 'Residential Solar',
    description: 'Complete end-to-end solar installations designed to integrate with your home\'s architecture while maximising energy offset. Escrow-protected payments, milestone-based delivery.',
    featured: true,
  },
  {
    id: 'commercial-solar',
    icon: Building2,
    tag: 'Best For: Businesses',
    title: 'Commercial Solar',
    description: 'Scalable energy solutions for retail, offices, hotels, schools, and multi-tenant facilities — engineered to reduce operating overhead by 60–80%.',
    featured: false,
  },
  {
    id: 'industrial-solar',
    icon: Factory,
    tag: 'Best For: Heavy Duty',
    title: 'Industrial Solar',
    description: 'Megawatt-scale deployments for manufacturing plants and logistics hubs. Full structural engineering, regulatory compliance, and performance monitoring.',
    featured: false,
  },
  {
    id: 'marketplace',
    icon: Search,
    tag: 'Best For: Procurement',
    title: 'Solar Marketplace',
    description: 'A curated exchange to source premium solar hardware and certified installers. Competitive bids, vetted suppliers, transparent pricing.',
    featured: false,
  },
  {
    id: 'energy-audits',
    icon: Wrench,
    tag: 'Best For: Optimisation',
    title: 'Energy Audits',
    description: 'Deep-dive analytics to identify inefficiencies and structure a path to net-zero operations. Site surveys, load analysis, ROI modelling.',
    featured: false,
  },
  {
    id: 'maintenance',
    icon: ShieldCheck,
    tag: 'Best For: Existing Systems',
    title: 'Maintenance',
    description: 'Proactive health monitoring and dispatch services to ensure peak hardware performance across your installed solar infrastructure.',
    featured: false,
  },
  {
    id: 'battery-storage',
    icon: Battery,
    tag: 'Best For: Resilience',
    title: 'Battery Storage',
    description: 'Enterprise-grade localized energy storage solutions to buffer grid volatility. LiFePO4 lithium systems with integrated BMS.',
    featured: false,
    highlight: true,
  },
  {
    id: 'ev-charging',
    icon: EvCharger,
    tag: 'Best For: Infrastructure',
    title: 'EV Charging',
    description: 'Scalable Level 2 and DC Fast Charging networks for commercial lots, residential estates, and fleet operators.',
    featured: false,
  },
  {
    id: 'solar-financing',
    icon: DollarSign,
    tag: 'Best For: Access',
    title: 'Solar Financing',
    description: 'Flexible financing pathways including lease-to-own, BNPL, and institutional debt instruments to remove upfront cost barriers.',
    featured: false,
  },
  {
    id: 'monitoring',
    icon: Zap,
    tag: 'Best For: Visibility',
    title: 'Live Monitoring',
    description: 'Real-time performance dashboards for all solar assets. AI-driven anomaly detection and predictive maintenance alerts.',
    featured: false,
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sunlit Energy Services',
  url: 'https://sunlitenergy.com/services',
  description: 'End-to-end solar installation and management services across Nigeria.',
};

export default function ServicesPage() {
  const [featured, ...rest] = SERVICES;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          aria-label="Services hero"
          style={{ padding: '6rem 1.5rem 5rem', background: 'linear-gradient(180deg, #f6f3eb 0%, #faf8f3 100%)', borderBottom: '1px solid rgba(191,202,186,0.3)' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem' }}>
                <Sun size={14} color="#00490e" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Our Services</span>
              </div>
              <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                Precision-Engineered Solar for Every Scale
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#40493d', lineHeight: 1.7, marginBottom: '2rem' }}>
                From residential rooftop installations to enterprise-scale grid management — Sunlit delivers sustainable power infrastructure with unmatched payment protection and transparency.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,73,14,0.2)' }}>
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', border: '1.5px solid rgba(191,202,186,0.5)', color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent' }}>
                  Talk to Sales
                </Link>
              </div>
            </div>

            {/* Glass metrics card */}
            <div style={{ background: 'rgba(253,251,247,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(191,202,186,0.3)', boxShadow: '0 8px 24px rgba(0,73,14,0.06)', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {[{ v: '10', l: 'Service Categories' }, { v: '500+', l: 'Vetted Installers' }, { v: '99.9%', l: 'Grid Efficiency' }, { v: '₦0', l: 'Upfront Risk' }].map((m) => (
                <div key={m.l} style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(0,73,14,0.04)', borderRadius: '12px' }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#00490e', letterSpacing: '-0.02em' }}>{m.v}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#40493d', marginTop: '0.25rem' }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Bento Grid ───────────────────────────────────── */}
        <section aria-label="Service catalogue" style={{ padding: '5rem 1.5rem', background: '#faf8f3' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>All Services</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                The Complete Sunlit Service Stack
              </h2>
            </div>

            {/* Featured service — full-width card */}
            <div
              style={{
                background: '#fdfbf7', borderRadius: '20px', border: '1px solid rgba(191,202,186,0.3)',
                boxShadow: '0 8px 24px rgba(0,73,14,0.06)', overflow: 'hidden',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <Home size={64} color="rgba(255,255,255,0.3)" />
              </div>
              <div style={{ padding: '2.5rem' }}>
                <div style={{ display: 'inline-flex', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.25rem 0.875rem', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{featured.tag}</span>
                </div>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#1a1c1b', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>{featured.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.65, marginBottom: '1.5rem' }}>{featured.description}</p>
                <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#00490e', textDecoration: 'none' }}>
                  Explore Solution <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Rest of services grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {rest.map((svc) => (
                <div
                  key={svc.id}
                  style={{
                    background: svc.highlight ? 'linear-gradient(135deg, rgba(0,73,14,0.06) 0%, rgba(15,99,27,0.09) 100%)' : '#fdfbf7',
                    borderRadius: '16px', padding: '1.75rem',
                    border: svc.highlight ? '1.5px solid rgba(0,73,14,0.2)' : '1px solid rgba(191,202,186,0.3)',
                    boxShadow: '0 4px 16px rgba(0,73,14,0.04)',
                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: svc.highlight ? 'rgba(0,73,14,0.12)' : 'rgba(0,73,14,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svc.icon size={22} color="#00490e" />
                    </div>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6875rem', fontWeight: 600, color: '#40493d', background: '#f6f3eb', borderRadius: '9999px', padding: '0.25rem 0.625rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em', border: '1px solid rgba(191,202,186,0.3)' }}>{svc.tag.replace('Best For: ', '')}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: svc.highlight ? '#00490e' : '#1a1c1b' }}>{svc.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#40493d', lineHeight: 1.6, flex: 1 }}>{svc.description}</p>
                  <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#00490e', textDecoration: 'none', marginTop: '0.25rem' }}>
                    Details <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process Section ───────────────────────────────────────── */}
        <section aria-label="How we deliver" style={{ padding: '5rem 1.5rem', background: '#f6f3eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>The Process</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                How Every Sunlit Service Is Delivered
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {[
                { step: '01', title: 'Post Your Project', desc: 'Describe your energy needs. We match you with qualified installers.' },
                { step: '02', title: 'Review Bids', desc: 'Get competitive bids from 3+ vetted installers. Compare prices and profiles.' },
                { step: '03', title: 'Secure Payment', desc: 'Funds go into escrow — only released when you approve each milestone.' },
                { step: '04', title: 'Live Monitoring', desc: 'Track your project in real-time. Full visibility from kick-off to commissioning.' },
              ].map((p) => (
                <div key={p.step} style={{ background: '#fdfbf7', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(191,202,186,0.3)' }}>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'rgba(0,73,14,0.2)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>{p.step}</div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', marginBottom: '0.625rem' }}>{p.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#40493d', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section aria-label="Services CTA" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Ready to Start Your Solar Project?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Join the waitlist or contact our team to discuss your energy needs. We serve Lagos, Abuja, Ogun State, and beyond.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                Join Waitlist <ArrowRight size={18} />
              </Link>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', background: 'transparent' }}>
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
