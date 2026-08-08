import { Metadata } from 'next';
import Link from 'next/link';
import {
  Home, Building2, Factory, Wrench, Battery, Sun,
  Zap, Search, ArrowRight, DollarSign, Settings2, ShieldCheck
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
    title: 'Residential Solar',
    tagline: 'Power your home',
    description: 'Complete end-to-end solar installations designed for Nigerian homes. From initial consultation to commissioning, fully escrow-protected.',
    benefits: ['Rooftop panel installation', 'Inverter & battery systems', 'Grid-tied and off-grid options', 'Milestone-based payment'],
    href: '/services/residential-solar',
  },
  {
    id: 'commercial-solar',
    icon: Building2,
    title: 'Commercial Solar',
    tagline: 'Reduce operating costs',
    description: 'Scalable energy solutions for retail, office spaces, hotels, schools, and multi-tenant facilities. Cut electricity costs by 60–80%.',
    benefits: ['Commercial-grade systems', 'Multi-location management', 'ROI-focused design', 'Dedicated project manager'],
    href: '/services/commercial-solar',
  },
  {
    id: 'industrial-solar',
    icon: Factory,
    title: 'Industrial Solar',
    tagline: 'Power at scale',
    description: 'Megawatt-scale solar deployments tailored for manufacturing plants, logistics hubs, and large industrial facilities.',
    benefits: ['500kW to 10MW systems', 'Structural engineering support', 'Regulatory compliance', 'Performance monitoring'],
    href: '/services/industrial-solar',
  },
  {
    id: 'battery-storage',
    icon: Battery,
    title: 'Battery Storage',
    tagline: 'Energy independence',
    description: 'Enterprise-grade localized energy storage to buffer grid volatility and maximize your solar investment across all hours.',
    benefits: ['LiFePO4 lithium systems', 'Tubular battery solutions', 'Battery management systems', 'Monitoring integration'],
    href: '/services/battery-storage',
  },
  {
    id: 'solar-maintenance',
    icon: Wrench,
    title: 'Solar Maintenance',
    tagline: 'Protect your asset',
    description: 'Proactive health monitoring and professional dispatch services to ensure peak hardware performance throughout the system lifecycle.',
    benefits: ['Panel cleaning & inspection', 'Inverter servicing', 'Performance analytics', 'Emergency repair dispatch'],
    href: '/services/maintenance',
  },
  {
    id: 'energy-audit',
    icon: Search,
    title: 'Energy Audit',
    tagline: 'Know your baseline',
    description: 'Deep-dive analytics to identify energy inefficiencies and structure a clear path to solar adoption with measurable ROI.',
    benefits: ['Load analysis report', 'Solar feasibility study', 'System sizing recommendations', 'Financial projections'],
    href: '/services/energy-audit',
  },
  {
    id: 'ev-charging',
    icon: Zap,
    title: 'EV Charging',
    tagline: 'Power your fleet',
    description: 'Scalable Level 2 and DC Fast Charging networks for commercial parking lots, corporate campuses, and electric vehicle fleets.',
    benefits: ['Level 2 AC charging', 'DC fast charging', 'Fleet management integration', 'Solar-powered stations'],
    href: '/services/ev-charging',
  },
  {
    id: 'solar-financing',
    icon: DollarSign,
    title: 'Solar Financing',
    tagline: 'No upfront barrier',
    description: 'Structured capital solutions including PPAs, solar loans, and PAYG options to make solar accessible regardless of budget.',
    benefits: ['Zero-deposit options', 'Flexible repayment plans', 'PPA agreements', 'Financing partner network'],
    href: '/services/financing',
  },
  {
    id: 'solar-marketplace',
    icon: Settings2,
    title: 'Solar Marketplace',
    tagline: 'Source hardware & experts',
    description: 'AI-curated exchange to source premium solar hardware — panels, inverters, batteries — and certified local installers.',
    benefits: ['Verified equipment catalog', 'Certified installer bids', 'Price comparison', 'Escrow-secured orders'],
    href: '/services/marketplace',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Consultation', desc: 'Submit your project details. Our platform analyzes your energy needs and location.' },
  { step: '02', title: 'AI Matching', desc: 'Receive competitive bids from our network of vetted, certified installers.' },
  { step: '03', title: 'Contract & Escrow', desc: 'Sign a transparent contract. Your funds are held securely in escrow — not paid upfront.' },
  { step: '04', title: 'Installation', desc: 'Certified professionals deploy your system. Track every milestone in real time.' },
  { step: '05', title: 'Milestone Payments', desc: 'Review completed work, approve milestones, then release payment. You\'re always in control.' },
  { step: '06', title: 'Monitor & Manage', desc: 'Access your dashboard for performance data, maintenance scheduling, and support.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Solar Energy Installation',
  provider: { '@type': 'Organization', name: 'Sunlit Energy', url: 'https://sunlitenergy.com' },
  areaServed: { '@type': 'Country', name: 'Nigeria' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Solar Energy Services',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.description },
    })),
  },
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ background: '#f9f9f6', minHeight: '100vh', paddingTop: 0 }}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          aria-label="Services hero"
          style={{
            padding: '6rem 1.5rem 5rem',
            background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)',
            textAlign: 'center',
            borderBottom: '1px solid rgba(191, 202, 186, 0.2)',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(0,73,14,0.08)', borderRadius: '9999px',
              padding: '0.375rem 1rem', marginBottom: '1.5rem',
            }}>
              <Sun size={14} color="#00490e" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                All Solar Services
              </span>
            </div>
            <h1 style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b',
              letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.5rem',
            }}>
              From Rooftop to Industrial Scale, All on One Platform
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#40493d', lineHeight: 1.7, marginBottom: '2.5rem',
            }}>
              Sunlit Energy connects you with Nigeria&apos;s best solar professionals for every service type — protected by escrow, tracked in real time.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/waitlist"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem', borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
                  fontSize: '0.9375rem', textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,73,14,0.2)',
                }}
              >
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem', borderRadius: '9999px',
                  border: '1.5px solid rgba(191, 202, 186, 0.5)',
                  color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent',
                }}
              >
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </section>

        {/* ── Service Cards Grid ────────────────────────────────────── */}
        <section aria-label="All services" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                Our Complete Service Portfolio
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                Every service is backed by our vetted professional network, escrow payment protection, and real-time tracking.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  style={{
                    background: '#fff', borderRadius: '18px', padding: '2rem',
                    border: '1px solid rgba(191, 202, 186, 0.2)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column',
                    transition: 'all 250ms cubic-bezier(0.22,0.61,0.36,1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <service.icon size={24} color="#00490e" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                        {service.tagline}
                      </div>
                      <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1875rem', color: '#1a1c1b', lineHeight: 1.3 }}>
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65, marginBottom: '1.25rem', flexGrow: 1 }}>
                    {service.description}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {service.benefits.map((b) => (
                      <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(0,73,14,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ShieldCheck size={10} color="#00490e" />
                        </span>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem 1.25rem', borderRadius: '9999px',
                      border: '1.5px solid #00490e', color: '#00490e',
                      fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                      textDecoration: 'none', transition: 'all 200ms ease',
                      background: 'transparent',
                    }}
                  >
                    Explore {service.title} <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────── */}
        <section aria-label="How it works" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>
                The Process
              </span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                A Streamlined 6-Step Process
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.step}
                  style={{
                    background: '#f9f9f6', borderRadius: '16px', padding: '1.75rem',
                    border: '1px solid rgba(191, 202, 186, 0.2)',
                  }}
                >
                  <div style={{
                    fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '2rem',
                    color: 'rgba(0,73,14,0.15)', letterSpacing: '-0.02em', marginBottom: '0.75rem',
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', marginBottom: '0.625rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
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
              Ready to Start Your Solar Project?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Join our early access waitlist and get matched with Nigeria&apos;s best solar professionals.
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
              Join Waitlist <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
