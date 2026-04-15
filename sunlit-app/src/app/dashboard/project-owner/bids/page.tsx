'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import type { RfqListItem } from '@/dashboards/project-owner/types/dashboard';
import { Plus, FileText, Tags, CheckCircle, Inbox, MapPin, Zap, Coins, Users, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getBidStatusClass(bidsCount: number, status: string): string {
  if (status === 'disputed') return 'badge--disputed';
  if (bidsCount === 0) return 'badge--pending';
  return 'badge--active';
}

export default function BidsOverviewPage() {
  const [rfqs, setRfqs] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'matched' | 'closed'>('all');

  useEffect(() => {
    async function load() {
      const res = await fetchRfqs();
      if (res.success && res.data) setRfqs(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = rfqs.filter((rfq) => {
    if (filter === 'all') return true;
    return rfq.status === filter;
  });

  const totalBids = rfqs.reduce((sum, r) => sum + (r.bidsCount ?? 0), 0);
  const rfqsWithBids = rfqs.filter((r) => (r.bidsCount ?? 0) > 0).length;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className="skeleton skeleton--title" style={{ width: '200px' }} />
          <div className="skeleton skeleton--text" style={{ width: '280px' }} />
        </div>
        <div className={styles.statsRow}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`skeleton skeleton--card ${styles.statSkeleton}`} />
          ))}
        </div>
        <div className="stagger-children">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`skeleton skeleton--card animate-in ${styles.cardSkeleton}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className="headline-lg">Bids Overview</h1>
            <p className="body-md text-muted">Track all bids received across your active projects.</p>
          </div>
          <Link href="/dashboard/project-owner/rfq/new" className="btn btn-primary">
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            New RFQ
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(0, 194, 168, 0.12)' }}>
            <FileText size={20} strokeWidth={2} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <span className="label-md">Total RFQs</span>
            <p className={styles.statValue}>{rfqs.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(157, 66, 36, 0.1)' }}>
            <Tags size={20} strokeWidth={2} color="var(--tertiary)" aria-hidden="true" />
          </div>
          <div>
            <span className="label-md">Total Bids</span>
            <p className={styles.statValue}>{totalBids}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(65, 221, 194, 0.15)' }}>
            <CheckCircle size={20} strokeWidth={2} color="var(--primary-fixed-dim)" aria-hidden="true" />
          </div>
          <div>
            <span className="label-md">RFQs with Bids</span>
            <p className={styles.statValue}>{rfqsWithBids}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterRow} role="tablist" aria-label="Filter bids by status">
        {(['all', 'open', 'matched', 'closed'] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={styles.filterCount}>
              {f === 'all' ? rfqs.length : rfqs.filter((r) => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bids List */}
      {filtered.length === 0 ? (
        <div className="empty-state animate-in">
          <div className="empty-state__icon">
            <Inbox size={48} strokeWidth={1.5} color="var(--outline)" aria-hidden="true" />
          </div>
          <p className="title-md mt-3">No RFQs found</p>
          <p className="body-sm mt-2">
            {filter === 'all' ? 'Create your first RFQ to start receiving bids.' : `No "${filter}" RFQs at the moment.`}
          </p>
          {filter === 'all' && (
            <Link href="/dashboard/project-owner/rfq/new" className="btn btn-primary mt-4">
              Create RFQ
            </Link>
          )}
        </div>
      ) : (
        <div className={`stagger-children ${styles.bidsList}`}>
          {filtered.map((rfq) => (
            <Link
              key={rfq.id}
              href={`/dashboard/project-owner/bids/${rfq.id}`}
              className={`animate-in ${styles.bidCard}`}
              aria-label={`View bids for ${rfq.projectTitle}`}
            >
              {/* Left accent */}
              <div className={styles.bidCardAccent} />

              <div className={styles.bidCardBody}>
                <div className={styles.bidCardTop}>
                  <div>
                    <h2 className="title-md">{rfq.projectTitle}</h2>
                    <div className={styles.rfqMeta}>
                      <span className={styles.metaItem}>
                        <MapPin size={12} strokeWidth={2} aria-hidden="true" className="mr-1" />
                        {rfq.locationCity}, {rfq.locationState}
                      </span>
                      <span className={styles.metaItem}>
                        <Zap size={12} strokeWidth={2} aria-hidden="true" className="mr-1" />
                        {rfq.systemSizeKw}kW
                      </span>
                      <span className={styles.metaItem}>
                        <Coins size={12} strokeWidth={2} aria-hidden="true" className="mr-1" />
                        {rfq.budgetMin ? formatCurrency(rfq.budgetMin) : 'TBD'} – {rfq.budgetMax ? formatCurrency(rfq.budgetMax) : 'TBD'}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${getBidStatusClass(rfq.bidsCount ?? 0, rfq.status)}`}>
                    {rfq.status}
                  </span>
                </div>

                <div className={styles.bidCardBottom}>
                  <div className={styles.bidsCountBadge}>
                    <Users size={14} strokeWidth={2} aria-hidden="true" className="mr-1" />
                    <strong>{rfq.bidsCount ?? 0}</strong> bid{(rfq.bidsCount ?? 0) !== 1 ? 's' : ''} received
                  </div>
                  <div className={styles.viewBids}>
                    View Bids
                    <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
