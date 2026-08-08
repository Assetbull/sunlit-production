'use client';

/**
 * Escrow Funding Setup — Project-Scoped Payment Initialization
 *
 * Stitch Screens:
 *   - 610e220d2192468ea5d2a3c19699bb0d — Project Funding Setup
 *   - 88f8b72c132943a58e92b4083c589ed9 — Virtual Account
 *   - c1ee0404d55a4f50b4d5f09012e08109 — Payment Confirmation
 *
 * Backend-connected via fetchProject() + initializePayment() API.
 * KYC enforcement gate before funding.
 *
 * Crew Isolation: ENFORCED — zero crew data exposure.
 * Luminous Precision Design — zero CSS modules.
 */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Clock,
  Copy,
  CheckCircle2,
  RefreshCcw,
  HandCoins,
  Lock,
  Zap,
  ShieldAlert,
  ChevronRight,
  Target,
  ArrowLeft,
  Shield,
  Activity,
  Wallet,
} from 'lucide-react';
import { fetchProject, fetchKycStatus, initializePayment } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from '../../../components/KYCModal';
import type { ProjectView, MilestoneView } from '@/dashboards/project-owner/types/dashboard';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function FundingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8">
      <div>
        <div className="h-4 w-36 bg-surface-container rounded-full mb-3" />
        <div className="h-10 w-80 bg-surface-container-high rounded-2xl mb-2" />
        <div className="h-4 w-64 bg-surface-container rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="h-36 bg-surface-container-low rounded-[1.75rem]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="h-80 bg-surface-container-lowest rounded-[2rem]" />
        <div className="h-96 bg-surface-container-lowest rounded-[2rem]" />
      </div>
    </div>
  );
}

export default function EscrowFundingPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<ProjectView | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'awaiting_transfer' | 'verifying' | 'success'>('awaiting_transfer');
  const [kycOk, setKycOk] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    async function load() {
      const [projRes, kycRes] = await Promise.all([fetchProject(projectId), fetchKycStatus()]);
      if (projRes.success && projRes.data) setProject(projRes.data);
      if (kycRes.success && kycRes.data?.canFundPayment) setKycOk(true);
      setLoading(false);
    }
    load();
  }, [projectId]);

  useEffect(() => {
    if (paymentStatus === 'awaiting_transfer') {
      const timer = setInterval(() => {
        setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('0039845123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pickFundMilestone = (p: ProjectView | null): MilestoneView | undefined => {
    if (!p?.milestones?.length) return undefined;
    return (
      p.milestones.find((m) => m.paymentStatus === 'pending' || (!m.paymentStatus && !m.isApproved)) ||
      p.milestones.find((m) => !m.isApproved) ||
      p.milestones[0]
    );
  };

  const startFunding = async () => {
    setPayError('');
    if (!kycOk) {
      setKycModalOpen(true);
      return;
    }
    const targetMilestone = pickFundMilestone(project);
    if (!project || !targetMilestone) {
      setPayError('No fundable milestone found.');
      return;
    }
    setPaymentStatus('verifying');
    const res = await initializePayment(targetMilestone.id, project.id, targetMilestone.amount);
    if (!res.success || !res.data?.paymentUrl) {
      setPaymentStatus('awaiting_transfer');
      setPayError(res.error || 'Could not start payment.');
      return;
    }
    const url = res.data.paymentUrl;
    if (url.includes('mock') || url.includes('#mock')) {
      setTimeout(() => {
        setPaymentStatus('success');
        setTimeout(() => {
          router.push(`/dashboard/project-owner/projects/${projectId}`);
        }, 2000);
      }, 2000);
      return;
    }
    window.location.href = url;
  };

  if (loading) return <FundingSkeleton />;

  const targetMilestone = pickFundMilestone(project);
  const amountToFund = targetMilestone?.amount || 0;
  const contractValue = project?.milestones?.reduce((sum, m) => sum + m.amount, 0) || amountToFund;
  const fundedCount = project?.milestones?.filter((m) => m.paymentStatus === 'funded' || m.paymentStatus === 'released').length || 0;
  const totalMilestones = project?.milestones?.length || 1;
  const fundingProgress = Math.round((fundedCount / totalMilestones) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      <KYCModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onSuccess={() => setKycOk(true)}
      />

      {/* KYC Alert Banner */}
      {!kycOk && (
        <div className="liquid-glass rounded-2xl p-6 border border-amber-200/50 bg-amber-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex gap-4 items-start">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="font-headline text-sm font-extrabold text-amber-900 tracking-tight">
                Identity Verification Required
              </p>
              <p className="text-xs text-amber-700/70 mt-0.5">
                NIN/BVN verification is mandatory for establishing secure escrow funding.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="h-10 px-5 bg-amber-600 text-white rounded-xl font-extrabold text-[10px] uppercase tracking-widest hover:bg-amber-700 active:scale-95 transition-all flex-shrink-0 shadow-sm"
            onClick={() => setKycModalOpen(true)}
          >
            Verify Identity
          </button>
        </div>
      )}

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
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Escrow Funding</span>
      </div>

      {/* Header */}
      <header>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
          <span className="w-6 h-[2px] bg-primary" />
          Financial Ledger
        </p>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
          Fund Your <span className="text-primary">Project</span>
        </h1>
        <p className="text-on-surface-variant font-medium mt-2 max-w-xl">
          Initialize decentralized payment control for <strong className="text-on-surface">{project?.title}</strong>.
        </p>
      </header>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Required Funding
            </p>
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
              <HandCoins size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-primary tracking-tight">
            {formatCurrency(amountToFund)}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50">
            {targetMilestone?.title || 'Initial Project Deposit'}
          </p>
        </div>

        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Contract Value
            </p>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Target size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            {formatCurrency(contractValue)}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50">
            Total across {totalMilestones} milestones
          </p>
        </div>

        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Fund Progress
            </p>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Activity size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-blue-600 tracking-tight">
            {fundingProgress}%
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50">
            {fundedCount} of {totalMilestones} funded
          </p>
        </div>

        <div className="liquid-glass rounded-[1.75rem] p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
              Escrow Status
            </p>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Shield size={18} />
            </div>
          </div>
          <p className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
            {kycOk ? 'Verified' : 'Locked'}
          </p>
          <p className="text-[10px] font-bold text-on-surface-variant/50 flex items-center gap-1">
            <Lock size={10} /> {kycOk ? 'Ready for funding' : 'KYC required'}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Milestone Ledger */}
        <div className="liquid-glass rounded-[2rem] overflow-hidden flex flex-col">
          <div className="p-7 flex items-center gap-3 border-b border-outline-variant/10">
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-primary uppercase tracking-widest">
              <Zap size={12} />
              Transaction Registry
            </div>
          </div>
          <h3 className="px-7 pt-5 font-headline text-lg font-extrabold text-on-surface tracking-tight">
            Milestone Ledger
          </h3>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="px-7 py-4 text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                    Milestone
                  </th>
                  <th className="px-7 py-4 text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-7 py-4 text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {project?.milestones?.map((milestone, idx) => (
                  <tr key={milestone.id} className="border-b border-outline-variant/5 last:border-none hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-7 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center font-headline font-extrabold text-xs text-on-surface-variant/50 border border-outline-variant/20">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <span className="font-headline font-bold text-on-surface tracking-tight">
                          {milestone.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-7 py-5">
                      {milestone.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-surface-container text-on-surface-variant border border-outline-variant/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40" />
                          Completed
                        </span>
                      ) : milestone.paymentStatus === 'funded' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-primary/8 text-primary border border-primary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Funded
                        </span>
                      ) : milestone.paymentStatus === 'released' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Released
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] bg-amber-50 text-amber-600 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Awaiting Funds
                        </span>
                      )}
                    </td>
                    <td className="px-7 py-5 text-right">
                      <span className="font-headline font-extrabold text-on-surface tracking-tight">
                        {formatCurrency(milestone.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!project?.milestones || project.milestones.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-7 py-12 text-center text-on-surface-variant/40 font-medium">
                      No milestones generated for this project yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Virtual Account Panel */}
        <div className="liquid-glass rounded-[2rem] p-7 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

          {paymentStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-12 flex-1 relative z-10">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface tracking-tight">
                Vault Fully Funded
              </h3>
              <p className="text-sm text-on-surface-variant mt-3 max-w-xs">
                Node confirmation successful. Redirecting to your active project workspace...
              </p>
              <div className="mt-8 flex items-center gap-2 text-primary text-[10px] font-extrabold uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                <RefreshCcw size={14} className="animate-spin" /> Verifying Ledger
              </div>
            </div>
          ) : paymentStatus === 'verifying' ? (
            <div className="flex flex-col items-center justify-center text-center py-12 flex-1 relative z-10">
              <div className="relative mb-8">
                <RefreshCcw size={64} className="text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={24} className="text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface tracking-tight">
                Syncing Infrastructure...
              </h3>
              <p className="text-sm text-on-surface-variant mt-3">
                Confirming institutional transfer across validator nodes.
              </p>
            </div>
          ) : (
            <div className="flex-1 relative z-10 flex flex-col">
              {/* Panel Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-headline text-base font-extrabold text-on-surface tracking-tight">
                    Virtual Escrow Account
                  </h3>
                  <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                    Secured Payment Channel
                  </p>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant mb-6">
                Fund this dedicated virtual account for immediate escrow allocation and project kickoff.
              </p>

              {/* Account Details */}
              <div className="space-y-3 mb-8">
                <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
                  <span className="block text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">
                    Custodian Bank
                  </span>
                  <span className="block text-sm font-bold text-on-surface">
                    Titan-One Trust (Paystack)
                  </span>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 border-2 border-primary/20 flex justify-between items-center group cursor-pointer hover:border-primary/40 transition-all relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r" />
                  <div className="pl-2">
                    <span className="block text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">
                      Institution ID
                    </span>
                    <span className="block font-headline text-2xl font-extrabold tracking-wider text-on-surface">
                      0039 8451 23
                    </span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center hover:bg-primary/15 active:scale-90 transition-all"
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
                  <span className="block text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">
                    Ledger Reference
                  </span>
                  <span className="block text-sm font-bold text-primary">
                    SUNLIT / {project?.id?.slice(0, 8) || 'XXXX'}
                  </span>
                </div>
              </div>

              {/* Timer + Actions */}
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock size={14} className={timeRemaining < 300 ? 'text-error animate-pulse' : 'text-primary'} />
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${timeRemaining < 300 ? 'text-error' : 'text-on-surface'}`}>
                    Session Expires: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                  </span>
                </div>

                {payError && (
                  <div className="p-3 bg-error/8 text-error rounded-xl flex items-center gap-2 text-xs font-bold border border-error/20">
                    <ShieldAlert size={14} />
                    <span>{payError}</span>
                  </div>
                )}

                <button
                  onClick={startFunding}
                  disabled={!kycOk}
                  className="w-full h-14 cta-gradient text-white rounded-xl font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cta-glow"
                >
                  <Wallet size={18} />
                  {kycOk ? 'Initialize Secure Payment' : 'Verification Required'}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-on-surface-variant/30">
                  <Lock size={10} />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">
                    Protected via Sunlit Institutional Vault
                  </span>
                </div>
              </div>
            </div>
          )}
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
          href={`/dashboard/project-owner/projects/${projectId}`}
          className="text-xs font-extrabold text-primary flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap"
        >
          View Project <ChevronRight size={14} />
        </Link>
      </div>

      {/* Attribution */}
      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 610e220d · Escrow Funding Authority
      </p>
    </div>
  );
}
