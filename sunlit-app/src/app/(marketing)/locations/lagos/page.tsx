import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sun, Shield, CheckCircle, MapPin, Zap, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Lagos Nigeria — Vetted Installers & Escrow-Protected Payments | Sunlit Energy',
  description:
    'Find verified solar installers in Lagos. Lekki, Victoria Island, Ikeja, Surulere, and all LGAs. Escrow-protected payments, competitive bids, milestone-tracked delivery.',
  keywords:
    'solar energy lagos, solar installer lekki, solar panel victoria island, solar lagos nigeria, solar installation ikeja, solar power surulere, solar lagos price',
  alternates: { canonical: 'https://sunlitenergy.com/locations/lagos' },
  openGraph: {
    title: 'Solar Energy Lagos — Sunlit Energy Nigeria',
    description: 'Lagos\'s most trusted solar marketplace. Vetted installers, escrow payments, full project visibility.',
    url: 'https://sunlitenergy.com/locations/lagos',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const ZONES = [
  { name: 'Lekki & VI', desc: 'Premium residential, high-rise commercial', time: '2–3 weeks' },
  { name: 'Ikeja & Surulere', desc: 'Mixed residential & light industrial', time: '3–4 weeks' },
  { name: 'Ikorodu & Badagry', desc: 'Off-grid & hybrid systems', time: '4–5 weeks' },
  { name: 'Mainland Zones', desc: 'Yaba, Mushin, Isale-Eko', time: '3–4 weeks' },
];

const STATS = [
  { value: '200+', label: 'Vetted Installers' },
  { value: '500+', label: 'Systems Installed' },
  { value: '3 weeks', label: 'Avg. Delivery' },
  { value: '₦0', label: 'Upfront Risk' },
];

const SYSTEM_TYPES = [
  { name: 'Residential (3–10 kVA)', range: '₦1.5M – ₦8M', bestFor: 'Homes, apartments, small offices' },
  { name: 'Commercial (10–100 kVA)', range: '₦8M – ₦80M', bestFor: 'SMEs, shops, schools, clinics' },
  { name: 'Industrial (100 kVA+)', range: '₦80M+', bestFor: 'Factories, data centers, hospitality' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Sunlit Energy Lagos',
  description: 'Solar energy marketplace serving Lagos, Nigeria.',
  url: 'https://sunlitenergy.com/locations/lagos',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressRegion: 'Lagos State',
    addressCountry: 'NG',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 6.4281, longitude: 3.4219 },
  areaServed: 'Lagos State, Nigeria',
};

export default function LagosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ background: '#f6f3eb', borderBottom: '1px solid rgba(191,202,186,0.3)', padding: '0.75rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c' }}>
            <Link href="/" style={{ color: '#707a6c', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/locations" style={{ color: '#707a6c', textDecoration: 'none' }}>Locations</Link>
            <span>/</span>
            <span style={{ color: '#1a1c1b', fontWeight: 500 }}>Lagos</span>
          </div>
        </div>

        {/* Hero */}
        <section aria-label="Lagos hero" style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(180deg, #f6f3eb 0%, #faf8f3 100%)', borderBottom: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem', width: 'fit-content' }}>
              <MapPin size={14} color="#00490e" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Lagos, Nigeria</span>
            </div>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', color: '#1a1c1b', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '800px' }}>
              Solar Energy for Lagos Homes & Businesses
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.1875rem)', color: '#40493d', lineHeight: 1.7, maxWidth: '640px', marginBottom: '2.5rem' }}>
              Connect with Lagos&apos;s largest network of vetted solar installers. From Lekki to Ikeja, get competitive bids, escrow-protected payments, and real-time project tracking.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,73,14,0.2)' }}>
                Get Solar Bids in Lagos <ArrowRight size={16} />
              </Link>
              <Link href="/faq" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', border: '1.5px solid rgba(191,202,186,0.5)', color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent' }}>
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Lagos statistics" style={{ padding: '3.5rem 1.5rem', background: '#fdfbf7' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1.75rem 1.25rem', background: '#f9f9f6', borderRadius: '16px', border: '1px solid rgba(191,202,186,0.2)' }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#00490e', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Zones */}
        <section aria-label="Lagos coverage zones" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Coverage</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Where We Operate in Lagos</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {ZONES.map((zone) => (
                <div key={zone.name} style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(191,202,186,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00490e', flexShrink: 0 }} />
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b' }}>{zone.name}</h3>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.6, marginBottom: '0.75rem' }}>{zone.desc}</p>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e' }}>Avg. delivery: {zone.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Types */}
        <section aria-label="Lagos solar system types" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Pricing Guide</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>Lagos Solar System Costs</h2>
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
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c', textAlign: 'center', marginTop: '1.5rem' }}>
              Actual cost depends on load size, battery type, and site conditions. Get competitive bids through Sunlit.
            </p>
          </div>
        </section>

        {/* Why Trust Section */}
        <section aria-label="Why Sunlit in Lagos" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>Why Sunlit</span>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                  Lagos Deserves Better Than a Phone Call and a Prayer
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.7 }}>
                  The Lagos solar market is fragmented. Sunlit brings the structure, vetting, and payment protection that make solar safe to buy in Nigeria&apos;s most competitive city.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: Shield, text: 'Escrow payments — funds only released when you approve each milestone' },
                  { icon: CheckCircle, text: 'Multi-stage installer vetting — business reg, certifications, references' },
                  { icon: TrendingUp, text: 'Competitive bids from 3+ installers for every project' },
                  { icon: Sun, text: 'Real-time project tracking from quote to commissioning' },
                  { icon: Zap, text: 'Post-installation support and warranty management' },
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
        <section aria-label="Lagos CTA" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Ready to Go Solar in Lagos?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Join the waitlist to access Lagos&apos;s most trusted solar marketplace. Get matched with vetted installers and receive competitive bids.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                Get Started in Lagos <ArrowRight size={18} />
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
