'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './marketing.module.css';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
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
        <Link href="/login" className="btn btn-outline">
          Login
        </Link>
        <Link href="/register" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
