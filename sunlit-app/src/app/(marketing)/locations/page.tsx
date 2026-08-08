import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Zap, Users, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solar Energy Locations — Lagos, Abuja & Ogun | Sunlit Energy Nigeria',
  description:
    'Sunlit Energy serves Lagos, Abuja, and Ogun State with vetted solar installers, escrow-protected payments, and full project management. Find your city and get started.',
  keywords:
    'solar energy lagos nigeria, solar abuja, solar ogun state, solar installers near me nigeria, renewable energy locations nigeria',
  alternates: { canonical: 'https://sunlitenergy.com/locations' },
  openGraph: {
    title: 'Solar Energy Locations — Sunlit Energy Nigeria',
    description: 'Find vetted solar installers in your city. Lagos, Abuja, and Ogun State.',
    url: 'https://sunlitenergy.com/locations',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

const CITIES = [
  {
    slug: 'lagos',
    name: 'Lagos',
    subtitle: 'Lekki · Victoria Island · Ikeja · Surulere',
    description: "Nigeria's commercial capital. High solar demand, premium installer network, fastest project timelines.",
    stats: [
      { label: 'Active Installers', value: '200+' },
      { label: 'Avg. Install Time', value: '3 weeks' },
      { label: 'Systems Delivered', value: '500+' },
    ],
    badge: 'Most Active',
    featured: true,
  },
  {
    slug: 'abuja',
    name: 'Abuja',
    subtitle: 'Maitama · Wuse · Garki · Asokoro',
    description: 'Federal Capital Territory — growing solar adoption driven by institutional and residential demand.',
    stats: [
      { label: 'Active Installers', value: '80+' },
      { label: 'Avg. Install Time', value: '4 weeks' },
      { label: 'Systems Delivered', value: '150+' },
    ],
    badge: 'Expanding',
    featured: false,
  },
  {
    slug: 'ogun',
    name: 'Ogun State',
    subtitle: 'Abeokuta · Sagamu · Ota · Ijebu-Ode',
    description: 'Industrial belt with high energy costs — strong ROI potential for commercial and manufacturing solar.',
    stats: [
      { label: 'Active Installers', value: '60+' },
      { label: 'Avg. Install Time', value: '4 weeks' },
      { label: 'Systems Delivered', value: '100+' },
    ],
    badge: 'Launching',
    featured: false,
  },
];

const COMING_SOON = ['Port Harcourt', 'Ibadan', 'Enugu', 'Kano', 'Kaduna'];

export default function LocationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Sunlit Energy Locations',
            url: 'https://sunlitenergy.com/locations',
            description: 'Solar energy marketplace serving Lagos, Abuja, and Ogun State.',
          }),
        }}
      />

      <main style={{ background: '#f9f9f6', minHeight: '100vh' }}>

        {/* Hero */}
        <section
          aria-label="Locations hero"
          style={{
            padding: '5rem 1.5rem 4rem',
            background: 'linear-gradient(180deg, #f4f4f1 0%, #f9f9f6 100%)',
            borderBottom: '1px solid rgba(191,202,186,0.2)',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem' }}>
              <MapPin size={14} color="#00490e" />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                Service Areas
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#1a1c1b', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                  Serving Communities Across Nigeria
                </h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: '#40493d', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Reliable, escrow-protected solar energy solutions for homes and businesses in Lagos, Abuja, and Ogun State — with more cities coming in 2026.
                </p>
                <Link
                  href="/waitlist"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,73,14,0.2)' }}
                >
                  Join Waitlist <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[{ value: '3', label: 'Active Cities' }, { value: '340+', label: 'Vetted Installers' }, { value: '₦0', label: 'Upfront Risk' }, { value: '2026', label: 'Expansion Year' }].map((s) => (
                  <div key={s.label} style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(191,202,186,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#00490e', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{s.value}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* City Cards */}
        <section aria-label="City hubs" style={{ padding: '5rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Active Hubs</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Find Solar in Your City
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/locations/${city.slug}`}
                  style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '20px', border: city.featured ? '2px solid rgba(0,73,14,0.2)' : '1px solid rgba(191,202,186,0.2)', boxShadow: city.featured ? '0 8px 32px rgba(0,73,14,0.1)' : '0 4px 16px rgba(0,0,0,0.04)', textDecoration: 'none', overflow: 'hidden' }}
                >
                  <div style={{ background: city.featured ? 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)' : 'linear-gradient(135deg, #f4f4f1 0%, #eeeee9 100%)', padding: '2rem' }}>
                    <div style={{ display: 'inline-flex', background: city.featured ? 'rgba(255,255,255,0.2)' : 'rgba(0,73,14,0.08)', borderRadius: '9999px', padding: '0.25rem 0.75rem', marginBottom: '1rem' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: city.featured ? '#fff' : '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{city.badge}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.875rem', color: city.featured ? '#fff' : '#1a1c1b', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>{city.name}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: city.featured ? 'rgba(255,255,255,0.75)' : '#40493d' }}>{city.subtitle}</p>
                  </div>
                  <div style={{ padding: '1.75rem 2rem', flex: 1 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65, marginBottom: '1.5rem' }}>{city.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {city.stats.map((s) => (
                        <div key={s.label} style={{ background: '#f9f9f6', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                          <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#00490e' }}>{s.value}</div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#707a6c', marginTop: '0.125rem' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00490e', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9375rem' }}>
                      View {city.name} <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section aria-label="Coverage approach" style={{ padding: '5rem 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>Our Approach</span>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em' }}>
                The Same Trusted Process, Every City
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: CheckCircle, title: 'Vetted Installer Network', desc: 'Every installer in every city passes our multi-stage verification process.' },
                { icon: Zap, title: 'Escrow-Protected Payments', desc: 'Funds are released milestone-by-milestone regardless of which city you\'re in.' },
                { icon: Users, title: 'Local Project Management', desc: 'City-specific operations teams ensure local knowledge meets platform standards.' },
                { icon: MapPin, title: 'Expanding Coverage', desc: 'We\'re adding Port Harcourt, Ibadan, and more cities throughout 2026.' },
              ].map((item) => (
                <div key={item.title} style={{ background: '#f9f9f6', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(191,202,186,0.2)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,73,14,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <item.icon size={24} color="#00490e" />
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', marginBottom: '0.625rem' }}>{item.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#40493d', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section aria-label="Upcoming cities" style={{ padding: '4rem 1.5rem', background: '#f9f9f6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', border: '1px solid rgba(191,202,186,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#40493d', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Expanding in 2026</span>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#1a1c1b', marginBottom: '0.75rem' }}>Coming to More Cities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {COMING_SOON.map((city) => (
                      <span key={city} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 500, color: '#40493d', background: '#f4f4f1', borderRadius: '9999px', padding: '0.375rem 1rem', border: '1px solid rgba(191,202,186,0.3)' }}>{city}</span>
                    ))}
                  </div>
                </div>
                <Link href="/waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,73,14,0.2)', flexShrink: 0 }}>
                  Join Waitlist for Your City <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
