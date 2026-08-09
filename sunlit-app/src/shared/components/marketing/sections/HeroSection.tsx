'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Calculator, Search, CalendarDays } from 'lucide-react';

interface HeroSectionProps {
  onWaitlistOpen: () => void;
}

export function HeroSection({ onWaitlistOpen }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[880px] flex items-center pt-20 pb-32 overflow-hidden"
      style={{ background: '#fff8f5' }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(204, 235, 145, 0.18)',
          filter: 'blur(80px)',
          transform: 'translate(25%, -25%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(230, 230, 220, 0.35)',
          filter: 'blur(80px)',
          transform: 'translate(-25%, 25%)',
        }}
      />

      <div
        className="relative z-10 w-full"
        style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 80px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left content */}
          <div className="flex flex-col items-start" style={{ gap: '32px' }}>
            {/* AI Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(240, 237, 227, 0.9)',
                border: '1px solid rgba(191, 202, 186, 0.3)',
                borderRadius: '9999px',
              }}
            >
              <Zap size={15} style={{ color: '#4d661c', fill: '#4d661c' }} />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '0.04em',
                  color: '#40493d',
                }}
              >
                AI-Ready Renewable Energy Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(40px, 5vw, 68px)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#1f1b17',
                margin: 0,
              }}
            >
              Power Your Property with Intelligent{' '}
              <span style={{ color: '#00490e' }}>Renewable Energy</span>
            </h1>

            {/* Body */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.65,
                color: '#40493d',
                maxWidth: '520px',
                margin: 0,
              }}
            >
              Compare verified solar installers, EPC contractors and renewable energy
              experts to design, install and manage residential, commercial and
              industrial renewable energy projects across Nigeria.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center" style={{ gap: '16px' }}>
              <a
                href="/tools/solar-system-sizing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #00490e 0%, #216224 100%)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 73, 14, 0.28)',
                  transition: 'all 350ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 73, 14, 0.38)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 73, 14, 0.28)';
                }}
              >
                Get Free Solar Quote
                <ArrowRight size={16} />
              </a>
              <a
                href="/services"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  borderRadius: '9999px',
                  background: 'transparent',
                  border: '1px solid rgba(191, 202, 186, 0.6)',
                  color: '#1f1b17',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  transition: 'all 250ms ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(240, 237, 227, 0.8)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191, 202, 186, 0.6)';
                }}
              >
                Explore Solutions
              </a>
            </div>

            {/* Quick Actions */}
            <div style={{ borderTop: '1px solid rgba(230, 225, 215, 0.8)', paddingTop: '32px', width: '100%' }}>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#40493d',
                  marginBottom: '16px',
                }}
              >
                Quick Actions
              </p>
              <div className="flex flex-wrap" style={{ gap: '12px' }}>
                {[
                  { icon: <Calculator size={16} />, label: 'Solar Cost Calculator', href: '/tools/solar-system-sizing' },
                  { icon: <Search size={16} />, label: 'Compare Installers', href: '/services' },
                  { icon: <CalendarDays size={16} />, label: 'Book Consultation', href: '/contact' },
                ].map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#fff',
                      border: '1px solid rgba(230, 225, 215, 0.8)',
                      borderRadius: '9999px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: '#1f1b17',
                      textDecoration: 'none',
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '#00490e';
                      (e.currentTarget as HTMLElement).style.color = '#00490e';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(230, 225, 215, 0.8)';
                      (e.currentTarget as HTMLElement).style.color = '#1f1b17';
                    }}
                  >
                    <span style={{ color: '#00490e' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative hero-visual" style={{ height: '600px' }}>
            {/* Main hero image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '2.5rem',
                overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCxOu026tgdXiFsW9WwJMEX1pfzjnymeEdlVmfxFdDXIwCzaoeaaKsEKJ8b7MLvkiy6ob0mAWsMbl_AGmc3fQdoM8aTxDGsN-eGwjreQH-dx-YGqA62Rjw1lfoC5JNGcjGG2hMqYcp1FH659GCGxuuCtRZIxD_YUyTMvdEUul2uTa-GVmNSCWDPnRCUDdbammv1ZEK4EBJyV0BEijC1Y3cWwTK9BwcgRzWkMdItoXl1XBzbOmZ9kzMk)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                aria-label="Solar professionals installing panels on a luxury home in Lagos"
              />
            </div>

            {/* Floating card — Pro Installer */}
            <div
              style={{
                position: 'absolute',
                top: '48px',
                left: '-32px',
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(231, 229, 228, 0.6)',
                borderRadius: '16px',
                padding: '16px',
                width: '220px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(204, 235, 145, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#00490e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '13px', color: '#1f1b17', margin: 0 }}>
                    Pro Installer
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#00490e', margin: 0 }}>Verified</p>
                </div>
              </div>
              <div style={{ height: '6px', background: '#f0ede3', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '85%', background: 'linear-gradient(90deg, #00490e, #4d661c)', borderRadius: '9999px' }} />
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#40493d', textAlign: 'right', marginTop: '6px', marginBottom: 0 }}>
                85% Match
              </p>
            </div>

            {/* Floating card — Energy Stats */}
            <div
              style={{
                position: 'absolute',
                bottom: '80px',
                right: '-32px',
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(231, 229, 228, 0.6)',
                borderRadius: '16px',
                padding: '16px',
                width: '200px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                animation: 'float 8s ease-in-out infinite reverse',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="#4d661c"/>
                </svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#00490e', background: 'rgba(204, 235, 145, 0.3)', padding: '3px 10px', borderRadius: '9999px' }}>
                  Optimal
                </span>
              </div>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '22px', color: '#1f1b17', margin: 0 }}>
                24.5 kWh
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#40493d', marginTop: '4px', marginBottom: 0 }}>
                Est. Daily Production
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 1023px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-visual {
            height: 380px !important;
          }
        }
        @media (max-width: 767px) {
          .hero-grid {
            padding: 0 20px !important;
          }
          section {
            padding-bottom: 60px !important;
          }
          .hero-visual {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
