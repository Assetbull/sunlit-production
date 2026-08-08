import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle, MapPin, Zap, TrendingUp, Factory } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Ogun State Nigeria — Industrial & Residential Solar | Sunlit Energy',
  description:
    'Solar energy solutions for Ogun State. Abeokuta, Sagamu, Ota, Ijebu-Ode. Ideal for industrial and commercial operations. Vetted installers, escrow payments, competitive bids.',
  keywords:
    'solar energy ogun state, solar installer abeokuta, solar ota ogun, solar sagamu, industrial solar ogun, solar ijebu ode, renewable energy ogun',
  alternates: { canonical: 'https://sunlitenergy.com/locations/ogun' },
  openGraph: {
    title: 'Solar Energy Ogun State — Sunlit Energy Nigeria',
    description: "Ogun State's solar marketplace. Industrial and residential solar with escrow protection.",
    url: 'https://sunlitenergy.com/locations/ogun',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const AREAS = [
  { name: 'Ota & Sango-Ota', desc: 'Industrial heartland — factories, warehouses, logistics', time: '4–5 weeks' },
  { name: 'Abeokuta', desc: 'State capital — residential estates & government offices', time: '3–4 weeks' },
  { name: 'Sagamu & Ijebu-Ode', desc: 'Highway corridors, mixed commercial & residential', time: '4–5 weeks' },
  { name: 'Mowe & Ibafo', desc: 'Lagos-Ogun border zone — high growth residential area', time: '3–4 weeks' },
];

const STATS = [
  { value: '60+', label: 'Vetted Installers' },
  { value: '100+', label: 'Systems Installed' },
  { value: '4 weeks', label: 'Avg. Delivery' },
  { value: '₦0', label: 'Upfront Risk' },
];

const SYSTEM_TYPES = [
  { name: 'Residential (3–10 kVA)', range: '₦1.5M – ₦8M', bestFor: 'Homes and apartments' },
  { name: 'Commercial (10–100 kVA)', range: '₦8M – ₦80M', bestFor: 'Factories, warehouses, farms' },
  { name: 'Industrial (100 kVA+)', range: '₦80M+', bestFor: 'Large manufacturing, processing plants' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Sunlit Energy Ogun State',
  description: 'Solar energy marketplace serving Ogun State, Nigeria.',
  url: 'https://sunlitenergy.com/locations/ogun',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Abeokuta',
    addressRegion: 'Ogun State',
    addressCountry: 'NG',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 7.1475, longitude: 3.3619 },
  areaServed: 'Ogun State, Nigeria',
};

export default function OgunPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#f9f9f6', minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(191,202,186,0.2)', padding: '0.75rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c' }}>
            <Link href="/" style={{ color: '#707a6c', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/locations" style={{ color: '#707a6c', textDecoration: 'none' }}>Locations</Link>
            <span>/</span>
            <span style={{ color: '#1a1c1b', fontWeight: 500 }}>Ogun State</span>
          </div>
        </div>

        {/* Hero */}
        <section aria-label="Ogun hero" style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)', borderBottom: '1px solid rgba(191,202,186,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem', width: 'fit-content' }}>
              <MapPin size={14} color="#00490e" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Ogun State, Nigeria</span>
            </div>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', color: '#1a1c1b', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '800px' }}>
              Industrial & Residential Solar for Ogun State
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.1875rem)', color: '#40493d', lineHeight: 1.7, maxWidth: '640px', marginBottom: '2.5rem' }}>
              Ogun State&apos;s industrial belt has some of the highest energy costs in Nigeria. Sunlit connects factories, manufacturers, and households with vetted solar installers — escrow-protected, milestone-managed.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,73,14,0.2)' }}>
                Get Solar Bids in Ogun <ArrowRight size={16} />
              </Link>
              <Link href="/faq" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', border: '1.5px solid rgba(191,202,186,0.5)', color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent' }}>
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Ogun statistics" style={{ padding: '3.5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1.75rem 1.25rem', background: '#f9f9f6', borderRadius: '16px', border: '1px solid rgba(191,202,186,0.2)' }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#00490e', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Areas */}
        <section aria-label="Ogun coverage areas" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Coverage</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Where We Operate in Ogun State</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {AREAS.map((area) => (
                <div key={area.name} style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(191,202,186,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00490e', flexShrink: 0 }} />
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b' }}>{area.name}</h3>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.6, marginBottom: '0.75rem' }}>{area.desc}</p>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e' }}>Avg. delivery: {area.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Types */}
        <section aria-label="Ogun solar systems" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Pricing Guide</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>Ogun State Solar System Costs</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {SYSTEM_TYPES.map((sys, i) => (
                <div key={sys.name} style={{ background: i === 0 ? 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)' : '#f9f9f6', borderRadius: '20px', padding: '2rem', border: i === 0 ? 'none' : '1px solid rgba(191,202,186,0.2)' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: i === 0 ? 'rgba(255,255,255,0.7)' : '#40493d', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{sys.bestFor}</div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: i === 0 ? '#fff' : '#1a1c1b', marginBottom: '0.5rem' }}>{sys.name}</div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: i === 0 ? '#88d982' : '#00490e', letterSpacing: '-0.02em' }}>{sys.range}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industrial Advantage */}
        <section aria-label="Industrial advantage" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>Industrial Focus</span>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                  Nigeria&apos;s Industrial Belt Needs Reliable Power
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.7 }}>
                  Ogun State factories spend millions on diesel annually. Sunlit connects industrial operators with specialist commercial and industrial solar installers — with the payment protection to make large projects safe.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: Factory, text: 'Specialist industrial solar installers with commercial experience' },
                  { icon: Shield, text: 'Escrow-protected milestone payments for large projects' },
                  { icon: TrendingUp, text: 'ROI analysis: diesel cost savings vs. solar investment' },
                  { icon: CheckCircle, text: 'Multi-site installation management across Ogun facilities' },
                  { icon: Zap, text: 'Hybrid systems for grid + solar + battery configurations' },
                ].map((item) => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(191,202,186,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={18} color="#00490e" />
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#1a1c1b', lineHeight: 1.5, fontWeight: 500 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-label="Ogun CTA" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Ready to Go Solar in Ogun State?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Join the early access list. Whether it&apos;s a factory in Ota or a home in Abeokuta — we&apos;ll connect you with the right installers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                Get Started in Ogun <ArrowRight size={18} />
              </Link>
              <Link href="/locations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', background: 'transparent' }}>
                View Other Cities
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
