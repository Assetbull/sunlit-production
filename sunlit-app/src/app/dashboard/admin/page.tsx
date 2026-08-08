'use client';

import { Shield, Users, FolderKanban, Flag, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdminDashboardOverview() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-primary" />
            <span className="label-sm uppercase tracking-widest text-primary font-bold">System Admin</span>
        </div>
        <h1 className={styles.title}>Global Command Center</h1>
        <p className={styles.subtitle}>
          Monitor system health, resolve disputes, and manage Sunlit Marketplace operations.
        </p>
      </header>

      <main className={styles.mainLayout}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in">
          
          <div className="bg-surface-2 border border-surface-3 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="label-sm text-muted font-bold uppercase tracking-wider">Total Users</span>
              <Users size={20} className="text-primary" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="headline-lg font-bold">1,248</p>
                <p className="text-sm text-green-600 font-bold mt-1">+12 this week</p>
              </div>
              <Link href="/dashboard/admin/users" className="text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors">
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>

          <div className="bg-surface-2 border border-surface-3 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="label-sm text-muted font-bold uppercase tracking-wider">Active Projects</span>
              <FolderKanban size={20} className="text-primary" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="headline-lg font-bold">156</p>
                <p className="text-sm text-green-600 font-bold mt-1">+8 this week</p>
              </div>
              <Link href="/dashboard/admin/projects" className="text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors">
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>

          <div className="bg-surface-2 border border-surface-3 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="label-sm text-muted font-bold uppercase tracking-wider">Escrow Balance</span>
              <Shield size={20} className="text-primary" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="headline-lg font-bold">₦450.2M</p>
                <p className="text-sm text-muted font-bold mt-1">Platform Held</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="label-sm text-red-600 font-bold uppercase tracking-wider">Active Disputes</span>
              <Flag size={20} className="text-red-500" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="headline-lg font-bold text-red-600">3</p>
                <p className="text-sm text-red-500 font-bold mt-1">Requires Attention</p>
              </div>
              <Link href="/dashboard/admin/disputes" className="text-red-600 hover:bg-red-100 p-2 rounded-xl transition-colors">
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 animate-in" style={{ animationDelay: '100ms' }}>
          
          <section className="bg-surface-2 border border-surface-3 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="title-md font-bold font-headline">Recent System Alerts</h3>
              <Link href="/dashboard/admin/settings" className="text-sm font-bold text-primary hover:underline">View All logs</Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-surface-3 transition-colors border border-transparent hover:border-surface-3">
                   <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                     <AlertTriangle size={18} />
                   </div>
                   <div>
                     <p className="body-sm font-bold text-foreground">Failed Webhook Retry</p>
                     <p className="text-xs text-muted mt-1">Paystack event transfer.failed delayed. Auto-retried successfully.</p>
                     <p className="text-xs text-muted font-bold mt-2">{i * 2} hours ago</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-2 border border-surface-3 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="title-md font-bold font-headline">Pending KYC Approvals</h3>
              <Link href="/dashboard/admin/users" className="text-sm font-bold text-primary hover:underline">Manage Queue</Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 items-center p-4 rounded-xl border border-surface-3">
                   <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center shrink-0 font-bold text-sm">
                     I
                   </div>
                   <div className="flex-1">
                     <p className="body-sm font-bold text-foreground">SolarGen Contractors Ltd</p>
                     <p className="text-xs text-muted mt-1">Installer Application • Submitted 2 days ago</p>
                   </div>
                   <button className="btn btn-secondary px-4 py-2 text-sm">Review</button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
