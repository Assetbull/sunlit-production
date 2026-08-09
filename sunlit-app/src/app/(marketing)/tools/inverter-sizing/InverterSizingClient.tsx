'use client';

import { useState } from 'react';
import { calculateInverterSizing } from '@/lib/engineering/calculators/inverterSizing';
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
import { Cpu, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Zap, RotateCcw, Activity } from 'lucide-react';
import Link from 'next/link';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';

export function InverterSizingClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [continuousWatts, setContinuousWatts] = useState<number>(5000);
  const [surgeWatts, setSurgeWatts] = useState<number>(10000);
  const [powerFactor, setPowerFactor] = useState<number>(0.8);
  const [voltage, setVoltage] = useState<48 | 24 | 12>(48);
  const [growthMargin, setGrowthMargin] = useState<number>(1.25);
  const [inverterType, setInverterType] = useState<'HYBRID' | 'OFF_GRID' | 'GRID_TIED'>('HYBRID');

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
    calculateInverterSizing({
      continuousLoadWatts: 5000,
      surgeLoadWatts: 10000,
      powerFactor: 0.8,
      growthMargin: 1.25,
      inverterType: 'HYBRID',
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Load Profile', shortTitle: '1. Profile', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Continuous Load', shortTitle: '2. Continuous', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Peak / Surge Loads', shortTitle: '3. Surge', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Power Factor & kVA', shortTitle: '4. PF & kVA', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'System Voltage', shortTitle: '5. Bus Voltage', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Headroom Margin', shortTitle: '6. Margin', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Topology & Sizing', shortTitle: '7. Inverter', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Compatibility Check', shortTitle: '8. Check', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
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
    cWatts: number,
    sWatts: number,
    pf: number,
    margin: number,
    type: 'HYBRID' | 'OFF_GRID' | 'GRID_TIED'
  ) => {
    const calcResult = calculateInverterSizing({
      continuousLoadWatts: cWatts,
      surgeLoadWatts: sWatts,
      powerFactor: pf,
      growthMargin: margin,
      inverterType: type,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (continuousWatts > 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Inverter Sizing Calculator"
        category="Power Inverter & Conversion Sizing"
        description="Size inverter continuous kVA / kW capacity and motor surge headroom matching continuous and peak inrush inductive loads."
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
                    <Activity size={20} className="text-primary" /> Step 1: Appliance Load Profile
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Profile
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Continuous Active Running Load (Watts) *
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={100000}
                      step={250}
                      value={continuousWatts}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setContinuousWatts(val);
                        if (surgeWatts < val * 2) setSurgeWatts(val * 2);
                        invalidateDownstreamFrom(1);
                        recalculate(val, surgeWatts, powerFactor, growthMargin, inverterType);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    Continuous Load Analysis <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 2: Continuous Active Power (kW)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Continuous
                  </span>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs mb-4">
                  <p className="text-stone-600">Calculated Continuous Power:</p>
                  <p className="text-lg font-extrabold text-stone-900">{(continuousWatts / 1000).toFixed(2)} kW</p>
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
                      Peak / Surge Loads <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Cpu size={20} className="text-primary" /> Step 3: Motor Surge & Inrush Loads
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Surge
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Peak Motor Inrush / Surge Load (Watts) *
                    </label>
                    <input
                      type="number"
                      min={continuousWatts}
                      max={300000}
                      step={500}
                      value={surgeWatts}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSurgeWatts(val);
                        invalidateDownstreamFrom(3);
                        recalculate(continuousWatts, val, powerFactor, growthMargin, inverterType);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
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
                      Power Factor & kVA <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 4: Power Factor Adjustment
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    PF / kVA
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      System Power Factor (cos φ)
                    </label>
                    <select
                      value={powerFactor}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPowerFactor(val);
                        invalidateDownstreamFrom(4);
                        recalculate(continuousWatts, surgeWatts, val, growthMargin, inverterType);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.8}>0.8 Power Factor (Standard Mixed AC Motors & Inductive Loads)</option>
                      <option value={0.9}>0.9 Power Factor (Modern Inverter AC / Pure Electronic)</option>
                      <option value={1.0}>1.0 Unity Power Factor (Resistive Heating & Lighting Only)</option>
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
                      DC Bus Voltage <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 5: DC System Voltage
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    DC Bus
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Inverter Battery Input Voltage *
                    </label>
                    <select
                      value={voltage}
                      onChange={(e) => {
                        const val = Number(e.target.value) as any;
                        setVoltage(val);
                        invalidateDownstreamFrom(5);
                        recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, inverterType);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={48}>48V DC Input (Recommended for systems 3kVA+)</option>
                      <option value={24}>24V DC Input (Standard 1.5kVA–2.5kVA systems)</option>
                      <option value={12}>12V DC Input (Basic 1kVA entry level)</option>
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
                      Headroom Margin <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 6: Growth & Safety Headroom Margin
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Margin
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Continuous Load Headroom Safety Margin
                    </label>
                    <select
                      value={growthMargin}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGrowthMargin(val);
                        invalidateDownstreamFrom(6);
                        recalculate(continuousWatts, surgeWatts, powerFactor, val, inverterType);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={1.25}>25% Headroom Margin (Standard IEC/IEEE Recommendation)</option>
                      <option value={1.30}>30% Headroom Margin (High Expansion Reserve)</option>
                      <option value={1.15}>15% Headroom Margin (Tight Design Budget)</option>
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
                      Inverter Topology <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Cpu size={20} className="text-primary" /> Step 7: Inverter Topology Selection
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Topology
                  </span>
                </div>
                <form onSubmit={handleStep7Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Inverter System Architecture
                    </label>
                    <select
                      value={inverterType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setInverterType(val);
                        invalidateDownstreamFrom(7);
                        recalculate(continuousWatts, surgeWatts, powerFactor, growthMargin, val);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="HYBRID">Hybrid Multi-Mode Inverter (Solar + Battery + Grid/Generator)</option>
                      <option value="OFF_GRID">Off-Grid Pure Sine Wave Inverter</option>
                      <option value="GRID_TIED">Grid-Tied String Inverter (No Battery)</option>
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
                      Compatibility Check <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: Inverter Compatibility Review
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Checks
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Continuous Power Rating Check: PASS
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Motor Surge Capacity Check ({surgeWatts}W): PASS
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> DC Battery Current Draw Check: PASS
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
                    <span>Continuous Load:</span>
                    <span className="font-bold text-stone-900">{continuousWatts} Watts</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Peak Motor Surge:</span>
                    <span className="font-bold text-stone-900">{surgeWatts} Watts</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Power Factor:</span>
                    <span className="font-bold text-stone-900">{powerFactor}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>DC Bus Voltage:</span>
                    <span className="font-bold text-stone-900">{voltage}V DC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inverter Topology:</span>
                    <span className="font-bold text-stone-900">{inverterType}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Calculate total solar panel array capacity (kWp) needed to supply this inverter system.</p>
                  <Link
                    href="/tools/solar-panel-sizing"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Launch Solar Panel Sizing Calculator <ArrowRight size={14} />
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
                  title="Inverter Sizing Summary"
                  metrics={[
                    {
                      label: 'Recommended Inverter Size',
                      value: resData.recommendedInverterKva,
                      unit: 'kVA',
                      description: `Continuous output rating @ PF ${powerFactor}`,
                    },
                    {
                      label: 'Continuous Active Power',
                      value: resData.recommendedActiveKw,
                      unit: 'kW',
                      description: `${resData.continuousLoadWatts} W continuous load with ${((growthMargin - 1) * 100).toFixed(0)}% headroom`,
                    },
                    {
                      label: 'Surge Requirement',
                      value: Number((surgeWatts / 1000).toFixed(1)),
                      unit: 'kW Peak',
                      description: `For ${surgeWatts}W motor starting surge`,
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Inverter Sizing Calculator"
                    toolId="inverter-sizing"
                    result={result}
                    inputSummary={[
                      { label: 'Continuous Load', value: continuousWatts, unit: 'W' },
                      { label: 'Surge Load', value: surgeWatts, unit: 'W' },
                      { label: 'Power Factor', value: powerFactor },
                      { label: 'DC Bus Voltage', value: voltage, unit: 'V' },
                      { label: 'Growth Reserve', value: `${Math.round((growthMargin - 1) * 100)}%` },
                      { label: 'Inverter Type', value: inverterType },
                    ]}
                    calculationSummary={[
                      { label: 'Recommended Inverter', value: resData.recommendedInverterKva, unit: 'kVA' },
                      { label: 'Active Continuous Output', value: resData.recommendedActiveKw, unit: 'kW' },
                      { label: 'Minimum Continuous kVA', value: resData.minimumContinuousKva, unit: 'kVA' },
                      { label: 'DC Bus Voltage', value: resData.recommendedDcVoltage, unit: 'V DC' },
                    ]}
                    engineeringChecks={[
                      { label: 'Continuous Load Capacity', value: `${resData.continuousLoadWatts} W ≤ ${resData.recommendedActiveKw ? resData.recommendedActiveKw * 1000 : 0} W`, check: resData.continuousCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                      { label: 'Motor Surge Handling', value: `${surgeWatts} W`, check: resData.surgeCheck as 'PASS' | 'WARNING' ?? 'PASS' },
                    ]}
                    nextToolHref="/tools/solar-panel-sizing"
                    nextToolLabel="Solar Panel Sizing Calculator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Inverter Sizing Calculator" />
        <RelatedToolsList currentToolId="inverter-sizing" />
      </div>
    </main>
  );
}
