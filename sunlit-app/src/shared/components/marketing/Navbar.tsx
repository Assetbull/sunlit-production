'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchServerSession } from '@/shared/auth/client-session';
import { dashboardPathForRole } from '@/shared/auth/sunlit-roles';
import styles from './marketing.module.css';

export function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardHref, setDashboardHref] = useState('/dashboard/project-owner');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await fetchServerSession();
      if (!cancelled && session) {
        setIsAuthenticated(true);
        setDashboardHref(dashboardPathForRole(session.role));
      }
    })();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        Sunlit
      </Link>
      
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
        >
          Home
        </Link>
        <Link 
          href="/services" 
          className={`${styles.link} ${pathname === '/services' ? styles.active : ''}`}
        >
          Services
        </Link>
        <Link 
          href="/about" 
          className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
        >
          About Us
        </Link>
      </div>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <Link href={dashboardHref} className="btn btn-primary">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
