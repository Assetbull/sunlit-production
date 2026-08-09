'use client';

import { useState } from 'react';
import { calculateSolarSavings } from '@/lib/engineering/calculators/solarSavings';
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
import { DollarSign, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, RotateCcw, TrendingUp, Zap, Fuel } from 'lucide-react';
import Link from 'next/link';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';

export function SolarSavingsClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [gridBillNaira, setGridBillNaira] = useState<number>(120000);
  const [dieselBillNaira, setDieselBillNaira] = useState<number>(200000);
  const [tariffBand, setTariffBand] = useState<string>('BAND_A');
  const [capacityKwp, setCapacityKwp] = useState<number>(10);
  const [solarOffsetPct, setSolarOffsetPct] = useState<number>(85);
  const [escalationRatePct, setEscalationRatePct] = useState<number>(12);

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
    calculateSolarSavings({
      currentMonthlyGridBillNaira: 120000,
      currentMonthlyDieselBillNaira: 200000,
      solarSystemCapacityKwp: 10,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Current Energy Spend', shortTitle: '1. Grid Spend', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Energy Consumption', shortTitle: '2. kWh Baseline', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'NERC Tariff Band', shortTitle: '3. Tariff Band', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Diesel Backup Costs', shortTitle: '4. Diesel Fuel', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'Solar System Capacity', shortTitle: '5. Solar kWp', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Solar Offset %', shortTitle: '6. Displacement', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Savings Projection', shortTitle: '7. Monthly ₦', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Long-Term Escalation', shortTitle: '8. 25-Yr ₦', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
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
    grid: number,
    diesel: number,
    capacity: number
  ) => {
    const calcResult = calculateSolarSavings({
      currentMonthlyGridBillNaira: grid,
      currentMonthlyDieselBillNaira: diesel,
      solarSystemCapacityKwp: capacity,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gridBillNaira >= 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(gridBillNaira, dieselBillNaira, capacityKwp);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Savings Calculator"
        category="Energy Economics & Cost Reduction"
        description="Calculate monthly and 25-year cumulative financial savings in Nigerian Naira (₦) from displacing utility DISCO grid bills and diesel generator fuel expenditure."
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
                    <DollarSign size={20} className="text-primary" /> Step 1: Utility Grid Energy Spend
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Grid Spend
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Current Monthly DISCO Electricity Bill (₦) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10000000}
                      step={5000}
                      value={gridBillNaira}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGridBillNaira(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, dieselBillNaira, capacityKwp);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    Consumption Baseline <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 2: Energy Consumption Baseline
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    kWh Baseline
                  </span>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-4">
                  <p className="text-stone-600">Monthly Utility Electricity Spend:</p>
                  <p className="text-lg font-extrabold text-stone-900">₦{gridBillNaira.toLocaleString()} / month</p>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
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
                      NERC Tariff Band <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" /> Step 3: NERC Tariff Classification
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Tariff Band
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      DISCO Tariff Band *
                    </label>
                    <select
                      value={tariffBand}
                      onChange={(e) => {
                        setTariffBand(e.target.value);
                        invalidateDownstreamFrom(3);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="BAND_A">Band A (₦225/kWh — 20+ Hours Grid)</option>
                      <option value="BAND_B">Band B (₦150/kWh — 16-20 Hours Grid)</option>
                      <option value="BAND_C">Band C (₦100/kWh — 12-16 Hours Grid)</option>
                    </select>
                  </div>

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
                      Diesel Backup Costs <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Fuel size={20} className="text-primary" /> Step 4: Existing Diesel Backup Costs
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Diesel Spend
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Monthly Generator Fuel & Service Spend (₦) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={20000000}
                      step={10000}
                      value={dieselBillNaira}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDieselBillNaira(val);
                        invalidateDownstreamFrom(4);
                        recalculate(gridBillNaira, val, capacityKwp);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
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
                      Solar Capacity <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 5: Proposed Solar Capacity (kWp)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Capacity
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Solar System Peak Capacity (kWp) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      step={1}
                      value={capacityKwp}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapacityKwp(val);
                        invalidateDownstreamFrom(5);
                        recalculate(gridBillNaira, dieselBillNaira, val);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
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
                      Solar Offset % <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" /> Step 6: Solar Displacement Offset %
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Offset %
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Grid & Diesel Displacement Target (%)
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={100}
                      step={5}
                      value={solarOffsetPct}
                      onChange={(e) => {
                        setSolarOffsetPct(Number(e.target.value));
                        invalidateDownstreamFrom(6);
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
                      Monthly Savings <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" /> Step 7: Monthly Net Savings Projection
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Monthly ₦
                  </span>
                </div>
                <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <p className="font-bold text-stone-900">Projected Savings breakdown:</p>
                  <p>Estimated Monthly Net Savings: <strong className="text-emerald-900 font-bold">₦{resData.monthlyNetSavingsNaira?.toLocaleString()} / month</strong></p>
                  <p>First-Year Annual Savings: <strong className="text-emerald-900 font-bold">₦{resData.annualSavingsNaira?.toLocaleString()} / year</strong></p>
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
                    Long-Term Escalation <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: Tariff Escalation & 25-Year Model
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    25-Yr ₦
                  </span>
                </div>
                <div className="space-y-3 mb-6 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-900">25-Year Inflation Forecast:</p>
                  <p>Annual Electricity Tariff Inflation: <strong className="text-stone-900 font-bold">12%/year</strong></p>
                  <p>Cumulative 25-Year Savings: <strong className="text-emerald-900 font-bold">₦{resData.cumulative25YearSavingsNaira?.toLocaleString()}</strong></p>
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
                    <span>Grid Electricity Bill:</span>
                    <span className="font-bold text-stone-900">₦{gridBillNaira.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Diesel Generator Spend:</span>
                    <span className="font-bold text-stone-900">₦{dieselBillNaira.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Solar Capacity:</span>
                    <span className="font-bold text-stone-900">{capacityKwp} kWp</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Displacement Target:</span>
                    <span className="font-bold text-stone-900">{solarOffsetPct}%</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Calculate Payback Period (Years), Simple ROI %, and Net Present Value (NPV).</p>
                  <Link
                    href="/tools/roi-calculator"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Launch Solar ROI Calculator <ArrowRight size={14} />
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
                  title="Solar Savings Summary"
                  metrics={[
                    {
                      label: 'Monthly Net Savings',
                      value: `₦${(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}`,
                      unit: '',
                      description: 'Avoided utility grid & generator spend per month',
                    },
                    {
                      label: 'First-Year Cost Reduction',
                      value: `₦${(resData.totalAnnualSavingsNaira ?? 0).toLocaleString()}`,
                      unit: '',
                      description: 'First 12 months cumulative avoided energy costs',
                    },
                    {
                      label: '25-Year Cumulative Savings',
                      value: `₦${(resData.cumulative25YearSavingsNaira ?? 0).toLocaleString()}`,
                      unit: '',
                      description: 'Lifetime energy savings assuming 12%/yr tariff escalation',
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Solar Energy Bill & Fuel Savings Calculator"
                    toolId="solar-savings"
                    result={result}
                    inputSummary={[
                      { label: 'Solar Capacity', value: capacityKwp, unit: 'kWp' },
                      { label: 'Monthly Grid Bill', value: `₦${gridBillNaira.toLocaleString()}` },
                      { label: 'Monthly Diesel Bill', value: `₦${dieselBillNaira.toLocaleString()}` },
                      { label: 'Tariff Band', value: resData.tariffBand ?? 'BAND_A' },
                    ]}
                    calculationSummary={[
                      { label: 'Monthly Total Savings', value: `₦${(resData.totalMonthlySavingsNaira ?? 0).toLocaleString()}` },
                      { label: 'Annual Total Savings', value: `₦${(resData.totalAnnualSavingsNaira ?? 0).toLocaleString()}` },
                      { label: '10-Year Savings', value: `₦${(resData.cumulative10YearSavingsNaira ?? 0).toLocaleString()}` },
                      { label: '25-Year Lifetime Savings', value: `₦${(resData.cumulative25YearSavingsNaira ?? 0).toLocaleString()}` },
                      { label: 'Displacement Percentage', value: `${resData.savingsAsPercentOfBaseline ?? 0}%` },
                    ]}
                    engineeringChecks={[
                      { label: 'Bill Displacement Ratio', value: `${resData.savingsAsPercentOfBaseline}% of current spend`, check: (resData.savingsAsPercentOfBaseline ?? 0) >= 50 ? 'PASS' : 'WARNING' },
                      { label: 'Diesel Cost Comparison', value: `₦${resData.dieselCostPerKwhNaira}/kWh vs ₦${resData.gridTariffNairaPerKwh}/kWh grid`, check: 'PASS' },
                    ]}
                    nextToolHref="/tools/roi-calculator"
                    nextToolLabel="Solar ROI & Payback Calculator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar Savings Calculator" />
        <RelatedToolsList currentToolId="solar-savings" />
      </div>
    </main>
  );
}
