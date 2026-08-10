'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { SunlitLogo } from '@/shared/components/brand/SunlitLogo';

const NAV_LINKS = [
  {
    label: 'Services',
    href: '/services',
    submenu: [
      { label: 'All Services Overview', href: '/services' },
      { label: 'Residential Solar (3–15 kVA)', href: '/services/residential-solar' },
      { label: 'Commercial Solar (15–100 kVA)', href: '/services/commercial-solar' },
      { label: 'Industrial Solar (100 kVA – 1MW+)', href: '/services/industrial-solar' },
      { label: 'LiFePO4 Battery Storage', href: '/services/battery-storage' },
      { label: 'Solar Maintenance & Health', href: '/services/maintenance' },
      { label: 'Energy Audits & Load Profiling', href: '/services/energy-audits' },
      { label: 'EV Charging Infrastructure', href: '/services/ev-charging' },
      { label: 'Solar Financing & PPA', href: '/services/solar-financing' },
      { label: 'Live IoT Telemetry', href: '/services/monitoring' },
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
  onWaitlistOpen?: () => void;
}

export function MarketingNavbar({ onWaitlistOpen: _onWaitlistOpen }: MarketingNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileOpenDropdown(null);
  }, []);

  const toggleMobileDropdown = (label: string) => {
    setMobileOpenDropdown(prev => (prev === label ? null : label));
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.75rem 1rem 0 1rem',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
      }}
    >
      {/* Outer Floating Pill Island Shell */}
      <nav
        aria-label="Main navigation"
        style={{
          position: 'relative',
          width: '100%',
          height: '58px',
          borderRadius: '9999px',
          background: scrolled
            ? 'rgba(15, 23, 15, 0.92)'
            : 'rgba(18, 26, 18, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: scrolled
            ? '0 20px 48px -8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)'
            : '0 14px 36px -6px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.04)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.375rem 0.5rem 0.375rem 1.25rem',
          boxSizing: 'border-box',
          zIndex: 1000,
        }}
      >
        {/* Brand / Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          aria-label="Sunlit Energy Home"
        >
          <SunlitLogo variant="horizontal" theme="dark" height={28} />
        </Link>

        {/* Segmented Center Island (Desktop) */}
        <div
          role="menubar"
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '0.25rem 0.375rem',
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.submenu && link.submenu.some(sub => sub.href === pathname));
            const isDropdownOpen = activeDropdown === link.label;

            return (
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isDropdownOpen || isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
                    textDecoration: 'none',
                    transition: 'all 150ms ease',
                    background: isDropdownOpen
                      ? 'rgba(255, 255, 255, 0.14)'
                      : isActive
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.12)';
                    (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    if (activeDropdown !== link.label && !isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.82)';
                    }
                  }}
                >
                  {link.label}
                  {link.submenu && (
                    <ChevronDown
                      size={13}
                      style={{
                        transition: 'transform 200ms ease',
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        opacity: isDropdownOpen ? 1 : 0.7,
                      }}
                    />
                  )}
                </Link>

                {/* Dropdown with seamless hover bridge */}
                {link.submenu && isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      paddingTop: '8px',
                      minWidth: '250px',
                      zIndex: 1100,
                    }}
                    role="menu"
                  >
                    <div
                      style={{
                        background: 'rgba(16, 24, 16, 0.98)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '18px',
                        padding: '6px',
                        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {link.submenu.map(item => {
                        const isSubActive = pathname === item.href;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMenu}
                            role="menuitem"
                            style={{
                              display: 'block',
                              padding: '0.5625rem 0.875rem',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.8125rem',
                              fontWeight: isSubActive ? 600 : 500,
                              color: isSubActive ? '#ceee93' : 'rgba(255, 255, 255, 0.88)',
                              background: isSubActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                              transition: 'all 150ms ease',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                              (e.currentTarget as HTMLElement).style.color = '#ceee93';
                              (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = isSubActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent';
                              (e.currentTarget as HTMLElement).style.color = isSubActive ? '#ceee93' : 'rgba(255, 255, 255, 0.88)';
                              (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                            }}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Action CTAs (Desktop) */}
        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
        >
          <Link
            href="/login"
            style={{
              padding: '0.45rem 0.9375rem',
              borderRadius: '9999px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
              background: 'transparent',
              textDecoration: 'none',
              transition: 'all 150ms ease',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLElement).style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.85)';
            }}
            aria-label="Sign in to Sunlit account"
          >
            Login
          </Link>
          <Link
            href="/get-started"
            id="nav-get-started-btn"
            style={{
              padding: '0.45rem 1.125rem',
              borderRadius: '9999px',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#003006',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: '#ffffff',
              boxShadow: '0 4px 14px rgba(255, 255, 255, 0.18)',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.background = '#eef5e8';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(255, 255, 255, 0.28)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.background = '#ffffff';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(255, 255, 255, 0.18)';
            }}
            aria-label="Get started with Sunlit"
          >
            <span>Get Started</span>
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Hamburger Button (Mobile / Tablet) */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          style={{
            minWidth: '38px',
            minHeight: '38px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 150ms ease',
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Floating Mobile Menu Drawer Card */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          style={{
            marginTop: '0.5rem',
            background: 'rgba(16, 24, 16, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '1.25rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            animation: 'fadeInSlide 200ms ease forwards',
          }}
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          {NAV_LINKS.map(link => (
            <div
              key={link.label}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.625rem 0',
              }}
            >
              {link.submenu ? (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleMobileDropdown(link.label)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '0.25rem 0',
                    }}
                    aria-expanded={mobileOpenDropdown === link.label}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: mobileOpenDropdown === link.label ? 'rotate(180deg)' : 'none',
                        transition: 'transform 200ms ease',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                  </button>
                  {mobileOpenDropdown === link.label && (
                    <div style={{ paddingLeft: '0.75rem', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      {link.submenu.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenu}
                          style={{
                            display: 'block',
                            padding: '0.375rem 0',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: pathname === child.href ? '#ceee93' : 'rgba(255, 255, 255, 0.75)',
                            textDecoration: 'none',
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    padding: '0.25rem 0',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: pathname === link.href ? '#ceee93' : '#ffffff',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}

          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/login"
              onClick={closeMenu}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.06)',
                textDecoration: 'none',
                display: 'block',
                boxSizing: 'border-box',
              }}
            >
              Login
            </Link>
            <Link
              href="/get-started"
              onClick={closeMenu}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '9999px',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
                color: '#003006',
                background: '#ffffff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                boxSizing: 'border-box',
                boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
              }}
            >
              <span>Get Started</span>
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 989px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 990px) {
          .mobile-menu-btn { display: none !important; }
        }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
