'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
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
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">← Back</Link>
        <div className={styles.headerMain}>
          <div>
            <h1 className="headline-lg">{project.title}</h1>
            <p className="body-md text-muted">
              📍 {project.locationCity}, {project.locationState} · ⚡ {project.systemSizeKw}kW · 🔧 {project.installerName}
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
                    {ms.isCompleted ? '✓' : ms.position}
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
                  <span className="body-sm text-muted">⏳ Awaiting completion by installer</span>
                )}
                {ms.escrowStatus === 'released' && (
                  <span className="body-sm text-primary">✓ Payment released</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className={styles.pageActions}>
        <Link href="/dashboard/project-owner/disputes/new" className="btn btn-danger btn-sm">
          ⚑ Raise Dispute
        </Link>
      </div>
    </div>
  );
}
