'use client';

import { useState } from 'react';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { WorkflowStepper, WorkflowStep } from '@/shared/components/tools/WorkflowStepper';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { RecommendationCard } from '@/shared/components/tools/RecommendationCard';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Zap, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, RotateCcw, MapPin, Building } from 'lucide-react';
import Link from 'next/link';

export function SolarSystemSizingClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Workflow state inputs
  const [monthlyBill, setMonthlyBill] = useState<number>(150000);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');
  const [location, setLocation] = useState('Lagos');

  // Step completion status tracking (9 Steps)
  const [step1Done, setStep1Done] = useState<boolean>(false);
  const [step2Done, setStep2Done] = useState<boolean>(false);
  const [step3Done, setStep3Done] = useState<boolean>(false);
  const [step4Done, setStep4Done] = useState<boolean>(false);
  const [step5Done, setStep5Done] = useState<boolean>(false);
  const [step6Done, setStep6Done] = useState<boolean>(false);
  const [step7Done, setStep7Done] = useState<boolean>(false);
  const [step8Done, setStep8Done] = useState<boolean>(false);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateSolarSystemSizing({
      monthlyBillNaira: 150000,
      daysOfAutonomy: 1.0,
      propertyType: 'residential',
      location: 'Lagos',
    })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Monthly Electricity Bill', shortTitle: '1. Electricity Bill', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Autonomy Duration', shortTitle: '2. Autonomy', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Property Classification', shortTitle: '3. Property', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Location Irradiance', shortTitle: '4. Location', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'System Simulation', shortTitle: '5. Simulation', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Battery Storage Sizing', shortTitle: '6. Battery Sizing', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Inverter Capacity Rating', shortTitle: '7. Inverter Rating', status: !step6Done ? 'LOCKED' : step7Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 8, title: 'Solar Array kWp Rating', shortTitle: '8. Solar Array', status: !step7Done ? 'LOCKED' : step8Done ? 'COMPLETED' : 'ACTIVE' },
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
    bill: number,
    days: number,
    prop: 'residential' | 'commercial',
    loc: string
  ) => {
    const calcResult = calculateSolarSystemSizing({
      monthlyBillNaira: bill,
      daysOfAutonomy: days,
      propertyType: prop,
      location: loc,
    });
    setResult(calcResult);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monthlyBill > 0) {
      setStep1Done(true);
      setCurrentStep(2);
      recalculate(monthlyBill, autonomyDays, propertyType, location);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const handleStep7Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep7Done(true);
    setCurrentStep(8);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const handleStep8Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep8Done(true);
    setCurrentStep(9);
    recalculate(monthlyBill, autonomyDays, propertyType, location);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface grid-bg min-h-screen pb-24 text-on-surface">
      <ToolHeader
        title="Solar System Sizing Calculator"
        category="System Design & Autonomy"
        description="Calculate required solar array kWp, battery kWh storage, and inverter kVA capacity tailored for property power requirements in Nigeria."
      />

      <div className="sunlit-container py-10">
        <WorkflowStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(s) => setCurrentStep(s)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form Column */}
          <div className="lg:col-span-5 stone-panel rounded-2xl p-6 md:p-8 h-fit">
            {currentStep === 1 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 1: Monthly Bill
                  </h2>
                  <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Bill
                  </span>
                </div>
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-1">
                      Monthly Electricity Bill (₦) *
                    </label>
                    <input
                      type="number"
                      min={1000}
                      step={5000}
                      value={monthlyBill}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMonthlyBill(val);
                        invalidateDownstreamFrom(1);
                        recalculate(val, autonomyDays, propertyType, location);
                      }}
                      className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                    <p className="text-[11px] text-secondary mt-1">
                      Estimated based on Band A tariff (₦225/kWh).
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer mt-4"
                  >
                    Autonomy Duration <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 2: Autonomy Requirement
                  </h2>
                  <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Autonomy
                  </span>
                </div>
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-1">
                      Battery Backup Days *
                    </label>
                    <select
                      value={autonomyDays}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAutonomyDays(val);
                        invalidateDownstreamFrom(2);
                        recalculate(monthlyBill, val, propertyType, location);
                      }}
                      className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value={0.5}>0.5 Days (Night backup only)</option>
                      <option value={1.0}>1.0 Day (Full 24-hour backup)</option>
                      <option value={1.5}>1.5 Days (Extended rainy day backup)</option>
                      <option value={2.0}>2.0 Days (Critical off-grid independence)</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                    >
                      Property Type <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <Building size={20} className="text-primary" /> Step 3: Property Type
                  </h2>
                  <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Property
                  </span>
                </div>
                <form onSubmit={handleStep3Submit} className="space-y-4">
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-1">
                      Property Classification *
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => {
                        const val = e.target.value as 'residential' | 'commercial';
                        setPropertyType(val);
                        invalidateDownstreamFrom(3);
                        recalculate(monthlyBill, autonomyDays, val, location);
                      }}
                      className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="residential">Residential Home / Villa</option>
                      <option value="commercial">Commercial Facility / Office</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                    >
                      Location Irradiance <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <MapPin size={20} className="text-primary" /> Step 4: Installation Location
                  </h2>
                  <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Location
                  </span>
                </div>
                <form onSubmit={handleStep4Submit} className="space-y-4">
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-1">
                      State / Geographic Zone *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLocation(val);
                        invalidateDownstreamFrom(4);
                        recalculate(monthlyBill, autonomyDays, propertyType, val);
                      }}
                      className="w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Lagos">Lagos State (4.8 PSH)</option>
                      <option value="Abuja">Abuja FCT (5.2 PSH)</option>
                      <option value="Kano">Kano State (6.0 PSH)</option>
                      <option value="Rivers">Rivers / Port Harcourt (4.5 PSH)</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                    >
                      Run Simulation <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 5: System Simulation
                  </h2>
                  <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Simulation
                  </span>
                </div>
                <div className="space-y-3 text-xs text-on-surface bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 mb-6">
                  <p className="font-label-caps text-label-caps text-primary">Simulated Sizing Results:</p>
                  <p>Solar Array: <strong className="font-bold text-primary">{resData.recommendedSystemKwp} kWp</strong></p>
                  <p>Battery Bank: <strong className="font-bold text-primary">{resData.requiredBatteryKwh} kWh</strong></p>
                  <p>Inverter Rating: <strong className="font-bold text-primary">{resData.recommendedInverterKva} kVA</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep5Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                  >
                    Battery Storage Sizing <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> Step 6: Battery Storage Sizing
                  </h2>
                </div>
                <div className="space-y-3 text-xs text-on-surface bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 mb-6">
                  <p>Required Usable Storage: <strong>{resData.requiredBatteryKwh} kWh</strong></p>
                  <p>Autonomy Hours: <strong>{autonomyDays * 24} Hours</strong></p>
                  <p>Module Quantity: <strong>{resData.batteryModuleCount ?? Math.ceil(resData.requiredBatteryKwh / 5.12)} LiFePO4 Modules</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep6Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                  >
                    Inverter Sizing <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 7: Inverter Capacity Rating
                  </h2>
                </div>
                <div className="space-y-3 text-xs text-on-surface bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 mb-6">
                  <p>Inverter Rating: <strong>{resData.recommendedInverterKva} kVA</strong></p>
                  <p>Active Power Output: <strong>{(resData.recommendedInverterKva * 0.8).toFixed(1)} kW</strong></p>
                  <p>Motor Surge Reserve: <strong>{(resData.recommendedInverterKva * 1.6).toFixed(1)} kW Peak</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep7Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                  >
                    Solar Array kWp <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-6">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <Zap size={20} className="text-primary" /> Step 8: Solar Array kWp Rating
                  </h2>
                </div>
                <div className="space-y-3 text-xs text-on-surface bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 mb-6">
                  <p>Solar Capacity: <strong>{resData.recommendedSystemKwp} kWp</strong></p>
                  <p>Panel Count (550W Mono): <strong>{resData.panelCount ?? Math.ceil((resData.recommendedSystemKwp * 1000) / 550)} Panels</strong></p>
                  <p>Roof Area: <strong>{resData.roofAreaSqMeters ?? (resData.recommendedSystemKwp * 6.5).toFixed(1)} m²</strong></p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(7)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep8Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                  >
                    Generate Report <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3 mb-4">
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-primary" /> Active Configuration
                  </h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} /> Edit Inputs
                  </button>
                </div>
                <p className="text-xs text-secondary mb-4">Full engineering report generated below. Scroll down to view.</p>
              </div>
            )}
          </div>

          {/* Right Results Column */}
          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Engineering Calculation Summary"
                  metrics={[
                    {
                      label: 'Solar Array Capacity',
                      value: resData.recommendedSystemKwp,
                      unit: 'kWp',
                      description: `Total peak capacity @ ${location}`,
                    },
                    {
                      label: 'Battery Storage',
                      value: resData.requiredBatteryKwh,
                      unit: 'kWh',
                      description: `${autonomyDays} Day(s) autonomy @ 80% max DoD`,
                    },
                    {
                      label: 'Inverter Rating',
                      value: resData.recommendedInverterKva,
                      unit: 'kVA',
                      description: 'Pure Sine Wave Hybrid Inverter',
                    },
                    {
                      label: 'Daily Generation',
                      value: resData.estimatedDailyGenerationKwh,
                      unit: 'kWh/day',
                      description: 'Estimated average daily yield',
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />

                {currentStep === 9 && (
                  <EngineeringReport
                    toolTitle="Solar System Sizing Calculator"
                    toolId="solar-system-sizing"
                    result={result}
                    inputSummary={[
                      { label: 'Monthly Electricity Bill', value: `₦${monthlyBill.toLocaleString()}` },
                      { label: 'Autonomy Duration', value: `${autonomyDays} day(s)` },
                      { label: 'Property Type', value: propertyType },
                      { label: 'Location', value: location },
                    ]}
                    calculationSummary={[
                      { label: 'Solar Array Peak Capacity', value: resData.recommendedSystemKwp, unit: 'kWp' },
                      { label: 'Battery Storage Usable Capacity', value: resData.requiredBatteryKwh, unit: 'kWh' },
                      { label: 'Inverter Apparent Rating', value: resData.recommendedInverterKva, unit: 'kVA' },
                      { label: 'Daily Energy Generation', value: resData.estimatedDailyGenerationKwh, unit: 'kWh/day' },
                    ]}
                    engineeringChecks={[
                      { label: 'System Capacity Adequacy', value: `${resData.recommendedSystemKwp} kWp`, check: 'PASS' },
                      { label: 'Battery Autonomy Coverage', value: `${autonomyDays} day(s)`, check: 'PASS' },
                    ]}
                    nextToolHref="/tools/battery-capacity"
                    nextToolLabel="Battery Capacity Calculator"
                  />
                )}

                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar System Sizing Calculator" />
        <RelatedToolsList currentToolId="solar-system-sizing" />
      </div>
    </main>
  );
}
