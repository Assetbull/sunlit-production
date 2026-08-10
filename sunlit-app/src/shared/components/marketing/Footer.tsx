'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { SunlitLogo } from '@/shared/components/brand/SunlitLogo';

const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'hello@sunlit.energy';
const COMPANY_PHONE = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '';
const COMPANY_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? 'Lagos, Nigeria';

const FOOTER_SERVICES = [
  { label: 'Residential Solar', href: '/services/residential-solar' },
  { label: 'Commercial Solar', href: '/services/commercial-solar' },
  { label: 'Industrial Solar', href: '/services/industrial-solar' },
  { label: 'Battery Storage', href: '/services/battery-storage' },
  { label: 'Solar Maintenance', href: '/services/maintenance' },
  { label: 'Energy Audit', href: '/services/energy-audits' },
  { label: 'EV Charging', href: '/services/ev-charging' },
  { label: 'Solar Financing', href: '/services/solar-financing' },
];

interface ServiceRegion {
  id: string;
  name: string;
  hubHref: string;
  hubLabel: string;
  neighborhoods: Array<{ label: string; href: string }>;
}

const SERVICE_REGIONS: ServiceRegion[] = [
  {
    id: 'lagos',
    name: 'Lagos',
    hubHref: '/locations/lagos',
    hubLabel: 'Lagos Solar Energy',
    neighborhoods: [
      { label: 'Lekki', href: '/installers/lagos/lekki' },
      { label: 'Victoria Island', href: '/installers/lagos/victoria-island' },
      { label: 'Ikoyi', href: '/installers/lagos/ikoyi' },
      { label: 'Ikeja', href: '/installers/lagos/ikeja' },
    ],
  },
  {
    id: 'abuja',
    name: 'Abuja',
    hubHref: '/locations/abuja',
    hubLabel: 'Abuja Solar Energy',
    neighborhoods: [
      { label: 'Maitama', href: '/installers/abuja/maitama' },
      { label: 'Wuse', href: '/installers/abuja/wuse' },
      { label: 'Garki', href: '/locations/abuja#districts' },
    ],
  },
  {
    id: 'ogun',
    name: 'Ogun',
    hubHref: '/locations/ogun',
    hubLabel: 'Ogun Solar Energy',
    neighborhoods: [
      { label: 'Ota', href: '/locations/ogun#corridors' },
      { label: 'Sagamu', href: '/locations/ogun#corridors' },
      { label: 'Mowe & Ibafo', href: '/locations/ogun#corridors' },
    ],
  },
];

const FOOTER_RESOURCES = [
  { label: 'Blog', href: '/blog' },
  { label: 'Solar Guides', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Case Studies', href: '/testimonials' },
  { label: 'Solar Calculator', href: '/tools/solar-system-sizing' },
];

const FOOTER_COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/about' },
  { label: 'Partners', href: '/installers' },
  { label: 'Contact', href: '/contact' },
];

const FOOTER_LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/privacy' },
  { label: 'Sustainability', href: '/about' },
];

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
};

const colTitle: React.CSSProperties = {
  fontFamily: 'Manrope, sans-serif',
  fontWeight: 700,
  fontSize: '0.875rem',
  color: '#1a1c1b',
  letterSpacing: '-0.01em',
  marginBottom: '0.25rem',
};

const colLink: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  color: '#707a6c',
  textDecoration: 'none',
  transition: 'color 150ms ease',
  lineHeight: 1.5,
};

export function MarketingFooter() {
  const year = new Date().getFullYear();
  const [expandedRegion, setExpandedRegion] = useState<string | null>('lagos');

  const toggleRegion = (id: string) => {
    setExpandedRegion((prev) => (prev === id ? null : id));
  };

  return (
    <footer
      style={{
        background: '#f4f4f1',
        borderTop: '1px solid rgba(187, 202, 196, 0.2)',
      }}
      aria-label="Site footer"
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Column 1 — Brand */}
          <div style={{ ...col, minWidth: '220px' }}>
            <Link
              href="/"
              style={{ display: 'inline-block', textDecoration: 'none', marginBottom: '0.875rem' }}
              aria-label="Sunlit Energy Home"
            >
              <SunlitLogo variant="horizontal" theme="light" height={30} showTagline={true} />
            </Link>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#707a6c',
                lineHeight: 1.6,
                maxWidth: '240px',
              }}
            >
              Nigeria&apos;s enterprise solar energy marketplace — connecting property owners and
              commercial enterprises with vetted solar installers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {COMPANY_EMAIL && (
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...colLink }}
                >
                  <Mail size={14} />
                  <span>{COMPANY_EMAIL}</span>
                </a>
              )}
              {COMPANY_PHONE && (
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...colLink }}
                >
                  <Phone size={14} />
                  <span>{COMPANY_PHONE}</span>
                </a>
              )}
              {COMPANY_ADDRESS && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...colLink }}>
                  <MapPin size={14} />
                  <span>{COMPANY_ADDRESS}</span>
                </span>
              )}
            </div>
          </div>

          {/* Column 2 — Services */}
          <div style={col}>
            <div style={colTitle}>Services</div>
            {FOOTER_SERVICES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={colLink}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 3 — Structured Service Areas */}
          <div style={{ ...col, minWidth: '200px' }}>
            <div style={colTitle}>Service Areas</div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#8c9588',
                marginBottom: '0.25rem',
              }}
            >
              Active regional coverage across Nigeria
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {SERVICE_REGIONS.map((region) => {
                const isExpanded = expandedRegion === region.id;
                return (
                  <div
                    key={region.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: '10px',
                      padding: '0.625rem 0.75rem',
                      border: '1px solid rgba(187, 202, 196, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleRegion(region.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${region.name} neighborhood service areas`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleRegion(region.id);
                        }
                      }}
                    >
                      <Link
                        href={region.hubHref}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#00490e',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.textDecoration = 'none';
                        }}
                      >
                        {region.hubLabel}
                      </Link>
                      <button
                        type="button"
                        aria-label={`Expand ${region.name} local areas`}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '0.25rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#707a6c',
                        }}
                      >
                        <ChevronDown
                          size={14}
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 150ms cubic-bezier(0.2, 0, 0, 1)',
                          }}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.375rem 0.75rem',
                          marginTop: '0.5rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px dashed rgba(187, 202, 196, 0.4)',
                        }}
                      >
                        {region.neighborhoods.map((n) => (
                          <Link
                            key={n.label}
                            href={n.href}
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                              color: '#556050',
                              textDecoration: 'none',
                              transition: 'color 120ms ease',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = '#00490e';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = '#556050';
                            }}
                          >
                            {n.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Link
              href="/locations"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#00490e',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.textDecoration = 'none';
              }}
            >
              View all service areas <ArrowRight size={13} />
            </Link>
          </div>

          {/* Column 4 — Resources */}
          <div style={col}>
            <div style={colTitle}>Resources</div>
            {FOOTER_RESOURCES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={colLink}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 5 — Company */}
          <div style={col}>
            <div style={colTitle}>Company</div>
            {FOOTER_COMPANY.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={colLink}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 6 — Legal */}
          <div style={col}>
            <div style={colTitle}>Legal</div>
            {FOOTER_LEGAL.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={colLink}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(187, 202, 196, 0.2)',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
            © {year} Sunlit Global Energy Co. Ltd. All rights reserved.
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
              <a
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sunlit Energy on Facebook"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                <FaFacebook size={18} />
              </a>
            )}
            {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
              <a
                href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sunlit Energy on LinkedIn"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                <FaLinkedin size={18} />
              </a>
            )}
            {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sunlit Energy on Instagram"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                <FaInstagram size={18} />
              </a>
            )}
            {process.env.NEXT_PUBLIC_X_URL && (
              <a
                href={process.env.NEXT_PUBLIC_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sunlit Energy on X"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#00490e';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#707a6c';
                }}
              >
                <FaXTwitter size={18} />
              </a>
            )}
            {!process.env.NEXT_PUBLIC_FACEBOOK_URL && !process.env.NEXT_PUBLIC_LINKEDIN_URL && (
              <>
                <a
                  href="#"
                  aria-label="Sunlit Energy on LinkedIn"
                  style={{ color: '#707a6c' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#00490e';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#707a6c';
                  }}
                >
                  <FaLinkedin size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Sunlit Energy on Instagram"
                  style={{ color: '#707a6c' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#00490e';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#707a6c';
                  }}
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Sunlit Energy on X"
                  style={{ color: '#707a6c' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#00490e';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#707a6c';
                  }}
                >
                  <FaXTwitter size={18} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
