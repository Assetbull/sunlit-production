'use client';

import Link from 'next/link';
import type { BidCompareCardProps, CompareBidsProps } from './types';

// ── Bid Comparison Card (exact Stitch liquid-glass-darker column style) ──────
function BidCompareCard({ bid, rfqId, onReject, isRecommended }: { bid: BidCompareCardProps; rfqId: string; onReject?: (bidId: string) => void; isRecommended?: boolean }) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

  return (
    <div className={`
      ${isRecommended ? 'liquid-glass-darker' : ''}
      rounded-[2rem] p-8 group transition-all duration-500 hover:-translate-y-1 relative overflow-hidden
      ${!isRecommended ? 'hover:bg-white/40 border border-transparent hover:border-white/60' : ''}
    `}>
      {/* Header */}
      <div className="h-28 flex flex-col justify-start mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            isRecommended
              ? 'bg-emerald-50 border-emerald-100/50 text-primary'
              : 'bg-surface-container border-outline-variant/20 text-secondary'
          } text-2xl font-bold font-headline`}>
            {bid.installerName?.[0] ?? 'I'}
          </div>
          <div>
            <h3 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">
              {bid.installerName ?? 'Installer'}
            </h3>
            {bid.installerCompany && (
              <p className="text-on-surface-variant text-xs font-semibold opacity-70">{bid.installerCompany}</p>
            )}
          </div>
        </div>
        {isRecommended ? (
          <span className="badge-glow bg-primary text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] w-fit">
            Best Value
          </span>
        ) : (
          <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] w-fit">
            Under Review
          </span>
        )}
      </div>

      {/* Specs Matrix */}
      <div className="space-y-12">
        {/* SunlitScore */}
        <div className="flex md:block justify-between items-center">
          <span className="md:hidden text-on-surface-variant font-label text-[10px] font-extrabold tracking-widest uppercase">
            SunlitScore
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-headline font-extrabold text-primary">
              {bid.sunlitScore ?? 88}
            </span>
            <span className="text-on-surface-variant font-body font-bold text-sm">/100</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex md:block justify-between items-center border-t border-white/40 md:border-none pt-4 md:pt-0">
          <span className="md:hidden text-on-surface-variant font-label text-[10px] font-extrabold tracking-widest uppercase">
            Timeline
          </span>
          <div className="text-on-surface font-body font-bold text-sm md:text-base">
            {bid.completionDays ? `${bid.completionDays} Days` : '14–21 Days'}
          </div>
        </div>

        {/* Warranty */}
        <div className="flex md:block justify-between items-center border-t border-white/40 md:border-none pt-4 md:pt-0">
          <span className="md:hidden text-on-surface-variant font-label text-[10px] font-extrabold tracking-widest uppercase">
            Warranty
          </span>
          <div className="text-on-surface font-body font-bold text-sm md:text-base">
            {bid.warrantyYears ? `${bid.warrantyYears} Year Guarantee` : '5 Year Standard'}
          </div>
        </div>

        {/* Total Cost */}
        <div className="pt-8 border-t border-outline-variant/30 flex md:block justify-between items-end">
          <span className="md:hidden text-on-surface-variant font-label text-[10px] font-extrabold tracking-widest uppercase">
            Total Cost
          </span>
          <div>
            <div className="text-3xl font-headline font-extrabold text-on-surface tracking-tighter">
              {formatCurrency(bid.totalAmount)}
            </div>
            <div className={`font-semibold text-[10px] mt-1 uppercase tracking-widest ${
              isRecommended ? 'text-primary' : 'text-on-surface-variant'
            }`}>
              Incl. installation & VAT
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href={`/dashboard/project-owner/bids/${rfqId}/${bid.id}`}
            className={`w-full py-4 rounded-full font-extrabold tracking-tight text-sm text-center transition-all active:scale-95 shadow-lg hover:brightness-105 ${
              isRecommended
                ? 'cta-gradient text-white cta-glow'
                : 'bg-white/60 backdrop-blur-md border border-white/60 text-on-surface hover:bg-white'
            }`}
          >
            View Full Proposal
          </Link>
          {onReject && (
            <button
              onClick={() => onReject(bid.id)}
              className="w-full py-3 rounded-full font-semibold tracking-tight text-sm text-on-surface-variant border border-outline-variant/30 hover:bg-error/5 hover:border-error/30 hover:text-error transition-all active:scale-95"
            >
              Decline Proposal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Additional Bid Card (smaller card style from bids.html) ──────────────────
function BidMiniCard({ bid, rfqId, onReject }: { bid: BidCompareCardProps; rfqId: string; onReject?: (bidId: string) => void }) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="liquid-glass rounded-[2rem] p-7 group cursor-pointer hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h4 className="font-headline font-extrabold text-xl text-on-surface tracking-tight">
            {bid.installerName ?? 'Installer'}
          </h4>
          {bid.installerCompany && (
            <p className="text-on-surface-variant text-xs font-semibold mt-1 opacity-70">
              {bid.installerCompany}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-primary font-headline font-extrabold text-2xl tracking-tighter">
            {bid.sunlitScore ?? 85}
          </span>
          <span className="text-[9px] font-label font-extrabold text-on-surface-variant uppercase tracking-widest">
            Score
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-on-surface-variant text-[9px] font-extrabold uppercase tracking-widest mb-1 opacity-60">
            Estimate
          </div>
          <div className="text-2xl font-headline font-extrabold text-on-surface tracking-tighter">
            {formatCurrency(bid.totalAmount)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-on-surface-variant text-[9px] font-extrabold uppercase tracking-widest mb-1 opacity-60">
            Duration
          </div>
          <div className="text-on-surface font-body font-bold">
            {bid.completionDays ? `${bid.completionDays} Days` : '—'}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/project-owner/bids/${rfqId}/${bid.id}`}
          className="flex-1 py-3 rounded-full cta-gradient text-white font-extrabold text-xs text-center cta-glow hover:brightness-105 transition-all"
        >
          View Proposal
        </Link>
        {onReject && (
          <button
            onClick={() => onReject(bid.id)}
            className="px-4 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-error/30 hover:text-error transition-all text-xs font-semibold"
          >
            Decline
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main CompareBids Component ───────────────────────────────────────────────
export function CompareBids({ rfqId, bids, onReject }: CompareBidsProps) {
  if (!bids || bids.length === 0) {
    return (
      <div className="liquid-glass rounded-[2rem] p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-6 text-3xl">
          📋
        </div>
        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Bids Yet</h3>
        <p className="text-on-surface-variant text-sm">
          Your RFQ has been broadcast. Verified installers are preparing their proposals.
        </p>
      </div>
    );
  }

  // Top 2 bids go into the full comparison matrix
  const topBids = bids.slice(0, 2);
  // Remaining bids go into the mini cards
  const remainingBids = bids.slice(2);

  return (
    <div>
      {/* ── HEADER ── */}
      <section className="mb-12">
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-background mb-5 tracking-tight leading-[1.1]">
          Bids & <span className="text-primary">Comparison</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed font-medium opacity-90">
          Review your high-performance energy proposals. Our algorithm has curated these options based on your efficiency profile and sustainability targets.
        </p>
      </section>

      {/* ── TOP COMPARISON MATRIX ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        <div className="lg:col-span-12 bg-surface-container-low rounded-[2.5rem] p-1 overflow-hidden shadow-sm">
          <div className="liquid-glass rounded-[2.4rem] p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <span className="text-primary font-label text-[10px] font-extrabold tracking-[0.25em] uppercase px-3 py-1 bg-primary/5 rounded-full">
                  Marketplace Analysis
                </span>
                <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface tracking-tight">
                  Top Tier Contrast
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
                  ‹
                </button>
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-on-surface hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
                  ›
                </button>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className={`grid gap-8 ${topBids.length === 1 ? 'grid-cols-1 max-w-md' : 'grid-cols-1 md:grid-cols-2'}`}>
              {/* Row Labels — desktop only */}
              {topBids.length >= 2 && (
                <div className="hidden md:flex flex-col pt-12 absolute opacity-0 pointer-events-none" aria-hidden="true">
                  {/* spacer for alignment */}
                </div>
              )}
              {topBids.map((bid, idx) => (
                <BidCompareCard
                  key={bid.id}
                  bid={bid}
                  rfqId={rfqId}
                  onReject={onReject}
                  isRecommended={idx === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ADDITIONAL BIDS ── */}
      {remainingBids.length > 0 && (
        <section className="mb-24">
          <h3 className="text-xl font-headline font-extrabold text-on-surface mb-8 ml-2 flex items-center gap-2">
            Other Pending Proposals
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {remainingBids.map((bid) => (
              <BidMiniCard key={bid.id} bid={bid} rfqId={rfqId} onReject={onReject} />
            ))}
            {/* Request New Bid card */}
            <div className="rounded-[2rem] border-2 border-dashed border-outline-variant/40 p-7 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/5">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm cta-glow text-primary text-2xl font-bold">
                +
              </div>
              <span className="text-on-surface font-extrabold text-sm uppercase tracking-wide">Request New Bid</span>
              <span className="text-on-surface-variant text-xs mt-2 font-medium">Our concierge can source more.</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default CompareBids;
