'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, PlusCircle, ArrowLeftRight, Flag, Menu, Bell, Sun } from 'lucide-react';
import styles from './layout.module.css';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard/project-owner', icon: <LayoutDashboard size={20} /> },
  { label: 'My Projects', href: '/dashboard/project-owner/projects', icon: <FolderKanban size={20} /> },
  { label: 'Create RFQ', href: '/dashboard/project-owner/rfq/new', icon: <PlusCircle size={20} /> },
  { label: 'Bids', href: '/dashboard/project-owner/bids', icon: <ArrowLeftRight size={20} /> },
  { label: 'Disputes', href: '/dashboard/project-owner/disputes', icon: <Flag size={20} /> },
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
            <span className={styles.logoIcon}>
              <Sun size={24} strokeWidth={2} className="text-primary" />
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
            <div className="w-12 h-12 rounded-xl overflow-hidden glass-card p-0.5 border border-white/20">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-sZxUQXg8Fpx_-C0grjEAW3dKtZhdjU_RxOgkPdKxvfSRYQDcBOF6LMqhSMUJCNlMnU--2NGx3rONplD9M8SUXgJetqMIttyU3dBGBytltznoG95FQZjRSfFObhC3ZsFqb_QugZhFAnTszwEktxj6RqoDsEt7xYxeAXrdyGkVhUQNXl7A71tk6mbrpUxWp1SERX7EewuKpE5uYWhNmsVBlih5tIyUhjsFbinU_MPXHLnnhGmyymiNpziqMR2IZ9HaR21myi88yiaS" 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className={styles.userInfo}>
              <h3 className="font-headline text-emerald-900 font-bold text-sm">Project Owner</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Platinum Tier</p>
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
            <span className={styles.menuIcon}><Menu size={24} /></span>
          </button>
          <div className={styles.topbarRight}>
            <div className={styles.notifBtn} role="button" aria-label="Notifications" tabIndex={0}>
              <Bell size={20} />
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
