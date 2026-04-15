'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Flag, AlertTriangle } from 'lucide-react';
import { DisputeFormSchema, type DisputeFormValues } from '@/dashboards/project-owner/validators/rfq-form';
import { createDispute } from '@/dashboards/project-owner/services/project-owner-api';
import type { FormStatus } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

export default function CreateDisputePage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [caseId, setCaseId] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const raw = {
      projectId: formData.get('projectId') as string,
      escrowId: formData.get('escrowId') as string,
      reason: formData.get('reason') as string,
    };

    const result = DisputeFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    const res = await createDispute(result.data.projectId, result.data.escrowId, result.data.reason);
    if (!res.success) {
      setServerError(res.error || 'Failed to submit dispute');
      setStatus('error');
      return;
    }

    setCaseId(res.data?.caseId || `DSP-${Date.now()}`);
    setStatus('success');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/dashboard/project-owner" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <h1 className="headline-lg">Raise a Dispute</h1>
        <p className="body-md text-muted">
          If there is an issue with your project or installer, raise a dispute and our team will investigate.
          Escrow funds will be locked immediately until resolution.
        </p>
      </div>

      {status === 'success' ? (
        <div className={`surface-card animate-scale ${styles.successCard}`}>
          <span className={styles.warningIcon}><Flag size={48} className="text-danger" /></span>
          <h2 className="headline-sm">Dispute Submitted</h2>
          <p className="body-md text-muted mt-2">Case ID: <strong>{caseId}</strong></p>
          <p className="body-sm text-muted mt-2">
            Escrow has been locked. You will be contacted within 24-48 hours.
          </p>
          <button
            className="btn btn-primary mt-6"
            onClick={() => router.push('/dashboard/project-owner')}
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={`surface-section animate-in ${styles.form}`} noValidate>
          {serverError && (
            <div className={styles.serverError} role="alert">{serverError}</div>
          )}

          <div className="input-group">
            <label htmlFor="disp-project" className="input-label">Project ID</label>
            <input
              id="disp-project"
              name="projectId"
              type="text"
              className={`input-field ${errors.projectId ? 'input-field--error' : ''}`}
              placeholder="e.g. proj-001"
              required
              aria-invalid={!!errors.projectId}
            />
            {errors.projectId && <span className="input-error">{errors.projectId}</span>}
            <span className="input-hint">Find this on your project details page</span>
          </div>

          <div className="input-group">
            <label htmlFor="disp-escrow" className="input-label">Escrow ID</label>
            <input
              id="disp-escrow"
              name="escrowId"
              type="text"
              className={`input-field ${errors.escrowId ? 'input-field--error' : ''}`}
              placeholder="e.g. esc-001"
              required
              aria-invalid={!!errors.escrowId}
            />
            {errors.escrowId && <span className="input-error">{errors.escrowId}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="disp-reason" className="input-label">Reason for Dispute</label>
            <textarea
              id="disp-reason"
              name="reason"
              className={`input-field ${errors.reason ? 'input-field--error' : ''}`}
              placeholder="Describe the issue in detail (minimum 20 characters)..."
              rows={5}
              required
              aria-invalid={!!errors.reason}
            />
            {errors.reason && <span className="input-error">{errors.reason}</span>}
          </div>

          <div className={`${styles.notice} flex items-start gap-2`}>
            <AlertTriangle size={18} className="text-warning shrink-0" />
            <div>
              <strong>Important:</strong> Filing a dispute will immediately lock escrow funds.
              This action cannot be undone without admin review.
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className="btn btn-danger btn-lg"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
