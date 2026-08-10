'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sun, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  {
    label: 'Services',
    href: '/services',
    submenu: [
      { label: 'All Services', href: '/services' },
      { label: 'Residential Solar', href: '/services#residential' },
      { label: 'Commercial Solar', href: '/services#commercial' },
      { label: 'Battery Storage', href: '/services#battery' },
      { label: 'Solar Maintenance', href: '/services#maintenance' },
      { label: 'Energy Audit', href: '/services#audit' },
      { label: 'EV Charging', href: '/services#ev' },
    ],
  },
  {
    label: 'Locations',
    href: '/locations',
    submenu: [
      { label: 'All Locations (Hub)', href: '/locations' },
      { label: 'Lagos State', href: '/locations/lagos' },
      { label: 'Abuja (FCT)', href: '/locations/abuja' },
      { label: 'Ogun State', href: '/locations/ogun' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    submenu: [
      { label: 'Resource Hub', href: '/resources' },
      { label: 'Frequently Asked Questions', href: '/faq' },
      { label: 'Latest Blog & Insights', href: '/blog' },
      { label: 'Solar Engineering Tools', href: '/tools' },
      { label: 'Solar Cost Calculator', href: '/tools/solar-system-sizing' },
      { label: 'Load Profile Calculator', href: '/tools/load-calculator' },
      { label: 'Battery Capacity Sizing', href: '/tools/battery-capacity' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

interface MarketingNavbarProps {
  onWaitlistOpen: () => void;
}

export function MarketingNavbar({ onWaitlistOpen }: MarketingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, []);

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          position: 'relative',
          width: '100%',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          background: scrolled ? 'rgba(250, 248, 243, 0.96)' : '#faf8f3',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: '1px solid rgba(191, 202, 186, 0.3)',
          boxShadow: scrolled ? '0 4px 24px rgba(0, 73, 14, 0.06)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '72px', gap: '2rem' }}>
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMenu}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}
              aria-label="Sunlit Energy Home"
            >
              <span
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0, 73, 14, 0.25)',
                }}
              >
                <Sun size={19} color="#fff" strokeWidth={2.5} />
              </span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#1a1c1b', letterSpacing: '-0.01em' }}>
                Sunlit Energy
              </span>
            </Link>

            {/* Center nav links — desktop */}
            <div
              role="menubar"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
              className="desktop-nav"
            >
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => link.submenu && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    role="menuitem"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '0.5rem 0.875rem',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', fontWeight: 500,
                      color: activeDropdown === link.label ? '#00490e' : '#40493d',
                      textDecoration: 'none',
                      transition: 'all 150ms ease',
                      background: activeDropdown === link.label ? 'rgba(0,73,14,0.08)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(0,73,14,0.08)';
                      (e.currentTarget as HTMLElement).style.color = '#00490e';
                    }}
                    onMouseLeave={e => {
                      if (activeDropdown !== link.label) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#40493d';
                      }
                    }}
                  >
                    {link.label}
                    {link.submenu && <ChevronDown size={14} style={{ transition: 'transform 200ms ease', transform: activeDropdown === link.label ? 'rotate(180deg)' : 'rotate(0deg)' }} />}
                  </Link>

                  {/* Dropdown with seamless hover bridge */}
                  {link.submenu && activeDropdown === link.label && (
                    <div
                      style={{
                        position: 'absolute', top: '100%', left: '0',
                        paddingTop: '6px',
                        minWidth: '240px',
                        zIndex: 1000,
                      }}
                      role="menu"
                    >
                      <div
                        style={{
                          background: 'rgba(253, 251, 247, 0.98)',
                          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                          border: '1px solid rgba(191, 202, 186, 0.35)',
                          borderRadius: '12px', padding: '8px',
                          boxShadow: '0 16px 40px rgba(0, 73, 14, 0.12)',
                        }}
                      >
                        {link.submenu.map(item => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMenu}
                            role="menuitem"
                            style={{
                              display: 'block', padding: '0.625rem 1rem',
                              borderRadius: '8px', textDecoration: 'none',
                              fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: '#1a1c1b',
                              transition: 'all 150ms ease',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,73,14,0.08)'; (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#1a1c1b'; }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right CTA — desktop */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="desktop-nav">
              <Link
                href="/login"
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  color: '#40493d', background: 'transparent', textDecoration: 'none',
                  transition: 'all 150ms ease', display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,73,14,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                aria-label="Sign in to Sunlit account"
              >
                Login
              </Link>
              <Link
                href="/get-started"
                id="nav-get-started-btn"
                style={{
                  padding: '0.5625rem 1.25rem', borderRadius: '9999px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                  color: '#fff', textDecoration: 'none', display: 'inline-block',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  boxShadow: '0 4px 12px rgba(0, 73, 14, 0.25)',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 73, 14, 0.35)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 73, 14, 0.25)'; }}
              >
                Get Started
              </Link>
            </div>

            {/* Hamburger — mobile */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                marginLeft: 'auto', minWidth: '44px', minHeight: '44px', borderRadius: '8px', border: 'none',
                background: 'transparent', cursor: 'pointer', color: '#1a1c1b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: '#faf8f3', backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(191, 202, 186, 0.3)',
              padding: '1rem 1.5rem 1.5rem',
            }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(link => (
              <div key={link.label} style={{ borderBottom: '1px solid rgba(187, 202, 196, 0.15)', padding: '0.75rem 0' }}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  style={{
                    display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
                    color: '#00490e', textDecoration: 'none', marginBottom: link.submenu ? '0.5rem' : 0,
                  }}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.75rem' }}>
                    {link.submenu.map(subItem => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        onClick={closeMenu}
                        style={{
                          fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                          color: '#40493d', textDecoration: 'none',
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                href="/login"
                onClick={closeMenu}
                style={{
                  width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid rgba(187, 202, 196, 0.3)',
                  fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500, textAlign: 'center',
                  color: '#40493d', background: 'transparent', textDecoration: 'none', display: 'block',
                }}
              >
                Login
              </Link>
              <Link
                href="/get-started"
                onClick={closeMenu}
                style={{
                  width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600, textAlign: 'center',
                  color: '#fff', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  textDecoration: 'none', display: 'block',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 900px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
