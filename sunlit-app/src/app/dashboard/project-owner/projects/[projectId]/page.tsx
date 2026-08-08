'use client';

/**
 * Project Command Center
 * Stitch Screen: 2457bd7a9eee4c3ebd24d8e6bd6e39c3
 * Crew Isolation: ENFORCED — zero crew data exposure.
 */

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Zap, CheckCircle2, Clock, ShieldCheck, ChevronRight,
  Lock, Camera, Activity, Calendar, ShieldAlert, Star, Eye,
} from 'lucide-react';
import { fetchProject, releasePayment, fetchKycStatus } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from '../../components/KYCModal';
import ChatWindow from '../../components/ChatWindow';
import AuditTrail from '../../components/AuditTrail';
import type { ProjectView, MilestoneView } from '@/dashboards/project-owner/types/dashboard';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

function ProgressRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="transparent" stroke="var(--surface-container)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="transparent" stroke="var(--primary)" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-extrabold font-headline text-primary">{pct}%</span>
      </div>
    </div>
  );
}

// OTP Modal for SMS-based payment release
function OTPModal({ open, onClose, onConfirm, loading }: { open: boolean; onClose: () => void; onConfirm: (otp: string) => void; loading: boolean }) {
  const [digits, setDigits] = useState(['','','','','','']);
  if (!open) return null;
  const handleChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) {
      const el = document.getElementById(`otp-${idx+1}`);
      el?.focus();
    }
    if (idx === 5 && val) onConfirm(next.join(''));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] p-10 max-w-md w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center text-primary mx-auto mb-6">
          <Lock size={28} />
        </div>
        <h3 className="font-headline text-2xl font-extrabold text-on-surface text-center tracking-tight mb-2">Verify Payment Release</h3>
        <p className="text-on-surface-variant text-sm text-center mb-8">Enter the 6-digit OTP sent to your registered phone number</p>
        <div className="flex justify-center gap-3 mb-8">
          {digits.map((d, i) => (
            <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value.replace(/\D/g, ''))}
              className="w-12 h-14 text-center text-xl font-extrabold bg-surface-container-lowest border-2 border-outline-variant/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onConfirm(digits.join(''))} disabled={digits.some(d => !d) || loading}
            className="flex-1 h-12 cta-gradient text-white rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md disabled:opacity-40 transition-all">
            {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : 'Confirm Release'}
          </button>
          <button onClick={onClose} className="h-12 px-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl font-extrabold text-on-surface-variant transition-all">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<ProjectView | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [otpTarget, setOtpTarget] = useState<MilestoneView | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'audit'>('overview');

  useEffect(() => {
    async function load() {
      const [projRes, kycRes] = await Promise.all([fetchProject(projectId), fetchKycStatus()]);
      if (projRes.success && projRes.data) setProject(projRes.data);
      if (kycRes.success && kycRes.data?.canFundPayment) setIsKycVerified(true);
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function handleRelease(ms: MilestoneView) {
    if (!ms.paymentId || !project) return;
    setReleasing(ms.id);
    const res = await releasePayment(ms.paymentId, project.id, ms.id);
    setReleasing(null);
    setOtpTarget(null);
    if (res.success) {
      setToast('Payment released successfully!');
      setTimeout(() => setToast(''), 3000);
    } else {
      setToast(res.error || 'Release failed.');
    }
  }

  function initiateRelease(ms: MilestoneView) {
    if (!isKycVerified) { setIsKycModalOpen(true); return; }
    setOtpTarget(ms);
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-4 w-40 bg-surface-container rounded-full" />
        <div className="h-12 w-96 bg-surface-container-high rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="h-40 bg-surface-container-lowest rounded-[2rem]" />)}</div>
          <div className="h-80 bg-surface-container-lowest rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (!project) return <div className="text-center py-20 text-on-surface-variant">Project not found</div>;

  const activeMilestone = project.milestones.find(m => !m.isApproved) || project.milestones[project.milestones.length - 1];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-10">
      <KYCModal isOpen={isKycModalOpen} onClose={() => setIsKycModalOpen(false)} onSuccess={() => setIsKycVerified(true)} />
      <OTPModal open={!!otpTarget} onClose={() => setOtpTarget(null)} loading={releasing !== null} onConfirm={() => otpTarget && handleRelease(otpTarget)} />

      {toast && (
        <div className="fixed bottom-10 right-10 z-50 bg-on-surface text-white px-8 py-4 rounded-full font-extrabold text-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <ShieldCheck size={20} className="text-emerald-400" /> {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/project-owner" className="flex items-center gap-2 group">
          <div className="p-2 bg-surface-container-lowest rounded-xl text-on-surface-variant/40 group-hover:text-primary transition-all"><ArrowLeft size={16} /></div>
          <span className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest group-hover:text-on-surface transition-colors">Command Center</span>
        </Link>
        <ChevronRight size={10} className="text-on-surface-variant/30" />
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Project: {project.id.slice(0, 8)}</span>
      </div>

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/70 mb-3 flex items-center gap-2">
            <span className="w-6 h-[2px] bg-primary" /> Project Authority
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Project <span className="text-primary">Execution</span>
          </h1>
          <div className="flex items-center gap-5 mt-4 flex-wrap text-sm text-on-surface-variant font-medium">
            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary/50" /> {project.locationCity}, {project.locationState}</span>
            <span className="flex items-center gap-1.5"><Calendar size={16} className="text-primary/50" /> Est. Completion: 2026</span>
          </div>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link href={`/dashboard/project-owner/projects/${project.id}/execution`}
              className="h-10 px-5 bg-primary text-white rounded-xl font-extrabold text-xs flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-sm">
              <Activity size={14} /> Execution Center
            </Link>
            <Link href={`/dashboard/project-owner/projects/${project.id}/milestones`}
              className="h-10 px-5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-xl font-extrabold text-xs flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all">
              <Eye size={14} /> Milestones
            </Link>
            <Link href="/dashboard/project-owner/escrow"
              className="h-10 px-5 bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant rounded-xl font-extrabold text-xs flex items-center gap-2 hover:border-primary/30 hover:text-primary transition-all">
              <ShieldCheck size={14} /> Fund Escrow
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/30 flex-shrink-0">
          {(['overview', 'messages', 'audit'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab ? 'bg-white text-primary shadow-md border border-outline-variant/20' : 'text-on-surface-variant/50 hover:text-on-surface-variant'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-8">
            {/* Progress Bento */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
              <div className="liquid-glass rounded-[2rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline text-xl font-extrabold text-on-surface tracking-tight">Overall Progress</h3>
                    <p className="text-sm text-on-surface-variant mt-1">{project.title}</p>
                  </div>
                  <ProgressRing pct={project.progressPercent} />
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${project.progressPercent}%` }} />
                </div>
              </div>

              <div className="liquid-glass rounded-[2rem] p-6 flex flex-col justify-center">
                <p className="text-[10px] font-extrabold text-error/70 uppercase tracking-widest mb-2 flex items-center gap-1"><ShieldAlert size={12} /> Action Required</p>
                <p className="font-headline font-extrabold text-on-surface text-sm tracking-tight">{activeMilestone?.title || 'No Pending Actions'}</p>
                <p className="text-xs text-on-surface-variant mt-1">Review Proofs & Authorize</p>
              </div>
            </div>

            {/* Milestone Tracker */}
            <div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface tracking-tight mb-5">Milestone Tracker</h3>
              <div className="space-y-4">
                {project.milestones.map((ms) => {
                  const isActive = ms.id === activeMilestone?.id;
                  return (
                    <div key={ms.id} className={`liquid-glass rounded-2xl p-6 transition-all ${isActive ? 'ring-1 ring-primary/20 shadow-md' : ''}`}>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          ms.isApproved ? 'bg-primary/8 text-primary' : isActive ? 'bg-amber-50 text-amber-600' : 'bg-surface-container text-on-surface-variant/40'
                        }`}>
                          {ms.isApproved ? <CheckCircle2 size={22} /> : isActive ? <Zap size={22} /> : <Clock size={22} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="font-headline text-base font-extrabold text-on-surface">{ms.title}</h4>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                              ms.isApproved ? 'bg-primary/8 text-primary' : isActive ? 'bg-amber-50 text-amber-600' : 'bg-surface-container text-on-surface-variant/50'
                            }`}>
                              {ms.isApproved ? 'Approved' : isActive ? 'Awaiting Review' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                            <span className="flex items-center gap-1"><Zap size={14} className="text-primary/50" /> {formatCurrency(ms.amount)}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {ms.isApproved ? (
                            <span className="text-xs font-extrabold text-primary flex items-center gap-1"><CheckCircle2 size={14} /> Released</span>
                          ) : isActive ? (
                            <button onClick={() => initiateRelease(ms)} disabled={releasing === ms.id}
                              className="h-10 px-5 cta-gradient text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all disabled:opacity-50">
                              {releasing === ms.id ? 'Authorizing...' : 'Authorize Release'} <ShieldCheck size={14} />
                            </button>
                          ) : (
                            <span className="text-xs text-on-surface-variant/40 font-bold">Pending</span>
                          )}
                        </div>
                      </div>

                      {isActive && (
                        <div className="mt-5 pt-5 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-3">Field Evidence</p>
                            <div className="flex gap-3 overflow-x-auto pb-1">
                              <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80" alt="Evidence" className="h-24 w-32 object-cover rounded-xl border border-outline-variant/20" />
                              <img src="https://images.unsplash.com/photo-1509391366360-fe5bb58583fb?auto=format&fit=crop&w=200&q=80" alt="Evidence" className="h-24 w-32 object-cover rounded-xl border border-outline-variant/20" />
                              <button className="h-24 w-32 flex flex-col items-center justify-center bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/40 hover:text-primary hover:border-primary/30 transition-all">
                                <Camera size={20} className="mb-1" /><span className="text-[10px] font-extrabold uppercase">More</span>
                              </button>
                            </div>
                          </div>
                          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20">
                            <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">Distribution Value</p>
                            <p className="text-2xl font-headline font-extrabold text-on-surface">{formatCurrency(ms.amount)}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant/50 mt-2 flex items-center gap-1"><Lock size={10} className="text-amber-500" /> Paystack Secured</p>
                            {!isKycVerified && (
                              <button onClick={() => setIsKycModalOpen(true)} className="mt-3 h-9 px-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 hover:bg-amber-100 transition-all">
                                <ShieldAlert size={12} /> KYC Required
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="liquid-glass rounded-[2rem] p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-primary/8 text-primary rounded-2xl flex items-center justify-center"><ShieldCheck size={22} /></div>
                <div><p className="text-[10px] font-extrabold text-on-surface uppercase tracking-widest">Vault Status</p><p className="text-[10px] text-primary font-bold mt-0.5">100% Secured</p></div>
              </div>
              <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">Remaining</p>
              <p className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-5">{formatCurrency(project.totalBudget - project.totalPaid)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20">
                  <p className="text-[9px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">Distributed</p>
                  <p className="text-xs font-extrabold text-on-surface">{formatCurrency(project.totalPaid)}</p>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20">
                  <p className="text-[9px] font-extrabold text-on-surface-variant/50 uppercase tracking-widest mb-1">Retention</p>
                  <p className="text-xs font-extrabold text-on-surface">₦0</p>
                </div>
              </div>
            </div>

            <div className="liquid-glass rounded-[2rem] p-6">
              <p className="text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-[0.2em] mb-5">Authorised Parties</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                  <div className="w-9 h-9 bg-surface-container rounded-lg flex items-center justify-center"><Star size={16} className="text-amber-500" fill="currentColor" /></div>
                  <div><p className="text-sm font-extrabold text-on-surface">Paystack</p><p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Custodian</p></div>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/20">
                  <div className="w-9 h-9 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant font-headline font-bold text-xs uppercase">{(project.installerName ?? 'UN').slice(0, 2)}</div>
                  <div><p className="text-sm font-extrabold text-on-surface">{project.installerName ?? 'Unassigned'}</p><p className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Contractor</p></div>
                </div>
              </div>
            </div>

            <Link href={`/dashboard/project-owner/projects/${project.id}/disputes/new`}
              className="flex items-center justify-center gap-2 h-12 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/50 font-extrabold text-xs uppercase tracking-widest hover:text-error hover:border-error/30 hover:bg-error/5 transition-all active:scale-95 group">
              <ShieldAlert size={14} className="group-hover:scale-110 transition-transform" /> Intervene & Dispute
            </Link>
          </aside>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="liquid-glass rounded-[2rem] h-[700px] overflow-hidden"><ChatWindow projectId={project.id} /></div>
      )}

      {activeTab === 'audit' && (
        <div className="liquid-glass rounded-[2rem] p-10">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">Immutable Audit Sequence</h2>
          <p className="text-on-surface-variant mb-8">Full cryptographic ledger of all project events.</p>
          <AuditTrail projectId={project.id} />
        </div>
      )}

      <p className="text-[10px] text-center text-on-surface-variant/25 font-extrabold uppercase tracking-widest">
        Stitch: 2457bd7a · Project Command Center
      </p>
    </div>
  );
}
