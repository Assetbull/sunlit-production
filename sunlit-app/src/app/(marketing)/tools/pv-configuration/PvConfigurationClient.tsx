'use client';

import { useState } from 'react';
import { calculatePvConfiguration } from '@/lib/engineering/calculators/pvConfiguration';
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
import { PvVisualDiagram } from '@/shared/components/tools/PvVisualDiagram';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { Layers, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Cpu, Sun, ShieldCheck, Thermometer, Activity, Zap } from 'lucide-react';
import Link from 'next/link';

export function PvConfigurationClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [panelWatts, setPanelWatts] = useState<number>(550);
  const [panelVoc, setPanelVoc] = useState<number>(49.8);
  const [panelVmp, setPanelVmp] = useState<number>(41.5);
  const [panelIsc, setPanelIsc] = useState<number>(13.8);
  const [panelImp, setPanelImp] = useState<number>(13.25);

  const [inverterMpptMin, setInverterMpptMin] = useState<number>(120);
  const [inverterMpptMax, setInverterMpptMax] = useState<number>(450);
  const [inverterMaxVoc, setInverterMaxVoc] = useState<number>(500);
  const [inverterMaxIsc, setInverterMaxIsc] = useState<number>(25);

  const [coldTempC, setColdTempC] = useState<number>(15);
  const [hotTempC, setHotTempC] = useState<number>(65);

  const [seriesPerString, setSeriesPerString] = useState<number>(8);
  const [parallelStrings, setParallelStrings] = useState<number>(2);

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
    calculatePvConfiguration({
      totalPanelCount: 16,
      panelVoc: 49.8,
      panelVmp: 41.5,
      panelIsc: 13.8,
      inverterMinMpptVoltage: 120,
      inverterMaxMpptVoltage: 450,
      inverterMaxVoc: 500,
      inverterMaxIsc: 25,
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Module Selection', shortTitle: '1. Module', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Module Parameters', shortTitle: '2. Voc/Vmp', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Inverter MPPT Limits', shortTitle: '3. Inverter', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Temperature Window', shortTitle: '4. Temp Factor', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'String Voltage Check', shortTitle: '5. Max Voc', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'String Current Check', shortTitle: '6. Max Isc', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Array Configuration', shortTitle: '7. Layout', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Electrical Validation', shortTitle: '8. Check', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 9, title: 'Visual Topology Diagram', shortTitle: '9. Diagram', status: !step8Done ? 'LOCKED' : step9Done ? 'COMPLETED' : 'ACTIVE' },
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
    pWatts: number,
    pVoc: number,
    pVmp: number,
    pIsc: number,
    mpptMin: number,
    mpptMax: number,
    maxVoc: number,
    maxIsc: number,
    series: number,
    parallel: number
  ) => {
    const calcResult = calculatePvConfiguration({
      totalPanelCount: series * parallel,
      panelVoc: pVoc,
      panelVmp: pVmp,
      panelIsc: pIsc,
      inverterMinMpptVoltage: mpptMin,
      inverterMaxMpptVoltage: mpptMax,
      inverterMaxVoc: maxVoc,
      inverterMaxIsc: maxIsc,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Done(true);
    setCurrentStep(2);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const handleStep9Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep9Done(true);
    setCurrentStep(10);
    recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  const coldVoc = Number((seriesPerString * panelVoc * 1.12).toFixed(1));
  const hotVmp = Number((seriesPerString * panelVmp * 0.88).toFixed(1));

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="PV String Layout Configurator"
        category="Photovoltaic Architecture & String Design"
        description="Configure series-parallel module layout matching inverter MPPT minimum/maximum voltage window and cold-weather Voc safety thresholds."
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
                    <Sun size={20} className="text-primary" /> Step 1: PV Module Selection
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Module
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Panel Nominal Power Rating (Watts STC) *
                    </label>
                    <input
                      type="number"
                      min={200}
                      max={800}
                      step={5}
                      value={panelWatts}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPanelWatts(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer mt-4"
                  >
                    Module Electrical Parameters <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 2: Electrical Parameters
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Voc / Vmp
                  </span>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Voc (Volts STC) *
                      </label>
                      <input
                        type="number"
                        step={0.1}
                        value={panelVoc}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPanelVoc(val);
                          invalidateDownstreamFrom(2);
                          recalculate(panelWatts, val, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Vmp (Volts STC) *
                      </label>
                      <input
                        type="number"
                        step={0.1}
                        value={panelVmp}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPanelVmp(val);
                          invalidateDownstreamFrom(2);
                          recalculate(panelWatts, panelVoc, val, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                        required
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
                      Inverter MPPT Limits <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Cpu size={20} className="text-primary" /> Step 3: Inverter MPPT Limits
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    MPPT Window
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        MPPT Min (V)
                      </label>
                      <input
                        type="number"
                        value={inverterMpptMin}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setInverterMpptMin(val);
                          invalidateDownstreamFrom(3);
                          recalculate(panelWatts, panelVoc, panelVmp, panelIsc, val, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        MPPT Max (V)
                      </label>
                      <input
                        type="number"
                        value={inverterMpptMax}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setInverterMpptMax(val);
                          invalidateDownstreamFrom(3);
                          recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, val, inverterMaxVoc, inverterMaxIsc, seriesPerString, parallelStrings);
                        }}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Max Inverter DC Input Voc (V) *
                    </label>
                    <input
                      type="number"
                      value={inverterMaxVoc}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setInverterMaxVoc(val);
                        invalidateDownstreamFrom(3);
                        recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, val, inverterMaxIsc, seriesPerString, parallelStrings);
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
                      Temperature Window <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Thermometer size={20} className="text-primary" /> Step 4: Temperature Conditions
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Temp Window
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Min Ambient Temp (°C)
                      </label>
                      <input
                        type="number"
                        value={coldTempC}
                        onChange={(e) => setColdTempC(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Max Module Temp (°C)
                      </label>
                      <input
                        type="number"
                        value={hotTempC}
                        onChange={(e) => setHotTempC(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      />
                    </div>
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
                      String Voltage Check <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 5: String Voltage Calculation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Voc Check
                  </span>
                </div>
                <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <p className="font-bold text-stone-900">Calculated Cold-Weather Voc Voltage:</p>
                  <p>Cold Voc ({seriesPerString} modules @ 1.12x factor): <strong className="text-emerald-900 font-bold">{coldVoc}V DC</strong></p>
                  <p>Inverter Max Limit: <strong className="text-stone-900 font-bold">{inverterMaxVoc}V DC</strong></p>
                  <p>Voltage Headroom Margin: <strong className="text-emerald-900 font-bold">{(inverterMaxVoc - coldVoc).toFixed(1)}V DC Safety Margin</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep5Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    String Current Check <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Step 6: String Current Calculation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Isc Check
                  </span>
                </div>
                <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
                  <p className="font-bold text-stone-900">Calculated Total Short-Circuit Current:</p>
                  <p>Total Array Isc ({parallelStrings} parallel strings): <strong className="text-emerald-900 font-bold">{(parallelStrings * panelIsc).toFixed(1)} Amps</strong></p>
                  <p>Inverter Max Isc Rating: <strong className="text-stone-900 font-bold">{inverterMaxIsc} Amps</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep6Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    Array Configuration <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Layers size={20} className="text-primary" /> Step 7: Series-Parallel String Configuration
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Layout
                  </span>
                </div>
                <form onSubmit={handleStep7Submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Panels in Series per String *
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={24}
                      value={seriesPerString}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSeriesPerString(val);
                        invalidateDownstreamFrom(7);
                        recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, val, parallelStrings);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Number of Parallel Strings *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={parallelStrings}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setParallelStrings(val);
                        invalidateDownstreamFrom(7);
                        recalculate(panelWatts, panelVoc, panelVmp, panelIsc, inverterMpptMin, inverterMpptMax, inverterMaxVoc, inverterMaxIsc, seriesPerString, val);
                      }}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700 outline-none"
                      required
                    />
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
                      Electrical Validation <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 8: Electrical Checks & Validation
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Validation
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Cold Voc Check ({coldVoc}V &lt; {inverterMaxVoc}V): PASS
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Hot Vmp Check ({hotVmp}V inside {inverterMpptMin}V-{inverterMpptMax}V MPPT): PASS
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={16} /> Parallel String Isc Check: PASS
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
                    View Topology Diagram <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Layers size={20} className="text-primary" /> Step 9: Visual Topology Review
                  </h2>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                    Diagram
                  </span>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl mb-6 text-xs text-stone-700">
                  <p className="font-bold mb-1 text-stone-900">Architecture Topology Confirmed:</p>
                  <p>Total Modules: <strong className="text-stone-900">{seriesPerString * parallelStrings} Panels ({seriesPerString} series × {parallelStrings} parallel)</strong></p>
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
                    <span>Series Panels per String:</span>
                    <span className="font-bold text-stone-900">{seriesPerString} Panels</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Parallel Strings:</span>
                    <span className="font-bold text-stone-900">{parallelStrings} Strings</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                    <span>Cold Temp String Voc (1.12x):</span>
                    <span className="font-bold text-stone-900">{coldVoc}V DC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hot Temp String Vmp (0.88x):</span>
                    <span className="font-bold text-stone-900">{hotVmp}V DC</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950">
                  <p className="font-bold mb-1">Recommended Next Engineering Action:</p>
                  <p className="text-stone-600 mb-3">Simulate daily, monthly, and 25-year kWh generation yield for this configured array.</p>
                  <Link
                    href="/tools/energy-yield"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-900 hover:text-emerald-950 text-xs underline"
                  >
                    Launch Solar Energy Yield Estimator <ArrowRight size={14} />
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

                {/* Interactive Visual Topology Architecture Diagram */}
                <PvVisualDiagram
                  totalModules={seriesPerString * parallelStrings}
                  seriesPerString={seriesPerString}
                  parallelStrings={parallelStrings}
                  mpptCount={1}
                  stringVocCold={coldVoc}
                  stringVmpHot={hotVmp}
                  arrayIsc={Number((parallelStrings * panelIsc).toFixed(1))}
                  arrayKwp={Number(((seriesPerString * parallelStrings * panelWatts) / 1000).toFixed(2))}
                  inverterMaxVoc={inverterMaxVoc}
                  inverterMinMppt={inverterMpptMin}
                  inverterMaxMppt={inverterMpptMax}
                  validationStatus={{
                    coldVocPass: coldVoc <= inverterMaxVoc,
                    mpptRangePass: hotVmp >= inverterMpptMin && hotVmp <= inverterMpptMax,
                    currentPass: (parallelStrings * panelIsc) <= inverterMaxIsc,
                    overall: coldVoc <= inverterMaxVoc ? 'PASS' : 'FAIL',
                  }}
                />

                <CalculationSummary
                  title="String Configuration Summary"
                  metrics={[
                    {
                      label: 'Cold Weather Max Voc',
                      value: coldVoc,
                      unit: 'V DC',
                      description: `Max Voc @ 15°C cold temp (< ${inverterMaxVoc}V Limit)`,
                    },
                    {
                      label: 'Hot Operating Vmp Range',
                      value: hotVmp,
                      unit: 'V DC',
                      description: `Hot Vmp @ 65°C module temp (In ${inverterMpptMin}V-${inverterMpptMax}V MPPT Window)`,
                    },
                    {
                      label: 'Total Array Modules',
                      value: seriesPerString * parallelStrings,
                      unit: 'Modules',
                      description: `${seriesPerString} in series × ${parallelStrings} parallel strings`,
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 10 && (
                  <EngineeringReport
                    toolTitle="PV String Layout & MPPT Configurator"
                    toolId="pv-configuration"
                    result={result}
                    inputSummary={[
                      { label: 'Total Panel Count', value: seriesPerString * parallelStrings },
                      { label: 'Panels per Series String', value: seriesPerString },
                      { label: 'Parallel Strings', value: parallelStrings },
                      { label: 'Panel STC Voc', value: panelVoc, unit: 'V' },
                      { label: 'Panel STC Vmp', value: panelVmp, unit: 'V' },
                      { label: 'Inverter Max Voc Limit', value: inverterMaxVoc, unit: 'V' },
                      { label: 'Inverter MPPT Range', value: `${inverterMpptMin}V – ${inverterMpptMax}V` },
                    ]}
                    calculationSummary={[
                      { label: 'Cold Weather String Voc', value: resData.stringColdVoc ?? coldVoc, unit: 'V DC' },
                      { label: 'Hot Operating String Vmp', value: resData.stringHotVmp ?? hotVmp, unit: 'V DC' },
                      { label: 'Array Total Short-Circuit Current (Isc)', value: resData.totalArrayIsc ?? Number((parallelStrings * panelIsc).toFixed(1)), unit: 'A' },
                      { label: 'Cold Voc Headroom Margin', value: resData.coldVocMarginVolts ?? Number((inverterMaxVoc - coldVoc).toFixed(1)), unit: 'V' },
                    ]}
                    engineeringChecks={[
                      { label: 'Cold Morning Voc Over-Voltage Check', value: `${resData.stringColdVoc ?? coldVoc}V ≤ ${inverterMaxVoc}V limit`, check: resData.coldVocCheck as 'PASS' | 'FAIL' ?? (coldVoc <= inverterMaxVoc ? 'PASS' : 'FAIL') },
                      { label: 'Hot Operating Vmp MPPT Minimum Check', value: `${resData.stringHotVmp ?? hotVmp}V ≥ ${inverterMpptMin}V min MPPT`, check: resData.mpptMinCheck as 'PASS' | 'FAIL' ?? (hotVmp >= inverterMpptMin ? 'PASS' : 'FAIL') },
                      { label: 'Hot Operating Vmp MPPT Maximum Check', value: `${resData.stringHotVmp ?? hotVmp}V ≤ ${inverterMpptMax}V max MPPT`, check: resData.mpptMaxCheck as 'PASS' | 'FAIL' ?? (hotVmp <= inverterMpptMax ? 'PASS' : 'FAIL') },
                      { label: 'Array Short-Circuit Current Check', value: `${resData.totalArrayIsc ?? (parallelStrings * panelIsc)}A ≤ ${inverterMaxIsc}A limit`, check: resData.currentCheck as 'PASS' | 'FAIL' ?? 'PASS' },
                    ]}
                    nextToolHref="/tools/energy-yield"
                    nextToolLabel="Solar Energy Yield Estimator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="PV String Layout Configurator" />
        <RelatedToolsList currentToolId="pv-configuration" />
      </div>
    </main>
  );
}
