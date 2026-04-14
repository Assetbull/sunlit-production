'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// UserButton will be restored when Clerk keys are configured
// import { UserButton } from '@clerk/nextjs';
import styles from './layout.module.css';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard/project-owner', icon: '⊞' },
  { label: 'My Projects', href: '/dashboard/project-owner/projects', icon: '☀' },
  { label: 'Create RFQ', href: '/dashboard/project-owner/rfq/new', icon: '＋' },
  { label: 'Bids', href: '/dashboard/project-owner/bids', icon: '⇄' },
  { label: 'Disputes', href: '/dashboard/project-owner/disputes/new', icon: '⚑' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
        role="navigation"
        aria-label="Dashboard navigation"
      >
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard/project-owner" className={styles.logo}>
            <span className={styles.logoIcon}>☀</span>
            <span className={styles.logoText}>Sunlit Energy</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard/project-owner'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userSection}>
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--cta-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.875rem',
              }}
              aria-label="User avatar"
            >
              PO
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userRole}>Project Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar} role="banner">
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={sidebarOpen}
          >
            <span className={styles.menuIcon}>☰</span>
          </button>
          <div className={styles.topbarRight}>
            <div className={styles.notifBtn} role="button" aria-label="Notifications" tabIndex={0}>
              🔔
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content} role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
