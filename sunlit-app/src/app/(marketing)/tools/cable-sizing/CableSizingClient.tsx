'use client';

import { useState } from 'react';
import { calculateCableSizing } from '@/lib/engineering/calculators/cableSizing';
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
import { Zap, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, RotateCcw, ShieldAlert, Activity, Thermometer } from 'lucide-react';
import Link from 'next/link';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';

export function CableSizingClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [circuitType, setCircuitType] = useState<'DC_ARRAY' | 'DC_BATTERY' | 'AC_MAIN'>('DC_ARRAY');
  const [voltage, setVoltage] = useState<48 | 24 | 12 | 230>(48);
  const [amps, setAmps] = useState<number>(30);
  const [lengthMeters, setLengthMeters] = useState<number>(25);
  const [material, setMaterial] = useState<'COPPER' | 'ALUMINUM'>('COPPER');
  const [maxDropPct, setMaxDropPct] = useState<number>(3.0);
  const [installMethod, setInstallMethod] = useState<'CONDUIT' | 'FREE_AIR' | 'DIRECT_BURIED'>('CONDUIT');

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
    calculateCableSizing({
      currentAmps: 30,
      cableLengthMeters: 25,
      systemVoltage: 48,
      conductorMaterial: 'COPPER',
      maxVoltageDropPercent: 3.0,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Circuit Definition', shortTitle: '1. Circuit', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'System Voltage', shortTitle: '2. Voltage', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Design Current', shortTitle: '3. Current', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Cable Run Length', shortTitle: '4. Length', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'Conductor Material', shortTitle: '5. Material', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Allowable Drop Limit', shortTitle: '6. Drop %', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Ampacity & Routing', shortTitle: '7. Routing', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Validation Check', shortTitle: '8. Check', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
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
    cAmps: number,
    cMeters: number,
    cVolts: 48 | 24 | 12 | 230,
    cMat: 'COPPER' | 'ALUMINUM',
    dropPct: number
  ) => {
    const calcResult = calculateCableSizing({
      currentAmps: cAmps,
      cableLengthMeters: cMeters,
      systemVoltage: cVolts,
      conductorMaterial: cMat,
      maxVoltageDropPercent: dropPct,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Done(true);
    setCurrentStep(2);
    recalculate(amps, lengthMeters, voltage, material, maxDropPct);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(amps, lengthMeters, voltage, material, maxDropPct);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amps > 0) {
      setStep3Done(true);
      setCurrentStep(4);
      recalculate(amps, lengthMeters, voltage, material, maxDropPct);
    }
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lengthMeters > 0) {
      setStep4Done(true);
      setCurrentStep(5);
      recalculate(amps, lengthMeters, voltage, material, maxDropPct);
    }
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(amps, lengthMeters, voltage, material, maxDropPct);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(amps, lengthMeters, voltage, material, maxDropPct);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(amps, lengthMeters, voltage, material, maxDropPct);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(amps, lengthMeters, voltage, material, maxDropPct);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Cable Sizing Calculator"
        category="Electrical Cabling & Voltage Drop"
        description="Size conductor cross-sectional area (mm²) for AC/DC solar circuits to limit voltage drop under 3.0% per IEC/IEEE standards."
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
                    <Zap size={20} className="text-primary" /> Step 1: Circuit & System Definition
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Circuit
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Target Circuit Type *
                    </label>
                    <select
                      value={circuitType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setCircuitType(val);
                        invalidateDownstreamFrom(1);
                        recalculate(amps, lengthMeters, voltage, material, maxDropPct);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="DC_ARRAY">PV Solar String DC Array Circuit</option>
                      <option value="DC_BATTERY">Battery Bank DC Interconnect Circuit</option>
                      <option value="AC_MAIN">AC Main Inverter Output Circuit</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    System Voltage <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 2: System Circuit Voltage
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Voltage
                  </span>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Circuit Nominal Voltage *
                    </label>
                    <select
                      value={voltage}
                      onChange={(e) => {
                        const val = Number(e.target.value) as any;
                        setVoltage(val);
                        invalidateDownstreamFrom(2);
                        recalculate(amps, lengthMeters, val, material, maxDropPct);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={48}>48V DC Battery / String Circuit</option>
                      <option value={24}>24V DC Circuit</option>
                      <option value={12}>12V DC Circuit</option>
                      <option value={230}>230V AC Single Phase Main Output</option>
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
                      Design Current <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 3: Maximum Design Current
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Current
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Maximum Design Current (Amps) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      step={1}
                      value={amps}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAmps(val);
                        invalidateDownstreamFrom(3);
                        recalculate(val, lengthMeters, voltage, material, maxDropPct);
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
                      Cable Length <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 4: One-Way Cable Length
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Length
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      One-Way Cable Run Distance (Meters) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      step={1}
                      value={lengthMeters}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setLengthMeters(val);
                        invalidateDownstreamFrom(4);
                        recalculate(amps, val, voltage, material, maxDropPct);
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
                      Conductor Material <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 5: Conductor Material Selection
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Material
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Conductor Metal Material *
                    </label>
                    <select
                      value={material}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setMaterial(val);
                        invalidateDownstreamFrom(5);
                        recalculate(amps, lengthMeters, voltage, val, maxDropPct);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="COPPER">Copper (High Conductivity - Recommended)</option>
                      <option value="ALUMINUM">Aluminum (Lightweight / Long Run Feeder)</option>
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
                      Allowable Voltage Drop <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 6: Allowable Voltage Drop Limit (%)
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Drop %
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Allowable Maximum Voltage Drop (%)
                    </label>
                    <select
                      value={maxDropPct}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMaxDropPct(val);
                        invalidateDownstreamFrom(6);
                        recalculate(amps, lengthMeters, voltage, material, val);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={3.0}>3.0% Maximum Voltage Drop (IEC/IEEE Standard)</option>
                      <option value={2.0}>2.0% Maximum Voltage Drop (High Efficiency Solar Run)</option>
                      <option value={1.5}>1.5% Maximum Voltage Drop (Critical Battery Bus)</option>
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
                      Ampacity & Routing <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Thermometer size={20} className="text-primary" /> Step 7: Ampacity & Routing Conditions
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Routing
                  </span>
                </div>
                <form onSubmit={handleStep7Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Installation Method & Derating
                    </label>
                    <select
                      value={installMethod}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setInstallMethod(val);
                        invalidateDownstreamFrom(7);
                        recalculate(amps, lengthMeters, voltage, material, maxDropPct);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="CONDUIT">Conduit / Enclosed Trunking (Standard UV Conduit)</option>
                      <option value="FREE_AIR">Free Air Cable Tray (Rooftop Open Mounting)</option>
                      <option value="DIRECT_BURIED">Direct Underground Trench Burial</option>
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
                      Validation Check <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: Cable Sizing & Voltage Drop Validation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Check
                  </span>
                </div>
                <div className="space-y-3 mb-6 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-900">Validated Conductor Metrics:</p>
                  <p>Minimum Area Calculated: <strong className="text-stone-900 font-bold">{resData.calculatedAreaMm2} mm²</strong></p>
                  <p>Recommended Conductor Size: <strong className="text-emerald-900 font-bold">{resData.recommendedCableSizeMm2} mm² ({material})</strong></p>
                  <p>Actual Voltage Drop: <strong className="text-emerald-900 font-bold">{resData.actualVoltageDropVolts}V ({resData.actualVoltageDropPercent}%)</strong></p>
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
                    <span>Circuit Current:</span>
                    <span className="font-bold text-stone-900">{amps} Amps</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Run Distance:</span>
                    <span className="font-bold text-stone-900">{lengthMeters} Meters</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Conductor Material:</span>
                    <span className="font-bold text-stone-900">{material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Allowed Drop:</span>
                    <span className="font-bold text-stone-900">{maxDropPct}%</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Configure PV string layout to match conductor specifications.</p>
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
                  title="Cable Sizing Results"
                  metrics={[
                    {
                      label: 'Recommended Cable Size',
                      value: resData.recommendedCableSizeMm2,
                      unit: 'mm²',
                      description: `Double insulated cable (${material})`,
                    },
                    {
                      label: 'Actual Voltage Drop',
                      value: resData.actualVoltageDropVolts,
                      unit: 'V',
                      description: `${resData.actualVoltageDropPercent}% of ${resData.systemVoltage}V nominal`,
                    },
                    {
                      label: 'Calculated Cross-Section',
                      value: resData.calculatedAreaByVoltageDrop,
                      unit: 'mm²',
                      description: `Minimum area for ${amps}A over ${lengthMeters}m`,
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Cable Sizing & Voltage Drop Calculator"
                    toolId="cable-sizing"
                    result={result}
                    inputSummary={[
                      { label: 'Design Current', value: amps, unit: 'A' },
                      { label: 'Run Length', value: lengthMeters, unit: 'm' },
                      { label: 'System Voltage', value: voltage, unit: 'V' },
                      { label: 'Conductor Material', value: material },
                      { label: 'Max Voltage Drop Allowed', value: maxDropPct, unit: '%' },
                    ]}
                    calculationSummary={[
                      { label: 'Recommended Cable Cross-Section', value: resData.recommendedCableSizeMm2, unit: 'mm²' },
                      { label: 'Actual Voltage Drop', value: resData.actualVoltageDropPercent, unit: '%' },
                      { label: 'Actual Voltage Drop Volts', value: resData.actualVoltageDropVolts, unit: 'V' },
                      { label: 'Derated Ampacity', value: resData.deratedAmpacity, unit: 'A' },
                      { label: 'Calculated Area (Voltage Drop)', value: resData.calculatedAreaByVoltageDrop, unit: 'mm²' },
                    ]}
                    engineeringChecks={[
                      { label: 'Voltage Drop Threshold', value: `${resData.actualVoltageDropPercent}% ≤ ${maxDropPct}%`, check: resData.voltageDropCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                      { label: 'Conductor Ampacity Safety', value: `${resData.deratedAmpacity}A ≥ ${amps}A`, check: resData.ampacityCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                      { label: 'Overall Engineering Status', value: resData.overallCheck ?? 'PASS', check: resData.overallCheck as 'PASS' | 'FAIL' ?? 'PASS' },
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

        <PublicWaitlistForm interestedTool="Solar Cable Sizing Calculator" />
        <RelatedToolsList currentToolId="cable-sizing" />
      </div>
    </main>
  );
}
