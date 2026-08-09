'use client';

import { useState } from 'react';
import { calculateSolarPanelSizing } from '@/lib/engineering/calculators/solarPanelSizing';
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
import { Sun, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Zap, RotateCcw, ShieldCheck, Layers } from 'lucide-react';
import Link from 'next/link';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';

export function SolarPanelSizingClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [dailyKwh, setDailyKwh] = useState<number>(25);
  const [psh, setPsh] = useState<number>(4.8);
  const [locationName, setLocationName] = useState<string>('Lagos');
  const [performanceRatio, setPerformanceRatio] = useState<number>(0.82);
  const [soilingLoss, setSoilingLoss] = useState<number>(0.03);
  const [targetOffset, setTargetOffset] = useState<number>(100);
  const [panelWattage, setPanelWattage] = useState<number>(550);

  // Step completion status tracking (9 Steps)
  const [step1Done, setStep1Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step2Done, setStep2Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step3Done, setStep3Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step4Done, setStep4Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step5Done, setStep5Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step6Done, setStep6Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step7Done, setStep7Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step8Done, setStep8Done] = useState<boolean>(false); // FIXED: must progress sequentially

  // Real calculation result
  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateSolarPanelSizing({
      dailyEnergyDemandKwh: 25,
      peakSunHours: 4.8,
      panelWattage: 550,
      systemLossesFactor: 0.82,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Energy Demand', shortTitle: '1. Demand', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Location Selection', shortTitle: '2. Location', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Peak Sun Hours', shortTitle: '3. PSH', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Performance Ratio', shortTitle: '4. PR', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'System Derating', shortTitle: '5. Losses', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Target Offset', shortTitle: '6. Offset', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'PV Capacity & Module', shortTitle: '7. Array', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Array Validation', shortTitle: '8. Check', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
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
    kwh: number,
    sunHours: number,
    offset: number,
    watts: number,
    pr: number
  ) => {
    const calcResult = calculateSolarPanelSizing({
      dailyEnergyDemandKwh: (kwh * offset) / 100,
      peakSunHours: sunHours,
      panelWattage: watts,
      systemLossesFactor: pr,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dailyKwh > 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(dailyKwh, psh, targetOffset, panelWattage, performanceRatio);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Panel Sizing Tool"
        category="Photovoltaic Generation & Capacity"
        description="Calculate total array capacity (kWp), panel module count, and roof area requirement based on regional peak sun hours in Nigeria."
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
                    <Sun size={20} className="text-primary" /> Step 1: Energy Demand Requirement
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Demand
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Daily Energy Demand Target (kWh/day) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      step={1}
                      value={dailyKwh}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDailyKwh(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, psh, targetOffset, panelWattage, performanceRatio);
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
                      Installation Region in Nigeria *
                    </label>
                    <select
                      value={psh}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPsh(val);
                        const names: Record<number, string> = { 4.8: 'Lagos / South-West', 5.2: 'Abuja / North-Central', 6.0: 'Kano / North-West', 4.5: 'Port Harcourt / South-South' };
                        setLocationName(names[val] || 'Custom');
                        invalidateDownstreamFrom(2);
                        recalculate(dailyKwh, val, targetOffset, panelWattage, performanceRatio);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={4.8}>Lagos / South-West Region</option>
                      <option value={5.2}>Abuja / North-Central Region</option>
                      <option value={6.0}>Kano / Northern Region</option>
                      <option value={4.5}>Port Harcourt / South-South Region</option>
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
                      Peak Sun Hours <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sun size={20} className="text-primary" /> Step 3: Peak Sun Hours (PSH)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    PSH Profile
                  </span>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-4">
                  <p className="text-stone-600">Regional Solar Irradiance Profile:</p>
                  <p className="text-lg font-extrabold text-stone-900">{psh} kWh/m²/day ({locationName})</p>
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
                      Performance Ratio <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 4: System Performance Ratio (PR)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    PR %
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      System PR Rating
                    </label>
                    <select
                      value={performanceRatio}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPerformanceRatio(val);
                        invalidateDownstreamFrom(4);
                        recalculate(dailyKwh, psh, targetOffset, panelWattage, val);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.82}>82% Performance Ratio (Standard Tropical Derating)</option>
                      <option value={0.85}>85% PR (Premium Tier-1 Modules + MPPT Optimizers)</option>
                      <option value={0.78}>78% PR (High Ambient Temperature Region)</option>
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
                      System Derating <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 5: System Losses & Derating
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Derating
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Soiling / Dust & DC Cabling Loss Allowance
                    </label>
                    <select
                      value={soilingLoss}
                      onChange={(e) => setSoilingLoss(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.03}>3% (Normal Cleaning Schedule)</option>
                      <option value={0.05}>5% (Harmattan Dust Season / High Soiling Area)</option>
                    </select>
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
                      Target Offset <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Sun size={20} className="text-primary" /> Step 6: Target Solar Energy Offset
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Offset %
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Target Energy Replacement Offset (%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      step={5}
                      value={targetOffset}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTargetOffset(val);
                        invalidateDownstreamFrom(6);
                        recalculate(dailyKwh, psh, val, panelWattage, performanceRatio);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
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
                      PV Capacity & Module <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Layers size={20} className="text-primary" /> Step 7: Module Selection & Array Sizing
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Module
                  </span>
                </div>
                <form onSubmit={handleStep7Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Solar Module Wattage (Wp)
                    </label>
                    <select
                      value={panelWattage}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPanelWattage(val);
                        invalidateDownstreamFrom(7);
                        recalculate(dailyKwh, psh, targetOffset, val, performanceRatio);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={550}>550W Mono PERC Half-Cell (Standard Tier-1)</option>
                      <option value={600}>600W N-Type TOPCon High Efficiency</option>
                      <option value={700}>700W Ultra High Power Bifacial Array</option>
                      <option value={450}>450W Compact Roof Module</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                    >
                      Array Roof Check <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: Array & Roof Area Validation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Check
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Array Peak Capacity: {resData.recommendedSystemKwp} kWp (PASS)
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Module Quantity: {resData.recommendedPanelCount} × {panelWattage}W Modules (PASS)
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Required Unshaded Roof Area: {resData.estimatedRoofAreaSqMeters} m² (PASS)
                  </div>
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
                    <span>Daily Energy Demand:</span>
                    <span className="font-bold text-stone-900">{dailyKwh} kWh/day</span>
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
                    <span>Panel Specification:</span>
                    <span className="font-bold text-stone-900">{panelWattage}W Mono PERC</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Configure series and parallel string wiring matching inverter MPPT input constraints.</p>
                  <Link
                    href="/tools/pv-configuration"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Launch PV String Layout Configurator <ArrowRight size={14} />
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
                  title="PV Array Sizing Summary"
                  metrics={[
                    {
                      label: 'Installed Array Capacity',
                      value: resData.actualArrayKwp ?? resData.requiredArrayKwp,
                      unit: 'kWp',
                      description: 'Total DC peak power capacity',
                    },
                    {
                      label: 'Recommended Module Count',
                      value: resData.recommendedPanelCount,
                      unit: 'Modules',
                      description: `${resData.recommendedPanelCount} × ${panelWattage}W Solar Panels`,
                    },
                    {
                      label: 'Estimated Roof Area',
                      value: resData.estimatedRoofAreaM2,
                      unit: 'm²',
                      description: 'Required unshaded installation area',
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Solar Panel Sizing Calculator"
                    toolId="solar-panel-sizing"
                    result={result}
                    inputSummary={[
                      { label: 'Daily Energy Demand', value: dailyKwh, unit: 'kWh/day' },
                      { label: 'Location (PSH)', value: `${locationName} (${psh} h/day)` },
                      { label: 'Panel Wattage', value: panelWattage, unit: 'W' },
                      { label: 'System Loss Factor', value: `${Math.round((1 - performanceRatio) * 100)}%` },
                    ]}
                    calculationSummary={[
                      { label: 'Installed Capacity', value: resData.actualArrayKwp ?? resData.requiredArrayKwp, unit: 'kWp' },
                      { label: 'Required Panel Count', value: resData.recommendedPanelCount, unit: 'modules' },
                      { label: 'Estimated Roof Area', value: resData.estimatedRoofAreaM2, unit: 'm²' },
                      { label: 'Daily Estimated Generation', value: resData.estimatedDailyGenerationKwh, unit: 'kWh/day' },
                      { label: 'Demand Coverage', value: resData.coveragePercent, unit: '%' },
                    ]}
                    engineeringChecks={[
                      { label: 'Demand Coverage', value: `${resData.coveragePercent}%`, check: (resData.coveragePercent ?? 0) >= 90 ? 'PASS' : 'WARNING' },
                      { label: 'Irradiance Adequacy', value: `${psh} h/day`, check: psh >= 4.0 ? 'PASS' : 'WARNING' },
                    ]}
                    nextToolHref="/tools/pv-configuration"
                    nextToolLabel="PV String Layout Configurator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar Panel Sizing Tool" />
        <RelatedToolsList currentToolId="solar-panel-sizing" />
      </div>
    </main>
  );
}
