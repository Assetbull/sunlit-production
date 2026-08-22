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
      className="how-it-works-section"
      style={{
        background: '#fff',
        borderTop: '1px solid rgba(230, 225, 215, 0.7)',
        borderBottom: '1px solid rgba(230, 225, 215, 0.7)',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
          <h2
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(28px, 4vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#1f1b17',
              marginBottom: '12px',
            }}
          >
            How It Works
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              lineHeight: 1.65,
              color: '#40493d',
              margin: 0,
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
              position: 'relative',
              zIndex: 1,
            }}
            className="steps-container"
          >
            {HOW_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="step-item"
                style={{
                  animationDelay: `${idx * 80}ms`,
                }}
              >
                {/* Circle */}
                <div
                  className="step-circle"
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

                {/* Text Content Wrapper */}
                <div className="step-text-wrapper">
                  <h4
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#1f1b17',
                      marginBottom: '4px',
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
                      lineHeight: 1.45,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .how-it-works-section {
          padding: 56px 20px;
        }
        .steps-container {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
        .step-item {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          text-align: left;
          gap: 16px;
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(250, 248, 243, 0.6);
          border: 1px solid rgba(230, 225, 215, 0.7);
          transition: transform 300ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 300ms ease, background 300ms ease;
          animation: stepReveal 500ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        .step-item:hover {
          background: rgba(250, 248, 243, 0.95);
          box-shadow: 0 6px 20px rgba(0, 73, 14, 0.06);
        }
        .step-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #00490e;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: #00490e;
        }
        .step-text-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
        }
        .connector-line {
          display: none !important;
        }

        @keyframes stepReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 640px) {
          .how-it-works-section {
            padding: 80px 40px;
          }
          .steps-container {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
          }
          .step-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 16px 12px;
            background: transparent;
            border: none;
            border-radius: 0;
          }
          .step-item:hover {
            background: transparent;
            box-shadow: none;
          }
          .step-circle {
            width: 56px;
            height: 56px;
            font-size: 17px;
            margin-bottom: 12px;
          }
          .step-text-wrapper {
            align-items: center;
          }
        }

        @media (min-width: 1024px) {
          .how-it-works-section {
            padding: 96px 80px;
          }
          .steps-container {
            grid-template-columns: repeat(6, 1fr) !important;
            gap: 12px !important;
          }
          .connector-line {
            display: block !important;
          }
          .step-circle {
            width: 64px;
            height: 64px;
            font-size: 18px;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </section>
  );
}
