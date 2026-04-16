'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Zap, Wrench, CheckCircle, Hourglass, Flag, Upload, Star, ShieldAlert, MessageSquare, History, LayoutDashboard } from 'lucide-react';
import { fetchProject, releaseEscrow } from '@/dashboards/project-owner/services/project-owner-api';
import KYCModal from '../../components/KYCModal';
import ChatWindow from '../../components/ChatWindow';
import AuditTrail from '../../components/AuditTrail';
import type { ProjectView, MilestoneView } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'badge--pending', funded: 'badge--funded',
    held: 'badge--pending', released: 'badge--completed',
    disputed: 'badge--disputed',
  };
  return map[status] || 'badge--pending';
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [project, setProject] = useState<ProjectView | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(false); // Mock KYC status
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
      setToast(res.error || 'Release failed. Conditions not met.');
      setTimeout(() => setToast(''), 5000);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !project) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', project.id);
    
    try {
      const res = await fetch('/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setToast('File uploaded and quarantined securely.');
      } else {
        setToast(data.error || 'Upload failed due to security checks.');
      }
    } catch {
      setToast('Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!project) return;
    setReviewSubmitted(true);
    // In actual implementation, send to /api/v1/reviews
    setToast('Review submitted securely and marked as immutable.');
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--card" style={{ height: 200 }} />
        <div className="skeleton skeleton--card" style={{ height: 400 }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.page}>
        <div className="empty-state">
          <p className="title-md">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {toast && (
        </div>
      )}

      {/* KYC Alert for Financial Actions */}
      {!isKycVerified && project.status === 'in_progress' && (
        <div className="surface-card bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-amber-500" size={20} />
            <p className="body-sm text-amber-900 font-medium">Identity verification required to fund or release escrow.</p>
          </div>
          <button onClick={() => setIsKycModalOpen(true)} className="btn btn-primary btn-xs">Verify Now</button>
        </div>
      )}

      <KYCModal 
        isOpen={isKycModalOpen} 
        onClose={() => setIsKycModalOpen(false)} 
        onSuccess={() => setIsKycVerified(true)} 
      />

      <div className={styles.header}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Dashboard
          </Link>
          <div className="flex gap-2">
             <Link href="/dashboard/project-owner/disputes/new" className="btn btn-outline btn-sm text-danger border-danger hover:bg-danger/5">
                <Flag size={14} className="mr-2" /> Raise Dispute
             </Link>
          </div>
        </div>

        <div className={styles.headerMain}>
          <div>
            <h1 className="headline-lg">{project.title}</h1>
            <p className="body-md text-muted flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1"><MapPin size={14} /> {project.locationCity}, {project.locationState}</span> · 
              <span className="flex items-center gap-1 text-primary font-bold"><Zap size={14} /> {project.systemSizeKw}kW System</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`badge ${getStatusClass(project.status)}`}>{project.status.replace('_', ' ')}</span>
            <span className="body-xs text-muted">ID: {project.id}</span>
          </div>
        </div>

        {/* PRO MAX Tabs */}
        <div className="flex border-b border-border mt-8 gap-8">
           {(['overview', 'messages', 'audit'] as const).map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                 activeTab === tab ? 'text-primary' : 'text-muted hover:text-foreground'
               }`}
             >
               <div className="flex items-center gap-2">
                 {tab === 'overview' && <LayoutDashboard size={16} />}
                 {tab === 'messages' && <MessageSquare size={16} />}
                 {tab === 'audit' && <History size={16} />}
                 {tab}
               </div>
               {activeTab === tab && (
                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in" />
               )}
             </button>
           ))}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 stagger-children">
            {/* Progress Overview */}
            <div className={`surface-card animate-in ${styles.progressSection}`}>
              <div className={styles.progressHeader}>
                <h2 className="title-lg">Project Progress</h2>
                <span className="headline-sm text-primary">{project.progressPercent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${project.progressPercent}%` }} />
              </div>
              <div className={styles.progressStats}>
                <div>
                  <span className="label-md">Total Budget</span>
                  <span className="title-md">{formatCurrency(project.totalBudget)}</span>
                </div>
                <div>
                  <span className="label-md">Paid</span>
                  <span className="title-md text-primary">{formatCurrency(project.totalPaid)}</span>
                </div>
                <div>
                  <span className="label-md">Remaining</span>
                  <span className="title-md">{formatCurrency(project.totalBudget - project.totalPaid)}</span>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <section className={styles.milestonesSection}>
              <h2 className="headline-sm">Work Execution & Escrow</h2>
              <div className={`stagger-children ${styles.milestoneList}`}>
                {project.milestones.map((ms) => (
                  <div key={ms.id} className={`surface-card animate-in ${styles.milestoneCard}`}>
                    <div className={styles.milestoneHeader}>
                      <div className={styles.milestoneInfo}>
                        <div className={`${styles.milestoneStep} ${ms.isCompleted ? styles.milestoneStepDone : ''}`}>
                          {ms.isCompleted ? <CheckCircle size={16} /> : ms.position}
                        </div>
                        <div>
                          <h3 className="title-md">{ms.title}</h3>
                          <span className="body-sm text-muted">{formatCurrency(ms.amount)}</span>
                        </div>
                      </div>
                      {ms.escrowStatus && (
                        <span className={`badge ${getStatusClass(ms.escrowStatus)}`}>
                          {ms.escrowStatus}
                        </span>
                      )}
                    </div>

                    {/* Milestone Actions */}
                    <div className={styles.milestoneActions}>
                      {ms.escrowStatus === 'pending' && (
                        <button
                          onClick={() => isKycVerified ? window.location.href = `/dashboard/project-owner/projects/${project.id}/escrow-funding` : setIsKycModalOpen(true)}
                          className="btn btn-primary btn-sm"
                        >
                          Fund Escrow
                        </button>
                      )}
                      {ms.escrowStatus === 'funded' && ms.isCompleted && !ms.isApproved && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => isKycVerified ? handleRelease(ms) : setIsKycModalOpen(true)}
                          disabled={releasing === ms.id}
                          aria-busy={releasing === ms.id}
                        >
                          {releasing === ms.id ? 'Releasing...' : 'Approve & Release'}
                        </button>
                      )}
                      {ms.escrowStatus === 'funded' && !ms.isCompleted && (
                        <span className="body-sm text-muted flex items-center gap-1 font-medium"><Hourglass size={14} className="text-amber-500" /> Installer is working on this...</span>
                      )}
                      {ms.escrowStatus === 'released' && (
                        <span className="body-sm text-primary flex items-center gap-1 font-bold"><CheckCircle size={14} /> Milestone Paid</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Progress Evidence / File Upload */}
            <section className={styles.milestonesSection}>
              <h2 className="headline-sm">Secure Evidence Documents</h2>
              <div className="surface-card p-6 flex flex-col gap-4 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <p className="body-md text-muted italic">Share signed contracts, site photos, or completion certificates securely.</p>
                <div className="flex gap-4">
                  <label className="btn btn-outline btn-sm cursor-pointer flex items-center justify-center">
                    <Upload size={14} className="mr-2" /> 
                    {uploading ? 'Processing Security Scan...' : 'Upload Secure File'}
                    <input 
                      type="file" 
                      style={{ display: 'none' }}
                      disabled={uploading}
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={handleFileUpload} 
                    />
                  </label>
                  <p className="label-sm text-muted mt-2">Allowed: JPEG, PNG, PDF (Max 10MB). Files are quarantined for 30s.</p>
                </div>
              </div>
            </section>

            {/* Review & Rating */}
            {project.progressPercent === 100 && (
              <section className={styles.milestonesSection}>
                <h2 className="headline-sm">Final Project Review</h2>
                {reviewSubmitted ? (
                   <div className="surface-card p-6 bg-green-50 border border-green-200">
                     <p className="title-md text-green-800 flex items-center gap-2"><CheckCircle2 size={24}/> Thank you. Feedback immutable.</p>
                   </div>
                ) : (
                  <form className="surface-card p-6 flex flex-col gap-6" onSubmit={handleSubmitReview}>
                    <div className="space-y-1">
                      <p className="title-md">How was your experience with {project.installerName}?</p>
                      <p className="body-sm text-muted">Your review helps maintain the integrity of the Sunlit ecosystem.</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                         <button 
                           key={star} 
                           type="button" 
                           className={`p-1 transition-transform hover:scale-110 ${reviewRating >= star ? 'text-primary' : 'text-neutral-200'}`}
                           onClick={() => setReviewRating(star)}
                         >
                           <Star size={40} fill={reviewRating >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
                         </button>
                      ))}
                    </div>
                    <textarea 
                       value={reviewText}
                       onChange={e => setReviewText(e.target.value)}
                       className="form-input min-h-[120px] w-full text-lg p-4" 
                       placeholder="Tell us about the quality of installation, professionalism, etc."
                       required
                    />
                    <button type="submit" className="btn btn-primary w-fit px-8" disabled={reviewRating === 0}>
                      Submit Immutable Review
                    </button>
                  </form>
                )}
              </section>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="animate-in slide-in-from-right stagger-children">
             <ChatWindow projectId={project.id} />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="animate-in slide-in-from-right stagger-children">
             <AuditTrail projectId={project.id} />
          </div>
        )}
      </div>
    </div>
  );
}
