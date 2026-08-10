'use client';

interface FinalCTAProps {
  onWaitlistOpen: () => void;
}

export function FinalCTA({ onWaitlistOpen }: FinalCTAProps) {
  return (
    <section
      style={{
        background: '#00490e',
        padding: '96px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'rgba(204, 235, 145, 0.1)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '320px',
          height: '320px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(32px, 4vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: '20px',
          }}
        >
          Start Your Energy Transformation Today
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.75)',
            marginBottom: '40px',
          }}
        >
          Join thousands of Nigerian homeowners and businesses who have trusted Sunlit
          Energy to design, finance, and install their solar energy systems.
        </p>

        <div
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}
        >
          <a
            href="/get-started"
            id="final-cta-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              borderRadius: '9999px',
              background: '#fff',
              color: '#00490e',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              transition: 'all 250ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
            }}
          >
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href="/tools/solar-system-sizing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 36px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              textDecoration: 'none',
              transition: 'all 250ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            Calculate Solar Cost
          </a>
        </div>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '24px',
          }}
        >
          Free to use · No obligation · 2-minute setup
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section { padding: 64px 20px !important; }
        }
        @media (max-width: 1023px) {
          section { padding: 80px 40px !important; }
        }
      `}</style>
    </section>
  );
}
