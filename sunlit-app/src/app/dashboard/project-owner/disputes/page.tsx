'use client';

/**
 * Dispute Center — Disputes & Mediation
 *
 * Stitch Screen: 8e4eb1f42d8847d786d4a27d46cb4a5d
 *
 * Luminous Precision Design — replaces legacy CSS modules.
 * Connects to backend via fetchDisputes() API.
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flag,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Upload,
  MessageSquare,
  FileText,
  Scale,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { fetchDisputes, createDispute } from '@/dashboards/project-owner/services/project-owner-api';

// ── Types ──────────────────────────────────────────────────────────────────
interface DisputeEvent {
  date: string;
  actor: string;
  action: string;
  note?: string;
}

interface Dispute {
  id: string;
  project: string;
  projectId?: string;
  installer: string;
  amount: number;
  reason: string;
  status: 'open' | 'in_mediation' | 'resolved' | 'refunded';
  openedDate: string;
  evidenceCount: number;
  timeline: DisputeEvent[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

function statusConfig(status: Dispute['status']) {
  if (status === 'open')
    return { bg: 'bg-error/8', color: 'text-error', label: 'Open', icon: Flag };
  if (status === 'in_mediation')
    return { bg: 'bg-amber-50', color: 'text-amber-700', label: 'In Mediation', icon: Scale };
  if (status === 'resolved')
    return { bg: 'bg-primary/8', color: 'text-primary', label: 'Resolved', icon: CheckCircle2 };
  return { bg: 'bg-primary/8', color: 'text-primary', label: 'Refunded', icon: CheckCircle2 };
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function DisputeSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-4 w-32 bg-surface-container rounded-full" />
      <div className="h-12 w-80 bg-surface-container-high rounded-2xl" />
      <div className="h-20 bg-surface-container-low rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-28 bg-surface-container-lowest rounded-[1.75rem]" />)}
        </div>
        <div className="h-96 bg-surface-container-lowest rounded-[2rem]" />
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function DisputesOverviewPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetchDisputes().then(res => {
      if (res.success && res.data) {
        const mapped = (res.data as any[]).map((d: any) => ({
          id: d.id,
          project: d.project,
          projectId: d.projectId || d.project_id,
          installer: d.installer,
          amount: d.amount,
          reason: d.reason,
          status: d.status as Dispute['status'],
          openedDate: d.openedDate || d.opened_date,
          evidenceCount: d.evidenceCount || d.evidence_count || 0,
          timeline: d.timeline || [],
        }));
        setDisputes(mapped);
        if (mapped.length > 0) setActive(mapped[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  const selected = disputes.find(d => d.id === active);

  if (loading) return <DisputeSkeleton />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Dispute Center
        </p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              Disputes &amp; <span className="text-primary">Mediation</span>
            </h1>
            <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
              Raise and track disputes. Funds are locked until resolution is confirmed.
            </p>
          </div>
          <Link
            href="/dashboard/project-owner/disputes/new"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={16} /> Raise Dispute
          </Link>
        </div>
      </header>

      {/* Security Lock Banner */}
      {disputes.some(d => d.status === 'open' || d.status === 'in_mediation') && (
        <div className="liquid-glass rounded-2xl p-5 flex items-center gap-4 border-l-4 border-error/50">
          <div className="w-10 h-10 rounded-xl bg-error/8 flex items-center justify-center text-error flex-shrink-0">
            <Shield size={18} />
          </div>
          <div>
            <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">Escrow Locked</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              All milestone payments and releases are frozen while a dispute is active.
            </p>
          </div>
        </div>
      )}

      {disputes.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/30 mb-6">
            <Flag size={36} />
          </div>
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">No Active Disputes</h3>
          <p className="text-on-surface-variant font-medium mb-6 max-w-sm">
            You don&apos;t have any disputes. If you have an issue with your project, raise one below.
          </p>
          <Link
            href="/dashboard/project-owner/disputes/new"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            <Plus size={16} /> Raise a Dispute
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          {/* Dispute List */}
          <div className="space-y-4">
            {disputes.map(d => {
              const cfg = statusConfig(d.status);
              const Icon = cfg.icon;
              return (
                <button
                  key={d.id}
                  className={`w-full text-left liquid-glass rounded-[1.75rem] p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                    active === d.id ? 'ring-2 ring-primary/30 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setActive(d.id)}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-headline text-sm font-extrabold text-on-surface tracking-tight truncate">{d.project}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                      <Icon size={11} /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium truncate mb-2">{d.installer}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-sm font-extrabold text-on-surface">{formatCurrency(d.amount)}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">{d.openedDate}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dispute Detail */}
          {selected && (() => {
            const cfg = statusConfig(selected.status);
            const StatusIcon = cfg.icon;
            return (
              <div className="liquid-glass rounded-[2rem] p-8 flex flex-col gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-1">{selected.project}</h2>
                    <p className="text-on-surface-variant font-medium">vs. {selected.installer}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest self-start ${cfg.bg} ${cfg.color}`}>
                    <StatusIcon size={14} /> {cfg.label}
                  </span>
                </div>

                {/* Amount at Stake */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
                  <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest mb-2">Amount in Dispute</p>
                  <p className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">{formatCurrency(selected.amount)}</p>
                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                    <Shield size={12} className="text-primary/50" /> Held in escrow pending resolution
                  </p>
                </div>

                {/* Reason */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">Dispute Reason</span>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">{selected.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="h-11 px-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-extrabold text-xs text-on-surface-variant flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all active:scale-95">
                    <Upload size={15} /> Upload Evidence
                  </button>
                  <button className="h-11 px-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-extrabold text-xs text-on-surface-variant flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all active:scale-95">
                    <MessageSquare size={15} /> Message Mediator
                  </button>
                  <button className="h-11 px-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-extrabold text-xs text-on-surface-variant flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all active:scale-95">
                    <FileText size={15} /> View Documents ({selected.evidenceCount})
                  </button>
                </div>

                {/* Timeline */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Clock size={14} className="text-primary" />
                    <h3 className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">Dispute Timeline</h3>
                  </div>
                  <div className="space-y-4">
                    {selected.timeline.map((ev, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-primary/30 flex-shrink-0 mt-1" />
                          {idx < selected.timeline.length - 1 && (
                            <div className="w-px h-full min-h-[16px] bg-outline-variant/20 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="font-extrabold text-sm text-on-surface">{ev.actor}</span>
                            <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest whitespace-nowrap">{ev.date}</span>
                          </div>
                          <p className="text-sm text-on-surface-variant">{ev.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resolution Banner */}
                {(selected.status === 'resolved' || selected.status === 'refunded') && (
                  <div className="bg-primary/5 rounded-2xl p-6 flex items-center gap-4 border border-primary/20">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">Dispute Resolved</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Funds have been released according to the mediation outcome.</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 8e4eb1f4 · Dispute Center
      </p>
    </div>
  );
}
