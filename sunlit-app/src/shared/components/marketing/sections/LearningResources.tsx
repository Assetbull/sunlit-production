import { BookOpen, Calculator, GraduationCap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const RESOURCES = [
  {
    icon: BookOpen,
    title: 'Solar Buyer Guides',
    desc: 'Deep-dive handbooks outlining sizing calculations, battery chemistry options, inverters, and utility net-metering processes in Nigeria.',
    linkText: 'Access Guides',
    href: '/resources/guides',
  },
  {
    icon: Calculator,
    title: 'Solar Yield Calculator',
    desc: 'Estimate system capacity requirements, battery sizes, and expected fuel offset calculations based on average daily appliance run-hours.',
    linkText: 'Run Calculation',
    href: '/resources/calculator',
  },
  {
    icon: GraduationCap,
    title: 'Installer Training Hub',
    desc: 'Technical certification prep, mechanical load standards, and wiring compliance guides for professionals within the network.',
    linkText: 'Visit Academy',
    href: '/resources/academy',
  },
];

export function LearningResources() {
  return (
    <section
      id="resources"
      aria-labelledby="resources-heading"
      style={{
        padding: '6rem 1.5rem',
        background: '#fff',
        borderBottom: '1px solid rgba(187, 202, 196, 0.12)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '640px', margin: '0 auto 4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0, 107, 92, 0.08)', borderRadius: '9999px',
            padding: '0.375rem 1rem', marginBottom: '1.25rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00490e', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#00490e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Resource Library
            </span>
          </div>
          <h2 id="resources-heading" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem' }}>
            Technical Knowledge &amp; Calculations
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#707a6c', lineHeight: 1.7 }}>
            Empowering property owners and technical experts with transparent metrics, solar standards, and calculation models.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {RESOURCES.map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.title}
                style={{
                  background: '#f9f9f6',
                  borderRadius: '16px',
                  padding: '2.5rem 2rem',
                  border: '1px solid rgba(187, 202, 196, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-2px)';
                  el.style.borderColor = 'rgba(0, 107, 92, 0.15)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'rgba(187, 202, 196, 0.12)';
                }}
              >
                <div>
                  <div
                    style={{
                      width: '44px', height: '44px', borderRadius: '10px', marginBottom: '1.25rem',
                      background: 'rgba(0, 107, 92, 0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} color="#00490e" strokeWidth={2} />
                  </div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.1875rem', color: '#1a1c1b', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                    {res.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#707a6c', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                    {res.desc}
                  </p>
                </div>
                <div>
                  <Link
                    href={res.href}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#00490e',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.opacity = '0.8';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.opacity = '1';
                    }}
                  >
                    {res.linkText} <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
