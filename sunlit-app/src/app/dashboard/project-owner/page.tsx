'use client';

/**
 * Project Owner — Luminous Command Center
 *
 * Stitch Screen: e5021775be304f7fa51cc1bd70d28c0b
 * Design Language: Luminous Precision
 *
 * Lifecycle states rendered:
 *   RFQ_DRAFT → RFQ_PUBLISHED → BIDS_RECEIVED → BID_ACCEPTED →
 *   CONTRACT_GENERATED → CONTRACT_SIGNED → FUNDING_COMPLETED →
 *   PROJECT_ACTIVATED → MILESTONES_EXECUTED → PAYMENTS_RELEASED →
 *   PROJECT_COMPLETED
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  FileText,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  Activity,
  BarChart3,
  Eye,
  Users,
  AlertCircle,
} from 'lucide-react';
import { fetchDashboardSummary, fetchRfqs } from '@/dashboards/project-owner/services/project-owner-api';
import type { DashboardSummary, RfqListItem } from '@/dashboards/project-owner/types/dashboard';
import { FEATURES } from '@/config/features';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Skeleton ────────────────────────────────────────────────────────────────
function CommandCenterSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Header skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-3 w-32 bg-surface-container-high rounded-full" />
          <div className="h-10 w-72 bg-surface-container-high rounded-2xl" />
          <div className="h-4 w-48 bg-surface-container rounded-full" />
        </div>
        <div className="h-12 w-44 bg-surface-container-high rounded-xl" />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-40 bg-surface-container-low rounded-[1.75rem]" />
        ))}
      </div>

      {/* Lifecycle stepper */}
      <div className="h-16 bg-surface-container-lowest rounded-2xl" />

      {/* Project cards */}
      <div className="space-y-5">
        {[1,2].map(i => (
          <div key={i} className="h-52 bg-surface-container-lowest rounded-[2rem]" />
        ))}
      </div>
    </div>
  );
}

// ── Lifecycle Step ──────────────────────────────────────────────────────────
const LIFECYCLE_STEPS = [
  { key: 'rfq', label: 'RFQ', num: '01' },
  { key: 'bidding', label: 'Bidding', num: '02' },
  { key: 'contract', label: 'Contract', num: '03' },
  { key: 'funding', label: 'Funding', num: '04' },
  { key: 'execution', label: 'Execution', num: '05' },
  { key: 'complete', label: 'Complete', num: '06' },
] as const;

function LifecycleStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="liquid-glass rounded-2xl p-2 flex items-center gap-1 overflow-x-auto hide-scrollbar">
      {LIFECYCLE_STEPS.map((step, i) => {
        const isComplete = i < activeIndex;
        const isActive = i === activeIndex;
        const isFuture = i > activeIndex;
        return (
          <div
            key={step.key}
            className={`flex-1 min-w-[120px] flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
              isActive
                ? 'bg-primary/10 text-primary'
                : isComplete
                ? 'text-primary/70'
                : 'text-on-surface-variant/40'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : isComplete
                  ? 'bg-primary/20 text-primary'
                  : 'bg-surface-container text-on-surface-variant/50'
              }`}
            >
              {isComplete ? <CheckCircle2 size={14} /> : step.num}
            </span>
            <span className="font-headline font-bold text-xs whitespace-nowrap tracking-tight">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 100 }: { pct: number; size?: number }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="var(--surface-container)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold font-headline text-primary tracking-tight">
          {pct}%
        </span>
      </div>
    </div>
  );
}

// ── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    draft: {
      label: 'Draft',
      cls: 'bg-surface-container text-on-surface-variant border-outline-variant/30',
      icon: <FileText size={10} />,
    },
    open: {
      label: 'Live',
      cls: 'bg-primary/8 text-primary border-primary/20',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />,
    },
    matched: {
      label: 'Matched',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 size={10} />,
    },
    closed: {
      label: 'Closed',
      cls: 'bg-surface-container-high text-on-surface-variant border-outline-variant/20',
      icon: <Clock size={10} />,
    },
    disputed: {
      label: 'Disputed',
      cls: 'bg-error/8 text-error border-error/20',
      icon: <AlertCircle size={10} />,
    },
  };
  const cfg = map[status] ?? map.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] border ${cfg.cls}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function CommandCenter() {
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

  if (loading) return <CommandCenterSkeleton />;

  // Determine active lifecycle step from summary
  const activeStep = summary
    ? summary.completedProjects > 0 ? 5
    : summary.activeRfqs > 0 && summary.pendingBids > 0 ? 1
    : summary.activeRfqs > 0 ? 0
    : 0
    : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* ── HEADER ── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" />
            Command Center
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Project <span className="text-primary">Overview</span>
          </h1>
          <p className="text-on-surface-variant mt-3 font-medium max-w-xl text-base">
            Monitor your solar projects, manage bids, and track funding across your portfolio.
          </p>
        </div>
        {FEATURES.RFQ && (
          <Link
            href="/dashboard/project-owner/rfq/new"
            id="create-rfq-cta"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2.5 shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-105 cta-glow"
          >
            <PlusCircle size={18} strokeWidth={2.5} />
            Commission Project
          </Link>
        )}
      </section>

      {/* ── KPI BENTO GRID ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Portfolio Value */}
        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                Portfolio Value
              </p>
              <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                <Wallet size={18} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              {summary ? formatCurrency(summary.paymentBalance) : '₦—'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wider relative z-10">
            <TrendingUp size={12} />
            <span>+12.4% this quarter</span>
          </div>
        </div>

        {/* Active RFQs */}
        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                Active RFQs
              </p>
              <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                <Zap size={18} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              {summary?.activeRfqs ?? 0}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-primary text-[10px] font-extrabold uppercase tracking-wider relative z-10">
            <Activity size={12} />
            <span>Live broadcast</span>
          </div>
        </div>

        {/* Pending Bids */}
        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                Pending Bids
              </p>
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Users size={18} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              {summary?.pendingBids ?? 0}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-extrabold uppercase tracking-wider relative z-10">
            <Clock size={12} />
            <span>Awaiting review</span>
          </div>
        </div>

        {/* Completed */}
        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                Completed
              </p>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              {summary?.completedProjects ?? 0}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wider relative z-10">
            <ShieldCheck size={12} />
            <span>Projects delivered</span>
          </div>
        </div>
      </section>

      {/* ── LIFECYCLE STEPPER ── */}
      <section>
        <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest mb-4 ml-1">
          Pipeline Trajectory
        </p>
        <LifecycleStepper activeIndex={activeStep} />
      </section>

      {/* ── ACTIVE PROJECTS ── */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            Active Projects
          </h3>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/project-owner/projects"
              className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
            {FEATURES.RFQ && (
              <Link
                href="/dashboard/project-owner/rfq/new"
                className="h-10 px-4 cta-gradient text-white rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-md shadow-primary/15 hover:brightness-105 active:scale-95 transition-all"
              >
                <PlusCircle size={15} />
                New RFQ
              </Link>
            )}
          </div>
        </div>

        {rfqs.length === 0 ? (
          <div className="liquid-glass rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-6 text-on-surface-variant/30">
              <BarChart3 size={40} strokeWidth={1.5} />
            </div>
            <h4 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">
              No Active Projects
            </h4>
            <p className="text-on-surface-variant font-medium max-w-md mb-8 text-sm">
              Create your first RFQ to start receiving bids from our verified installer network across Nigeria.
            </p>
            {FEATURES.RFQ && (
              <Link
                href="/dashboard/project-owner/rfq/new"
                className="h-12 px-8 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2.5 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all cta-glow"
              >
                <Zap size={18} />
                Authorize New RFQ
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {rfqs.map((rfq) => {
              const progressPct =
                rfq.status === 'matched' ? 75
                : rfq.status === 'open' ? 30
                : rfq.status === 'closed' ? 100
                : 10;

              return (
                <div
                  key={rfq.id}
                  className="liquid-glass rounded-[2rem] p-7 md:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
                >
                  {/* Accent flare */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

                  <ProgressRing pct={progressPct} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-headline text-xl font-extrabold text-on-surface tracking-tight truncate group-hover:text-primary transition-colors">
                        {rfq.projectTitle}
                      </h4>
                      <StatusBadge status={rfq.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-on-surface-variant font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="text-primary/50">📍</span>
                        {rfq.locationCity}, {rfq.locationState}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap size={13} className="text-primary/50" />
                        {rfq.systemSizeKw} kW System
                      </span>
                      {rfq.budgetMin && rfq.budgetMax && (
                        <span className="flex items-center gap-1.5">
                          <Wallet size={13} className="text-primary/50" />
                          {formatCurrency(rfq.budgetMin)} – {formatCurrency(rfq.budgetMax)}
                        </span>
                      )}
                      {rfq.bidsCount > 0 && (
                        <span className="flex items-center gap-1.5 text-amber-600">
                          <Users size={13} />
                          {rfq.bidsCount} bid{rfq.bidsCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {FEATURES.BIDDING && rfq.bidsCount > 0 && (
                      <Link
                        href={`/dashboard/project-owner/bids/${rfq.id}`}
                        className="h-10 px-4 bg-primary text-white rounded-xl font-extrabold text-xs flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-md shadow-primary/15"
                        aria-label={`Compare bids for ${rfq.projectTitle}`}
                      >
                        <Eye size={14} />
                        Compare Bids
                        <ArrowUpRight size={12} />
                      </Link>
                    )}
                    <Link
                      href="/dashboard/project-owner/rfq"
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95"
                      aria-label={`View RFQ ${rfq.projectTitle}`}
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── ACTION CENTER ── */}
      {summary && (summary.pendingBids > 0 || summary.activeRfqs > 0) && (
        <section className="liquid-glass rounded-[2rem] p-8">
          <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest mb-5">
            Action Center
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.pendingBids > 0 && (
              <Link
                href="/dashboard/project-owner/bids"
                className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low/60 transition-all group border border-transparent hover:border-primary/10"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">
                    Review Bids
                  </p>
                  <p className="text-on-surface-variant text-xs mt-0.5">
                    {summary.pendingBids} new proposal{summary.pendingBids > 1 ? 's' : ''} waiting
                  </p>
                </div>
                <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            )}

            <Link
              href="/dashboard/project-owner/escrow"
              className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low/60 transition-all group border border-transparent hover:border-primary/10"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">
                  Fund Escrow
                </p>
                <p className="text-on-surface-variant text-xs mt-0.5">
                  Secure your project payment
                </p>
              </div>
              <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/dashboard/project-owner/contracts"
              className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl hover:bg-surface-container-low/60 transition-all group border border-transparent hover:border-primary/10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">
                  View Contracts
                </p>
                <p className="text-on-surface-variant text-xs mt-0.5">
                  Manage signed agreements
                </p>
              </div>
              <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </section>
      )}

      {/* Stitch attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: e5021775be304f7fa51cc1bd70d28c0b · Luminous Command Center
      </p>
    </div>
  );
}
