'use client';

/**
 * Master Contracts — Glass Ledger Listing
 *
 * Stitch Design Language: Luminous Precision
 * Displays all contracts with status badges, search, and navigation
 * to the Contract Acceptance Center for signing.
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileSignature,
  Clock,
  CheckCircle2,
  ChevronRight,
  Wallet,
  Filter,
  Inbox,
} from 'lucide-react';
import { fetchContracts } from '@/dashboards/project-owner/services/project-owner-api';
import type { ContractListItem, ContractStatus } from '@/dashboards/project-owner/types/dashboard';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

const statusMap: Record<ContractStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  pending_signatures: {
    label: 'Awaiting Signatures',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <FileSignature size={12} />,
  },
  signed: {
    label: 'Fully Signed',
    cls: 'bg-primary/8 text-primary border-primary/20',
    icon: <CheckCircle2 size={12} />,
  },
  active: {
    label: 'In Execution',
    cls: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <Clock size={12} />,
  },
  completed: {
    label: 'Completed',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <ShieldCheck size={12} />,
  },
  disputed: {
    label: 'Disputed',
    cls: 'bg-error/8 text-error border-error/20',
    icon: <AlertCircle size={12} />,
  },
};

export default function ContractsListPage() {
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetchContracts();
      if (res.success && res.data) setContracts(res.data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredContracts = contracts.filter(
    (c) =>
      c.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.installerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pending = contracts.filter((c) => c.status === 'pending_signatures').length;
  const active = contracts.filter((c) => c.status === 'active').length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-surface-container rounded-full" />
          <div className="h-10 w-64 bg-surface-container-high rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-surface-container-low rounded-[1.75rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Legal Authority
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              Master <span className="text-primary">Contracts</span>
            </h1>
            <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
              Manage your legal agreements, review digitally signed contracts, and track multi-party executions.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Search contracts or installers..."
              className="w-full pl-11 pr-4 h-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <div className="liquid-glass rounded-[1.75rem] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant/50">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest">Total</p>
            <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">{contracts.length}</p>
          </div>
        </div>
        <div className="liquid-glass rounded-[1.75rem] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <FileSignature size={20} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest">Pending</p>
            <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">{pending}</p>
          </div>
        </div>
        <div className="liquid-glass rounded-[1.75rem] p-5 flex items-center gap-4 col-span-2 md:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest">Active</p>
            <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">{active}</p>
          </div>
        </div>
      </div>

      {/* Contract List */}
      {filteredContracts.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/30 mb-6">
            <Inbox size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            No Contracts Found
          </h3>
          <p className="text-on-surface-variant font-medium max-w-md mb-8">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'When a bid is accepted, the system automatically generates an enforceable smart contract here.'}
          </p>
          {!searchTerm && (
            <Link
              href="/dashboard/project-owner/bids"
              className="flex items-center gap-2 text-primary font-extrabold uppercase text-xs tracking-widest hover:gap-3 transition-all"
            >
              Review Active Bids <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const statusCfg = statusMap[contract.status];
            return (
              <Link
                href={`/dashboard/project-owner/contracts/${contract.id}`}
                key={contract.id}
                className="group liquid-glass rounded-[1.75rem] p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-bl from-primary/3 to-transparent pointer-events-none" />

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant/40 group-hover:text-primary group-hover:bg-primary/5 transition-colors shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                      {contract.projectTitle}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-sm font-bold text-on-surface-variant">{contract.installerName}</p>
                      <span className="w-1 h-1 bg-outline-variant/40 rounded-full" />
                      <p className="text-[10px] font-mono font-bold text-on-surface-variant/50 uppercase tracking-widest">
                        {contract.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 md:gap-8 pl-17 md:pl-0">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">
                      Contract Value
                    </p>
                    <p className="text-base font-extrabold text-on-surface flex items-center gap-1.5 justify-end">
                      <Wallet size={13} className="text-primary/50" />
                      {formatCurrency(contract.totalAmount)}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border ${statusCfg.cls}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant/40 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: Contract Ledger · Glass Ledger Authority
      </p>
    </div>
  );
}
