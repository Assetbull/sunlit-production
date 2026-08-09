'use client';

import Link from 'next/link';
import { ArrowRight, Sun, Building2, BatteryCharging, Wrench } from 'lucide-react';

const SERVICES = [
  {
    icon: <Sun size={24} />,
    title: 'Residential Solar Installation',
    desc: 'Reliable rooftop solar systems designed for homes seeking dependable electricity, lower energy costs, and long-term savings.',
    href: '/services/residential-solar',
  },
  {
    icon: <Building2 size={24} />,
    title: 'Commercial Solar Solutions',
    desc: 'Scalable renewable energy systems for offices, schools, hospitals, hotels, retail spaces, and commercial properties.',
    href: '/services/commercial-solar',
  },
  {
    icon: <BatteryCharging size={24} />,
    title: 'Battery Energy Storage',
    desc: 'Advanced battery storage systems providing intelligent backup power, energy independence, and optimized solar performance.',
    href: '/services/battery-storage',
  },
  {
    icon: <Wrench size={24} />,
    title: 'Solar Maintenance & Support',
    desc: 'Preventive maintenance, inspections, repairs, monitoring, performance optimization, and long-term asset protection.',
    href: '/services',
  },
];

interface ServicesGridProps {
  onWaitlistOpen?: () => void;
}

export function ServicesGrid({ onWaitlistOpen }: ServicesGridProps = {}) {
  return (
    <section
      id="services"
      style={{
        background: '#fff8f5',
        padding: '96px 80px',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
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
            Comprehensive Energy Solutions
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
            Whether you&apos;re powering a home, business, commercial facility, or industrial
            operation, Sunlit connects you with verified renewable energy professionals
            across Nigeria.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {SERVICES.map(svc => (
            <div
              key={svc.title}
              className="service-card"
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(230, 225, 215, 0.7)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 350ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 350ms ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(0, 73, 14, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  color: '#00490e',
                  flexShrink: 0,
                }}
              >
                {svc.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: 1.3,
                  color: '#1f1b17',
                  marginBottom: '12px',
                }}
              >
                {svc.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: '#40493d',
                  flex: 1,
                  marginBottom: '24px',
                }}
              >
                {svc.desc}
              </p>

              {/* Link */}
              <Link
                href={svc.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                  color: '#00490e',
                  textDecoration: 'none',
                  transition: 'gap 200ms ease',
                }}
              >
                Learn More
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* View All */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            href="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '9999px',
              border: '1px solid rgba(191, 202, 186, 0.6)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: '#1f1b17',
              textDecoration: 'none',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0, 73, 14, 0.06)';
              (e.currentTarget as HTMLElement).style.borderColor = '#00490e';
              (e.currentTarget as HTMLElement).style.color = '#00490e';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191, 202, 186, 0.6)';
              (e.currentTarget as HTMLElement).style.color = '#1f1b17';
            }}
          >
            View All Services
            <ArrowRight size={16} />
          </Link>
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
