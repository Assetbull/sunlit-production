'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Sun, MapPin, Zap, Coins } from 'lucide-react';
import { fetchDashboardSummary, fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import type { DashboardSummary, RfqListItem } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    open: 'badge--active',
    matched: 'badge--completed',
    closed: 'badge--completed',
    expired: 'badge--pending',
    draft: 'badge--pending',
    bidding: 'badge--active',
    in_progress: 'badge--active',
    completed: 'badge--completed',
    disputed: 'badge--disputed',
  };
  return map[status] || 'badge--pending';
}

export default function DashboardOverview() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [rfqs, setRfqs] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [summaryRes, rfqsRes] = await Promise.all([
        fetchDashboardSummary(),
        fetchRfqs(),
      ]);
      if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
      if (rfqsRes.success && rfqsRes.data) setRfqs(rfqsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className="skeleton skeleton--title" style={{ width: '220px' }} />
          <div className="skeleton skeleton--text" style={{ width: '300px' }} />
        </div>
        <div className="grid grid-cols-4 stagger-children">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton--card animate-in" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className="headline-lg">Dashboard</h1>
        <p className="body-md text-muted">Welcome back. Here&apos;s your project overview.</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className={`grid grid-cols-4 stagger-children ${styles.summaryGrid}`}>
          <div className={`surface-card animate-in ${styles.summaryCard}`}>
            <span className={`label-md ${styles.summaryLabel}`}>Total Projects</span>
            <span className={styles.summaryValue}>{summary.totalProjects}</span>
          </div>
          <div className={`surface-card animate-in ${styles.summaryCard}`}>
            <span className={`label-md ${styles.summaryLabel}`}>Active RFQs</span>
            <span className={`${styles.summaryValue} text-primary`}>{summary.activeRfqs}</span>
          </div>
          <div className={`surface-card animate-in ${styles.summaryCard}`}>
            <span className={`label-md ${styles.summaryLabel}`}>Pending Bids</span>
            <span className={styles.summaryValue}>{summary.pendingBids}</span>
          </div>
          <div className={`surface-card animate-in ${styles.summaryCard}`}>
            <span className={`label-md ${styles.summaryLabel}`}>Escrow Balance</span>
            <span className={`${styles.summaryValue} text-primary`}>{formatCurrency(summary.escrowBalance)}</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.actions}>
        <Link href="/dashboard/project-owner/rfq/new" className="btn btn-primary">
          <Plus size={18} className="mr-2" /> Create New RFQ
        </Link>
      </div>

      {/* RFQ List */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="headline-sm">Your RFQs</h2>
          <span className="body-sm">{rfqs.length} total</span>
        </div>

        {rfqs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Sun size={48} strokeWidth={1.5} className="text-muted" />
            </div>
            <p className="title-md">No RFQs yet</p>
            <p className="body-sm mt-2">Create your first Request for Quotation to start receiving bids from verified installers.</p>
            <Link href="/dashboard/project-owner/rfq/new" className="btn btn-primary mt-4">
              Create RFQ
            </Link>
          </div>
        ) : (
          <div className={`stagger-children ${styles.rfqList}`}>
            {rfqs.map((rfq) => (
              <Link
                key={rfq.id}
                href={`/dashboard/project-owner/bids/${rfq.id}`}
                className={`surface-card animate-in ${styles.rfqCard}`}
              >
                <div className={styles.rfqCardTop}>
                  <h3 className="title-md">{rfq.projectTitle}</h3>
                  <span className={`badge ${getStatusClass(rfq.status)}`}>
                    {rfq.status}
                  </span>
                </div>
                <div className={styles.rfqMeta}>
                  <span className="body-sm flex items-center gap-1 text-muted"><MapPin size={14} /> {rfq.locationCity}, {rfq.locationState}</span>
                  <span className="body-sm flex items-center gap-1 text-muted"><Zap size={14} /> {rfq.systemSizeKw}kW</span>
                  <span className="body-sm flex items-center gap-1 text-muted"><Coins size={14} /> {rfq.budgetMin ? formatCurrency(rfq.budgetMin) : 'TBD'} – {rfq.budgetMax ? formatCurrency(rfq.budgetMax) : 'TBD'}</span>
                </div>
                <div className={styles.rfqCardBottom}>
                  <span className="body-sm text-muted">{rfq.bidsCount} bid{rfq.bidsCount !== 1 ? 's' : ''} received</span>
                  <span className="body-sm text-muted">{new Date(rfq.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
