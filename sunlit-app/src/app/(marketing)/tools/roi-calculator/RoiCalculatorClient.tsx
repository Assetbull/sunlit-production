'use client';

import { useState } from 'react';
import { calculateRoi } from '@/lib/engineering/calculators/roiCalculator';
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
import { DollarSign, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, RotateCcw, TrendingUp, PieChart, Activity } from 'lucide-react';
import Link from 'next/link';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';

export function RoiCalculatorClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [systemCapexNaira, setSystemCapexNaira] = useState<number>(12000000);
  const [capacityKwp, setCapacityKwp] = useState<number>(10);
  const [batteryKwh, setBatteryKwh] = useState<number>(15);
  const [installationLaborNaira, setInstallationLaborNaira] = useState<number>(1200000);
  const [annualSavingsNaira, setAnnualSavingsNaira] = useState<number>(3200000);
  const [annualOmCostNaira, setAnnualOmCostNaira] = useState<number>(150000);
  const [escalationRatePct, setEscalationRatePct] = useState<number>(12);
  const [hurdleRatePct, setHurdleRatePct] = useState<number>(10);

  // Step completion status tracking (10 Steps)
  const [step1Done, setStep1Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step2Done, setStep2Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step3Done, setStep3Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step4Done, setStep4Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step5Done, setStep5Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step6Done, setStep6Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step7Done, setStep7Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step8Done, setStep8Done] = useState<boolean>(false); // FIXED: must progress sequentially
  const [step9Done, setStep9Done] = useState<boolean>(false); // FIXED: must progress sequentially

  // Real calculation result
  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateRoi({
      systemCostNaira: 12000000,
      solarSystemCapacityKwp: 10,
      currentMonthlyGridBillNaira: 120000,
      currentMonthlyDieselBillNaira: 200000,
      annualMaintenanceCostNaira: 150000,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'System CapEx Investment', shortTitle: '1. CapEx ₦', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Equipment Breakdown', shortTitle: '2. Equipment', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Installation & Soft Costs', shortTitle: '3. Soft Costs', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Pre-Solar Expenditure', shortTitle: '4. Baseline Spend', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'Annual Solar Savings', shortTitle: '5. Annual ₦', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'O&M Operating Reserve', shortTitle: '6. O&M Reserve', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Tariff Escalation %', shortTitle: '7. Escalation', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Cash Flow Projection', shortTitle: '8. Cash Flow', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 9, title: 'Financial Metrics & NPV', shortTitle: '9. Payback & NPV', status: !step8Done ? 'LOCKED' : step9Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 10, title: 'Engineering Report', shortTitle: '10. Report', status: currentStep === 10 ? 'ACTIVE' : step9Done ? 'COMPLETED' : 'LOCKED' },
  ];

  const invalidateDownstreamFrom = (stepNum: number) => {
    if (stepNum <= 1) setStep2Done(false);
    if (stepNum <= 2) setStep3Done(false);
    if (stepNum <= 3) setStep4Done(false);
    if (stepNum <= 4) setStep5Done(false);
    if (stepNum <= 5) setStep6Done(false);
    if (stepNum <= 6) setStep7Done(false);
    if (stepNum <= 7) setStep8Done(false);
    if (stepNum <= 8) setStep9Done(false);
  };

  const recalculate = (
    capex: number,
    savings: number,
    om: number,
    escalation: number,
    discount: number
  ) => {
    const calcResult = calculateRoi({
      systemCostNaira: capex,
      solarSystemCapacityKwp: capacityKwp,
      currentMonthlyGridBillNaira: 120000,
      currentMonthlyDieselBillNaira: 200000,
      annualMaintenanceCostNaira: om,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (systemCapexNaira > 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (annualSavingsNaira > 0) {
      setStep5Done(true);
      setCurrentStep(6);
      recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
    }
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const handleStep9Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep9Done(true);
    setCurrentStep(10);
    recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar ROI & Payback Calculator"
        category="Financial Return & Capital Investment"
        description="Calculate simple payback period (Years), simple annual return on investment (ROI %), and 25-year Net Present Value (NPV) for turnkey solar systems."
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
                    <DollarSign size={20} className="text-primary" /> Step 1: Turnkey System CapEx (₦)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    CapEx ₦
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Total System Capital Investment (CapEx ₦) *
                    </label>
                    <input
                      type="number"
                      min={1000000}
                      max={500000000}
                      step={500000}
                      value={systemCapexNaira}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSystemCapexNaira(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, annualSavingsNaira, annualOmCostNaira, escalationRatePct, hurdleRatePct);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    Equipment Breakdown <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <PieChart size={20} className="text-primary" /> Step 2: Equipment Capacity Breakdown
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Equipment
                  </span>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Solar Array (kWp)
                      </label>
                      <input
                        type="number"
                        value={capacityKwp}
                        onChange={(e) => setCapacityKwp(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Battery Storage (kWh)
                      </label>
                      <input
                        type="number"
                        value={batteryKwh}
                        onChange={(e) => setBatteryKwh(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
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
                      Installation Costs <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" /> Step 3: Installation & Soft Costs
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Soft Costs
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Installation, Balance of System & Logistics (₦)
                    </label>
                    <input
                      type="number"
                      value={installationLaborNaira}
                      onChange={(e) => setInstallationLaborNaira(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
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
                      Baseline Spend <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 4: Pre-Solar Baseline Expenditure
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Baseline
                  </span>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-4">
                  <p className="text-stone-600">Total System Turnkey Investment:</p>
                  <p className="text-lg font-extrabold text-stone-900">₦{systemCapexNaira.toLocaleString()}</p>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
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
                      Annual Solar Savings <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" /> Step 5: Annual Solar Cost Savings (₦)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Annual ₦
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      First-Year Avoided Energy Expenditure (₦/year) *
                    </label>
                    <input
                      type="number"
                      min={100000}
                      max={100000000}
                      step={100000}
                      value={annualSavingsNaira}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAnnualSavingsNaira(val);
                        invalidateDownstreamFrom(5);
                        recalculate(systemCapexNaira, val, annualOmCostNaira, escalationRatePct, hurdleRatePct);
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
                      O&M Reserve <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <DollarSign size={20} className="text-primary" /> Step 6: O&M Operating Reserve
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    O&M Reserve
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Annual System O&M Reserve (₦/year)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={5000000}
                      step={50000}
                      value={annualOmCostNaira}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAnnualOmCostNaira(val);
                        invalidateDownstreamFrom(6);
                        recalculate(systemCapexNaira, annualSavingsNaira, val, escalationRatePct, hurdleRatePct);
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
                      Tariff Escalation <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" /> Step 7: Energy Tariff Escalation Rate %
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Escalation
                  </span>
                </div>
                <form onSubmit={handleStep7Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Annual Tariff Inflation Rate (%)
                    </label>
                    <select
                      value={escalationRatePct}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEscalationRatePct(val);
                        invalidateDownstreamFrom(7);
                        recalculate(systemCapexNaira, annualSavingsNaira, annualOmCostNaira, val, hurdleRatePct);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={12}>12% Annual Tariff Escalation (Standard Nigerian Forecast)</option>
                      <option value={15}>15% High Inflation Rate</option>
                      <option value={8}>8% Moderate Inflation Rate</option>
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
                      Cash Flow Model <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 8: Cash Flow Projection
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Cash Flow
                  </span>
                </div>
                <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <p className="font-bold text-stone-900">Projected 25-Year Cash Flow Metrics:</p>
                  <p>Turnkey CapEx Outflow: <strong className="text-stone-900 font-bold">₦{systemCapexNaira.toLocaleString()}</strong></p>
                  <p>First-Year Net Cash Flow: <strong className="text-emerald-900 font-bold">₦{(annualSavingsNaira - annualOmCostNaira).toLocaleString()} / year</strong></p>
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
                    Payback & NPV <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 9: Financial Metrics & NPV
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Metrics & NPV
                  </span>
                </div>
                <div className="space-y-3 mb-6 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-900">Calculated Return Metrics:</p>
                  <p>Simple Payback Period: <strong className="text-emerald-900 font-bold">{resData.simplePaybackYears} Years</strong></p>
                  <p>Simple Annual ROI: <strong className="text-emerald-900 font-bold">{resData.simpleRoiPercent}%</strong></p>
                  <p>25-Year Net Present Value (NPV @ 12%): <strong className="text-emerald-900 font-bold">₦{(resData.npv25YearNaira ?? 0).toLocaleString()}</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(8)}
                    className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep9Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    Generate Report <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 10 && (
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
                    <span>Turnkey CapEx Investment:</span>
                    <span className="font-bold text-stone-900">₦{systemCapexNaira.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Annual Avoided Expenditure:</span>
                    <span className="font-bold text-stone-900">₦{annualSavingsNaira.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Payback Period:</span>
                    <span className="font-bold text-stone-900">{resData.simplePaybackYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>25-Year NPV:</span>
                    <span className="font-bold text-stone-900">₦{(resData.npv25YearNaira ?? 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Action:</p>
                  <p className="text-stone-600 mb-3">Request verified contractor quotes and custom turnkey proposal on Sunlit Energy.</p>
                  <Link
                    href="/get-started"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Request Verified Solar Proposal <ArrowRight size={14} />
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
                  title="Financial Return Summary"
                  metrics={[
                    {
                      label: 'Simple Payback Period',
                      value: resData.simplePaybackYears,
                      unit: 'Years',
                      description: 'Time required to recover full capital investment',
                    },
                    {
                      label: 'Simple Annual ROI',
                      value: resData.simpleRoiPercent,
                      unit: '%',
                      description: 'Annual financial return on investment',
                    },
                    {
                      label: '25-Year Net Present Value',
                      value: `₦${(resData.npv25YearNaira ?? 0).toLocaleString()}`,
                      unit: '',
                      description: 'Net present value discounted @ 12% hurdle rate',
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 10 && (
                  <EngineeringReport
                    toolTitle="Solar ROI, NPV & Financial Model"
                    toolId="roi-calculator"
                    result={result}
                    inputSummary={[
                      { label: 'Turnkey System CapEx', value: `₦${systemCapexNaira.toLocaleString()}` },
                      { label: 'System Capacity', value: capacityKwp, unit: 'kWp' },
                      { label: 'Gross Annual Savings', value: `₦${(resData.grossAnnualSavingsNaira ?? annualSavingsNaira).toLocaleString()}` },
                      { label: 'Annual O&M Reserve', value: `₦${(resData.annualMaintenanceCostNaira ?? 0).toLocaleString()}` },
                    ]}
                    calculationSummary={[
                      { label: 'Simple Payback Period', value: resData.simplePaybackYears, unit: 'years' },
                      { label: 'Escalated Payback Period', value: resData.escalatedPaybackYears, unit: 'years' },
                      { label: 'Simple Annual ROI', value: resData.simpleRoiPercent, unit: '%' },
                      { label: 'Internal Rate of Return (IRR)', value: resData.irrPercent, unit: '%' },
                      { label: '25-Year Net Present Value (NPV)', value: `₦${(resData.npv25YearNaira ?? 0).toLocaleString()}` },
                      { label: 'Net Annual Savings (Year 1)', value: `₦${(resData.netAnnualSavingsNaira ?? 0).toLocaleString()}` },
                    ]}
                    engineeringChecks={[
                      { label: 'Payback Period Benchmark', value: `${resData.simplePaybackYears} years ≤ 8 year benchmark`, check: (resData.simplePaybackYears ?? 99) <= 8 ? 'PASS' : 'WARNING' },
                      { label: 'Net Present Value Check', value: `NPV ₦${(resData.npv25YearNaira ?? 0).toLocaleString()} > 0`, check: (resData.npv25YearNaira ?? 0) > 0 ? 'PASS' : 'WARNING' },
                      { label: 'Net Savings Check', value: `₦${(resData.netAnnualSavingsNaira ?? 0).toLocaleString()}/yr > 0`, check: (resData.netAnnualSavingsNaira ?? 0) > 0 ? 'PASS' : 'FAIL' },
                    ]}
                    nextToolHref="/get-started"
                    nextToolLabel="Get Turnkey Solar Quote"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar ROI & Payback Calculator" />
        <RelatedToolsList currentToolId="roi-calculator" />
      </div>
    </main>
  );
}
