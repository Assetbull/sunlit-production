'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { CreateRfqFormSchema, type CreateRfqFormValues } from '@/dashboards/project-owner/validators/rfq-form';
import { createRfq } from '@/dashboards/project-owner/services/project-owner-api';
import { NIGERIA_STATES, type FormStatus } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

export default function CreateRfqPage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [projectType, setProjectType] = useState<'Residential' | 'Commercial'>('Residential');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [customAppliance, setCustomAppliance] = useState('');

  const COMMON_APPLIANCES = [
    'Air Conditioner', 'Refrigerator', 'LED Lights', 'Water Pump',
    'Television', 'Washing Machine', 'Microwave', 'Electric Iron'
  ];

  function toggleAppliance(app: string) {
    setSelectedAppliances(prev => prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]);
  }

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
      projectType,
      appliances: selectedAppliances,
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
          <span className={styles.successIcon}><CheckCircle size={48} className="text-secondary" /></span>
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

          {/* Project Type */}
          <fieldset className={styles.fieldset}>
            <legend className="label-lg">Project Type</legend>
            <div className={styles.typeSelector}>
              <label className={`${styles.typeCard} ${projectType === 'Residential' ? styles.typeCardActive : ''}`}>
                <input type="radio" name="projectTypeMock" value="Residential" checked={projectType === 'Residential'} onChange={() => setProjectType('Residential')} className="sr-only" />
                <span className="title-md">Residential</span>
                <span className="body-sm text-muted">Home solar installations</span>
              </label>
              <label className={`${styles.typeCard} ${projectType === 'Commercial' ? styles.typeCardActive : ''}`}>
                <input type="radio" name="projectTypeMock" value="Commercial" checked={projectType === 'Commercial'} onChange={() => setProjectType('Commercial')} className="sr-only" />
                <span className="title-md">Commercial</span>
                <span className="body-sm text-muted">Office and business solar</span>
              </label>
            </div>
            {errors.projectType && <span className="input-error">{errors.projectType}</span>}
          </fieldset>

          {/* Appliances */}
          <fieldset className={styles.fieldset}>
            <legend className="label-lg">Target Appliances</legend>
            <p className="body-sm text-muted mb-3">Select or type the main appliances this system needs to power.</p>
            
            <div className="input-group">
                <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                        className="input-field" 
                        defaultValue="" 
                        onChange={(e) => {
                            if (e.target.value !== '') {
                                if (!selectedAppliances.includes(e.target.value)) {
                                    toggleAppliance(e.target.value);
                                }
                                e.target.value = '';
                            }
                        }}
                    >
                        <option value="" disabled>Select a standard appliance...</option>
                        {COMMON_APPLIANCES.map(app => (
                            <option key={app} value={app} disabled={selectedAppliances.includes(app)}>{app}</option>
                        ))}
                    </select>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Or add customized appliance..."
                        value={customAppliance}
                        onChange={(e) => setCustomAppliance(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (customAppliance.trim() && !selectedAppliances.includes(customAppliance.trim())) {
                                    toggleAppliance(customAppliance.trim());
                                    setCustomAppliance('');
                                }
                            }
                        }}
                    />
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                            if (customAppliance.trim() && !selectedAppliances.includes(customAppliance.trim())) {
                                toggleAppliance(customAppliance.trim());
                                setCustomAppliance('');
                            }
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>

            {selectedAppliances.length > 0 && (
                <div className={styles.applianceGrid} style={{ marginTop: '16px' }}>
                  {selectedAppliances.map(app => (
                    <button
                      key={app}
                      type="button"
                      className={`${styles.applianceChip} ${styles.applianceChipActive}`}
                      onClick={() => toggleAppliance(app)}
                      title="Click to remove"
                    >
                      {app} <span aria-hidden="true">&times;</span>
                    </button>
                  ))}
                </div>
            )}
            {errors.appliances && <span className="input-error">{errors.appliances}</span>}
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
