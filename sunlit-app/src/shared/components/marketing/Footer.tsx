'use client';

import Link from 'next/link';
import styles from './marketing.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerCol}>
          <div className={styles.logo}>Sunlit</div>
          <p className="text-sm text-muted mt-2 max-w-[250px]">
            Verified solar installers. Escrow-secured projects. Faster installs.
          </p>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Quick Links</h4>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/about" className={styles.footerLink}>About Us</Link>
            <Link href="/services" className={styles.footerLink}>Services</Link>
            <Link href="/blog" className={styles.footerLink}>Blog</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <Link href="#waitlist" className={styles.footerLink}>Join Waitlist</Link>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Resources</h4>
          <div className={styles.footerLinks}>
            <Link href="/services" className={styles.footerLink}>Services</Link>
            <Link href="/blog" className={styles.footerLink}>Blog</Link>
            <Link href="/faq" className={styles.footerLink}>FAQ</Link>
            <Link href="/about" className={styles.footerLink}>About Us</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
            <Link href="/testimonials" className={styles.footerLink}>Testimonials</Link>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Company</h4>
          <div className={styles.footerLinks}>
            <Link href="/team" className={styles.footerLink}>Team</Link>
            <Link href="/careers" className={styles.footerLink}>Careers</Link>
            <Link href="/about" className={styles.footerLink}>Locations</Link>
          </div>
        </div>

        <div className={styles.footerCol}>
          <h4 className={styles.footerTitle}>Contact</h4>
          <div className={styles.footerLinks}>
            <span className={styles.footerLink}>Lagos Office</span>
            <span className={styles.footerLink}>Abuja Office</span>
            <span className={styles.footerLink}>hello@sunlit.energy</span>
            <span className={styles.footerLink}>+234 800 SUNLIT</span>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Sunlit Energy Marketplace. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="https://facebook.com" className={styles.footerLink}>Facebook</Link>
          <Link href="https://instagram.com" className={styles.footerLink}>Instagram</Link>
          <Link href="https://linkedin.com" className={styles.footerLink}>LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}
