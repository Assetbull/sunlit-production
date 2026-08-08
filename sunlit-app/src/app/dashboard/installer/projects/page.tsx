'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import styles from './page.module.css';

/**
 * Active Projects — Installer Dashboard
 *
 * GEMINI.md §4 step 7-8: Execution Started → Milestones Updated
 * Shows all projects where installer has won the contract.
 */

interface ProjectSummary {
  id: string; title: string; client: string;
  location: string; contractValue: number; status: string;
  milestonesTotal: number; milestonesCompleted: number;
  paymentFunded: number; paymentReleased: number;
  startDate: string;
}

const MOCK_PROJECTS: ProjectSummary[] = [
  {
    id: 'proj-001', title: 'Modernist Villa Solar System', client: 'Edward Adeyemi',
    location: 'Lagos, Ikoyi', contractValue: 4200000, status: 'in_progress',
    milestonesTotal: 5, milestonesCompleted: 2,
    paymentFunded: 4200000, paymentReleased: 1680000,
    startDate: new Date(Date.now() - 1036800000).toISOString(),
  },
  {
    id: 'proj-002', title: 'Office Complex Energy Upgrade', client: 'Chidi Nwosu',
    location: 'Abuja, Garki', contractValue: 18000000, status: 'in_progress',
    milestonesTotal: 6, milestonesCompleted: 1,
    paymentFunded: 18000000, paymentReleased: 3000000,
    startDate: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'proj-003', title: 'Tech Hub Commercial Installation', client: 'Sarah Kolade',
    location: 'Lagos, Lekki', contractValue: 10500000, status: 'in_progress',
    milestonesTotal: 5, milestonesCompleted: 3,
    paymentFunded: 10500000, paymentReleased: 6300000,
    startDate: new Date(Date.now() - 2592000000).toISOString(),
  },
];

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  return `₦${amount.toLocaleString()}`;
}

export default function ActiveProjectsPage() {
  const projects = MOCK_PROJECTS;

  const totalValue = projects.reduce((sum, p) => sum + p.contractValue, 0);
  const totalPaymentHeld = projects.reduce((sum, p) => sum + (p.paymentFunded - p.paymentReleased), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tagBadge}><Briefcase size={12} /> Active Projects</div>
        <h1 className={styles.title}>Active Projects</h1>
        <p className={styles.subtitle}>Manage your ongoing solar installation contracts.</p>
      </header>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: '#0F631B' }}>{projects.length}</span>
          <span className={styles.statLabel}>Active Projects</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatCurrency(totalValue)}</span>
          <span className={styles.statLabel}>Total Contract Value</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatCurrency(totalPaymentHeld)}</span>
          <span className={styles.statLabel}>Payment Held</span>
        </div>
      </div>

      {/* Project Cards */}
      {projects.length > 0 ? (
        <div className={styles.projectList}>
          {projects.map((project) => {
            const progress = Math.round((project.milestonesCompleted / project.milestonesTotal) * 100);
            const paymentProgress = Math.round((project.paymentReleased / project.paymentFunded) * 100);

            return (
              <Link
                key={project.id}
                href={`/dashboard/installer/projects/${project.id}`}
                className={styles.projectCard}
              >
                <div className={styles.projectCardHeader}>
                  <div>
                    <h3 className={styles.projectName}>{project.title}</h3>
                    <div className={styles.projectMeta}>
                      <span>{project.client}</span>
                      <span>•</span>
                      <span><MapPin size={12} style={{ verticalAlign: 'middle' }} /> {project.location}</span>
                    </div>
                  </div>
                  <span className={styles.contractValue}>{formatCurrency(project.contractValue)}</span>
                </div>

                {/* Progress */}
                <div className={styles.progressSection}>
                  <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>Milestones</span>
                    <span className={styles.progressValue}>
                      {project.milestonesCompleted}/{project.milestonesTotal} ({progress}%)
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className={styles.progressSection}>
                  <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>Payment Released</span>
                    <span className={styles.progressValue}>
                      {formatCurrency(project.paymentReleased)} / {formatCurrency(project.paymentFunded)}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFillEscrow} style={{ width: `${paymentProgress}%` }} />
                  </div>
                </div>

                <div className={styles.projectCardFooter}>
                  <span className={styles.statusBadge}>In Progress</span>
                  <span className={styles.viewCta}>
                    Manage Project <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FolderOpen size={48} style={{ color: '#BFCABA' }} />
          <h3 className={styles.emptyTitle}>No active projects</h3>
          <p className={styles.emptyDesc}>Win bids from the marketplace to start your first project.</p>
          <Link href="/dashboard/installer/marketplace" className={styles.emptyCta}>
            Browse Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
