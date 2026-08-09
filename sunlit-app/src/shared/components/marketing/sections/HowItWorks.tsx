'use client';

const HOW_STEPS = [
  { num: '1', title: 'Request a Quote', desc: 'Share your energy needs.' },
  { num: '2', title: 'Compare Verified Installers', desc: 'Choose the best fit.' },
  { num: '3', title: 'Receive Proposal & Solar Design', desc: 'Custom AI engineering.' },
  { num: '4', title: 'Secure Escrow Payment', desc: 'Funds protected.' },
  { num: '5', title: 'Professional Installation', desc: 'Track milestones.' },
  { num: '6', title: 'Monitoring & Support', desc: 'Live performance data.' },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: '#fff',
        borderTop: '1px solid rgba(230, 225, 215, 0.7)',
        borderBottom: '1px solid rgba(230, 225, 215, 0.7)',
        padding: '96px 80px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px' }}>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 3vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#1f1b17',
              marginBottom: '16px',
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#40493d',
            }}
          >
            A streamlined, transparent process from your first inquiry to full
            energy independence.
          </p>
        </div>

        {/* Steps — horizontal desktop, vertical mobile */}
        <div className="how-steps-grid" style={{ position: 'relative' }}>
          {/* Connector line — desktop */}
          <div
            className="connector-line"
            style={{
              position: 'absolute',
              top: '32px',
              left: '5%',
              right: '5%',
              height: '2px',
              background: 'rgba(191, 202, 186, 0.3)',
              zIndex: 0,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              position: 'relative',
              zIndex: 1,
            }}
            className="steps-container"
          >
            {HOW_STEPS.map(step => (
              <div
                key={step.num}
                className="step-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 8px',
                  cursor: 'default',
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#fff',
                    border: '2px solid #00490e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    flexShrink: 0,
                    transition: 'background 200ms ease',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 800,
                    fontSize: '18px',
                    color: '#00490e',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = '#00490e';
                    el.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = '#fff';
                    el.style.color = '#00490e';
                  }}
                >
                  {step.num}
                </div>

                <h4
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1f1b17',
                    marginBottom: '6px',
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: '#40493d',
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .steps-container {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .connector-line { display: none !important; }
          section { padding: 80px 40px !important; }
        }
        @media (max-width: 767px) {
          .steps-container {
            grid-template-columns: 1fr !important;
          }
          .step-item {
            flex-direction: row !important;
            text-align: left !important;
            gap: 16px;
          }
          section { padding: 64px 20px !important; }
        }
      `}</style>
    </section>
  );
}
