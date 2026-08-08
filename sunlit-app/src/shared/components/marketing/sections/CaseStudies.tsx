import { ArrowRight, BarChart3, ShieldCheck, Sun } from 'lucide-react';

const CASE_STUDIES = [
  {
    type: 'Commercial Solar',
    title: 'Heritage Mall Energy Independence',
    location: 'Ikeja, Lagos',
    specs: '120kWp Solar PV | 240kWh Storage',
    metric: '₦1.2M Monthly Fuel Savings',
    desc: 'Transitioned a multi-tenant commercial center from primary diesel generator dependency to solar-first hybrid power. Replaced 75% of generator run hours and stabilized critical voltage levels.',
  },
  {
    type: 'Industrial Solar',
    title: 'Agro-Allied Cold Storage Facility',
    location: 'Abeokuta, Ogun',
    specs: '350kWp Grid-Tied PV System',
    metric: '99.8% Cooling System Uptime',
    desc: 'Engineered a grid-synchronized commercial solar system to support critical cold-chain food processing operations. Reduced monthly power grid costs by 45% with zero operational disruptions.',
  },
  {
    type: 'Residential Solar',
    title: 'Parkview Estate Microgrid',
    location: 'Ikoyi, Lagos',
    specs: '15kWp Solar PV | 30kWh Lithium Storage',
    metric: '100% Uninterrupted Power Supply',
    desc: 'Installed a premium residential energy system with smart inverter integration. Replaced a backup 20kVA generator, achieving silent operation and complete energy independence.',
  },
];

interface CaseStudiesProps {
  onWaitlistOpen: () => void;
}

export function CaseStudies({ onWaitlistOpen }: CaseStudiesProps) {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      style={{
        padding: '6rem 1.5rem',
        background: '#f9f9f6',
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
              Project Deployments
            </span>
          </div>
          <h2 id="case-studies-heading" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem' }}>
            Proven Solar Performance
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#707a6c', lineHeight: 1.7 }}>
            Review operational systems designed, funded, and deployed by vetted professionals across Nigeria.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.title}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                border: '1px solid rgba(187, 202, 196, 0.12)',
                boxShadow: '0 4px 16px rgba(7, 54, 66, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                    color: '#00490e', background: 'rgba(0,107,92,0.08)', borderRadius: '9999px', padding: '0.25rem 0.75rem',
                  }}>
                    {cs.type}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
                    {cs.location}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#1a1c1b', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                  {cs.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#707a6c', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {cs.desc}
                </p>
              </div>

              <div style={{
                borderTop: '1px solid rgba(187, 202, 196, 0.12)',
                paddingTop: '1.25rem',
                marginTop: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Sun size={15} color="#00490e" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#1a1c1b' }}>
                    {cs.specs}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={15} color="#00490e" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#00490e' }}>
                    {cs.metric}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onWaitlistOpen}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', border: '1.5px solid #00490e', borderRadius: '9999px',
              padding: '0.75rem 2rem', color: '#00490e',
              fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 200ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(0,107,92,0.05)';
              el.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.transform = 'translateY(0)';
            }}
            aria-label="View all solar case studies"
          >
            View More Deployments
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
