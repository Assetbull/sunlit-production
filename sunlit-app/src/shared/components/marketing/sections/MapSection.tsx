'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

const LOCATIONS = [
  {
    city: 'Lagos',
    href: '/locations/lagos',
    desc: 'Nigeria\'s commercial capital — serving Lekki, Victoria Island, Ikoyi, Ikeja and more.',
    stats: '1,200+ projects',
    badge: 'Most Active',
  },
  {
    city: 'Abuja (FCT)',
    href: '/locations/abuja',
    desc: 'Federal Capital Territory — serving Wuse, Garki, Maitama, Asokoro and surrounding areas.',
    stats: '800+ projects',
    badge: 'Growing Fast',
  },
  {
    city: 'Ogun State',
    href: '/locations/ogun',
    desc: 'Industrial heartland — serving Sagamu, Ijebu Ode, Abeokuta, Ota and industrial zones.',
    stats: '400+ projects',
    badge: 'Industrial Focus',
  },
];

interface MapSectionProps {
  onWaitlistOpen: () => void;
}

export function MapSection({ onWaitlistOpen }: MapSectionProps) {
  return (
    <section
      id="locations"
      style={{
        background: '#fff8f5',
        padding: '96px 80px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#00490e',
              background: 'rgba(0, 73, 14, 0.06)',
              padding: '6px 14px',
              borderRadius: '9999px',
              marginBottom: '16px',
            }}
          >
            Across Nigeria
          </span>
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
            Solar Energy Across Nigeria
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
            We&apos;re currently serving Lagos, Abuja, and Ogun with rapid expansion
            planned to all 36 states by Q4 2026.
          </p>
        </div>

        {/* Location cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {LOCATIONS.map(loc => (
            <Link
              key={loc.city}
              href={loc.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="location-card"
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(230, 225, 215, 0.7)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'all 300ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0, 73, 14, 0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(230, 225, 215, 0.7)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} style={{ color: '#00490e', flexShrink: 0 }} />
                    <h3
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: '#1f1b17',
                        margin: 0,
                      }}
                    >
                      {loc.city}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '11px',
                      letterSpacing: '0.04em',
                      color: '#00490e',
                      background: 'rgba(0, 73, 14, 0.08)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    {loc.badge}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: '#40493d',
                    marginBottom: '20px',
                  }}
                >
                  {loc.desc}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: '#00490e',
                    }}
                  >
                    {loc.stats}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00490e', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                    View <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: '#40493d',
              marginBottom: '16px',
            }}
          >
            Not in our coverage area yet?
          </p>
          <button
            onClick={onWaitlistOpen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #00490e 0%, #216224 100%)',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 73, 14, 0.25)',
              transition: 'all 250ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 73, 14, 0.35)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 73, 14, 0.25)';
            }}
          >
            Join the Waitlist for Your State
          </button>
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
