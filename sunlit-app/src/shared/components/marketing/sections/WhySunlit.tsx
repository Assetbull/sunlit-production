'use client';

import { Search, Handshake, CheckCircle } from 'lucide-react';

const WHY_FEATURES = [
  {
    icon: <Search size={22} />,
    title: 'Discover',
    desc: 'Find the right energy solution tailored to your specific residential, commercial, or industrial needs.',
  },
  {
    icon: <Handshake size={22} />,
    title: 'Connect',
    desc: 'Match with verified professionals, trusted installers, and expert project partners across Nigeria.',
  },
  {
    icon: <CheckCircle size={22} />,
    title: 'Execute',
    desc: 'Track and complete the installation safely with secure, milestone-based escrow payments.',
  },
];

interface WhySunlitProps {
  onWaitlistOpen: () => void;
}

export function WhySunlit({ onWaitlistOpen }: WhySunlitProps) {
  return (
    <section
      id="why-sunlit"
      style={{
        background: '#fff',
        borderTop: '1px solid rgba(230, 225, 215, 0.7)',
        borderBottom: '1px solid rgba(230, 225, 215, 0.7)',
        padding: '96px 80px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 64px' }}>
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
            Why Choose Sunlit Energy
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#40493d',
            }}
          >
            Sunlit combines trusted renewable energy professionals, intelligent
            engineering, secure project payments, and modern technology to simplify
            every stage of your renewable energy journey.
          </p>
        </div>

        {/* 3-column features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
          }}
        >
          {WHY_FEATURES.map(feat => (
            <div key={feat.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#f0ede3',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00490e',
                  marginBottom: '8px',
                }}
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  color: '#1f1b17',
                  margin: 0,
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: '#40493d',
                  margin: 0,
                }}
              >
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '24px',
            background: '#fff8f5',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(230, 225, 215, 0.7)',
          }}
        >
          {[
            { value: '2,400+', label: 'Projects Completed' },
            { value: '18 MW', label: 'Solar Installed' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '3', label: 'States Covered' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#00490e',
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#40493d',
                  marginTop: '8px',
                  marginBottom: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
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
