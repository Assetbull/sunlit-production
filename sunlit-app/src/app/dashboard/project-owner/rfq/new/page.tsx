'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight, ChevronLeft, ShieldCheck, Zap, Home, Building2, MapPin, Coins } from 'lucide-react';
import { CreateRfqFormSchema, type CreateRfqFormValues } from '@/dashboards/project-owner/validators/rfq-form';
import { createRfq } from '@/dashboards/project-owner/services/project-owner-api';
import { NIGERIA_STATES, type FormStatus } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

const COMMON_APPLIANCES = [
  'Air Conditioner', 'Refrigerator', 'LED Lights', 'Water Pump',
  'Television', 'Washing Machine', 'Microwave', 'Electric Iron'
];

export default function CreateRfqPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<'Residential' | 'Commercial'>('Residential');
  const [systemSizeKw, setSystemSizeKw] = useState('');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [customAppliance, setCustomAppliance] = useState('');
  const [locationState, setLocationState] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [timelineDays, setTimelineDays] = useState('');
  const [budgetRangeMin, setBudgetRangeMin] = useState('');
  const [budgetRangeMax, setBudgetRangeMax] = useState('');

  function toggleAppliance(app: string) {
    setSelectedAppliances(prev => prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]);
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  async function handleSubmit() {
    setErrors({});
    setServerError('');
    setStatus('loading');

    const raw = {
      projectTitle,
      description,
      locationState,
      locationCity,
      systemSizeKw,
      budgetRangeMin,
      budgetRangeMax,
      timelineDays,
      projectType,
      appliances: selectedAppliances.length > 0 ? selectedAppliances : ['General Load'],
    };

    // Client-side Zod validation
    const result = CreateRfqFormSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus('idle');
      // If validation fails, stay on last step and display errors
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
    setTimeout(() => router.push('/dashboard/project-owner'), 2000);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="headline-lg">Create New RFQ</h1>
        <p className="body-md text-muted">
          Submit a Request for Quotation and receive bids from verified solar installers.
        </p>
      </div>

      {status === 'success' ? (
        <div className={`surface-card animate-scale ${styles.successCard}`}>
          <span className={styles.successIcon}><CheckCircle size={48} className="text-secondary" /></span>
          <h2 className="headline-sm">RFQ Created Successfully</h2>
          <p className="body-md text-muted mt-2">Your project is now published to the marketplace.</p>
          <div className="skeleton skeleton--text mt-4" style={{ width: '150px' }} />
        </div>
      ) : (
        <div className={`surface-section animate-in ${styles.formContainer}`}>
          
          {/* Stepper Progress */}
          <div className={styles.stepperProgress}>
            <div className={styles.stepIndicator}>
                <span className={`${styles.stepCircle} ${step >= 1 ? styles.stepActive : ''}`}>1</span>
                <span className="label-sm ml-2 hidden sm:inline">Basics</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : ''}`} />
            <div className={styles.stepIndicator}>
                <span className={`${styles.stepCircle} ${step >= 2 ? styles.stepActive : ''}`}>2</span>
                <span className="label-sm ml-2 hidden sm:inline">Energy</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.stepLineActive : ''}`} />
            <div className={styles.stepIndicator}>
                <span className={`${styles.stepCircle} ${step >= 3 ? styles.stepActive : ''}`}>3</span>
                <span className="label-sm ml-2 hidden sm:inline">Location</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 4 ? styles.stepLineActive : ''}`} />
            <div className={styles.stepIndicator}>
                <span className={`${styles.stepCircle} ${step >= 4 ? styles.stepActive : ''}`}>4</span>
                <span className="label-sm ml-2 hidden sm:inline">Budget</span>
            </div>
          </div>

          {serverError && (
            <div className={styles.serverError} role="alert">
              {serverError}
            </div>
          )}

          <div className={styles.stepContent}>
            {/* STEP 1: BASICS */}
            {step === 1 && (
              <div className="animate-in stagger-children">
                <h2 className="headline-sm mb-4">Project Basics</h2>
                <div className="input-group">
                  <label htmlFor="rfq-title" className="input-label">Project Title</label>
                  <input
                    id="rfq-title"
                    type="text"
                    className={`input-field ${errors.projectTitle ? 'input-field--error' : ''}`}
                    placeholder="e.g. 5kW Residential Solar Installation"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                  />
                  {errors.projectTitle && <span className="input-error">{errors.projectTitle}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="rfq-desc" className="input-label">Description (optional)</label>
                  <textarea
                    id="rfq-desc"
                    className="input-field"
                    placeholder="Describe your solar installation needs..."
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className="input-group mt-4">
                  <label className="input-label">Project Type</label>
                  <div className={styles.typeSelector}>
                    <button
                      type="button"
                      className={`${styles.typeCard} ${projectType === 'Residential' ? styles.typeCardActive : ''}`}
                      onClick={() => setProjectType('Residential')}
                    >
                      <Home size={24} className="mb-2 text-primary" />
                      <span className="title-md">Residential</span>
                      <span className="body-sm text-muted">Home setups</span>
                    </button>
                    <button
                      type="button"
                      className={`${styles.typeCard} ${projectType === 'Commercial' ? styles.typeCardActive : ''}`}
                      onClick={() => setProjectType('Commercial')}
                    >
                      <Building2 size={24} className="mb-2 text-primary" />
                      <span className="title-md">Commercial</span>
                      <span className="body-sm text-muted">Business / Office</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ENERGY & APPLIANCES */}
            {step === 2 && (
              <div className="animate-in stagger-children">
                 <h2 className="headline-sm mb-4">Energy Requirements</h2>
                 
                 <div className="input-group">
                    <label htmlFor="rfq-size" className="input-label flex items-center gap-2"><Zap size={16}/> Target System Size (kW)</label>
                    <input
                      id="rfq-size"
                      type="number"
                      step="0.1"
                      className={`input-field ${errors.systemSizeKw ? 'input-field--error' : ''}`}
                      placeholder="e.g. 5"
                      value={systemSizeKw}
                      onChange={e => setSystemSizeKw(e.target.value)}
                    />
                    {errors.systemSizeKw && <span className="input-error">{errors.systemSizeKw}</span>}
                 </div>

                 <div className="input-group mt-6">
                    <label className="input-label">Target Appliances to Power</label>
                    <p className="body-sm text-muted mb-2">Select the main appliances this system needs to power.</p>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <select 
                            className="input-field" 
                            defaultValue="" 
                            onChange={(e) => {
                                if (e.target.value !== '') {
                                    if (!selectedAppliances.includes(e.target.value)) toggleAppliance(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        >
                            <option value="" disabled>Select standard appliance...</option>
                            {COMMON_APPLIANCES.map(app => (
                                <option key={app} value={app} disabled={selectedAppliances.includes(app)}>{app}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Add custom appliance..."
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
                        >Add</button>
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
                 </div>
              </div>
            )}

            {/* STEP 3: LOCATION & TIMELINE */}
            {step === 3 && (
              <div className="animate-in stagger-children">
                 <h2 className="headline-sm mb-4">Location & Delivery</h2>
                 
                 <div className={styles.fieldRow}>
                    <div className="input-group">
                        <label htmlFor="rfq-state" className="input-label flex items-center gap-2"><MapPin size={16}/> State</label>
                        <select
                            id="rfq-state"
                            className={`input-field ${errors.locationState ? 'input-field--error' : ''}`}
                            value={locationState}
                            onChange={e => setLocationState(e.target.value)}
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
                            type="text"
                            className={`input-field ${errors.locationCity ? 'input-field--error' : ''}`}
                            placeholder="e.g. Lekki"
                            value={locationCity}
                            onChange={e => setLocationCity(e.target.value)}
                        />
                        {errors.locationCity && <span className="input-error">{errors.locationCity}</span>}
                    </div>
                </div>

                <div className="input-group mt-4">
                    <label htmlFor="rfq-timeline" className="input-label">Target Completion (Days)</label>
                    <input
                        id="rfq-timeline"
                        type="number"
                        className={`input-field ${errors.timelineDays ? 'input-field--error' : ''}`}
                        placeholder="e.g. 30"
                        value={timelineDays}
                        onChange={e => setTimelineDays(e.target.value)}
                    />
                    {errors.timelineDays && <span className="input-error">{errors.timelineDays}</span>}
                </div>
              </div>
            )}

            {/* STEP 4: BUDGET & ESCROW SHIELD */}
            {step === 4 && (
              <div className="animate-in stagger-children">
                 <h2 className="headline-sm mb-4">Budget & Protection</h2>

                 <div className={styles.fieldRow}>
                    <div className="input-group">
                        <label htmlFor="rfq-bmin" className="input-label flex items-center gap-2"><Coins size={16}/> Min Budget (₦)</label>
                        <input
                            id="rfq-bmin"
                            type="number"
                            className={`input-field ${errors.budgetRangeMin ? 'input-field--error' : ''}`}
                            placeholder="e.g. 2000000"
                            value={budgetRangeMin}
                            onChange={e => setBudgetRangeMin(e.target.value)}
                        />
                        {errors.budgetRangeMin && <span className="input-error">{errors.budgetRangeMin}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="rfq-bmax" className="input-label">Max Budget (₦)</label>
                        <input
                            id="rfq-bmax"
                            type="number"
                            className={`input-field ${errors.budgetRangeMax ? 'input-field--error' : ''}`}
                            placeholder="e.g. 3500000"
                            value={budgetRangeMax}
                            onChange={e => setBudgetRangeMax(e.target.value)}
                        />
                        {errors.budgetRangeMax && <span className="input-error">{errors.budgetRangeMax}</span>}
                    </div>
                </div>

                <div className={`${styles.escrowShield} mt-6`}>
                    <ShieldCheck size={32} className="text-secondary" />
                    <div className={styles.shieldContent}>
                        <h4 className="title-md">100% Escrow Protected</h4>
                        <p className="body-sm text-muted">
                           By submitting this RFQ, your future payments will be secured in a Sunlit Virtual Escrow Account. Funds are only released when you approve installation milestones.
                        </p>
                    </div>
                </div>
                
                {Object.keys(errors).length > 0 && (
                    <div className="input-error mt-4">
                        Please review earlier steps. Some required fields are missing or invalid.
                    </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
             {step > 1 ? (
                 <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={status === 'loading'}>
                     <ChevronLeft size={18} className="mr-1"/> Back
                 </button>
             ) : <div />}

             {step < 4 ? (
                 <button type="button" className="btn btn-primary" onClick={nextStep}>
                     Continue <ChevronRight size={18} className="ml-1"/>
                 </button>
             ) : (
                 <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                 >
                    <ShieldCheck size={18} className="mr-2"/>
                    {status === 'loading' ? 'Securing & Submitting...' : 'Post Secured RFQ'}
                 </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
