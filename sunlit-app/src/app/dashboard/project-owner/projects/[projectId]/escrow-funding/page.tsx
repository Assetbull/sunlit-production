'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  Copy, 
  CheckCircle, 
  RefreshCcw, 
  HandCoins,
  ChevronLeft,
  Lock,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { fetchProject, fetchKycStatus, initializePayment } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from '../../../components/KYCModal';
import type { ProjectView, MilestoneView } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
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
      if (kycRes.success && kycRes.data?.canFundEscrow) setKycOk(true);
      setLoading(false);
    }
    load();
  }, [projectId]);

  useEffect(() => {
    if (paymentStatus === 'awaiting_transfer') {
      const timer = setInterval(() => {
        setTimeRemaining(t => (t > 0 ? t - 1 : 0));
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
      p.milestones.find((m) => m.escrowStatus === 'pending' || (!m.escrowStatus && !m.isApproved)) ||
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

  if (loading) return null;

  const targetMilestone = pickFundMilestone(project);
  const amountToFund = targetMilestone?.amount || 0;

  return (
    <div className={styles.page}>
      <KYCModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        onSuccess={() => setKycOk(true)}
      />
      <header className={styles.header}>
        <div className="flex justify-center mb-8">
           <Link href={`/dashboard/project-owner`} className="flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-all">
              <ChevronLeft size={20} /> Back to Dashboard
           </Link>
        </div>
        <h1 className="text-5xl font-extrabold font-headline text-slate-900 tracking-tight">
          Secure <span className="text-primary">Escrow</span> Funding
        </h1>
        <p className="text-xl text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Initialize your decentralized trust vault for <strong>{project?.title}</strong>. 
          Funds are held in a secure 3-of-4 multisig-style Nigerian escrow.
        </p>
      </header>

      {!kycOk && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 text-sm font-bold text-center">
          KYC verification is required before escrow funding.&nbsp;
          <button type="button" className="underline text-primary" onClick={() => setKycModalOpen(true)}>
            Verify now
          </button>
        </div>
      )}

      <div className={styles.contentGrid}>
        <div className={styles.paymentCard}>
          <div className={styles.escrowHeader}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-primary shadow-sm border border-emerald-100">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">Tier-1 Verified Account</p>
              <h3 className="text-lg font-extrabold text-slate-900">Sunlit Energy Trust Vault</h3>
            </div>
          </div>

          {paymentStatus === 'success' ? (
            <div className={styles.successState}>
              <div className="w-24 h-24 rounded-full bg-emerald-50 text-primary flex items-center justify-center mb-8 shadow-inner">
                <CheckCircle size={56} />
              </div>
              <h2 className="text-4xl font-extrabold font-headline text-slate-900 tracking-tight">Verification Success</h2>
              <p className="text-lg text-slate-500 mt-4">Funds confirmed. Initializing project logistics...</p>
              <div className="mt-8 flex items-center gap-2 text-primary font-bold">
                <RefreshCcw size={18} className="animate-spin" /> Redirecting to Workspace
              </div>
            </div>
          ) : paymentStatus === 'verifying' ? (
            <div className={styles.verifyingState}>
              <RefreshCcw size={64} className="text-primary animate-spin mb-8" />
              <h2 className="text-4xl font-extrabold font-headline text-slate-900 tracking-tight">Syncing Nodes...</h2>
              <p className="text-lg text-slate-500 mt-4">Confirming ledger update across verified payment providers.</p>
            </div>
          ) : (
            <>
              <div className={styles.amountContainer}>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Initial Commitment</span>
                <h2 className="text-5xl font-extrabold font-headline text-slate-900 tracking-tighter mt-2">{formatCurrency(amountToFund)}</h2>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                   <Zap size={14} className="text-primary" />
                   <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Next Phase: Procurement</span>
                </div>
              </div>

              <div className={styles.timerBar}>
                <Clock size={16} className={timeRemaining < 300 ? 'text-red-500' : 'text-primary'} />
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${timeRemaining < 300 ? 'text-red-500' : 'text-slate-500'}`}>
                  Vault Window Close: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </span>
              </div>

              <div className={styles.accountBox}>
                <div className={styles.accountRow}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bank Partner</span>
                  <span className="text-sm font-extrabold text-slate-900">Titan-Paystack</span>
                </div>
                <div className={styles.accountRow}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Routing No.</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-slate-900 tracking-[0.2em]">0039845123</span>
                    <button onClick={copyToClipboard} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-primary transition-all">
                       {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                <div className={styles.accountRow}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</span>
                  <span className="text-sm font-extrabold text-slate-800">SUNLIT / {project?.id?.slice(0, 8)}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-3">
                {payError ? (
                  <p className="text-center text-sm font-bold text-red-600">{payError}</p>
                ) : null}
                <button 
                  onClick={startFunding} 
                  disabled={!kycOk}
                  className="w-full py-5 cta-gradient text-white rounded-[1.25rem] font-extrabold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HandCoins size={24} /> {kycOk ? 'Pay with Paystack (escrow)' : 'Complete KYC to pay'}
                </button>
                <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
                   <Lock size={12} /> Funds are confirmed only via Paystack webhook — never in-browser                </p>
              </div>
            </>
          )}
        </div>

        <aside className={styles.infoSidebar}>
            <div className={styles.infoCard}>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-6 pb-4 border-b border-slate-100">Escrow Protocol</h3>
                <ul className={styles.infoList}>
                   <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-primary flex items-center justify-center flex-shrink-0 font-bold text-xs ring-4 ring-white">1</div>
                      <div>
                        <p className="font-extrabold text-slate-900">Verification</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Deposit funds into the multisig-locked Nigerian trust account.</p>
                      </div>
                   </li>
                   <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
                      <div>
                        <p className="font-extrabold text-slate-900">Procurement</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Installer receives proof of funds and begins equipment procurement.</p>
                      </div>
                   </li>
                   <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
                      <div>
                        <p className="font-extrabold text-slate-900">Release</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">You authorize disbursement only after physical inspection.</p>
                      </div>
                   </li>
                </ul>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center">
              <ShieldAlert className="text-slate-300 mb-3" size={32} />
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Payment Support</p>
              <button className="mt-2 text-primary font-bold text-xs hover:underline">Chat with Treasury Team</button>
            </div>
        </aside>
      </div>
    </div>
  );
}
