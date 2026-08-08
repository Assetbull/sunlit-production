'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Sun, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  {
    label: 'Services',
    href: '/services',
    submenu: [
      { label: 'Residential Solar', href: '/services/residential-solar' },
      { label: 'Commercial Solar', href: '/services/commercial-solar' },
      { label: 'Battery Storage', href: '/services/battery-storage' },
      { label: 'Solar Maintenance', href: '/services/maintenance' },
      { label: 'Energy Audit', href: '/services/energy-audit' },
      { label: 'EV Charging', href: '/services/ev-charging' },
    ],
  },
  {
    label: 'Locations',
    href: '/locations',
    submenu: [
      { label: 'Lagos', href: '/locations/lagos' },
      { label: 'Lekki', href: '/locations/lagos/lekki' },
      { label: 'Victoria Island', href: '/locations/lagos/victoria-island' },
      { label: 'Abuja', href: '/locations/abuja' },
      { label: 'Ogun', href: '/locations/ogun' },
    ],
  },
  { label: 'Resources', href: '/resources' },
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
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          background: scrolled ? 'rgba(249, 249, 246, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(191, 202, 186, 0.2)' : 'none',
          boxShadow: scrolled ? '0 4px 24px rgba(0, 0, 0, 0.06)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '72px', gap: '2rem' }}>
            {/* Logo */}
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}
              aria-label="Sunlit Energy Home"
            >
              <span
                style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0, 73, 14, 0.25)',
                }}
              >
                <Sun size={18} color="#fff" strokeWidth={2.5} />
              </span>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#1a1c1b', letterSpacing: '-0.01em' }}>
                Sunlit Energy
              </span>
            </Link>

            {/* Center nav links — desktop */}
            <div
              role="menubar"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }}
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
                    role="menuitem"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '0.5rem 0.875rem',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                      color: '#40493d',
                      textDecoration: 'none',
                      transition: 'all 150ms ease',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,73,14,0.06)'; (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#40493d'; }}
                  >
                    {link.label}
                    {link.submenu && <ChevronDown size={14} />}
                  </Link>

                  {/* Dropdown */}
                  {link.submenu && activeDropdown === link.label && (
                    <div
                      style={{
                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                        marginTop: '8px', minWidth: '200px',
                        background: 'rgba(249, 249, 246, 0.96)',
                        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(191, 202, 186, 0.2)',
                        borderRadius: '12px', padding: '8px',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.10)',
                        zIndex: 100,
                      }}
                      role="menu"
                    >
                      {link.submenu.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          style={{
                            display: 'block', padding: '0.625rem 1rem',
                            borderRadius: '8px', textDecoration: 'none',
                            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#40493d',
                            transition: 'all 150ms ease',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,73,14,0.06)'; (e.currentTarget as HTMLElement).style.color = '#00490e'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#40493d'; }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right CTA — desktop */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="desktop-nav">
              <button
                onClick={onWaitlistOpen}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  color: '#40493d', background: 'transparent', cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,73,14,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                aria-label="Sign in (redirects to waitlist)"
              >
                Login
              </button>
              <button
                onClick={onWaitlistOpen}
                id="nav-get-started-btn"
                style={{
                  padding: '0.5625rem 1.25rem', borderRadius: '9999px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  cursor: 'pointer', transition: 'all 150ms ease',
                  boxShadow: '0 4px 12px rgba(0, 73, 14, 0.25)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 73, 14, 0.35)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 73, 14, 0.25)'; }}
              >
                Get Started
              </button>
            </div>

            {/* Hamburger — mobile */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                marginLeft: 'auto', padding: '0.5rem', borderRadius: '8px', border: 'none',
                background: 'transparent', cursor: 'pointer', color: '#1a1c1b',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: 'rgba(249, 249, 246, 0.98)', backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(191, 202, 186, 0.2)',
              padding: '1rem 1.5rem 1.5rem',
            }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                style={{
                  display: 'block', padding: '0.875rem 0',
                  borderBottom: '1px solid rgba(187, 202, 196, 0.1)',
                  fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500,
                  color: '#1a1c1b', textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => { closeMenu(); onWaitlistOpen(); }}
                style={{
                  width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid rgba(187, 202, 196, 0.3)',
                  fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500,
                  color: '#40493d', background: 'transparent', cursor: 'pointer',
                }}
              >
                Login
              </button>
              <button
                onClick={() => { closeMenu(); onWaitlistOpen(); }}
                style={{
                  width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
                  color: '#fff', background: 'linear-gradient(135deg, #00490e 0%, #0f631b 100%)',
                  cursor: 'pointer',
                }}
              >
                Get Started
              </button>
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
