'use client';

import { useState } from 'react';
import { calculateEnergyYield } from '@/lib/engineering/calculators/energyYield';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { RecommendationCard } from '@/shared/components/tools/RecommendationCard';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { WorkflowStepper, WorkflowStep } from '@/shared/components/tools/WorkflowStepper';
import { Sun, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Zap, RotateCcw, Compass, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';

export function EnergyYieldClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [systemKwp, setSystemKwp] = useState<number>(10);
  const [psh, setPsh] = useState<number>(4.8);
  const [locationName, setLocationName] = useState<string>('Lagos');
  const [orientation, setOrientation] = useState<string>('SOUTH');
  const [tiltAngle, setTiltAngle] = useState<number>(15);
  const [performanceRatio, setPerformanceRatio] = useState<number>(0.80);
  const [degradationRate, setDegradationRate] = useState<number>(0.005);

  // Step completion status tracking (9 Steps)
  // CRITICAL: All steps start as FALSE — user must progress sequentially
  const [step1Done, setStep1Done] = useState<boolean>(false);
  const [step2Done, setStep2Done] = useState<boolean>(false);
  const [step3Done, setStep3Done] = useState<boolean>(false);
  const [step4Done, setStep4Done] = useState<boolean>(false);
  const [step5Done, setStep5Done] = useState<boolean>(false);
  const [step6Done, setStep6Done] = useState<boolean>(false);
  const [step7Done, setStep7Done] = useState<boolean>(false);
  const [step8Done, setStep8Done] = useState<boolean>(false);

  // Real calculation result
  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateEnergyYield({
      systemCapacityKwp: 10,
      locationPeakSunHours: 4.8,
      performanceRatio: 0.80,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'System Capacity', shortTitle: '1. Capacity', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Location Selection', shortTitle: '2. Location', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Solar Resource (PSH)', shortTitle: '3. PSH Data', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Array Orientation', shortTitle: '4. Compass', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'Roof Tilt Angle', shortTitle: '5. Tilt Angle', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Performance Ratio', shortTitle: '6. PR Losses', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Yield Simulation', shortTitle: '7. Simulation', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: '25-Yr Degradation', shortTitle: '8. 25-Yr Model', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 9, title: 'Engineering Report', shortTitle: '9. Report', status: currentStep === 9 ? 'ACTIVE' : step8Done ? 'COMPLETED' : 'LOCKED' },
  ];

  const invalidateDownstreamFrom = (stepNum: number) => {
    if (stepNum <= 1) setStep2Done(false);
    if (stepNum <= 2) setStep3Done(false);
    if (stepNum <= 3) setStep4Done(false);
    if (stepNum <= 4) setStep5Done(false);
    if (stepNum <= 5) setStep6Done(false);
    if (stepNum <= 6) setStep7Done(false);
    if (stepNum <= 7) setStep8Done(false);
  };

  const recalculate = (
    kwp: number,
    sunHours: number,
    pr: number,
    orient: string,
    tilt: number
  ) => {
    const calcResult = calculateEnergyYield({
      systemCapacityKwp: kwp,
      locationPeakSunHours: sunHours,
      performanceRatio: pr,
      orientation: orient,
      tiltDeg: tilt,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (systemKwp > 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(systemKwp, psh, performanceRatio, orientation, tiltAngle);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Energy Yield Estimator"
        category="Solar Production & Generation Forecasting"
        description="Estimate daily (kWh), annual (MWh), and 25-year cumulative clean solar generation for PV array systems across Nigeria."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10">
        <WorkflowStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(s) => setCurrentStep(s)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form Column */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200 h-fit">
            {currentStep === 1 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sun size={20} className="text-primary" /> Step 1: PV System DC Capacity
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Capacity
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Installed PV Array Peak Capacity (kWp) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      step={0.5}
                      value={systemKwp}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSystemKwp(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, psh, performanceRatio, orientation, tiltAngle);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    Select Location <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <MapPin size={20} className="text-primary" /> Step 2: Location Selection
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Location
                  </span>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Installation Geographic Region *
                    </label>
                    <select
                      value={psh}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPsh(val);
                        const names: Record<number, string> = { 4.8: 'Lagos / South-West', 5.2: 'Abuja / North-Central', 6.0: 'Kano / Northern Region', 4.5: 'Port Harcourt / South-South' };
                        setLocationName(names[val] || 'Custom');
                        invalidateDownstreamFrom(2);
                        recalculate(systemKwp, val, performanceRatio, orientation, tiltAngle);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={4.8}>Lagos / South-West (4.8 PSH)</option>
                      <option value={5.2}>Abuja / North-Central (5.2 PSH)</option>
                      <option value={6.0}>Kano / Northern Belt (6.0 PSH)</option>
                      <option value={4.5}>Port Harcourt / South-South (4.5 PSH)</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                    >
                      PSH Resource <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sun size={20} className="text-primary" /> Step 3: Peak Sun Hours Resource Data
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    PSH Data
                  </span>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-4">
                  <p className="text-stone-600">Average Daily Solar Irradiance:</p>
                  <p className="text-lg font-extrabold text-stone-900">{psh} Peak Sun Hours ({locationName})</p>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                    >
                      Array Orientation <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Compass size={20} className="text-primary" /> Step 4: Array Compass Orientation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Compass
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Array Facing Direction *
                    </label>
                    <select
                      value={orientation}
                      onChange={(e) => {
                        setOrientation(e.target.value);
                        invalidateDownstreamFrom(4);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="SOUTH">True South (Optimal Peak Generation)</option>
                      <option value="SOUTH_WEST">South-West (Enhanced Afternoon Solar Curve)</option>
                      <option value="EAST_WEST">East-West Split Array</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                    >
                      Roof Tilt Angle <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sun size={20} className="text-primary" /> Step 5: Roof Mounting Tilt Angle
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Tilt Angle
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Roof Tilt Angle (Degrees)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={45}
                      value={tiltAngle}
                      onChange={(e) => {
                        setTiltAngle(Number(e.target.value));
                        invalidateDownstreamFrom(5);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                    >
                      Performance Ratio <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 6: System Performance Ratio (PR)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    PR Rating
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      System PR Rating
                    </label>
                    <select
                      value={performanceRatio}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPerformanceRatio(val);
                        invalidateDownstreamFrom(6);
                        recalculate(systemKwp, psh, val, orientation, tiltAngle);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.80}>80% Standard System Performance Ratio</option>
                      <option value={0.84}>84% Premium Tier-1 Efficiency</option>
                      <option value={0.76}>76% High Temperature Ambient Region</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                    >
                      Yield Simulation <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sun size={20} className="text-primary" /> Step 7: Energy Yield Simulation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Simulation
                  </span>
                </div>
                <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <p className="font-bold text-stone-900">Simulated Energy Production:</p>
                  <p>Daily Average Output: <strong className="text-emerald-900 font-bold">{resData.estimatedDailyYieldKwh} kWh/day</strong></p>
                  <p>Annual Energy Generation: <strong className="text-emerald-900 font-bold">{resData.estimatedAnnualYieldKwh} kWh/year</strong></p>
                  <p>Specific Energy Yield: <strong className="text-stone-900 font-bold">{resData.specificYieldKwhPerKwp} kWh/kWp/year</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep7Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    25-Yr Degradation <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: 25-Year Long-Term Degradation Model
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    25-Yr Model
                  </span>
                </div>
                <div className="space-y-3 mb-6 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-900">Long-Term Lifetime Output:</p>
                  <p>Linear Degradation Rate: <strong className="text-stone-900 font-bold">0.5%/year (Tier-1 Warranty)</strong></p>
                  <p>25-Year Cumulative Clean Energy: <strong className="text-emerald-900 font-bold">{resData.estimated25YearLifetimeKwh?.toLocaleString()} kWh ({resData.estimated25YearLifetimeMwh} MWh)</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(7)}
                    className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep8Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    Generate Report <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-700" /> Active Configuration
                  </h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} /> Edit Inputs
                  </button>
                </div>
                <div className="space-y-2 text-xs font-medium text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Array Capacity:</span>
                    <span className="font-bold text-stone-900">{systemKwp} kWp</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Solar Resource (PSH):</span>
                    <span className="font-bold text-stone-900">{psh} Hours ({locationName})</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Performance Ratio:</span>
                    <span className="font-bold text-stone-900">{(performanceRatio * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Array Orientation:</span>
                    <span className="font-bold text-stone-900">{orientation} ({tiltAngle}° Tilt)</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Calculate grid electricity bill and diesel generator cost savings.</p>
                  <Link
                    href="/tools/solar-savings"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Launch Solar Savings Calculator <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Energy Production Forecast"
                  metrics={[
                    {
                      label: 'Daily Average Generation',
                      value: resData.estimatedDailyYieldKwh,
                      unit: 'kWh / day',
                      description: `Clean energy output @ ${psh} PSH`,
                    },
                    {
                      label: 'First-Year Energy Yield',
                      value: resData.estimatedAnnualYieldKwh,
                      unit: 'kWh / year',
                      description: `Annual generation for ${systemKwp} kWp array`,
                    },
                    {
                      label: '25-Year Cumulative Output',
                      value: resData.estimated25YearLifetimeMwh,
                      unit: 'MWh',
                      description: `Lifetime output considering 0.5%/yr linear degradation`,
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Solar Energy Yield Estimator"
                    toolId="energy-yield"
                    result={result}
                    inputSummary={[
                      { label: 'Array Capacity', value: systemKwp, unit: 'kWp' },
                      { label: 'Location (PSH)', value: `${locationName} (${psh} h/day)` },
                      { label: 'Orientation', value: orientation },
                      { label: 'Tilt Angle', value: tiltAngle, unit: '°' },
                      { label: 'Performance Ratio', value: `${Math.round(performanceRatio * 100)}%` },
                    ]}
                    calculationSummary={[
                      { label: 'Daily Yield', value: resData.estimatedDailyYieldKwh, unit: 'kWh/day' },
                      { label: 'Annual Yield', value: resData.estimatedAnnualYieldKwh, unit: 'kWh/yr' },
                      { label: '25-Year Output', value: resData.estimated25YearLifetimeMwh, unit: 'MWh' },
                      { label: 'Specific Yield', value: resData.specificYieldKwhPerKwp, unit: 'kWh/kWp/yr' },
                    ]}
                    engineeringChecks={[
                      { label: 'Performance Ratio', value: `${Math.round(performanceRatio * 100)}%`, check: performanceRatio >= 0.70 ? 'PASS' : 'WARNING' },
                      { label: 'Specific Yield Benchmark', value: `${resData.specificYieldKwhPerKwp} kWh/kWp/yr`, check: (resData.specificYieldKwhPerKwp ?? 0) >= 1200 ? 'PASS' : 'WARNING' },
                    ]}
                    nextToolHref="/tools/solar-savings"
                    nextToolLabel="Solar Savings Calculator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar Energy Yield Estimator" />
        <RelatedToolsList currentToolId="energy-yield" />
      </div>
    </main>
  );
}
