import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle, MapPin, Zap, TrendingUp, Building2 } from 'lucide-react';
import { BreadcrumbNav } from '@/shared/components/marketing/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Solar Energy in Abuja (FCT) Nigeria — Vetted Installers & Escrow Payments | Sunlit Energy',
  description:
    'Verified solar installers in Abuja FCT (Maitama, Wuse II, Garki, Asokoro, Gwarinpa, Jabi). Escrow-protected milestone payments, institutional-grade engineering, and competitive bids.',
  keywords:
    'solar energy abuja, solar installer maitama, solar panel wuse abuja, solar installers asokoro, solar fct nigeria, commercial solar gwarinpa, solar price abuja nigeria',
  alternates: { canonical: 'https://sunlit.energy/locations/abuja' },
  openGraph: {
    title: 'Solar Energy in Abuja (FCT) — Sunlit Energy Nigeria',
    description:
      "Abuja's premier solar marketplace. Vetted installers, milestone escrow security, and institutional-grade engineering for homes, embassies, and commercial centers.",
    url: 'https://sunlit.energy/locations/abuja',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Energy in Abuja Nigeria — Sunlit Energy',
    description:
      'Connect with 80+ vetted solar installers in Abuja with 100% milestone escrow payment protection.',
  },
};

const DISTRICTS = [
  { name: 'Maitama, Guzape & Asokoro', desc: 'Premium residential, diplomatic missions & executive residences', time: '2–3 weeks' },
  { name: 'Wuse II & Garki', desc: 'Commercial headquarters, financial institutions & hospitality venues', time: '3–4 weeks' },
  { name: 'Gwarinpa, Jabi & Utako', desc: 'High-density residential estates & commercial shopping complexes', time: '3–4 weeks' },
  { name: 'Lugbe, Kubwa & Satellite Zones', desc: 'Fast-growing residential corridors and hybrid solar installations', time: '3–5 weeks' },
];

const STATS = [
  { value: '80+', label: 'Vetted Installers' },
  { value: '150+', label: 'Systems Delivered' },
  { value: '3–4 wks', label: 'Avg. Delivery' },
  { value: '₦0', label: 'Upfront Risk' },
];

const SYSTEM_TYPES = [
  { name: 'Residential (3kVA – 10kVA)', range: '₦2.8M – ₦10.5M', bestFor: 'Homes, duplexes & serviced apartments' },
  { name: 'Commercial (15kVA – 100kVA)', range: '₦14M – ₦90M', bestFor: 'Offices, embassies, clinics & schools' },
  { name: 'Institutional (100kVA – 1MW+)', range: '₦90M – ₦700M+', bestFor: 'Government complexes, hospitals & data facilities' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Sunlit Energy Abuja',
  description:
    'Solar energy marketplace serving Abuja FCT with vetted installers and milestone escrow payments.',
  url: 'https://sunlit.energy/locations/abuja',
  telephone: '+234-800-SUNLIT',
  priceRange: '₦₦₦',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Central Business District',
    addressLocality: 'Abuja',
    addressRegion: 'Federal Capital Territory',
    addressCountry: 'NG',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 9.0579, longitude: 7.4951 },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Maitama' },
    { '@type': 'AdministrativeArea', name: 'Asokoro' },
    { '@type': 'AdministrativeArea', name: 'Wuse' },
    { '@type': 'AdministrativeArea', name: 'Garki' },
    { '@type': 'AdministrativeArea', name: 'Gwarinpa' },
    { '@type': 'AdministrativeArea', name: 'Jabi' },
  ],
};

export default function AbujaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ background: '#faf8f3', minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Locations', href: '/locations' },
            { label: 'Abuja' },
          ]}
        />

        {/* Hero */}
        <section aria-label="Abuja hero" style={{ padding: '5rem 1.5rem 4rem', background: 'linear-gradient(180deg, #f6f3eb 0%, #faf8f3 100%)', borderBottom: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem', width: 'fit-content' }}>
              <MapPin size={14} color="#00490e" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Abuja FCT, Nigeria</span>
            </div>
            <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', color: '#1a1c1b', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '800px' }}>
              Solar Energy for Abuja Homes & Institutions
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.1875rem)', color: '#40493d', lineHeight: 1.7, maxWidth: '640px', marginBottom: '2.5rem' }}>
              Abuja&apos;s growing demand for reliable power meets Sunlit&apos;s trusted marketplace. From Maitama to Gwagwalada — vetted installers, competitive bids, escrow protection.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,73,14,0.2)' }}>
                Get Solar Bids in Abuja <ArrowRight size={16} />
              </Link>
              <Link href="/faq" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', border: '1.5px solid rgba(191,202,186,0.5)', color: '#1a1c1b', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', background: 'transparent' }}>
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Abuja statistics" style={{ padding: '3.5rem 1.5rem', background: '#f7fbf1' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1.75rem 1.25rem', background: '#fff8f5', borderRadius: '16px', border: '1px solid rgba(191,202,186,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 150ms cubic-bezier(0.2,0,0,1)' }}>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#00490e', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{s.value}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Districts */}
        <section aria-label="Abuja districts" style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Coverage</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Where We Operate in Abuja</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {DISTRICTS.map((d) => (
                <div key={d.name} style={{ background: '#fff8f5', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(191,202,186,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 150ms cubic-bezier(0.2,0,0,1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00490e', flexShrink: 0 }} />
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b' }}>{d.name}</h3>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d', lineHeight: 1.6, marginBottom: '0.75rem' }}>{d.desc}</p>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e' }}>Avg. delivery: {d.time}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Types */}
        <section aria-label="Abuja solar systems" style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Pricing Guide</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>Abuja Solar System Costs</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {SYSTEM_TYPES.map((sys, i) => (
                <div key={sys.name} style={{ background: i === 0 ? 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)' : '#fff8f5', borderRadius: '20px', padding: '2rem', border: i === 0 ? 'none' : '1px solid rgba(191,202,186,0.4)', transition: 'all 150ms cubic-bezier(0.2,0,0,1)' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: i === 0 ? 'rgba(255,255,255,0.7)' : '#40493d', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{sys.bestFor}</div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: i === 0 ? '#fff' : '#1a1c1b', marginBottom: '0.5rem' }}>{sys.name}</div>
                  <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: i === 0 ? '#88d982' : '#00490e', letterSpacing: '-0.02em' }}>{sys.range}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Sunlit */}
        <section aria-label="Why Sunlit in Abuja" style={{ padding: '5rem 1.5rem', background: '#f7fbf1', borderTop: '1px solid rgba(191,202,186,0.3)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '1rem' }}>Institutional-Grade Trust</span>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                  Built for Abuja&apos;s Institutional Standards
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#40493d', lineHeight: 1.7 }}>
                  Abuja&apos;s mix of government buildings, embassies, and premium residences demands higher standards. Sunlit&apos;s platform delivers the documentation, accountability, and payment security required.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: Shield, text: 'Escrow-protected payments with full documentation trail' },
                  { icon: Building2, text: 'Institutional-grade compliance and reporting' },
                  { icon: CheckCircle, text: 'Full installer background checks and certifications' },
                  { icon: TrendingUp, text: 'ROI analysis and system sizing for every project type' },
                  { icon: Zap, text: 'Post-installation monitoring and maintenance support' },
                ].map((item) => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#fff8f5', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(191,202,186,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 150ms cubic-bezier(0.2,0,0,1)' }}>
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
        <section aria-label="Abuja CTA" style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Ready to Go Solar in Abuja?
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Join Abuja&apos;s early access list. Get matched with vetted installers and competitive bids.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '9999px', background: '#fff', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                Get Started in Abuja <ArrowRight size={18} />
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
