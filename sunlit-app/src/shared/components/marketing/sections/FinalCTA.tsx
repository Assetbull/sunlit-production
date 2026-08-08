import { ArrowRight, Sun } from 'lucide-react';

interface FinalCTAProps {
  onWaitlistOpen: () => void;
}

export function FinalCTA({ onWaitlistOpen }: FinalCTAProps) {
  return (
    <section
      aria-labelledby="final-cta-heading"
      style={{
        padding: '6rem 1.5rem',
        background: '#f9f9f6',
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #00490e 0%, #007a6b 50%, #0f631b 100%)',
            borderRadius: '28px',
            padding: 'clamp(3rem, 8vw, 5rem) clamp(2rem, 6vw, 4rem)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0, 107, 92, 0.25)',
          }}
        >
          {/* Decorative orbs */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(101, 250, 222, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Sun icon */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            marginBottom: '1.5rem',
          }}>
            <Sun size={28} color="#fff" strokeWidth={2} />
          </div>

          <h2
            id="final-cta-heading"
            style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 700,
              fontSize: 'clamp(1.875rem, 5vw, 3rem)',
              color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1,
              marginBottom: '1.125rem',
            }}
          >
            Ready to Power Your Future?
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
            color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.65,
            marginBottom: '2.25rem', maxWidth: '520px', margin: '0 auto 2.25rem',
          }}>
            Join thousands of Nigerians securing their energy independence through Nigeria&apos;s most trusted solar marketplace.
            Launch is coming — be first in line.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onWaitlistOpen}
              id="final-cta-waitlist-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2.25rem', borderRadius: '9999px', border: 'none',
                background: '#fff', color: '#00490e',
                fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 200ms ease',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              aria-label="Join the Sunlit Energy waitlist"
            >
              Join the Waitlist
              <ArrowRight size={18} />
            </button>

            <a
              href="/faq"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 2rem', borderRadius: '9999px',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                background: 'transparent', color: '#fff',
                fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
                textDecoration: 'none', transition: 'all 200ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Learn More
            </a>
          </div>

          {/* Social proof mini strip */}
          <div style={{
            marginTop: '2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
          }}>
            {['500+ Verified Installers', '₦2.4B+ Projects', '99.8% Success Rate'].map((stat) => (
              <div key={stat} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#65fade', display: 'inline-block' }} />
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
