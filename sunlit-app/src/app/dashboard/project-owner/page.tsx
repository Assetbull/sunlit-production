'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Sun, MapPin, Zap, Coins, ShieldAlert } from 'lucide-react';
import { fetchDashboardSummary, fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from './components/KYCModal';
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
  const [isKycVerified, setIsKycVerified] = useState(false); // Mock KYC status
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

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

      {/* KYC Alert Banner */}
      {!isKycVerified && (
        <div className="surface-card bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 animate-in slide-in-from-top">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-amber-500" size={24} />
              <div>
                <p className="title-sm text-amber-900">Identity Verification Required</p>
                <p className="body-sm text-amber-700">Please verify your identity to unlock all marketplace features and secure your escrow payments.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsKycModalOpen(true)}
              className="btn btn-primary btn-sm whitespace-nowrap"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}

      <KYCModal 
        isOpen={isKycModalOpen} 
        onClose={() => setIsKycModalOpen(false)} 
        onSuccess={() => setIsKycVerified(true)} 
      />

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
        <button 
          onClick={() => isKycVerified ? window.location.href = '/dashboard/project-owner/rfq/new' : setIsKycModalOpen(true)} 
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-2" /> Create New RFQ
        </button>
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
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children ${styles.rfqList}`}>
            {rfqs.map((rfq) => (
              <Link
                key={rfq.id}
                href={`/dashboard/project-owner/bids/${rfq.id}`}
                className={`surface-card animate-in border-t-4 ${
                  rfq.status === 'open' ? 'border-primary' : 
                  rfq.status === 'matched' ? 'border-green-500' : 'border-neutral-300'
                } hover:shadow-xl hover:translate-y-[-4px] transition-all p-6 group`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="title-md group-hover:text-primary transition-colors">{rfq.projectTitle}</h3>
                    <p className="label-sm text-muted">ID: {rfq.id}</p>
                  </div>
                  <span className={`badge ${getStatusClass(rfq.status)}`}>
                    {rfq.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin size={16} className="text-primary/60" />
                    <span className="body-sm">{rfq.locationCity}, {rfq.locationState}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Zap size={16} className="text-primary/60" />
                    <span className="body-sm font-bold text-foreground">{rfq.systemSizeKw}kW System</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Coins size={16} className="text-primary/60" />
                    <span className="body-sm">{formatCurrency(rfq.budgetMin)} – {formatCurrency(rfq.budgetMax)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="label-xs text-muted uppercase tracking-tighter">Bids Received</span>
                    <span className="title-sm text-primary">{rfq.bidsCount} Offers</span>
                  </div>
                  <div className="text-right">
                    <span className="label-xs text-muted">Posted On</span>
                    <span className="body-xs block">{new Date(rfq.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
