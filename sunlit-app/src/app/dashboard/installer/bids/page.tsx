'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  ChevronRight,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Clock,
  FolderOpen,
} from 'lucide-react';
import type { InstallerBid } from '@/dashboards/installer/services/installer-api';
import styles from './page.module.css';

/**
 * My Bids Tracker — Installer Dashboard
 *
 * GEMINI.md §4 step 3-4: Track submitted bids and their status.
 */

const MOCK_BIDS: InstallerBid[] = [
  {
    id: 'bid-001', rfq_id: 'rfq-001', project_title: 'Modernist Villa Solar System',
    amount: 4200000, proposed_timeline_days: 25, proposal_text: 'Full installation with Tier-1 panels...',
    status: 'submitted', budget_min: 3500000, budget_max: 5000000,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'bid-002', rfq_id: 'rfq-002', project_title: 'Tech Hub Commercial Installation',
    amount: 10500000, proposed_timeline_days: 40, proposal_text: 'Commercial-grade system with SCADA...',
    status: 'accepted', budget_min: 8000000, budget_max: 12000000,
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'bid-003', rfq_id: 'rfq-003', project_title: 'Suburban Family Home Solar',
    amount: 2100000, proposed_timeline_days: 18, proposal_text: 'Budget-friendly residential setup...',
    status: 'submitted', budget_min: 1800000, budget_max: 2500000,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'bid-004', rfq_id: 'rfq-005', project_title: 'Lakeside Residence Solar',
    amount: 5500000, proposed_timeline_days: 30, proposal_text: 'Premium installation with monitoring...',
    status: 'rejected', budget_min: 4200000, budget_max: 6000000,
    created_at: new Date(Date.now() - 1209600000).toISOString(),
  },
  {
    id: 'bid-005', rfq_id: 'rfq-004', project_title: 'Office Complex Energy Upgrade',
    amount: 18000000, proposed_timeline_days: 55, proposal_text: 'Large-scale commercial with warranty...',
    status: 'accepted', budget_min: 15000000, budget_max: 22000000,
    created_at: new Date(Date.now() - 2592000000).toISOString(),
  },
  {
    id: 'bid-006', rfq_id: 'rfq-006', project_title: 'Industrial Warehouse Solar Array',
    amount: 28000000, proposed_timeline_days: 80, proposal_text: 'Industrial-grade array system...',
    status: 'submitted', budget_min: 25000000, budget_max: 35000000,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'bid-007', rfq_id: 'rfq-007', project_title: 'Community Center Solar Project',
    amount: 3800000, proposed_timeline_days: 28, proposal_text: 'Community project installation...',
    status: 'withdrawn', budget_min: 3000000, budget_max: 4500000,
    created_at: new Date(Date.now() - 5184000000).toISOString(),
  },
];

const STATUS_CONFIG = {
  submitted: { icon: Clock, color: '#F5A623', bg: 'rgba(245,166,35,0.08)', label: 'Submitted' },
  accepted: { icon: CheckCircle2, color: '#0F631B', bg: 'rgba(15,99,27,0.06)', label: 'Accepted' },
  rejected: { icon: XCircle, color: '#ba1a1a', bg: 'rgba(186,26,26,0.06)', label: 'Rejected' },
  withdrawn: { icon: ArrowLeftRight, color: '#707A6C', bg: 'rgba(112,122,108,0.08)', label: 'Withdrawn' },
};

type FilterTab = 'all' | 'submitted' | 'accepted' | 'rejected' | 'withdrawn';

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function MyBidsPage() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const bids = MOCK_BIDS;

  const filtered = filter === 'all' ? bids : bids.filter((b) => b.status === filter);

  const counts: Record<FilterTab, number> = {
    all: bids.length,
    submitted: bids.filter((b) => b.status === 'submitted').length,
    accepted: bids.filter((b) => b.status === 'accepted').length,
    rejected: bids.filter((b) => b.status === 'rejected').length,
    withdrawn: bids.filter((b) => b.status === 'withdrawn').length,
  };

  const totalBids = bids.length;
  const winRate = totalBids > 0 ? Math.round((counts.accepted / totalBids) * 100) : 0;
  const avgBid = totalBids > 0 ? bids.reduce((sum, b) => sum + b.amount, 0) / totalBids : 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <ArrowLeftRight size={12} /> My Bids
        </div>
        <h1 className={styles.title}>My Bids</h1>
        <p className={styles.subtitle}>Track your proposals across all projects.</p>
      </header>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: '#0F631B' }}>{winRate}%</span>
          <span className={styles.statLabel}>Win Rate</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatCurrency(avgBid)}</span>
          <span className={styles.statLabel}>Average Bid</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalBids}</span>
          <span className={styles.statLabel}>Total Submitted</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {(['all', 'submitted', 'accepted', 'rejected', 'withdrawn'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            className={`${styles.filterTab} ${filter === tab ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={styles.filterCount}>{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Bid List */}
      {filtered.length > 0 ? (
        <div className={styles.bidList}>
          {filtered.map((bid) => {
            const config = STATUS_CONFIG[bid.status];
            const Icon = config.icon;
            return (
              <div key={bid.id} className={styles.bidCard}>
                <div className={styles.bidCardMain}>
                  <div>
                    <h3 className={styles.bidProject}>{bid.project_title}</h3>
                    <div className={styles.bidMeta}>
                      <span>Submitted {formatDate(bid.created_at)}</span>
                      {bid.proposed_timeline_days && <span>• {bid.proposed_timeline_days} days</span>}
                      <span>• Budget: {formatCurrency(bid.budget_min || 0)} — {formatCurrency(bid.budget_max || 0)}</span>
                    </div>
                  </div>
                  <div className={styles.bidAmountSection}>
                    <span className={styles.bidAmount} style={{
                      color: bid.status === 'accepted' ? '#0F631B' :
                             bid.status === 'rejected' ? '#ba1a1a' : '#1A1C1C',
                    }}>
                      {formatCurrency(bid.amount)}
                    </span>
                    <span className={styles.bidStatusBadge} style={{ background: config.bg, color: config.color }}>
                      <Icon size={12} /> {config.label}
                    </span>
                  </div>
                </div>
                <div className={styles.bidCardActions}>
                  <Link
                    href={`/dashboard/installer/marketplace/${bid.rfq_id}`}
                    className={styles.bidAction}
                  >
                    View Project <ChevronRight size={14} />
                  </Link>
                  {bid.status === 'submitted' && (
                    <button className={styles.bidActionWarn}>
                      Withdraw Bid
                    </button>
                  )}
                  {bid.status === 'accepted' && (
                    <Link
                      href={`/dashboard/installer/projects/${bid.rfq_id}`}
                      className={styles.bidActionPrimary}
                    >
                      Go to Project <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FolderOpen size={48} style={{ color: '#BFCABA' }} />
          <h3 className={styles.emptyTitle}>No bids found</h3>
          <p className={styles.emptyDesc}>
            {filter !== 'all'
              ? `No ${filter} bids. Try a different filter.`
              : 'Start browsing the marketplace to submit your first bid.'}
          </p>
          <Link
            href="/dashboard/installer/marketplace"
            className={styles.emptyCta}
          >
            Browse Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
