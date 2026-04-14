'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { fetchBidsForRfq, acceptBid } from '@/dashboards/project-owner/services/project-owner-api';
import type { BidComparisonItem } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

export default function BidsPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = use(params);
  const [bids, setBids] = useState<BidComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'amount' | 'sunlitScore' | 'proposedTimelineDays'>('sunlitScore');
  const [accepting, setAccepting] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchBidsForRfq(rfqId);
      if (res.success && res.data) setBids(res.data);
      setLoading(false);
    }
    load();
  }, [rfqId]);

  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'sunlitScore') return (b.sunlitScore ?? 0) - (a.sunlitScore ?? 0);
    if (sortBy === 'amount') return a.amount - b.amount;
    return (a.proposedTimelineDays ?? 999) - (b.proposedTimelineDays ?? 999);
  });

  async function handleAcceptBid(bidId: string) {
    setAccepting(bidId);
    const res = await acceptBid(bidId);
    if (res.success) {
      setAccepted(true);
    }
    setAccepting(null);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--card" style={{ height: 300 }} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">← Back</Link>
        <h1 className="headline-lg">Compare Bids</h1>
        <p className="body-md text-muted">Review and select the best installer for your project.</p>
      </div>

      {accepted && (
        <div className="toast toast--success" role="status">
          ✓ Bid accepted! Contract generation in progress.
        </div>
      )}

      {/* Sort Controls */}
      <div className={styles.controls}>
        <span className="label-md">Sort by:</span>
        <div className={styles.sortBtns}>
          {[
            { key: 'sunlitScore' as const, label: 'SunlitScore' },
            { key: 'amount' as const, label: 'Price' },
            { key: 'proposedTimelineDays' as const, label: 'Timeline' },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`btn btn-sm ${sortBy === opt.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSortBy(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bid Cards */}
      {sortedBids.length === 0 ? (
        <div className="empty-state">
          <p className="title-md">No bids received yet</p>
          <p className="body-sm mt-2">Installers will be notified about your RFQ. Bids usually arrive within 24-48 hours.</p>
        </div>
      ) : (
        <div className={`stagger-children ${styles.bidList}`}>
          {sortedBids.map((bid, i) => (
            <div key={bid.id} className={`surface-card animate-in ${styles.bidCard}`}>
              <div className={styles.bidHeader}>
                <div>
                  <h3 className="title-lg">{bid.installerName}</h3>
                  <div className={styles.bidMeta}>
                    <span className="body-sm">⭐ {bid.installerRating?.toFixed(1)}</span>
                    <span className={`${styles.scoreChip}`}>
                      Score: {bid.sunlitScore}
                    </span>
                  </div>
                </div>
                {i === 0 && sortBy === 'sunlitScore' && (
                  <span className={styles.bestBadge}>Best Match</span>
                )}
              </div>

              <div className={styles.bidStats}>
                <div className={styles.bidStat}>
                  <span className="label-md">Price</span>
                  <span className="headline-sm">{formatCurrency(bid.amount)}</span>
                </div>
                <div className={styles.bidStat}>
                  <span className="label-md">Timeline</span>
                  <span className="headline-sm">{bid.proposedTimelineDays} days</span>
                </div>
              </div>

              <div className={styles.bidProposal}>
                <span className="label-md">Proposal</span>
                <p className="body-md mt-2">{bid.proposalText}</p>
              </div>

              <div className={styles.bidActions}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAcceptBid(bid.id)}
                  disabled={!!accepting || accepted}
                  aria-busy={accepting === bid.id}
                >
                  {accepting === bid.id ? 'Accepting...' : 'Accept Bid'}
                </button>
                <button className="btn btn-ghost">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
