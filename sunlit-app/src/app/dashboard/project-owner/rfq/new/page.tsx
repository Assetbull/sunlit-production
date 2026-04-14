'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRfqFormSchema, type CreateRfqFormValues } from '@/dashboards/project-owner/validators/rfq-form';
import { createRfq } from '@/dashboards/project-owner/services/project-owner-api';
import { NIGERIA_STATES, type FormStatus } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

export default function CreateRfqPage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const raw = {
      projectTitle: formData.get('projectTitle') as string,
      description: formData.get('description') as string,
      locationState: formData.get('locationState') as string,
      locationCity: formData.get('locationCity') as string,
      systemSizeKw: formData.get('systemSizeKw') as string,
      budgetRangeMin: formData.get('budgetRangeMin') as string,
      budgetRangeMax: formData.get('budgetRangeMax') as string,
      timelineDays: formData.get('timelineDays') as string,
    };

    // Client-side Zod validation
    const result = CreateRfqFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus('idle');
      return;
    }

    // API call
    const res = await createRfq(result.data);
    if (!res.success) {
      setServerError(res.error || 'Failed to create RFQ');
      setStatus('error');
      return;
    }

    setStatus('success');
    setTimeout(() => router.push('/dashboard/project-owner'), 1500);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="headline-lg">Create New RFQ</h1>
        <p className="body-md text-muted">
          Submit a Request for Quotation and receive bids from verified solar installers across Nigeria.
        </p>
      </div>

      {status === 'success' ? (
        <div className={`surface-card animate-scale ${styles.successCard}`}>
          <span className={styles.successIcon}>✓</span>
          <h2 className="headline-sm">RFQ Created Successfully</h2>
          <p className="body-md text-muted mt-2">Redirecting to your dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={`surface-section animate-in ${styles.form}`} noValidate>
          {serverError && (
            <div className={styles.serverError} role="alert">
              {serverError}
            </div>
          )}

          {/* Project Details */}
          <fieldset className={styles.fieldset}>
            <legend className="label-lg">Project Details</legend>

            <div className="input-group">
              <label htmlFor="rfq-title" className="input-label">Project Title</label>
              <input
                id="rfq-title"
                name="projectTitle"
                type="text"
                className={`input-field ${errors.projectTitle ? 'input-field--error' : ''}`}
                placeholder="e.g. 5kW Residential Solar Installation"
                required
                aria-invalid={!!errors.projectTitle}
                aria-describedby={errors.projectTitle ? 'err-title' : undefined}
              />
              {errors.projectTitle && <span id="err-title" className="input-error">{errors.projectTitle}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="rfq-desc" className="input-label">Description (optional)</label>
              <textarea
                id="rfq-desc"
                name="description"
                className="input-field"
                placeholder="Describe your solar installation needs..."
                rows={3}
              />
              {errors.description && <span className="input-error">{errors.description}</span>}
            </div>
          </fieldset>

          {/* Location */}
          <fieldset className={styles.fieldset}>
            <legend className="label-lg">Location (Nigeria Only)</legend>
            <div className={styles.fieldRow}>
              <div className="input-group">
                <label htmlFor="rfq-state" className="input-label">State</label>
                <select
                  id="rfq-state"
                  name="locationState"
                  className={`input-field ${errors.locationState ? 'input-field--error' : ''}`}
                  required
                  aria-invalid={!!errors.locationState}
                  defaultValue=""
                >
                  <option value="" disabled>Select state</option>
                  {NIGERIA_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.locationState && <span className="input-error">{errors.locationState}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="rfq-city" className="input-label">City / LGA</label>
                <input
                  id="rfq-city"
                  name="locationCity"
                  type="text"
                  className={`input-field ${errors.locationCity ? 'input-field--error' : ''}`}
                  placeholder="e.g. Lekki"
                  required
                  aria-invalid={!!errors.locationCity}
                />
                {errors.locationCity && <span className="input-error">{errors.locationCity}</span>}
              </div>
            </div>
          </fieldset>

          {/* System & Budget */}
          <fieldset className={styles.fieldset}>
            <legend className="label-lg">System & Budget</legend>

            <div className="input-group">
              <label htmlFor="rfq-size" className="input-label">System Size (kW)</label>
              <input
                id="rfq-size"
                name="systemSizeKw"
                type="number"
                step="0.1"
                className={`input-field ${errors.systemSizeKw ? 'input-field--error' : ''}`}
                placeholder="e.g. 5"
                required
                aria-invalid={!!errors.systemSizeKw}
              />
              {errors.systemSizeKw && <span className="input-error">{errors.systemSizeKw}</span>}
            </div>

            <div className={styles.fieldRow}>
              <div className="input-group">
                <label htmlFor="rfq-bmin" className="input-label">Min Budget (₦)</label>
                <input
                  id="rfq-bmin"
                  name="budgetRangeMin"
                  type="number"
                  className={`input-field ${errors.budgetRangeMin ? 'input-field--error' : ''}`}
                  placeholder="e.g. 2000000"
                  required
                  aria-invalid={!!errors.budgetRangeMin}
                />
                {errors.budgetRangeMin && <span className="input-error">{errors.budgetRangeMin}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="rfq-bmax" className="input-label">Max Budget (₦)</label>
                <input
                  id="rfq-bmax"
                  name="budgetRangeMax"
                  type="number"
                  className={`input-field ${errors.budgetRangeMax ? 'input-field--error' : ''}`}
                  placeholder="e.g. 3500000"
                  required
                  aria-invalid={!!errors.budgetRangeMax}
                />
                {errors.budgetRangeMax && <span className="input-error">{errors.budgetRangeMax}</span>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="rfq-timeline" className="input-label">Preferred Timeline (Days)</label>
              <input
                id="rfq-timeline"
                name="timelineDays"
                type="number"
                className={`input-field ${errors.timelineDays ? 'input-field--error' : ''}`}
                placeholder="e.g. 30"
                required
                aria-invalid={!!errors.timelineDays}
              />
              {errors.timelineDays && <span className="input-error">{errors.timelineDays}</span>}
            </div>
          </fieldset>

          {/* Submit */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit RFQ'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
