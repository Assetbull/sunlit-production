import { PiggyBank, Award, Eye, TrendingUp, ShieldCheck, Heart } from 'lucide-react';

const BENEFITS = [
  {
    icon: PiggyBank,
    title: 'Fuel Savings',
    desc: 'Eliminate high diesel and petrol generator expenses with immediate off-grid solar generation.',
  },
  {
    icon: Award,
    title: 'Certified Hardware',
    desc: 'Only Tier-1 panels, industrial-grade inverters, and lithium storage units are permitted on the network.',
  },
  {
    icon: Eye,
    title: 'Complete Transparency',
    desc: 'View comprehensive bid breakdowns. No hidden administration, shipping, or installation surcharges.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Monitoring',
    desc: 'Analyze energy yield, generator offsets, and battery state-of-health indicators in real-time.',
  },
  {
    icon: ShieldCheck,
    title: 'Financial Protection',
    desc: 'Funds are protected in bank-backed escrow accounts and released only on verified physical milestone completion.',
  },
  {
    icon: Heart,
    title: 'Extended Warranties',
    desc: 'Access verified structural support, equipment warranties, and emergency repair dispatch services.',
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
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
              System Advantages
            </span>
          </div>
          <h2 id="benefits-heading" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#1a1c1b', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem' }}>
            Why Clients Prefer Sunlit Energy
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: '#707a6c', lineHeight: 1.7 }}>
            We replace manual coordination and visual risk with automated standards, secure transactions, and technical oversight.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: '#f9f9f6',
                  border: '1px solid rgba(187, 202, 196, 0.12)',
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
                <div
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    background: 'rgba(0, 107, 92, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color="#00490e" strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', marginBottom: '0.5rem' }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c', lineHeight: 1.6 }}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
