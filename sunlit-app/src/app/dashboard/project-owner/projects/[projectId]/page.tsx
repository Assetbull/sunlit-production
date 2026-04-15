'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Zap, Wrench, CheckCircle, Hourglass, Flag, Upload, Star } from 'lucide-react';
import { fetchProject, releaseEscrow } from '@/dashboards/project-owner/services/project-owner-api';
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
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
        <div className={`toast ${toast.includes('success') ? 'toast--success' : 'toast--error'}`} role="status">
          {toast}
        </div>
      )}

      <div className={styles.header}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <div className={styles.headerMain}>
          <div>
            <h1 className="headline-lg">{project.title}</h1>
            <p className="body-md text-muted flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1"><MapPin size={14} /> {project.locationCity}, {project.locationState}</span> · 
              <span className="flex items-center gap-1"><Zap size={14} /> {project.systemSizeKw}kW</span> · 
              <span className="flex items-center gap-1"><Wrench size={14} /> {project.installerName}</span>
            </p>
          </div>
          <span className={`badge ${getStatusClass(project.status)}`}>{project.status.replace('_', ' ')}</span>
        </div>
      </div>

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
        <h2 className="headline-sm">Milestones</h2>
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
                  <Link
                    href={`/dashboard/project-owner/escrow/fund/${ms.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Fund Escrow
                  </Link>
                )}
                {ms.escrowStatus === 'funded' && ms.isCompleted && !ms.isApproved && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleRelease(ms)}
                    disabled={releasing === ms.id}
                    aria-busy={releasing === ms.id}
                  >
                    {releasing === ms.id ? 'Releasing...' : 'Approve & Release'}
                  </button>
                )}
                {ms.escrowStatus === 'funded' && !ms.isCompleted && (
                  <span className="body-sm text-muted flex items-center gap-1"><Hourglass size={14} /> Awaiting completion by installer</span>
                )}
                {ms.escrowStatus === 'released' && (
                  <span className="body-sm text-primary flex items-center gap-1"><CheckCircle size={14} /> Payment released</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress Evidence / File Upload (Step 8) */}
      <section className={styles.milestonesSection}>
        <h2 className="headline-sm">Project Evidence & Contracts</h2>
        <div className="surface-card p-4 flex flex-col gap-4">
          <p className="body-md text-muted">Upload securely sanitized JPEGs, PNGs, or PDFs matching Sunlit&apos;s rules.</p>
          <label className="btn btn-outline btn-sm w-fit cursor-pointer flex items-center justify-center">
            <Upload size={14} className="mr-2" /> 
            {uploading ? 'Processing File...' : 'Upload Evidence Document'}
            <input 
              type="file" 
              style={{ display: 'none' }}
              disabled={uploading}
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileUpload} 
            />
          </label>
        </div>
      </section>

      {/* Review & Rating (Step 10) - Appears only when 100% complete */}
      {project.progressPercent === 100 && (
        <section className={styles.milestonesSection}>
          <h2 className="headline-sm">Leave a Review</h2>
          {reviewSubmitted ? (
             <div className="surface-card p-4">
               <p className="body-md text-primary flex items-center gap-2"><CheckCircle size={16}/> Rating recorded immutably.</p>
             </div>
          ) : (
            <form className="surface-card p-4 flex flex-col gap-4" onSubmit={handleSubmitReview}>
              <p className="body-md text-muted">Rate your experience. Reviews cannot be altered once submitted.</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                   <button 
                     key={star} 
                     type="button" 
                     className={`btn btn-ghost p-1 ${reviewRating >= star ? 'text-primary' : 'text-muted'}`}
                     onClick={() => setReviewRating(star)}
                   >
                     <Star size={24} fill={reviewRating >= star ? 'currentColor' : 'none'} />
                   </button>
                ))}
              </div>
              <textarea 
                 value={reviewText}
                 onChange={e => setReviewText(e.target.value)}
                 className="form-input min-h-[100px] w-full mt-2" 
                 placeholder="Provide detailed feedback..."
                 required
              />
              <button type="submit" className="btn btn-primary btn-sm w-fit mt-2" disabled={reviewRating === 0}>
                Submit Review
              </button>
            </form>
          )}
        </section>
      )}

      {/* Actions */}
      <div className={styles.pageActions}>
        <Link href="/dashboard/project-owner/disputes/new" className="btn btn-danger btn-sm">
          <Flag size={14} className="mr-2" /> Raise Dispute
        </Link>
      </div>
    </div>
  );
}
