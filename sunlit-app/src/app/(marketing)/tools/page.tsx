import { Metadata } from 'next';
import Link from 'next/link';
import { ALL_TOOLS } from '@/shared/components/tools/RelatedToolsList';
import { Cpu, ArrowRight } from 'lucide-react';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';

export const metadata: Metadata = {
  title: 'Solar Engineering Tools — Free System Sizing & Calculators | Sunlit Energy',
  description:
    'Free enterprise solar engineering calculators for Nigeria. Size solar panels, battery storage, inverters, cable gauges, PV string layouts, energy yield, and ROI.',
  keywords:
    'solar engineering tools nigeria, solar calculator lagos, battery sizing calculator, inverter sizing tool, cable sizing calculator, pv array layout',
  alternates: { canonical: 'https://sunlitenergy.com/tools' },
  openGraph: {
    title: 'Solar Engineering Tools — Sunlit Energy Nigeria',
    description: 'Free, validated solar engineering calculators built for Nigeria.',
    url: 'https://sunlitenergy.com/tools',
    siteName: 'Sunlit Energy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function ToolsIndexPage() {
  return (
    <main style={{ background: '#fff8f5', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Hero Header */}
      <header
        style={{
          background: 'linear-gradient(180deg, #f4f4f1 0%, #fff8f5 100%)',
          borderBottom: '1px solid rgba(191, 202, 186, 0.3)',
          padding: '64px 20px',
          textAlign: 'center',
        }}
      >
        <div className="sunlit-container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(0, 73, 14, 0.08)',
              borderRadius: '9999px',
              marginBottom: '16px',
            }}
          >
            <Cpu size={15} style={{ color: '#00490e' }} />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#00490e',
              }}
            >
              Sunlit Public Engineering Suite
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(32px, 4vw, 56px)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#1f1b17',
              marginBottom: '16px',
            }}
          >
            Enterprise Solar Engineering Tools
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#40493d',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Free, deterministic calculation engines designed for homeowners, engineers,
            installers, and EPC contractors across Nigeria.
          </p>
        </div>
      </header>

      {/* Tools Grid */}
      <section className="sunlit-container" style={{ paddingTop: '64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {ALL_TOOLS.map((tool) => (
            <div
              key={tool.id}
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(230, 225, 215, 0.7)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 350ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}
              className="bento-card-motion"
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: 'rgba(0, 73, 14, 0.08)',
                    color: '#00490e',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: '9999px',
                    marginBottom: '16px',
                  }}
                >
                  {tool.category}
                </span>
                <h2
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#1f1b17',
                    marginBottom: '12px',
                  }}
                >
                  {tool.name}
                </h2>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: '#40493d',
                    marginBottom: '24px',
                  }}
                >
                  {tool.description}
                </p>
              </div>

              <Link
                href={tool.path}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #00490e 0%, #216224 100%)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0, 73, 14, 0.2)',
                  transition: 'all 200ms ease',
                }}
              >
                Launch Calculator <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Global Tools Waitlist */}
        <div style={{ marginTop: '64px' }}>
          <PublicWaitlistForm
            title="Access Enterprise Engineering Reports"
            subtitle="Join the Sunlit Engineering Tools waitlist to unlock CAD downloads, automated single-line diagrams (SLD), and installer RFQ distribution."
          />
        </div>
      </section>
    </main>
  );
}
