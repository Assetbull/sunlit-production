'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Zap,
  Calendar,
  PlusCircle,
  ChevronRight,
  FolderOpen,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { getSession } from '@/shared/session/sessionManager';
import styles from './page.module.css';

/**
 * External Projects Page
 * 
 * Feature: EPC Dashboard Enterprise System
 * Task: 6.4 Create external projects UI page
 * Requirements: 4.1, 4.4
 * 
 * Displays list of external projects for EPC contractors
 * Provides "Create External Project" form
 * Integrates with POST /api/v1/projects/external and GET /api/v1/projects/external
 * 
 * Design: Follows Sunlit design system (light mode, organic minimalism)
 */

interface ExternalProject {
  project_id: string;
  title: string;
  project_source: 'external';
  creator_id: string;
  approval_authority: 'epc_contractor';
  created_at: string;
  location_state?: string;
  location_city?: string;
  system_size_kw?: number;
  funding_source?: 'client' | 'epc_funded';
  status?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  planning: { label: 'Planning', color: '#F5A623', bg: 'rgba(245,166,35,0.08)', icon: Clock },
  in_progress: { label: 'In Progress', color: '#0F631B', bg: 'rgba(15,99,27,0.08)', icon: Zap },
  completed: { label: 'Completed', color: '#0F631B', bg: 'rgba(15,99,27,0.08)', icon: CheckCircle2 },
  on_hold: { label: 'On Hold', color: '#707A6C', bg: 'rgba(112,122,108,0.08)', icon: AlertCircle },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ExternalProjectsPage() {
  const [projects, setProjects] = useState<ExternalProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user session to verify EPC contractor role
  const session = getSession();
  const isEpcContractor = session?.role === 'epc_contractor';

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_state: '',
    location_city: '',
    system_size_kw: '',
    funding_source: 'client' as 'client' | 'epc_funded',
  });

  useEffect(() => {
    if (!isEpcContractor) {
      setError('Access denied. EPC contractor role required.');
      setLoading(false);
      return;
    }

    loadProjects();
  }, [isEpcContractor]);

  async function loadProjects() {
    try {
      const response = await fetch('/api/v1/projects/external', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load external projects');
      }
    } catch (err) {
      console.error('Error loading external projects:', err);
      setError('Failed to load external projects');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        location_state: formData.location_state,
        location_city: formData.location_city,
        system_size_kw: formData.system_size_kw ? Number(formData.system_size_kw) : undefined,
        funding_source: formData.funding_source,
      };

      const response = await fetch('/api/v1/projects/external', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Reset form and reload projects
        setFormData({
          title: '',
          description: '',
          location_state: '',
          location_city: '',
          system_size_kw: '',
          funding_source: 'client',
        });
        setShowCreateForm(false);
        await loadProjects();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create external project');
      }
    } catch (err) {
      console.error('Error creating external project:', err);
      setError('Failed to create external project');
    } finally {
      setCreating(false);
    }
  }

  if (!isEpcContractor) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <AlertCircle size={48} style={{ color: '#ba1a1a' }} />
          <h3 className={styles.errorTitle}>Access Denied</h3>
          <p className={styles.errorDesc}>
            This page is only accessible to EPC contractors.
          </p>
          <Link href="/dashboard/installer" className={styles.backBtn}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} style={{ height: 40, width: '35%', marginBottom: 12 }} />
        <div className={styles.skeleton} style={{ height: 20, width: '50%', marginBottom: 24 }} />
        <div className={styles.skeleton} style={{ height: 56, borderRadius: 16, marginBottom: 24 }} />
        <div className={styles.cardGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} style={{ height: 220, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.tagBadge}>
          <Building2 size={12} /> External Projects
        </div>
        <h1 className={styles.title}>External Projects</h1>
        <p className={styles.subtitle}>
          Manage projects sourced outside the marketplace using Sunlit tools.
        </p>
      </header>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.projectCount}>
          <span className={styles.projectCountNum}>{projects.length}</span> Project{projects.length !== 1 ? 's' : ''}
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreateForm(true)}
        >
          <PlusCircle size={18} /> Create External Project
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
        </div>
      )}

      {/* Create Project Form Modal */}
      {showCreateForm && (
        <div className={styles.modal} onClick={() => !creating && setShowCreateForm(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create External Project</h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowCreateForm(false)}
                disabled={creating}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProject} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Project Title *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Corporate Office Solar Installation"
                  required
                  minLength={5}
                  disabled={creating}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the project..."
                  rows={3}
                  disabled={creating}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>State *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.location_state}
                    onChange={(e) => setFormData({ ...formData, location_state: e.target.value })}
                    placeholder="e.g., Lagos"
                    required
                    disabled={creating}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.location_city}
                    onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                    placeholder="e.g., Ikoyi"
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>System Size (kW)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formData.system_size_kw}
                    onChange={(e) => setFormData({ ...formData, system_size_kw: e.target.value })}
                    placeholder="e.g., 25"
                    min="0"
                    step="0.1"
                    disabled={creating}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Funding Source *</label>
                  <select
                    className={styles.formSelect}
                    value={formData.funding_source}
                    onChange={(e) => setFormData({ ...formData, funding_source: e.target.value as 'client' | 'epc_funded' })}
                    required
                    disabled={creating}
                  >
                    <option value="client">Client Funded</option>
                    <option value="epc_funded">EPC Funded</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.formBtnSecondary}
                  onClick={() => setShowCreateForm(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.formBtnPrimary}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className={styles.cardGrid}>
          {projects.map((project) => {
            const statusConfig = STATUS_CONFIG[project.status || 'planning'];
            const StatusIcon = statusConfig.icon;

            return (
              <Link
                key={project.project_id}
                href={`/dashboard/installer/external-projects/${project.project_id}`}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.cardStatus}
                    style={{ background: statusConfig.bg, color: statusConfig.color }}
                  >
                    <StatusIcon size={12} />
                    {statusConfig.label}
                  </span>
                  <span className={styles.cardBadge}>
                    <Wallet size={12} />
                    {project.funding_source === 'epc_funded' ? 'EPC Funded' : 'Client'}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{project.title}</h3>

                <div className={styles.cardMeta}>
                  {project.location_city && project.location_state && (
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardMetaIcon}><MapPin size={14} /></span>
                      <span className={styles.cardMetaValue}>
                        {project.location_city}, {project.location_state}
                      </span>
                    </div>
                  )}
                  {project.system_size_kw && (
                    <div className={styles.cardMetaRow}>
                      <span className={styles.cardMetaIcon}><Zap size={14} /></span>
                      <span className={styles.cardMetaValue}>{project.system_size_kw} kW System</span>
                    </div>
                  )}
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardMetaIcon}><Calendar size={14} /></span>
                    <span className={styles.cardMetaValue}>Created {formatDate(project.created_at)}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardCta}>
                    View Details <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FolderOpen size={48} style={{ color: '#BFCABA' }} />
          <h3 className={styles.emptyTitle}>No external projects yet</h3>
          <p className={styles.emptyDesc}>
            Create your first external project to start managing it with Sunlit tools.
          </p>
          <button
            className={styles.emptyBtn}
            onClick={() => setShowCreateForm(true)}
          >
            <PlusCircle size={18} /> Create External Project
          </button>
        </div>
      )}
    </div>
  );
}
