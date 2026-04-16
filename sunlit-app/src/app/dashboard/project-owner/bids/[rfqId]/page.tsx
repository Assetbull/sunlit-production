'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Bolt, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import { fetchBidsForRfq, acceptBid } from '@/dashboards/project-owner/services/project-owner-api';
import type { BidComparisonItem } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
}

export default function BidsPage({ params }: { params: Promise<{ rfqId: string }> }) {
  const { rfqId } = use(params);
  const router = useRouter();
  const [bids, setBids] = useState<BidComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  async function handleAcceptBid(bidId: string) {
    setAccepting(bidId);
    const res = await acceptBid(rfqId, bidId);
    if (res.success) {
      setAccepted(true);
      setTimeout(() => {
        router.push(`/dashboard/project-owner/projects/${rfqId}/escrow-funding`);
      }, 1500);
    }
    setAccepting(null);
  }

  const comparisonBids = bids.slice(0, 2);
  const otherBids = bids.slice(2);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="skeleton-h1 h-12 w-1/3 mb-4" />
        <div className="skeleton h-96 w-full rounded-[40px]" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/dashboard/project-owner" className="flex items-center gap-2 text-primary font-bold mb-4 hover:translate-x-[-4px] transition-transform">
          <ChevronLeft size={20} /> Back to Command Center
        </Link>
        <h1 className="text-5xl font-extrabold font-headline text-slate-950 tracking-tight leading-tight">
          Bids & <span className="text-primary">Comparison</span>
        </h1>
        <p className="text-slate-500 text-xl max-w-2xl mt-4 leading-relaxed">
          Review your high-performance energy proposals. Our concierge algorithm has curated these options based on your efficiency profile.
        </p>
      </header>

      {accepted && (
        <div className="fixed top-24 right-8 z-50 animate-in">
          <div className="glass-card bg-emerald-50 border-emerald-200 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
            <CheckCircle className="text-primary" />
            <p className="font-bold text-emerald-900">Bid accepted! Initializing Escrow...</p>
          </div>
        </div>
      )}

      {/* Comparison Ledger */}
      <section className={styles.comparisonLedger}>
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <span className="text-primary font-label text-[10px] font-extrabold tracking-[0.25em] uppercase px-3 py-1 bg-primary/5 rounded-full">
              Marketplace Analysis
            </span>
            <h2 className="text-4xl font-extrabold font-headline text-slate-900 tracking-tight">Top Tier Contrast</h2>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-slate-900 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100">
              <ChevronLeft size={20} />
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-slate-900 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className={styles.ledgerGrid}>
          <div className={styles.labelsColumn}>
            <div className={styles.labelItem}>SunlitScore</div>
            <div className={styles.labelItem}>Inverter</div>
            <div className={styles.labelItem}>Battery</div>
            <div className={styles.labelItem}>Panels</div>
            <div className={styles.labelItem}>Warranty</div>
            <div className={styles.labelItem}>Total Cost</div>
          </div>

          {comparisonBids.map((bid, i) => (
            <div key={bid.id} className={`${styles.bidColumn} ${i === 0 ? styles.bidColumnFeatured : ''}`}>
              <div className={styles.bidHeader}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-2xl font-extrabold font-headline text-slate-900">{bid.installerName}</h3>
                </div>
                {i === 0 && <span className={styles.bestValueBadge}>Best Value</span>}
              </div>

              <div className="space-y-[1.75rem]">
                <div className="flex md:block justify-between items-center py-2">
                  <span className="md:hidden text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">SunlitScore</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold font-headline ${i === 0 ? 'text-primary' : 'text-slate-900'}`}>
                      {bid.sunlitScore}
                    </span>
                    <span className="text-slate-400 font-bold text-sm">/100</span>
                  </div>
                </div>

                <div className={styles.statItem}>
                  <span className="md:hidden text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Inverter</span>
                  <span className="font-bold text-slate-800">Luma Core X Gen 4</span>
                </div>
                <div className={styles.statItem}>
                  <span className="md:hidden text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Battery</span>
                  <span className="font-bold text-slate-800">15kWh IonStream</span>
                </div>
                <div className={styles.statItem}>
                  <span className="md:hidden text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Panels</span>
                  <span className="font-bold text-slate-800">24x Mono Peric</span>
                </div>
                <div className={styles.statItem}>
                  <span className="md:hidden text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Warranty</span>
                  <span className="font-bold text-slate-800">25 Year Limited</span>
                </div>

                <div className={styles.priceSection}>
                  <span className="md:hidden text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Cost</span>
                  <div className="text-3xl font-extrabold font-headline text-slate-900 tracking-tighter">
                    {formatCurrency(bid.amount)}
                  </div>
                  <div className="text-primary font-bold text-[10px] mt-1 uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp size={12} /> Est. 3.8yr Payback
                  </div>
                </div>

                <button 
                  className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all shadow-lg active:scale-95 ${i === 0 ? 'cta-gradient text-white shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-900'}`}
                  onClick={() => handleAcceptBid(bid.id)}
                  disabled={!!accepting || accepted}
                >
                  {accepting === bid.id ? 'Securing Contract...' : `Select ${bid.installerName}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other Proposals */}
      <section className="mt-20">
        <h3 className="text-2xl font-extrabold font-headline text-slate-950 mb-8 flex items-center gap-3">
          Other Pending Proposals
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </h3>
        <div className={styles.bidList}>
          {otherBids.map(bid => (
            <div key={bid.id} className={styles.smallBidCard} onClick={() => handleAcceptBid(bid.id)}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-extrabold text-xl text-slate-900">{bid.installerName}</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <Star size={14} fill="var(--primary)" className="text-primary" />
                    <span className="text-xs font-bold text-slate-500">{bid.installerRating?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-extrabold text-2xl tracking-tighter">{bid.sunlitScore}</div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Score</span>
                </div>
              </div>
              <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                <div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Estimate</div>
                  <div className="text-2xl font-extrabold font-headline text-slate-900">{formatCurrency(bid.amount)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Duration</div>
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Clock size={14} />
                    {bid.proposedTimelineDays} Days
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary hover:bg-emerald-50 transition-all">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 transition-transform shadow-sm border border-slate-100 group-hover:scale-110">
              <Bolt className="text-primary" />
            </div>
            <span className="text-slate-900 font-extrabold text-sm uppercase tracking-wide">Request New Bid</span>
            <p className="text-slate-400 text-xs mt-2 font-medium">Outreach to 5+ verified installers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
