'use client';

/**
 * RFQ Management Page
 *
 * Stitch Screen ID: a6b678412b9a48648335a9fb28170ff3
 * "Homeowner Dashboard | RFQ Management"
 *
 * Lifecycle:
 *  - Loads all RFQs via fetchRfqs() (existing service, preserves backend contract)
 *  - Filterable by status: all | draft | open | matched | closed
 *  - Glass Ledger design system (liquid-glass cards, Stitch tokens)
 *  - Links to /rfq/new for creation, /bids/[rfqId] for bid comparison
 *
 * GOVERNANCE:
 *  ✔ Extends existing /rfq folder — no duplicate route
 *  ✔ Uses existing fetchRfqs() service — no direct fetch()
 *  ✔ Preserves route ownership: /dashboard/project-owner/rfq/*
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  MapPin,
  Zap,
  Calendar,
  Users,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Inbox,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import type { RfqListItem } from '@/dashboards/project-owner/types/dashboard';

type FilterStatus = 'all' | 'draft' | 'open' | 'matched' | 'closed';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso)
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    draft: {
      label: 'Draft',
      icon: <FileText size={11} />,
      cls: 'bg-surface-container text-on-surface-variant border-outline-variant/30',
    },
    open: {
      label: 'Live — Accepting Bids',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />,
      cls: 'bg-primary/8 text-primary border-primary/20',
    },
    matched: {
      label: 'Matched',
      icon: <CheckCircle2 size={11} />,
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    closed: {
      label: 'Closed',
      icon: <XCircle size={11} />,
      cls: 'bg-surface-container-high text-on-surface-variant border-outline-variant/20',
    },
    disputed: {
      label: 'Disputed',
      icon: <AlertCircle size={11} />,
      cls: 'bg-error/8 text-error border-error/20',
    },
  };
  const cfg = configs[status] ?? configs.open;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.12em] border ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function RfqCard({ rfq }: { rfq: RfqListItem }) {
  const hasBids = (rfq.bidsCount ?? 0) > 0;
  return (
    <div className="group liquid-glass rounded-[2rem] p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
      {/* Solar flare accent */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: RFQ Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={rfq.status} />
            {hasBids && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wide">
                <TrendingUp size={10} />
                {rfq.bidsCount} Bid{rfq.bidsCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <h2 className="font-headline text-xl md:text-2xl font-extrabold text-on-surface tracking-tight mb-4 truncate group-hover:text-primary transition-colors">
            {rfq.projectTitle}
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-on-surface-variant font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary/60 shrink-0" />
              {rfq.locationCity}, {rfq.locationState}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-primary/60 shrink-0" />
              {rfq.systemSizeKw} kW System
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary/60 shrink-0" />
              {rfq.timelineDays} Day Timeline
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary/60 shrink-0" />
              {formatDate(rfq.createdAt)}
            </span>
          </div>
        </div>

        {/* Right: Budget + Actions */}
        <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest mb-1">
              Budget Range
            </p>
            <p className="font-headline text-xl font-extrabold text-on-surface tracking-tight">
              {rfq.budgetMin ? formatCurrency(rfq.budgetMin) : '—'}
              <span className="text-on-surface-variant font-medium mx-1">–</span>
              {rfq.budgetMax ? formatCurrency(rfq.budgetMax) : '—'}
            </p>
          </div>

          <div className="flex gap-2">
            {hasBids ? (
              <Link
                href={`/dashboard/project-owner/bids/${rfq.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-extrabold text-sm rounded-xl hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-primary/20 cta-glow"
                aria-label={`Compare bids for ${rfq.projectTitle}`}
              >
                <Users size={15} />
                Compare Bids
                <ArrowUpRight size={14} />
              </Link>
            ) : (
              <Link
                href={`/dashboard/project-owner/rfq/new`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container text-on-surface font-extrabold text-sm rounded-xl hover:bg-surface-container-high active:scale-95 transition-all border border-outline-variant/30"
                aria-label="Create new RFQ"
              >
                <Eye size={15} />
                View Details
              </Link>
            )}

            <Link
              href={`/dashboard/project-owner/bids/${rfq.id}`}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 border border-outline-variant/20 text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95"
              aria-label={`View RFQ ${rfq.projectTitle}`}
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bid Progress Bar */}
      {rfq.status === 'open' && (
        <div className="mt-6 pt-6 border-t border-outline-variant/20">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-2">
            <span>Bid Activity</span>
            <span>{rfq.bidsCount ?? 0} proposals received</span>
          </div>
          <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(((rfq.bidsCount ?? 0) / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

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
          <div className="w-32 h-6 bg-surface-container rounded-lg" />
          <div className="w-28 h-9 bg-surface-container rounded-xl" />
        </div>
      </div>
    </div>
  );
}

const FILTERS: { key: FilterStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All RFQs', icon: <FileText size={13} /> },
  { key: 'open', label: 'Live', icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> },
  { key: 'matched', label: 'Matched', icon: <CheckCircle2 size={13} /> },
  { key: 'draft', label: 'Draft', icon: <Clock size={13} /> },
  { key: 'closed', label: 'Closed', icon: <XCircle size={13} /> },
];

export default function RfqManagementPage() {
  const [rfqs, setRfqs] = useState<RfqListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const res = await fetchRfqs();
    if (res.success && res.data) setRfqs(res.data);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  const filtered = rfqs.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      !search ||
      r.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.locationCity.toLowerCase().includes(search.toLowerCase()) ||
      r.locationState.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBids = rfqs.reduce((s, r) => s + (r.bidsCount ?? 0), 0);
  const openCount = rfqs.filter((r) => r.status === 'open').length;
  const matchedCount = rfqs.filter((r) => r.status === 'matched').length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" />
            Marketplace Intelligence
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            RFQ{' '}
            <span className="text-primary">Command</span>
          </h1>
          <p className="text-on-surface-variant mt-3 font-medium max-w-xl text-base">
            Manage your solar project requests. Monitor bid activity and convert proposals into secured contracts.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh RFQ list"
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/dashboard/project-owner/rfq/new"
            id="create-rfq-cta"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2.5 shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-105 cta-glow"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create RFQ
          </Link>
        </div>
      </div>

      {/* Stats Strip */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total RFQs', value: rfqs.length, icon: <FileText size={20} />, accent: 'text-on-surface' },
            { label: 'Live RFQs', value: openCount, icon: <Zap size={20} />, accent: 'text-primary' },
            { label: 'Matched', value: matchedCount, icon: <CheckCircle2 size={20} />, accent: 'text-emerald-600' },
            { label: 'Total Bids', value: totalBids, icon: <Users size={20} />, accent: 'text-amber-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="liquid-glass rounded-[1.5rem] p-5 flex items-center gap-4"
            >
              <div className={`${stat.accent} opacity-70`}>{stat.icon}</div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60">
                  {stat.label}
                </p>
                <p className={`font-headline text-2xl font-extrabold ${stat.accent} tracking-tight`}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            id="rfq-search"
            type="text"
            placeholder="Search by project title or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 h-12 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Filter Tabs — scroll on mobile */}
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar shrink-0"
          role="tablist"
          aria-label="Filter RFQs by status"
        >
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? rfqs.length : rfqs.filter((r) => r.status === f.key).length;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-4 py-2.5 h-12 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all border-2 active:scale-95 ${
                  filter === f.key
                    ? 'border-primary bg-primary/8 text-primary shadow-sm'
                    : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40 hover:bg-surface-container'
                }`}
              >
                {f.icon}
                {f.label}
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
      </div>

      {/* RFQ List */}
      {loading ? (
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/40 rounded-[2rem] py-24 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/30 mb-6">
            <Inbox size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            {search ? 'No matching RFQs' : 'No RFQs yet'}
          </h3>
          <p className="text-on-surface-variant font-medium max-w-sm mb-8">
            {search
              ? `No RFQs match "${search}". Try a different search.`
              : filter !== 'all'
              ? `No ${filter} RFQs in the system. Create one or change the filter.`
              : 'Publish your first RFQ to source competitive bids from top installers.'}
          </p>
          <Link
            href="/dashboard/project-owner/rfq/new"
            className="h-12 px-8 flex items-center gap-2 bg-primary text-white rounded-xl font-extrabold shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all cta-glow"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create First RFQ
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((rfq) => (
            <RfqCard key={rfq.id} rfq={rfq} />
          ))}
        </div>
      )}

      {/* Stitch Screen ID Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/30 font-extrabold uppercase tracking-widest">
        Stitch Screen: a6b678412b9a48648335a9fb28170ff3 · RFQ Management Authority
      </p>
    </div>
  );
}
