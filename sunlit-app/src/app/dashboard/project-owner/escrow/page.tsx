'use client';

/**
 * Escrow Wallet — Funding Overview
 *
 * Stitch Screens:
 *   - 610e220d2192468ea5d2a3c19699bb0d — Project Funding Setup
 *   - 7ecfa9217d9f429788713205864b5e1d — Secure Funding Status Widget
 *   - 88f8b72c132943a58e92b4083c589ed9 — Virtual Account
 *
 * Backend-connected via fetchEscrowAccounts() API.
 * Displays escrow balances, milestone payment ledger,
 * commission breakdown, and final buffer status.
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Shield,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  CircleDollarSign,
  Info,
  Zap,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { fetchEscrowAccounts } from '@/dashboards/project-owner/services/project-owner-api';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface EscrowMilestone {
  id: string;
  title: string;
  amount: number;
  percentage: number;
  status: 'funded' | 'released' | 'held' | 'pending';
  date?: string;
}

interface EscrowAccount {
  id: string;
  project: string;
  contractId: string;
  totalAmount: number;
  funded: number;
  released: number;
  held: number;
  commission: number;
  finalBuffer: number;
  milestones: EscrowMilestone[];
}

function milestoneConfig(status: EscrowMilestone['status']) {
  const map = {
    released: { cls: 'bg-primary/8 text-primary', label: 'Released', icon: CheckCircle2 },
    funded: { cls: 'bg-amber-50 text-amber-600', label: 'Awaiting Approval', icon: Clock },
    held: { cls: 'bg-surface-container text-on-surface-variant', label: 'Held in Escrow', icon: Lock },
    pending: { cls: 'bg-surface-container-high text-on-surface-variant/60', label: 'Pending', icon: CircleDollarSign },
  };
  return map[status];
}

function EscrowSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-4 w-32 bg-surface-container rounded-full" />
      <div className="h-12 w-72 bg-surface-container-high rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface-container-low rounded-[1.75rem]" />)}
      </div>
      <div className="h-96 bg-surface-container-lowest rounded-[2rem]" />
    </div>
  );
}

export default function EscrowOverviewPage() {
  const [accounts, setAccounts] = useState<EscrowAccount[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEscrowAccounts().then(res => {
      if (res.success && res.data) {
        const mapped = (res.data as any[]).map((a: any) => ({
          id: a.id,
          project: a.project,
          contractId: a.contractId || a.contract_id,
          totalAmount: a.totalAmount || a.total_amount,
          funded: a.funded,
          released: a.released,
          held: a.held,
          commission: a.commission,
          finalBuffer: a.finalBuffer || a.final_buffer,
          milestones: (a.milestones || []).map((m: any) => ({
            id: m.id,
            title: m.title,
            amount: m.amount,
            percentage: m.percentage,
            status: m.status as EscrowMilestone['status'],
            date: m.date,
          })),
        }));
        setAccounts(mapped);
        if (mapped.length > 0) setSelected(mapped[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <EscrowSkeleton />;

  const account = accounts.find(a => a.id === selected);

  if (!account) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
        <header>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" /> Payment Control
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Escrow <span className="text-primary">Wallet</span>
          </h1>
        </header>
        <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/30 mb-6">
            <Wallet size={36} />
          </div>
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">No Escrow Accounts</h3>
          <p className="text-on-surface-variant font-medium mb-6 max-w-sm">
            Escrow accounts are created automatically when you sign a contract.
          </p>
          <Link
            href="/dashboard/project-owner/contracts"
            className="h-12 px-6 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2 shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            View Contracts <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const fundedPct = Math.round((account.funded / account.totalAmount) * 100);
  const releasedPct = Math.round((account.released / account.totalAmount) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Payment Control
        </p>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
          Escrow <span className="text-primary">Wallet</span>
        </h1>
        <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
          Milestone-secured payments. Funds are released only on verified project completion.
        </p>
      </header>

      {/* Account Selector */}
      {accounts.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {accounts.map(a => (
            <button
              key={a.id}
              className={`px-5 py-3 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all border-2 active:scale-95 ${
                selected === a.id
                  ? 'border-primary bg-primary/8 text-primary shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant hover:border-primary/30'
              }`}
              onClick={() => setSelected(a.id)}
            >
              {a.project}
            </button>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Total Funded
            </p>
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
              <Wallet size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-primary tracking-tight">
            {formatCurrency(account.funded)}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50 flex items-center gap-1">
            <Shield size={10} /> Secured in escrow
          </p>
        </div>

        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Released
            </p>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            {formatCurrency(account.released)}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50 flex items-center gap-1">
            <CheckCircle2 size={10} /> Paid to installer
          </p>
        </div>

        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Commission
            </p>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <CircleDollarSign size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            {formatCurrency(account.commission)}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50">
            {account.totalAmount >= 5000000 ? '3%' : '4%'} of contract value
          </p>
        </div>

        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Final Buffer
            </p>
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
              <Lock size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            {formatCurrency(account.finalBuffer)}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50 flex items-center gap-1">
            <Info size={10} /> Released on completion
          </p>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="liquid-glass rounded-[2rem] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-primary uppercase tracking-widest">
            <Zap size={12} />
            Fund Ledger
          </div>
        </div>
        <h2 className="font-headline text-xl font-extrabold text-on-surface tracking-tight mb-6">
          Payment Progress — {account.project}
        </h2>

        {/* Progress Bar */}
        <div className="h-3 bg-surface-container rounded-full overflow-hidden flex">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000"
            style={{ width: `${releasedPct}%` }}
          />
          <div
            className="h-full bg-primary/30 transition-all duration-1000"
            style={{ width: `${fundedPct - releasedPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Released ({releasedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary/30" /> In Escrow ({fundedPct - releasedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-container" /> Unfunded
          </span>
        </div>

        {/* Milestone Timeline */}
        <div className="mt-8 space-y-4">
          {account.milestones.map((ms, idx) => {
            const cfg = milestoneConfig(ms.status);
            const Icon = cfg.icon;
            return (
              <div key={ms.id} className="flex gap-4">
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                    <Icon size={18} />
                  </div>
                  {idx < account.milestones.length - 1 && (
                    <div className="w-px h-full min-h-[20px] bg-outline-variant/20 mt-1" />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="font-headline text-sm font-extrabold text-on-surface tracking-tight">
                      {ms.title}
                    </p>
                    <p className="font-headline text-sm font-extrabold text-on-surface tracking-tight">
                      {formatCurrency(ms.amount)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                    <span>{ms.percentage}% of contract</span>
                    <span style={{ color: cfg.cls.includes('primary') ? 'var(--primary)' : undefined }}>
                      {cfg.label}
                    </span>
                    {ms.date && <span>{ms.date}</span>}
                  </div>
                  {ms.status === 'funded' && (
                    <Link
                      href={`/dashboard/project-owner/escrow/fund/${ms.id}`}
                      className="inline-flex items-center gap-2 mt-3 text-xs font-extrabold text-primary hover:gap-3 transition-all"
                    >
                      Approve Release <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="liquid-glass rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
          <Shield size={18} />
        </div>
        <div className="flex-1">
          <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">
            Escrow Protection Active
          </p>
          <p className="text-on-surface-variant text-xs mt-0.5">
            Your funds are held by Sunlit Energy under the terms of your signed contract. No party can access funds without your explicit milestone approval.
          </p>
        </div>
        <Link
          href="/dashboard/project-owner/contracts"
          className="text-xs font-extrabold text-primary flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap"
        >
          View Contract <ChevronRight size={14} />
        </Link>
      </div>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 610e220d · Escrow Wallet Authority
      </p>
    </div>
  );
}
