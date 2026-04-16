'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Zap, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  MoreHorizontal,
  ChevronRight,
  Lock,
  Camera,
  FileText,
  History,
  MessageSquare,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import { fetchProject, releaseEscrow } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from '../../components/KYCModal';
import ChatWindow from '../../components/ChatWindow';
import AuditTrail from '../../components/AuditTrail';
import type { ProjectView, MilestoneView } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    maximumFractionDigits: 0 
  }).format(amount);
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<ProjectView | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'audit'>('overview');

  useEffect(() => {
    async function load() {
      const res = await fetchProject(projectId);
      if (res.success && res.data) setProject(res.data);
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function handleRelease(ms: MilestoneView) {
    if (!ms.escrowId || !project) return;
    setReleasing(ms.id);
    const res = await releaseEscrow(ms.escrowId, project.id, ms.id);
    setReleasing(null);
    if (res.success) {
      setToast('Escrow released successfully!');
      setTimeout(() => setToast(''), 3000);
    } else {
      setToast(res.error || 'Release failed.');
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="skeleton-h1 h-12 w-1/3 mb-4" />
        <div className="skeleton h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="skeleton h-96 rounded-[32px]" />
          </div>
          <div className="space-y-8">
            <div className="skeleton h-64 rounded-[28px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  const activeMilestone = project.milestones.find(m => !m.isApproved) || project.milestones[project.milestones.length - 1];

  return (
    <div className={styles.page}>
      <KYCModal 
        isOpen={isKycModalOpen} 
        onClose={() => setIsKycModalOpen(false)} 
        onSuccess={() => setIsKycVerified(true)} 
      />

      <header className={styles.header}>
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/project-owner" className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="bg-primary/5 text-primary text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
            Project: {project.id}
          </span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-extrabold font-headline text-slate-900 tracking-tight leading-tight">
              Project <span className="text-primary">Execution</span>
            </h1>
            <p className="text-xl text-slate-500 mt-2 flex items-center gap-2">
              <MapPin size={20} className="text-primary" /> {project.locationCity}, {project.locationState}
            </p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setActiveTab('messages')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <MessageSquare size={18} /> Team Chat
             </button>
             <button className="flex items-center gap-2 px-6 py-3 cta-gradient text-white rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all">
                <LayoutDashboard size={18} /> Controls
             </button>
          </div>
        </div>

        {/* PRO MAX Tabs */}
        <nav className="flex gap-10 mt-12 border-b border-slate-100">
           {(['overview', 'messages', 'audit'] as const).map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-xs font-extrabold uppercase tracking-[0.2em] transition-all relative ${
                 activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-900'
               }`}
             >
               {tab}
               {activeTab === tab && (
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
               )}
             </button>
           ))}
        </nav>
      </header>

      {activeTab === 'overview' && (
        <>
          {/* Timeline Section */}
          <section className={styles.timelineSection}>
            <div className={styles.timelineWrapper}>
              <div className={styles.timelineLine}>
                <div 
                  className={styles.timelineLineFill} 
                  style={{ width: `${(project.progressPercent / 100) * 100}%` }} 
                />
              </div>
              {project.milestones.map((ms, i) => (
                <div 
                  key={ms.id} 
                  className={`${styles.timelineNode} ${ms.isCompleted ? styles.nodeDone : i === project.milestones.findIndex(m => !m.isCompleted) ? styles.nodeActive : ''}`}
                >
                  <div className={styles.nodeIcon}>
                    {ms.isCompleted ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="mt-2">
                    <h4 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-widest">{ms.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">
                       {ms.isCompleted ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.grid}>
            <div className={styles.mainContent}>
              {/* Active Milestone Card */}
              <div className={styles.activeMilestoneCard}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Active Workspace</span>
                    </div>
                    <h2 className="text-3xl font-extrabold font-headline text-slate-900">{activeMilestone?.title}</h2>
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 text-primary rounded-full flex items-center gap-2 border border-emerald-100">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-extrabold uppercase">Escrow Protected</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Evidence Payload</span>
                    <div className={styles.evidenceGrid}>
                      <div className={styles.evidenceItem}>
                        <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=300&q=80" alt="Evidence" />
                      </div>
                      <div className={styles.evidenceItem}>
                        <img src="https://images.unsplash.com/photo-1509391366360-fe5bb58583fb?auto=format&fit=crop&w=300&q=80" alt="Evidence" />
                      </div>
                      <div className="aspect-ratio p-4 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                        <Camera size={24} />
                        <span className="text-[9px] font-bold mt-2 uppercase">Add Scan</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Milestone Value</span>
                      <p className="text-4xl font-extrabold font-headline text-slate-900 mt-2">{formatCurrency(activeMilestone?.amount || 0)}</p>
                    </div>
                    
                    <button 
                      onClick={() => isKycVerified ? (activeMilestone && handleRelease(activeMilestone)) : setIsKycModalOpen(true)}
                        disabled={releasing === activeMilestone?.id || activeMilestone?.isApproved}
                      className="w-full py-4 mt-8 bg-slate-950 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-slate-200"
                    >
                      <Lock size={18} />
                      {releasing === activeMilestone?.id ? 'Authenticating...' : 'Authorize Escrow Release'}
                    </button>
                    {!isKycVerified && (
                       <p className="text-[9px] text-amber-600 font-bold mt-3 text-center uppercase tracking-widest flex items-center justify-center gap-1">
                         <ShieldAlert size={12} /> KYC Verification Required
                       </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Audit Ledger */}
              <div className={styles.auditLedger}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-extrabold font-headline text-slate-900">Immutable Audit Ledger</h3>
                  <button className="text-xs font-extrabold text-primary uppercase tracking-widest">View Full History</button>
                </div>
                <div className="space-y-4">
                  <div className={styles.auditItem}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-primary">
                        <Camera size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 condensed">Site Evidence Uploaded</p>
                        <p className="text-[10px] font-mono text-slate-400">Hash: 8f2a...d91c</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">10:42 AM</span>
                  </div>

                  <div className={styles.auditItem}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-900 condensed">Third-Party Verification Passed</p>
                        <p className="text-[10px] font-mono text-slate-400">Inspector ID: INS-992</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">09:15 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className={styles.sidebar}>
              {/* Escrow Health */}
              <div className={styles.glassWidget}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-emerald-100">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Escrow Health</h4>
                    <p className="text-[10px] text-primary font-bold">100% Secured</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Vault Balance</span>
                    <p className="text-3xl font-extrabold font-headline text-slate-900 tracking-tighter mt-1">{formatCurrency(project.totalBudget - project.totalPaid)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Disbursed</span>
                      <p className="text-sm font-extrabold text-slate-800">{formatCurrency(project.totalPaid)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pending ms</span>
                      <p className="text-sm font-extrabold text-slate-800">₦0.00</p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${project.progressPercent}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Stakeholders */}
              <div className="p-8 bg-slate-50 rounded-[28px]">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">Verified Stakeholders</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                      <Star size={18} className="text-amber-500" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">Paystack Escrow</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Financial Custodian</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{project.installerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Head Contractor</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/dashboard/project-owner/disputes/new" className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs uppercase hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                <ShieldAlert size={16} /> Open Dispute Thread
              </Link>
            </aside>
          </div>
        </>
      )}

      {activeTab === 'messages' && <ChatWindow projectId={project.id} />}
      {activeTab === 'audit' && <AuditTrail projectId={project.id} />}
    </div>
  );
}
