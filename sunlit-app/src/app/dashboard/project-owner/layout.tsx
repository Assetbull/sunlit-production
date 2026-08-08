'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Bell, Sun, LogOut } from 'lucide-react';
import { logoutClient } from '@/shared/auth/client-session';
import { DashboardErrorBoundary } from '@/shared/components/DashboardErrorBoundary';
import { getNavigation } from '@/core/rbac/nav-bridge';
import { getSession } from '@/shared/session/sessionManager';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = getSession();
  const role = session?.role;

  // STRICT ROLE ENFORCEMENT
  useEffect(() => {
    if (role !== 'project_owner') {
      router.push(role === 'installer' ? '/dashboard/installer' : '/login');
    }
  }, [role, router]);

  if (role !== 'project_owner') {
    return null; // Prevent flicker before redirect
  }

  const NAV_ITEMS = getNavigation(role);

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
            <span className={styles.logoIcon}>
              <Sun size={20} strokeWidth={2.5} />
            </span>
            <span className={styles.logoText}>Sunlit Energy</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard/project-owner'
                ? pathname === item.href
                : pathname.startsWith(item.href);
            
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={styles.navIcon}><Icon size={20} /></span>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userSection}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #0F631B, #2F7D32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '0.8125rem', fontWeight: 800,
              flexShrink: 0,
            }}>
              {session?.email?.[0]?.toUpperCase() ?? 'PO'}
            </div>
            <div className={styles.userInfo}>
              <h3>{session?.email?.split('@')[0] ?? 'Project Owner'}</h3>
              <p>Homeowner / Business</p>
            </div>
          </div>
          
          <button 
            onClick={() => logoutClient()}
            style={{
              width: '100%', marginTop: 10,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', fontSize: '0.8125rem', fontWeight: 600,
              color: '#ba1a1a', background: 'none', border: 'none',
              borderRadius: 10, cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(186,26,26,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
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
            <span className={styles.menuIcon}><Menu size={22} /></span>
          </button>
          <div className={styles.topbarRight}>
            <div className={styles.notifBtn} role="button" aria-label="Notifications" tabIndex={0}>
              <Bell size={18} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content} role="main">
          <DashboardErrorBoundary>
            {children}
          </DashboardErrorBoundary>
        </main>
      </div>
    </div>
  );
}
