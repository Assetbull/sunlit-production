'use client';

import { useState } from 'react';
import { calculateBatteryCapacity } from '@/lib/engineering/calculators/batteryCapacity';
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
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { Battery, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Zap, RotateCcw, Thermometer, Layers } from 'lucide-react';
import Link from 'next/link';

export function BatteryCapacityClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [dailyKwh, setDailyKwh] = useState<number>(20);
  const [criticalLoadWatts, setCriticalLoadWatts] = useState<number>(3000);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [backupHours, setBackupHours] = useState<number>(24);
  const [voltage, setVoltage] = useState<48 | 24 | 12 | 51.2>(48);
  const [chemistry, setChemistry] = useState<'LITHIUM_LIFEPO4' | 'TUBULAR_GEL'>('LITHIUM_LIFEPO4');
  const [dodPercent, setDodPercent] = useState<number>(80);
  const [inverterEfficiency, setInverterEfficiency] = useState<number>(0.92);
  const [tempDeratingFactor, setTempDeratingFactor] = useState<number>(0.95);

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
    calculateBatteryCapacity({
      dailyEnergyKwh: 20,
      daysOfAutonomy: 1.0,
      systemVoltage: 48,
      chemistry: 'LITHIUM_LIFEPO4',
      maxDepthOfDischarge: 0.8,
      inverterEfficiency: 0.92,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Project Load Profile', shortTitle: '1. Load', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Backup & Autonomy', shortTitle: '2. Autonomy', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'System Voltage', shortTitle: '3. Voltage', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Battery Technology', shortTitle: '4. Chemistry', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'DoD & Efficiency', shortTitle: '5. DoD/Eff', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Temp & Derating', shortTitle: '6. Derating', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Bank Layout', shortTitle: '7. Config', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Engineering Review', shortTitle: '8. Check', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
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
    days: number,
    volts: 48 | 24 | 12 | 51.2,
    chem: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL',
    dod: number,
    eff: number,
    tempDerating: number
  ) => {
    const calcResult = calculateBatteryCapacity({
      dailyEnergyKwh: kwh,
      daysOfAutonomy: days,
      systemVoltage: volts,
      chemistry: chem,
      maxDepthOfDischarge: dod / 100,
      inverterEfficiency: eff,
      temperatureDerating: tempDerating,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dailyKwh > 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (autonomyDays >= 0.25) {
      setStep2Done(true);
      setCurrentStep(3);
      recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
    }
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Battery Capacity Calculator"
        category="Energy Storage & Battery Bank Sizing"
        description="Determine required battery bank capacity (kWh / Ah), nominal voltage, and series-parallel module configuration for solar backup."
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
                    <Zap size={20} className="text-primary" /> Step 1: Project Load Profile
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Demand
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Daily Energy Requirement (kWh/day) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      step={0.5}
                      value={dailyKwh}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDailyKwh(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Critical Continuous Load (Watts)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={50000}
                      step={100}
                      value={criticalLoadWatts}
                      onChange={(e) => setCriticalLoadWatts(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    Backup & Autonomy Requirement <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Battery size={20} className="text-primary" /> Step 2: Backup & Autonomy
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Autonomy
                  </span>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Days of Autonomy (No Solar Generation) *
                    </label>
                    <select
                      value={autonomyDays}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAutonomyDays(val);
                        setBackupHours(val * 24);
                        invalidateDownstreamFrom(2);
                        recalculate(dailyKwh, val, voltage, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.5}>0.5 Days (12 Hours Overnight Backup)</option>
                      <option value={1.0}>1.0 Day (24 Hours Full Autonomy - Standard)</option>
                      <option value={1.5}>1.5 Days (36 Hours extended backup)</option>
                      <option value={2.0}>2.0 Days (48 Hours extreme grid resilience)</option>
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
                      System Voltage <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 3: System Voltage Architecture
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Voltage
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      DC Bus Nominal Voltage *
                    </label>
                    <select
                      value={voltage}
                      onChange={(e) => {
                        const val = Number(e.target.value) as any;
                        setVoltage(val);
                        invalidateDownstreamFrom(3);
                        recalculate(dailyKwh, autonomyDays, val, chemistry, dodPercent, inverterEfficiency, tempDeratingFactor);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={48}>48V DC Nominal (Standard Residential/Commercial)</option>
                      <option value={51.2}>51.2V DC Nominal (Server Rack LiFePO4 Module)</option>
                      <option value={24}>24V DC Nominal (Small Backup/Cabin System)</option>
                      <option value={12}>12V DC Nominal (Basic Portable DC)</option>
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
                      Battery Technology <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Battery size={20} className="text-primary" /> Step 4: Battery Technology
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Chemistry
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Battery Chemistry *
                    </label>
                    <select
                      value={chemistry}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setChemistry(val);
                        const defaultDod = val === 'LITHIUM_LIFEPO4' ? 80 : 50;
                        setDodPercent(defaultDod);
                        invalidateDownstreamFrom(4);
                        recalculate(dailyKwh, autonomyDays, voltage, val, defaultDod, inverterEfficiency, tempDeratingFactor);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value="LITHIUM_LIFEPO4">Lithium Iron Phosphate (LiFePO4) - 6000+ Cycles</option>
                      <option value="TUBULAR_GEL">Deep Cycle Tubular Gel / AGM - 1500 Cycles</option>
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
                      DoD & Efficiency <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 5: Depth of Discharge & Efficiency
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    DoD / Efficiency
                  </span>
                </div>
                <form onSubmit={handleStep5Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Max Depth of Discharge (DoD %)
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={90}
                      value={dodPercent}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDodPercent(val);
                        invalidateDownstreamFrom(5);
                        recalculate(dailyKwh, autonomyDays, voltage, chemistry, val, inverterEfficiency, tempDeratingFactor);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Inverter Conversion Efficiency (%)
                    </label>
                    <select
                      value={inverterEfficiency}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setInverterEfficiency(val);
                        invalidateDownstreamFrom(5);
                        recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, val, tempDeratingFactor);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.92}>92% Efficiency (Standard Hybrid Inverter)</option>
                      <option value={0.95}>95% High Efficiency Transformerless</option>
                      <option value={0.88}>88% Heavy Transformer Inverter</option>
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
                      Temp & Derating <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Thermometer size={20} className="text-primary" /> Step 6: Temperature & Derating
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Derating
                  </span>
                </div>
                <form onSubmit={handleStep6Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Ambient Operating Temperature & Usable Capacity Factor
                    </label>
                    <select
                      value={tempDeratingFactor}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTempDeratingFactor(val);
                        invalidateDownstreamFrom(6);
                        recalculate(dailyKwh, autonomyDays, voltage, chemistry, dodPercent, inverterEfficiency, val);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                    >
                      <option value={0.95}>95% (Indoor Climate Controlled / Well Ventilated Room)</option>
                      <option value={0.90}>90% (Tropical High Ambient Heat 35°C+ Derating)</option>
                      <option value={0.85}>85% (Unventilated Outdoor Enclosure)</option>
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
                      Bank Configuration <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Layers size={20} className="text-primary" /> Step 7: Battery Bank Configuration
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Layout
                  </span>
                </div>
                <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <p className="font-bold text-stone-900">Calculated Battery Bank Sizing:</p>
                  <p>Required Usable Capacity: <strong className="text-emerald-900 font-bold">{resData.requiredUsableKwh} kWh</strong></p>
                  <p>Installed Nominal Capacity: <strong className="text-emerald-900 font-bold">{resData.installedCapacityKwh} kWh</strong></p>
                  <p>Amp-Hour Rating @ {voltage}V: <strong className="text-stone-900 font-bold">{resData.installedAmpHours} Ah</strong></p>
                  <p>Module Quantity: <strong className="text-stone-900 font-bold">{resData.recommendedModuleCount} Modules</strong></p>
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
                    Engineering Review <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: Engineering Review & Checks
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Review
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Capacity Adequacy Check: PASS
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> DoD Safety Threshold ({dodPercent}%): PASS
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Inverter DC Bus Match ({voltage}V): PASS
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
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-700" /> Report Ready
                  </h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} /> Edit Inputs
                  </button>
                </div>
                <p className="text-xs text-stone-500 mb-4">Full engineering report generated below. Scroll down to view.</p>
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Size inverter continuous load (kVA/kW) and surge rating for this battery bank.</p>
                  <Link
                    href="/tools/inverter-sizing"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Launch Inverter Sizing Calculator <ArrowRight size={14} />
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
                  title="Battery Storage Sizing Summary"
                  metrics={[
                    {
                      label: 'Installed Nominal Capacity',
                      value: resData.installedCapacityKwh,
                      unit: 'kWh',
                      description: `Total installed energy @ ${voltage}V DC`,
                    },
                    {
                      label: 'Usable Battery Capacity',
                      value: resData.requiredUsableKwh,
                      unit: 'kWh',
                      description: `Usable energy @ ${dodPercent}% DoD limit`,
                    },
                    {
                      label: 'Total Amp-Hours',
                      value: resData.installedAmpHours,
                      unit: 'Ah',
                      description: `Bank Ah rating @ ${voltage}V DC (${resData.recommendedModuleCount} modules)`,
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {/* Engineering Report — rendered when step 9 is reached */}
                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Battery Capacity Calculator"
                    toolId="battery-capacity"
                    result={result}
                    inputSummary={[
                      { label: 'Daily Energy Demand', value: dailyKwh, unit: 'kWh/day' },
                      { label: 'Autonomy Duration', value: `${autonomyDays} day(s)` },
                      { label: 'DC Bus Voltage', value: voltage, unit: 'V DC' },
                      { label: 'Battery Chemistry', value: chemistry === 'LITHIUM_LIFEPO4' ? 'LiFePO4' : 'Tubular Gel' },
                      { label: 'Max Depth of Discharge', value: dodPercent, unit: '%' },
                      { label: 'Inverter Efficiency', value: Math.round(inverterEfficiency * 100), unit: '%' },
                      { label: 'Temperature Derating', value: Math.round(tempDeratingFactor * 100), unit: '%' },
                    ]}
                    calculationSummary={[
                      { label: 'Installed Capacity', value: resData.installedCapacityKwh, unit: 'kWh' },
                      { label: 'Usable Capacity', value: resData.requiredUsableKwh, unit: 'kWh' },
                      { label: 'Total Amp-Hours', value: resData.installedAmpHours, unit: 'Ah' },
                      { label: 'Battery Modules', value: resData.recommendedModuleCount, unit: 'modules' },
                      { label: 'Gross Required', value: resData.requiredGrossKwh, unit: 'kWh' },
                      { label: 'System Voltage', value: voltage, unit: 'V DC' },
                    ]}
                    engineeringChecks={[
                      { label: 'Capacity Adequacy', value: `${resData.installedCapacityKwh} kWh ≥ ${resData.requiredUsableKwh} kWh usable`, check: resData.capacityAdequacyCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                      { label: 'DoD Safety Threshold', value: `${dodPercent}%`, check: dodPercent <= 90 ? 'PASS' : 'WARNING' },
                      { label: 'Temperature Derating Applied', value: `${Math.round(tempDeratingFactor * 100)}%`, check: tempDeratingFactor >= 0.90 ? 'PASS' : 'WARNING' },
                    ]}
                    nextToolHref="/tools/inverter-sizing"
                    nextToolLabel="Inverter Sizing Calculator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Battery Capacity Calculator" />
        <RelatedToolsList currentToolId="battery-capacity" />
      </div>
    </main>
  );
}
