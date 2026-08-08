'use client';

/**
 * Bid Management — Active RFQs Overview
 *
 * Stitch Screen: 93f2e38aac1d4cba82bbe41c7ec856a0
 * "Bid Management | Active RFQs"
 *
 * Shows all RFQs with bid counts, allowing the Project Owner to navigate
 * to the comparison matrix for each RFQ.
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  MapPin,
  Zap,
  Users,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Inbox,
  RefreshCw,
  Coins,
  ArrowUpRight,
} from 'lucide-react';
import { fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import type { RfqListItem } from '@/dashboards/project-owner/types/dashboard';

type FilterStatus = 'all' | 'open' | 'matched' | 'closed';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getBidBadge(bidsCount: number, status: string) {
  if (status === 'disputed')
    return { cls: 'bg-error/8 text-error border-error/20', label: 'Disputed', icon: <AlertCircle size={10} /> };
  if (status === 'matched')
    return { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Matched', icon: <CheckCircle2 size={10} /> };
  if (status === 'closed')
    return { cls: 'bg-surface-container-high text-on-surface-variant border-outline-variant/20', label: 'Closed', icon: <XCircle size={10} /> };
  if (bidsCount === 0)
    return { cls: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Awaiting Bids', icon: <Clock size={10} /> };
  return { cls: 'bg-primary/8 text-primary border-primary/20', label: 'Live', icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> };
}

const FILTER_TABS: { key: FilterStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <FileText size={13} /> },
  { key: 'open', label: 'Live', icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> },
  { key: 'matched', label: 'Matched', icon: <CheckCircle2 size={13} /> },
  { key: 'closed', label: 'Closed', icon: <XCircle size={13} /> },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse liquid-glass rounded-[2rem] p-8">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 space-y-4">
          <div className="w-24 h-5 bg-surface-container rounded-full" />
          <div className="w-3/4 h-7 bg-surface-container rounded-xl" />
          <div className="flex gap-4">
            <div className="w-20 h-4 bg-surface-container rounded-full" />
            <div className="w-16 h-4 bg-surface-container rounded-full" />
            <div className="w-24 h-4 bg-surface-container rounded-full" />
          </div>
        </div>
        <div className="space-y-3 items-end flex flex-col">
          <div className="w-16 h-10 bg-surface-container rounded-lg" />
          <div className="w-28 h-9 bg-surface-container rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function BidManagementPage() {
  const [rfqs, setRfqs] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const res = await fetchRfqs();
    if (res.success && res.data) setRfqs(res.data);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { load(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  const filtered = rfqs.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const totalBids = rfqs.reduce((s, r) => s + (r.bidsCount ?? 0), 0);
  const rfqsWithBids = rfqs.filter((r) => (r.bidsCount ?? 0) > 0).length;

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 space-y-8">
        <div className="space-y-4">
          <div className="h-10 bg-surface-container animate-pulse rounded-lg w-1/3" />
          <div className="h-6 bg-surface-container-low animate-pulse rounded-lg w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-surface-container-low animate-pulse rounded-[1.75rem]" />
          ))}
        </div>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" />
            Marketplace Intelligence
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Installer <span className="text-primary">Proposals</span>
          </h1>
          <p className="text-on-surface-variant mt-3 font-medium max-w-xl text-base">
            Monitor real-time propositions and secure your solar infrastructure deployments via the Marketplace.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh bid list"
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/dashboard/project-owner/rfq/new"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2.5 shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-105 cta-glow"
          >
            <Plus size={18} strokeWidth={2.5} />
            Broadcast New RFQ
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="liquid-glass rounded-[1.75rem] p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/60">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Active RFQs
            </p>
            <p className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mt-1">
              {rfqs.length}
            </p>
          </div>
        </div>
        <div className="liquid-glass rounded-[1.75rem] p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Total Proposals
            </p>
            <p className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mt-1">
              {totalBids}
            </p>
          </div>
        </div>
        <div className="liquid-glass rounded-[1.75rem] p-6 flex items-center gap-5 border border-emerald-100/30">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-primary">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
              Matched Deals
            </p>
            <p className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mt-1">
              {rfqsWithBids}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar" role="tablist">
        {FILTER_TABS.map((f) => {
          const count = f.key === 'all' ? rfqs.length : rfqs.filter((r) => r.status === f.key).length;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all border-2 active:scale-95 ${
                filter === f.key
                  ? 'border-primary bg-primary/8 text-primary shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-primary/30'
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.icon}
              {f.label} Proposals
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  filter === f.key ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bids List */}
      {filtered.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/30 mb-6">
            <Inbox size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            The Marketplace is Clear
          </h3>
          <p className="text-on-surface-variant font-medium max-w-sm mb-8">
            {filter === 'all'
              ? 'Initialize your first RFQ to source competitive bids from top installers.'
              : `No "${filter}" proposals are currently in the system.`}
          </p>
          {filter === 'all' && (
            <Link
              href="/dashboard/project-owner/rfq/new"
              className="h-12 px-8 flex items-center gap-2 cta-gradient text-white rounded-xl font-extrabold shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all cta-glow"
            >
              <Plus size={18} strokeWidth={2.5} />
              Initialize RFQ Protocol
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filtered.map((rfq) => {
            const badge = getBidBadge(rfq.bidsCount ?? 0, rfq.status);
            return (
              <Link
                key={rfq.id}
                href={`/dashboard/project-owner/bids/${rfq.id}`}
                className="group liquid-glass rounded-[2rem] p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                aria-label={`View bids for ${rfq.projectTitle}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="font-headline text-xl md:text-2xl font-extrabold text-on-surface tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                      {rfq.projectTitle}
                    </h2>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] border ${badge.cls}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary/50 shrink-0" />
                      {rfq.locationCity}, {rfq.locationState}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap size={14} className="text-primary/50 shrink-0" />
                      {rfq.systemSizeKw}kW System
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Coins size={14} className="text-primary/50 shrink-0" />
                      {rfq.budgetMin ? formatCurrency(rfq.budgetMin) : 'TBD'} – {rfq.budgetMax ? formatCurrency(rfq.budgetMax) : 'TBD'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 md:border-l border-outline-variant/20 pt-5 md:pt-0 md:pl-8">
                  <div className="flex flex-col md:items-end">
                    <span className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest flex items-center gap-1">
                      <Users size={10} /> Bids
                    </span>
                    <span className="text-2xl font-extrabold font-headline text-on-surface tracking-tighter mt-1">
                      {rfq.bidsCount ?? 0}
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-primary/8 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Stitch attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 93f2e38aac1d4cba82bbe41c7ec856a0 · Bid Management Authority
      </p>
    </div>
  );
}
