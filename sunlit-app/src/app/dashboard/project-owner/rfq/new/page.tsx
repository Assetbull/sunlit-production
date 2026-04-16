'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Zap, 
  Home, 
  Building2, 
  MapPin, 
  Coins,
  ArrowRight
} from 'lucide-react';
import { CreateRfqFormSchema } from '@/dashboards/project-owner/validators/rfq-form';
import { createRfq } from '@/dashboards/project-owner/services/project-owner-api';
import { NIGERIA_STATES, type FormStatus } from '@/dashboards/project-owner/types/dashboard';
import styles from './page.module.css';

// Components
import ApplianceLoadSizer from './components/ApplianceLoadSizer';
import SizingSidebar from './components/SizingSidebar';

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
  const [systemSizeKw, setSystemSizeKw] = useState('0');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [locationState, setLocationState] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [timelineDays, setTimelineDays] = useState('30');
  const [budgetRangeMin, setBudgetRangeMin] = useState('');
  const [budgetRangeMax, setBudgetRangeMax] = useState('');

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const totalConsumption = useMemo(() => {
    // Mock consumption based on system size for the sidebar
    return parseFloat(systemSizeKw) * 4.5;
  }, [systemSizeKw]);

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

    const result = CreateRfqFormSchema.safeParse(raw);
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

    const res = await createRfq(result.data);
    if (!res.success) {
      setServerError(res.error || 'Failed to create RFQ');
      setStatus('error');
      return;
    }

    setStatus('success');
    setTimeout(() => router.push('/dashboard/project-owner'), 2000);
  }

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <div className={`glass-card animate-scale ${styles.successCard}`}>
          <div className={styles.successIcon}><CheckCircle size={40} /></div>
          <h1 className="text-4xl font-bold font-headline text-emerald-900 tracking-tight">RFQ Secured & Published</h1>
          <p className="text-xl text-slate-500 mt-4 max-w-lg mx-auto">
            Your project is now live in the Sunlit Marketplace. Verified installers have been notified.
          </p>
          <div className="mt-8 flex gap-4">
            <button 
              onClick={() => router.push('/dashboard/project-owner')}
              className="px-8 py-3 cta-gradient text-white font-bold rounded-xl shadow-lg ring-offset-2 ring-emerald-500/20"
            >
              Go to Command Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block font-headline">
          Step {step} of 4: {step === 1 ? 'Project Initiation' : step === 2 ? 'Energy Profiling' : step === 3 ? 'Location & Timeline' : 'Budget & Escrow'}
        </span>
        <h1 className="text-4xl font-bold font-headline text-slate-900 tracking-tight">
          {step === 1 && 'Start Your Solar Journey'}
          {step === 2 && 'Appliance Load Calculator'}
          {step === 3 && 'Project Footprint'}
          {step === 4 && 'Budget & Protection'}
        </h1>
        <p className="text-slate-500 mt-2 max-w-2xl text-lg">
          {step === 1 && 'Define your project basics and select the environment you want to power.'}
          {step === 2 && 'Define your household energy footprint. This precision tool calculates your peak load.'}
          {step === 3 && 'Tell us where the installation will take place and your expected timeline.'}
          {step === 4 && 'Set your financial goals and review our 100% Escrow Protection shield.'}
        </p>
      </header>

      <div className={styles.mainLayout}>
        <main className={styles.wizardContainer}>
          {/* Stepper */}
          <div className={styles.stepperProgress}>
            {[1, 2, 3, 4].map((s, i) => (
              <div key={s} className="flex-grow flex items-center">
                <div className={`${styles.stepCircle} ${step >= s ? styles.stepActive : ''}`}>
                  {step > s ? <CheckCircle size={20} /> : s}
                </div>
                {i < 3 && <div className={`${styles.stepLine} ${step > s ? styles.stepLineActive : ''}`} />}
              </div>
            ))}
          </div>

          <div className={styles.stepContent}>
            {/* STEP 1: BASICS */}
            {step === 1 && (
              <div className="space-y-8 animate-in">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Project Title</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm text-lg font-medium"
                      placeholder="e.g. 5kW Residential Solar Installation"
                      value={projectTitle}
                      onChange={e => setProjectTitle(e.target.value)}
                    />
                    {errors.projectTitle && <p className="text-xs text-red-500 font-bold px-1">{errors.projectTitle}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Description (optional)</label>
                    <textarea
                      placeholder="Describe your goals, specialized equipment, or any site constraints..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm min-h-[120px]"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Environment Type</label>
                    <div className={styles.typeSelector}>
                      <button
                        type="button"
                        className={`${styles.typeCard} ${projectType === 'Residential' ? styles.typeCardActive : ''}`}
                        onClick={() => setProjectType('Residential')}
                      >
                        <Home size={32} className={projectType === 'Residential' ? 'text-primary' : 'text-slate-400'} />
                        <div className="text-center">
                          <p className="font-bold text-lg font-headline">Residential</p>
                          <p className="text-xs text-slate-500">Home & Private Property</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`${styles.typeCard} ${projectType === 'Commercial' ? styles.typeCardActive : ''}`}
                        onClick={() => setProjectType('Commercial')}
                      >
                        <Building2 size={32} className={projectType === 'Commercial' ? 'text-primary' : 'text-slate-400'} />
                        <div className="text-center">
                          <p className="font-bold text-lg font-headline">Commercial</p>
                          <p className="text-xs text-slate-500">Office & Business Facility</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ENERGY & APPLIANCES */}
            {step === 2 && (
              <ApplianceLoadSizer 
                onUpdate={(apps, size) => {
                  setSelectedAppliances(apps);
                  setSystemSizeKw(size);
                }} 
              />
            )}

            {/* STEP 3: LOCATION & TIMELINE */}
            {step === 3 && (
              <div className="space-y-8 animate-in">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Installation State</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm appearance-none font-bold"
                      value={locationState}
                      onChange={e => setLocationState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.locationState && <p className="text-xs text-red-500 font-bold px-1">{errors.locationState}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">City / LGA</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm font-bold"
                      placeholder="e.g. Lekki Phase 1"
                      value={locationCity}
                      onChange={e => setLocationCity(e.target.value)}
                    />
                    {errors.locationCity && <p className="text-xs text-red-500 font-bold px-1">{errors.locationCity}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Target Completion Timeline</label>
                  <div className="flex items-center gap-4">
                    {[15, 30, 45, 60].map(days => (
                      <button
                        key={days}
                        type="button"
                        className={`flex-grow py-4 rounded-xl border-2 font-bold transition-all ${timelineDays === days.toString() ? 'border-primary bg-emerald-50 text-emerald-900' : 'border-slate-100 text-slate-400'}`}
                        onClick={() => setTimelineDays(days.toString())}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BUDGET & ESCROW */}
            {step === 4 && (
              <div className="space-y-8 animate-in">
                <div className={styles.escrowShield}>
                  <div className="w-12 h-12 rounded-xl cta-gradient flex items-center justify-center text-white shrink-0 mt-1">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 font-headline">Secure Virtual Escrow</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      By submitting this secured RFQ, your future project funds will be held by Sunlit's trust-vault. 
                      Payment is only released upon your confirmation of completed milestones.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Minimum Budget (₦)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm font-bold text-xl"
                      placeholder="Min"
                      value={budgetRangeMin}
                      onChange={e => setBudgetRangeMin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-emerald-800/60 block px-1">Maximum Budget (₦)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-emerald-900 focus:ring-2 focus:ring-emerald-500 shadow-sm font-bold text-xl"
                      placeholder="Max"
                      value={budgetRangeMax}
                      onChange={e => setBudgetRangeMax(e.target.value)}
                    />
                  </div>
                </div>

                {serverError && <p className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-center border border-red-100">{serverError}</p>}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            {step > 1 ? (
              <button 
                type="button" 
                className="flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-transform"
                onClick={prevStep}
              >
                <ChevronLeft size={20} />
                Previous Step
              </button>
            ) : <div />}

            {step < 4 ? (
              <button 
                type="button" 
                className="cta-gradient px-12 py-4 rounded-full text-white font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                onClick={nextStep}
              >
                Continue to {step === 1 ? 'Energy Profile' : step === 2 ? 'Location' : 'Budget'}
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                className="cta-gradient px-12 py-4 rounded-full text-white font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                onClick={handleSubmit}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Securing RFQ...' : 'Secure & Publish RFQ'}
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </main>

        <aside className={styles.sidebar}>
          <SizingSidebar 
            consumption={totalConsumption} 
            systemSize={systemSizeKw === '0' ? '---' : systemSizeKw} 
          />
        </aside>
      </div>
    </div>
  );
}
