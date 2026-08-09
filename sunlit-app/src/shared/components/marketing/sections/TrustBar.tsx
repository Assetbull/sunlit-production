'use client';

import { ShieldCheck, Wrench, Lock, Cpu } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: <ShieldCheck size={24} />, label: 'Verified Professionals' },
  { icon: <Wrench size={24} />, label: 'Certified Engineers' },
  { icon: <Lock size={24} />, label: 'Secure Escrow Payments' },
  { icon: <Cpu size={24} />, label: 'AI Engineering' },
];

export function TrustBar() {
  return (
    <section
      style={{
        background: '#fff',
        borderTop: '1px solid rgba(230, 225, 215, 0.7)',
        borderBottom: '1px solid rgba(230, 225, 215, 0.7)',
        padding: '28px 80px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px',
        }}
      >
        {TRUST_ITEMS.map(item => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: '#00490e', flexShrink: 0 }}>{item.icon}</span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                letterSpacing: '0.02em',
                color: '#40493d',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 767px) {
          section { padding: 24px 20px !important; }
        }
      `}</style>
    </section>
  );
}
