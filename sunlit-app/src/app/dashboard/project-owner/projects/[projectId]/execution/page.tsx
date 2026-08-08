'use client';

/**
 * Project Execution Command Center
 *
 * Stitch Screen: 3025255acfae4c5690d6e7bb30f8f49d
 * Mobile: feaf3adb789f4d34942febb40fb407aa
 *
 * Shows lifecycle tracker, milestone timeline, escrow sidebar.
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Zap,
  Upload,
  FileText,
  Lock,
  Activity,
  TrendingUp,
  Award,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED';
  amount: number;
  sequence_order: number;
  submitted_at?: string;
  approved_at?: string;
  paid_at?: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  total_amount: number;
  funded_amount?: number;
  released_amount?: number;
  escrow_balance?: number;
  installer_name?: string;
  milestones?: Milestone[];
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

const STATUS_CFG: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  PENDING:   { label: 'Pending',    cls: 'bg-surface-container text-on-surface-variant',       icon: Clock },
  SUBMITTED: { label: 'In Review',  cls: 'bg-amber-50 text-amber-600 border-amber-200',        icon: Upload },
  APPROVED:  { label: 'Approved',   cls: 'bg-blue-50 text-blue-600 border-blue-200',           icon: CheckCircle2 },
  PAID:      { label: 'Released',   cls: 'bg-primary/8 text-primary border-primary/20',        icon: Shield },
  REJECTED:  { label: 'Rejected',   cls: 'bg-error/8 text-error border-error/20',              icon: AlertCircle },
};

function ExecutionSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-4 w-40 bg-surface-container rounded-full" />
      <div className="h-12 w-96 bg-surface-container-high rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-surface-container-low rounded-[1.75rem]" />)}
      </div>
      <div className="h-64 bg-surface-container-lowest rounded-[2rem]" />
    </div>
  );
}

export default function ProjectExecutionPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projRes, msRes] = await Promise.all([
          fetch(`/api/v1/projects/${projectId}`),
          fetch(`/api/v1/milestones?projectId=${projectId}`),
        ]);
        const projData = await projRes.json();
        const msData = await msRes.json();
        if (projData.success && projData.data) {
          setProject({ ...projData.data, milestones: msData.data || [] });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [projectId]);

  if (loading) return <ExecutionSkeleton />;

  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <AlertCircle size={48} className="text-error mb-4" />
      <h2 className="font-headline text-2xl font-extrabold text-on-surface mb-2">Project Not Found</h2>
      <Link href="/dashboard/project-owner" className="text-primary font-bold hover:underline">Back to Dashboard</Link>
    </div>
  );

  const milestones = project.milestones || [];
  const paidCount = milestones.filter(m => m.status === 'PAID').length;
  const progress = milestones.length > 0 ? Math.round((paidCount / milestones.length) * 100) : 0;
  const escrowBal = project.escrow_balance ?? (project.total_amount - (project.released_amount ?? 0));
  const activeMilestone = milestones.find(m => m.status === 'SUBMITTED') ?? milestones.find(m => m.status === 'PENDING');
  const allPaid = milestones.length > 0 && milestones.every(m => m.status === 'PAID');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/project-owner/projects/${projectId}`} className="flex items-center gap-2 group">
          <div className="p-2 bg-surface-container-lowest rounded-xl text-on-surface-variant/40 group-hover:text-primary transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest group-hover:text-on-surface transition-colors">
            Project
          </span>
        </Link>
        <ChevronRight size={10} className="text-on-surface-variant/30" />
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Execution Center</span>
      </div>

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-primary/8 text-primary border border-primary/20">
              PRJ-{projectId.slice(0, 8).toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" />
            Execution Authority
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            {project.title}
          </h1>
          <p className="text-on-surface-variant font-medium mt-2">
            Command Center · {project.installer_name ?? 'Installer'}
          </p>
        </div>

        {allPaid && (
          <button
            onClick={async () => {
              const r = await fetch(`/api/v1/projects/${projectId}/complete`, { method: 'POST' });
              const d = await r.json();
              if (d.success) router.push(`/dashboard/project-owner/projects/${projectId}/reviews`);
            }}
            className="h-14 px-8 cta-gradient text-white rounded-xl font-extrabold flex items-center gap-2.5 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all cta-glow"
          >
            <Award size={18} />
            Complete Project
          </button>
        )}
      </header>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Escrow Balance', value: fmt(escrowBal), icon: Shield, accent: 'text-primary', bg: 'bg-primary/8' },
          { label: 'Overall Progress', value: `${progress}%`, icon: Activity, accent: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Stage', value: activeMilestone ? `Stage ${activeMilestone.sequence_order ?? 1}` : 'Done', icon: Zap, accent: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Contract Value', value: fmt(project.total_amount), icon: TrendingUp, accent: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">{k.label}</p>
                <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center ${k.accent}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className={`font-headline text-2xl font-extrabold tracking-tight ${k.accent}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="liquid-glass rounded-[2rem] p-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
            <Activity size={12} className="text-primary" /> Overall Progress
          </p>
          <span className="font-headline text-sm font-extrabold text-primary">{paidCount}/{milestones.length} milestones released</span>
        </div>
        <div className="h-3 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Timeline */}
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-6 flex items-center gap-2">
            <Zap size={12} className="text-primary" /> Project Timeline
          </p>

          <div className="space-y-4">
            {milestones.map((ms, i) => {
              const cfg = STATUS_CFG[ms.status] ?? STATUS_CFG.PENDING;
              const Icon = cfg.icon;
              const isActive = ms.id === activeMilestone?.id;
              return (
                <div key={ms.id} className="flex gap-4">
                  {/* Connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.cls} ${isActive ? 'ring-2 ring-primary/20 shadow-md' : ''}`}>
                      <Icon size={18} />
                    </div>
                    {i < milestones.length - 1 && (
                      <div className={`w-px h-full min-h-[20px] mt-1 ${ms.status === 'PAID' ? 'bg-primary/30' : 'bg-outline-variant/20'}`} />
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 liquid-glass rounded-2xl p-6 mb-2 transition-all ${isActive ? 'ring-1 ring-primary/20 shadow-md' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-[10px] font-extrabold text-on-surface-variant/60">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-headline text-base font-extrabold text-on-surface tracking-tight">{ms.title}</h4>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] border ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>

                    {ms.description && (
                      <p className="text-sm text-on-surface-variant mb-3">{ms.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-primary/50" />
                        <span className="font-headline text-sm font-extrabold text-on-surface">{fmt(ms.amount)}</span>
                        <span className="text-[10px] text-on-surface-variant/50 font-bold">
                          ({((ms.amount / project.total_amount) * 100).toFixed(0)}%)
                        </span>
                      </div>

                      {ms.status === 'SUBMITTED' && (
                        <Link
                          href={`/dashboard/project-owner/projects/${projectId}/milestones/${ms.id}`}
                          className="h-9 px-4 bg-primary text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition-all shadow-sm"
                        >
                          Review <ChevronRight size={12} />
                        </Link>
                      )}
                      {ms.status === 'PAID' && (
                        <span className="flex items-center gap-1.5 text-primary text-xs font-extrabold">
                          <CheckCircle2 size={14} /> Released
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Escrow Widget */}
          <div className="liquid-glass rounded-[2rem] p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-3 flex items-center gap-2">
              <Lock size={12} className="text-primary" /> Escrow Balance
            </p>
            <p className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-6">{fmt(escrowBal)}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20">
                <p className="text-[9px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">Funded</p>
                <p className="text-sm font-extrabold text-on-surface">{fmt(project.funded_amount ?? project.total_amount)}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20">
                <p className="text-[9px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">Released</p>
                <p className="text-sm font-extrabold text-on-surface">{fmt(project.released_amount ?? 0)}</p>
              </div>
            </div>
          </div>

          {/* Active Milestone */}
          {activeMilestone && (
            <div className="liquid-glass rounded-[2rem] p-7">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/60 mb-3">Active Milestone</p>
              <h4 className="font-headline text-lg font-extrabold text-on-surface tracking-tight mb-2">{activeMilestone.title}</h4>
              <p className="text-sm text-on-surface-variant mb-4">{activeMilestone.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} className="text-primary" />
                <span className="font-extrabold text-on-surface">{fmt(activeMilestone.amount)}</span>
              </div>
              {activeMilestone.status === 'SUBMITTED' && (
                <Link
                  href={`/dashboard/project-owner/projects/${projectId}/milestones/${activeMilestone.id}`}
                  className="block text-center h-12 cta-gradient text-white rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md shadow-primary/15 hover:brightness-105 active:scale-95 transition-all"
                >
                  Review & Approve <ChevronRight size={14} />
                </Link>
              )}
            </div>
          )}

          {/* Quick Nav */}
          <div className="flex flex-col gap-3">
            <Link
              href={`/dashboard/project-owner/projects/${projectId}/milestones`}
              className="flex items-center justify-center gap-2 h-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface-variant font-extrabold text-xs uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all active:scale-95"
            >
              <FileText size={14} /> View All Milestones
            </Link>
            <Link
              href={`/dashboard/project-owner/projects/${projectId}/disputes/new`}
              className="flex items-center justify-center gap-2 h-12 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/60 font-extrabold text-xs uppercase tracking-widest hover:text-error hover:border-error/30 hover:bg-error/5 transition-all active:scale-95"
            >
              <AlertCircle size={14} /> Raise a Dispute
            </Link>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 3025255a · Execution Command Center
      </p>
    </div>
  );
}
