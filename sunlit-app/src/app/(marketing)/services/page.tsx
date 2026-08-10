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
  alternates: { canonical: 'https://sunlit.energy/services' },
  openGraph: {
    title: 'Solar Services — Sunlit Energy Nigeria',
    description: 'From rooftop residential solar to megawatt industrial infrastructure. All on one platform.',
    url: 'https://sunlit.energy/services',
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
  url: 'https://sunlit.energy/services',
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
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f6f3eb] to-[#faf8f3] border-b border-[#BFCABA]/30"
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00490e]/10 rounded-full px-3.5 py-1 mb-5">
                <Sun size={14} className="text-[#00490e]" />
                <span className="font-sans text-xs font-semibold text-[#00490e] uppercase tracking-wider">Our Services</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#1a1c1b] tracking-tight leading-[1.08] mb-4">
                Precision-Engineered Solar for Every Scale
              </h1>
              <p className="font-sans text-sm sm:text-base lg:text-lg text-[#40493d] leading-relaxed mb-8">
                From residential rooftop installations to enterprise-scale grid management — Sunlit delivers sustainable power infrastructure with unmatched payment protection and transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/waitlist" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#00490e] hover:bg-[#003006] text-white font-sans font-bold text-sm shadow-md transition-all">
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[#BFCABA]/60 hover:bg-[#F0EDE3] text-[#1a1c1b] font-sans font-semibold text-sm transition-all">
                  Talk to Sales
                </Link>
              </div>
            </div>

            {/* Glass metrics card */}
            <div className="bg-[#fdfbf7]/85 backdrop-blur-md border border-[#BFCABA]/30 shadow-sm rounded-[20px] p-6 sm:p-8 grid grid-cols-2 gap-3 sm:gap-4">
              {[{ v: '10', l: 'Service Categories' }, { v: '500+', l: 'Vetted Installers' }, { v: '99.9%', l: 'Grid Efficiency' }, { v: '₦0', l: 'Upfront Risk' }].map((m) => (
                <div key={m.l} className="text-center p-4 bg-[#00490e]/5 rounded-xl">
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#00490e] tracking-tight">{m.v}</div>
                  <div className="font-sans text-xs text-[#40493d] mt-1">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services Bento Grid ───────────────────────────────────── */}
        <section aria-label="Service catalogue" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f3]">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-10">
              <span className="font-sans text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-2">All Services</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#1a1c1b] tracking-tight">
                The Complete Sunlit Service Stack
              </h2>
            </div>

            {/* Featured service — full-width card */}
            <div className="bg-[#fdfbf7] rounded-[20px] border border-[#BFCABA]/30 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 mb-6">
              <div className="bg-gradient-to-br from-[#00490e] to-[#0f631b] p-8 md:col-span-5 flex items-center justify-center min-h-[180px] md:min-h-full">
                <Home size={64} className="text-white/30" />
              </div>
              <div className="p-6 sm:p-10 md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="inline-flex bg-[#00490e]/10 rounded-full px-3 py-1 mb-3">
                    <span className="font-sans text-xs font-semibold text-[#00490e] uppercase tracking-wider">{featured.tag}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1a1c1b] tracking-tight mb-3">{featured.title}</h3>
                  <p className="font-sans text-sm sm:text-base text-[#40493d] leading-relaxed mb-6">{featured.description}</p>
                </div>
                <Link href="/waitlist" className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-[#00490e] hover:underline">
                  Explore Solution <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Rest of services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((svc) => (
                <div
                  key={svc.id}
                  className={`rounded-[18px] p-6 border shadow-xs flex flex-col justify-between transition-all ${
                    svc.highlight
                      ? 'bg-gradient-to-br from-[#00490e]/5 to-[#0f631b]/10 border-[#00490e]/30'
                      : 'bg-[#fdfbf7] border-[#BFCABA]/30'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#00490e]/10 flex items-center justify-center text-[#00490e]">
                        <svc.icon size={22} />
                      </div>
                      <span className="font-sans text-[10px] font-semibold text-[#40493d] bg-[#f6f3eb] rounded-full px-2.5 py-1 uppercase tracking-wider border border-[#BFCABA]/30">
                        {svc.tag.replace('Best For: ', '')}
                      </span>
                    </div>
                    <h3 className={`font-display font-bold text-lg mb-2 ${svc.highlight ? 'text-[#00490e]' : 'text-[#1a1c1b]'}`}>
                      {svc.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#40493d] leading-relaxed mb-5">
                      {svc.description}
                    </p>
                  </div>
                  <Link href="/waitlist" className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs sm:text-sm text-[#00490e] hover:underline">
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
