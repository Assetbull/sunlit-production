'use client';

import { useState } from 'react';
import { X, Zap } from 'lucide-react';

interface AnnouncementBarProps {
  onWaitlistOpen: () => void;
}

export function AnnouncementBar({ onWaitlistOpen }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="banner"
      style={{
        background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
        color: '#fff',
        padding: '0.625rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        position: 'relative',
        zIndex: 999,
      }}
    >
      <Zap size={14} fill="currentColor" style={{ flexShrink: 0 }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, textAlign: 'center' }}>
        Launching Soon — Serving Lagos, Ogun &amp; Abuja First.{' '}
        <button
          onClick={onWaitlistOpen}
          style={{
            background: 'none', border: 'none', color: '#65fade', fontWeight: 700,
            cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit', padding: 0,
          }}
        >
          Join the waitlist →
        </button>
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        style={{
          position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', padding: '0.25rem', borderRadius: '4px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
