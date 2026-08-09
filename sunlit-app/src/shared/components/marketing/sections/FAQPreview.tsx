'use client';

const FAQS = [
  {
    q: 'What is the average cost of solar installation in Nigeria?',
    a: 'Costs vary based on system size, roof type, and location. Our platform allows you to get multiple quotes from verified installers to ensure you get competitive, transparent pricing. You can also use our calculator for a quick estimate.',
  },
  {
    q: 'How does Sunlit verify solar installers and EPC contractors?',
    a: 'We maintain a rigorous vetting process that includes verifying licenses, insurance, past performance data, and financial stability. Only tier-one professionals make it onto our marketplace.',
  },
  {
    q: 'Is my payment secure when using the Sunlit platform?',
    a: 'Funds are held securely in escrow and only released upon successful completion of predefined project milestones (e.g., equipment delivery, installation, final inspection). This protects both the property owner and the installer.',
  },
  {
    q: 'What solar financing options are available for businesses?',
    a: 'Through our platform, you can access a range of financing partners offering solar loans, leases, and Power Purchase Agreements (PPAs) tailored to your financial needs.',
  },
  {
    q: 'How do I request maintenance for my solar energy system?',
    a: 'All installations through Sunlit come with robust warranties. If maintenance is needed, you can easily log a service request directly through your Project Dashboard, and a verified technician will be dispatched.',
  },
];

export function FAQPreview() {
  return (
    <section
      id="faq"
      style={{
        background: '#fff8f5',
        padding: '96px 80px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
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
            Frequently Asked Questions
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#40493d',
              margin: 0,
            }}
          >
            Everything you need to know about transitioning to solar with Sunlit.
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map(faq => (
            <details
              key={faq.q}
              className="faq-item"
              style={{
                background: '#fff',
                border: '1px solid rgba(230, 225, 215, 0.7)',
                borderRadius: '16px',
              }}
            >
              <summary
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px',
                  cursor: 'pointer',
                  listStyle: 'none',
                  outline: 'none',
                }}
              >
                <h4
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#1f1b17',
                    margin: 0,
                    paddingRight: '24px',
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                </h4>
                <span
                  className="faq-chevron"
                  style={{
                    flexShrink: 0,
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00490e',
                    transition: 'transform 300ms ease',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </summary>
              <div style={{ padding: '0 24px 24px' }}>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: '#40493d',
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        details[open] .faq-chevron {
          transform: rotate(180deg);
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
        details > summary {
          list-style: none;
        }
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
