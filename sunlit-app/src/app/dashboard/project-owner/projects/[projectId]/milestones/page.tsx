'use client';

/**
 * Milestone Review Schedule
 *
 * Stitch Screen: e6f84760b330493b9e97488c6439c2d2
 * Shows all milestones for a project with status, amounts, and review links.
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  Clock,
  Upload,
  ChevronRight,
  Zap,
  AlertCircle,
  Activity,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED';
  sequence_order: number;
  submitted_at?: string;
  paid_at?: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  PENDING:   { label: 'Pending',         cls: 'bg-surface-container text-on-surface-variant border-outline-variant/20', icon: Clock },
  SUBMITTED: { label: 'Awaiting Review', cls: 'bg-amber-50 text-amber-600 border-amber-200',                          icon: Upload },
  APPROVED:  { label: 'Approved',        cls: 'bg-blue-50 text-blue-600 border-blue-200',                              icon: CheckCircle2 },
  PAID:      { label: 'Released',        cls: 'bg-primary/8 text-primary border-primary/20',                           icon: Shield },
  REJECTED:  { label: 'Rejected',        cls: 'bg-error/8 text-error border-error/20',                                icon: AlertCircle },
};

export default function MilestonesListPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectTitle, setProjectTitle] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/milestones?projectId=${projectId}`).then(r => r.json()),
      fetch(`/api/v1/projects/${projectId}`).then(r => r.json()),
    ]).then(([msData, projData]) => {
      if (msData.success) setMilestones(msData.data || []);
      if (projData.success) setProjectTitle(projData.data?.title ?? '');
    }).catch(console.error).finally(() => setLoading(false));
  }, [projectId]);

  const paidCount = milestones.filter(m => m.status === 'PAID').length;
  const totalAmount = milestones.reduce((s, m) => s + (m.amount || 0), 0);
  const progress = milestones.length > 0 ? Math.round((paidCount / milestones.length) * 100) : 0;

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-40 bg-surface-container rounded-full" />
      <div className="h-10 w-80 bg-surface-container-high rounded-xl" />
      <div className="h-16 bg-surface-container-low rounded-2xl" />
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface-container-lowest rounded-[1.75rem]" />)}
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/project-owner/projects/${projectId}/execution`} className="flex items-center gap-2 group">
          <div className="p-2 bg-surface-container-lowest rounded-xl text-on-surface-variant/40 group-hover:text-primary transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest group-hover:text-on-surface transition-colors">
            Execution
          </span>
        </Link>
        <ChevronRight size={10} className="text-on-surface-variant/30" />
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Milestones</span>
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" />
            Payment Schedule
          </p>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
            Milestone <span className="text-primary">Schedule</span>
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            {projectTitle} · {paidCount} of {milestones.length} completed
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest mb-1">Total Contract</p>
          <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">{fmt(totalAmount)}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="liquid-glass rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
            <Activity size={12} className="text-primary" /> Payment Progress
          </span>
          <span className="font-headline text-sm font-extrabold text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Milestone List */}
      {milestones.length === 0 ? (
        <div className="border-2 border-dashed border-outline-variant/30 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center">
          <Clock size={48} className="text-on-surface-variant/20 mb-4" />
          <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">No Milestones Yet</h3>
          <p className="text-on-surface-variant font-medium">Milestones will appear once the project is funded.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((ms, i) => {
            const cfg = STATUS_CFG[ms.status] ?? STATUS_CFG.PENDING;
            const Icon = cfg.icon;
            const isSubmitted = ms.status === 'SUBMITTED';
            return (
              <div
                key={ms.id}
                className={`liquid-glass rounded-[1.75rem] p-6 flex flex-col sm:flex-row sm:items-center gap-5 transition-all duration-300 hover:-translate-y-0.5 ${isSubmitted ? 'ring-1 ring-amber-200 shadow-md' : ''}`}
              >
                {/* Step */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-sm border ${isSubmitted ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-surface-container text-on-surface-variant/60 border-outline-variant/20'}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.cls}`}>
                  <Icon size={16} />
                </div>

                {/* Title + date */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline text-base font-extrabold text-on-surface tracking-tight mb-1">{ms.title}</h4>
                  <p className="text-xs text-on-surface-variant/60">
                    {ms.status === 'PAID' && ms.paid_at ? `Released ${new Date(ms.paid_at).toLocaleDateString()}` :
                     ms.status === 'SUBMITTED' && ms.submitted_at ? `Submitted ${new Date(ms.submitted_at).toLocaleDateString()}` :
                     'Awaiting installer submission'}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Zap size={14} className="text-primary/50" />
                  <span className="font-headline text-base font-extrabold text-on-surface tracking-tight">{fmt(ms.amount)}</span>
                </div>

                {/* Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] border flex-shrink-0 ${cfg.cls}`}>
                  {cfg.label}
                </span>

                {/* Action */}
                {isSubmitted && (
                  <Link
                    href={`/dashboard/project-owner/projects/${projectId}/milestones/${ms.id}`}
                    className="h-10 px-5 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition-all shadow-sm flex-shrink-0"
                  >
                    Review <ChevronRight size={12} />
                  </Link>
                )}
                {ms.status === 'PAID' && (
                  <Link
                    href={`/dashboard/project-owner/projects/${projectId}/milestones/${ms.id}`}
                    className="h-10 px-5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-xl font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:border-primary/30 hover:text-primary transition-all flex-shrink-0"
                  >
                    Details
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick nav */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/project-owner/projects/${projectId}/execution`}
          className="h-12 px-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-extrabold text-sm text-on-surface-variant flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
        >
          <ArrowLeft size={14} /> Execution Timeline
        </Link>
        <Link
          href={`/dashboard/project-owner/projects/${projectId}/disputes/new`}
          className="h-12 px-6 border-2 border-dashed border-outline-variant/30 rounded-xl font-extrabold text-sm text-on-surface-variant/60 flex items-center gap-2 hover:text-error hover:border-error/30 transition-all active:scale-95"
        >
          <AlertCircle size={14} /> Raise Dispute
        </Link>
      </div>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: e6f84760 · Milestone Authority
      </p>
    </div>
  );
}
