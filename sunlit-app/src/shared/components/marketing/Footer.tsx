import Link from 'next/link';
import { Sun, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const COMPANY_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Sunlit Energy';
const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? 'hello@sunlit.energy';
const COMPANY_PHONE = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? '';
const COMPANY_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? 'Lagos, Nigeria';

const FOOTER_SERVICES = [
  { label: 'Residential Solar', href: '/services#residential-solar' },
  { label: 'Commercial Solar', href: '/services#commercial-solar' },
  { label: 'Industrial Solar', href: '/services#industrial-solar' },
  { label: 'Battery Storage', href: '/services#battery-storage' },
  { label: 'Solar Maintenance', href: '/services#maintenance' },
  { label: 'Energy Audit', href: '/services#energy-audits' },
  { label: 'EV Charging', href: '/services#ev-charging' },
  { label: 'Solar Financing', href: '/services#solar-financing' },
];

const FOOTER_LOCATIONS = [
  { label: 'Lagos', href: '/locations/lagos' },
  { label: 'Lekki', href: '/locations/lagos' },
  { label: 'Victoria Island', href: '/locations/lagos' },
  { label: 'Ikoyi', href: '/locations/lagos' },
  { label: 'Ikeja', href: '/locations/lagos' },
  { label: 'Abuja', href: '/locations/abuja' },
  { label: 'Ogun', href: '/locations/ogun' },
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
          maxWidth: '1280px', margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Column 1 — Brand */}
          <div style={{ ...col, minWidth: '200px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '0.75rem' }}>
              <span
                style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 107, 92, 0.2)',
                }}
              >
                <Sun size={16} color="#fff" strokeWidth={2.5} />
              </span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1a1c1b' }}>
                {COMPANY_NAME}
              </span>
            </Link>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#707a6c', lineHeight: 1.6, maxWidth: '240px' }}>
              Nigeria&apos;s enterprise solar energy marketplace — connecting homeowners and businesses with trusted professionals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {COMPANY_EMAIL && (
                <a href={`mailto:${COMPANY_EMAIL}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...colLink }}>
                  <Mail size={14} />
                  <span>{COMPANY_EMAIL}</span>
                </a>
              )}
              {COMPANY_PHONE && (
                <a href={`tel:${COMPANY_PHONE}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', ...colLink }}>
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
            {FOOTER_SERVICES.map(item => (
              <Link key={item.label} href={item.href}
                style={colLink}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 3 — Locations */}
          <div style={col}>
            <div style={colTitle}>Locations</div>
            {FOOTER_LOCATIONS.map(item => (
              <Link key={item.label} href={item.href}
                style={colLink}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 4 — Resources */}
          <div style={col}>
            <div style={colTitle}>Resources</div>
            {FOOTER_RESOURCES.map(item => (
              <Link key={item.label} href={item.href}
                style={colLink}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 5 — Company */}
          <div style={col}>
            <div style={colTitle}>Company</div>
            {FOOTER_COMPANY.map(item => (
              <Link key={item.label} href={item.href}
                style={colLink}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Column 6 — Legal */}
          <div style={col}>
            <div style={colTitle}>Legal</div>
            {FOOTER_LEGAL.map(item => (
              <Link key={item.label} href={item.href}
                style={colLink}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
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
            maxWidth: '1280px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1rem',
          }}
        >
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#707a6c' }}>
            © {year} Sunlit Global Energy Co. Ltd. All rights reserved.
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
              <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Sunlit Energy on Facebook"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                <FaFacebook size={18} />
              </a>
            )}
            {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
              <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Sunlit Energy on LinkedIn"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                <FaLinkedin size={18} />
              </a>
            )}
            {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
              <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Sunlit Energy on Instagram"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                <FaInstagram size={18} />
              </a>
            )}
            {process.env.NEXT_PUBLIC_X_URL && (
              <a href={process.env.NEXT_PUBLIC_X_URL} target="_blank" rel="noopener noreferrer" aria-label="Sunlit Energy on X"
                style={{ color: '#707a6c', transition: 'color 150ms ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}
              >
                <FaXTwitter size={18} />
              </a>
            )}
            {/* Always show social placeholders if none configured */}
            {!process.env.NEXT_PUBLIC_FACEBOOK_URL && !process.env.NEXT_PUBLIC_LINKEDIN_URL && (
              <>
                <a href="#" aria-label="Sunlit Energy on LinkedIn" style={{ color: '#707a6c' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}>
                  <FaLinkedin size={18} />
                </a>
                <a href="#" aria-label="Sunlit Energy on Instagram" style={{ color: '#707a6c' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}>
                  <FaInstagram size={18} />
                </a>
                <a href="#" aria-label="Sunlit Energy on X" style={{ color: '#707a6c' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00490e'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#707a6c'; }}>
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
