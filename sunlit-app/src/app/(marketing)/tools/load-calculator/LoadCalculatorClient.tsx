'use client';

import { useState } from 'react';
import { calculateLoad, LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { WorkflowStepper, WorkflowStep } from '@/shared/components/tools/WorkflowStepper';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { EngineeringReport } from '@/shared/components/tools/EngineeringReport';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import {
  Plus, Trash2, Zap, ArrowRight, ArrowLeft, CheckCircle2,
  Tv, Cpu, ShieldCheck, RotateCcw, AlertTriangle, Layers, Laptop
} from 'lucide-react';
import Link from 'next/link';

const DEFAULT_ITEMS: LoadItem[] = [
  { name: '1.5HP Inverter AC', powerWatts: 1100, quantity: 1, hoursPerDay: 8 },
  { name: 'Refrigerator / Freezer', powerWatts: 250, quantity: 1, hoursPerDay: 24 },
  { name: 'LED Lighting Bulbs', powerWatts: 15, quantity: 10, hoursPerDay: 6 },
  { name: 'Smart TV (55")', powerWatts: 120, quantity: 1, hoursPerDay: 5 },
  { name: 'WiFi Router & Laptops', powerWatts: 80, quantity: 2, hoursPerDay: 12 },
];

export function LoadCalculatorClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [items, setItems] = useState<LoadItem[]>(DEFAULT_ITEMS);

  // Workflow gating steps (7 Steps matching Stitch)
  const [step1Done, setStep1Done] = useState<boolean>(false);
  const [step2Done, setStep2Done] = useState<boolean>(false);
  const [step3Done, setStep3Done] = useState<boolean>(false);
  const [step4Done, setStep4Done] = useState<boolean>(false);
  const [step5Done, setStep5Done] = useState<boolean>(false);
  const [step6Done, setStep6Done] = useState<boolean>(false);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateLoad({ items: DEFAULT_ITEMS })
  );

  const steps: WorkflowStep[] = [
    { id: 1, title: 'Appliance Inventory', shortTitle: '1. Inventory', status: step1Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 2, title: 'Power Rating (Watts)', shortTitle: '2. Wattage', status: !step1Done ? 'LOCKED' : step2Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 3, title: 'Quantity & Counts', shortTitle: '3. Quantity', status: !step2Done ? 'LOCKED' : step3Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 4, title: 'Daily Usage Hours', shortTitle: '4. Schedule', status: !step3Done ? 'LOCKED' : step4Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 5, title: 'Review & Validate', shortTitle: '5. Review', status: !step4Done ? 'LOCKED' : step5Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 6, title: 'Demand Analysis', shortTitle: '6. Demand', status: !step5Done ? 'LOCKED' : step6Done ? 'COMPLETED' : 'ACTIVE' },
    { id: 7, title: 'Engineering Report', shortTitle: '7. Report', status: currentStep === 7 ? 'ACTIVE' : step6Done ? 'COMPLETED' : 'LOCKED' },
  ];

  const invalidateDownstreamFrom = (stepNum: number) => {
    if (stepNum <= 1) setStep2Done(false);
    if (stepNum <= 2) setStep3Done(false);
    if (stepNum <= 3) setStep4Done(false);
    if (stepNum <= 4) setStep5Done(false);
    if (stepNum <= 5) setStep6Done(false);
  };

  const updateItem = (index: number, field: keyof LoadItem, val: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
    invalidateDownstreamFrom(1);
    setResult(calculateLoad({ items: updated }));
  };

  const addItem = () => {
    const updated = [...items, { name: 'New Appliance', powerWatts: 150, quantity: 1, hoursPerDay: 4 }];
    setItems(updated);
    invalidateDownstreamFrom(1);
    setResult(calculateLoad({ items: updated }));
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    invalidateDownstreamFrom(1);
    setResult(calculateLoad({ items: updated }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Done(true);
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Done(true);
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Done(true);
    setCurrentStep(4);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep4Done(true);
    setCurrentStep(5);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep5Done(true);
    setCurrentStep(6);
  };

  const handleStep6Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep6Done(true);
    setCurrentStep(7);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface grid-bg min-h-screen pb-24 text-on-surface">
      <ToolHeader
        title="Appliance Load Calculator"
        category="Load Sizing & Energy Consumption"
        description="Estimate total connected wattage, peak surge demand, and daily energy consumption (kWh) across household or commercial appliances."
      />

      <div className="sunlit-container py-10">
        <WorkflowStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(s) => setCurrentStep(s)}
        />

        {/* Bento Summary Grid matching Stitch Visual DNA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="stone-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center z-10 mb-3">
              <span className="font-label-caps text-label-caps text-secondary">Total Appliances</span>
              <Cpu size={18} className="text-primary" />
            </div>
            <div className="font-display-lg text-headline-xl font-extrabold text-primary z-10">
              {items.length}
            </div>
          </div>

          <div className="stone-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center z-10 mb-3">
              <span className="font-label-caps text-label-caps text-secondary">Connected Load</span>
              <Zap size={18} className="text-primary" />
            </div>
            <div className="font-display-lg text-headline-xl font-extrabold text-primary z-10 flex items-baseline gap-1.5">
              {((resData.totalConnectedWatts ?? 0) / 1000).toFixed(2)}
              <span className="font-data-mono-md text-secondary">kW</span>
            </div>
          </div>

          <div className="stone-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center z-10 mb-3">
              <span className="font-label-caps text-label-caps text-secondary">Daily Energy</span>
              <ShieldCheck size={18} className="text-primary" />
            </div>
            <div className="font-display-lg text-headline-xl font-extrabold text-primary z-10 flex items-baseline gap-1.5">
              {resData.dailyEnergyDemandKwh ?? 0}
              <span className="font-data-mono-md text-secondary">kWh/day</span>
            </div>
          </div>

          <div className="stone-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-primary">
            <div className="flex justify-between items-center z-10 mb-3">
              <span className="font-label-caps text-label-caps text-secondary">Peak Surge Demand</span>
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <div className="font-display-lg text-headline-xl font-extrabold text-primary z-10 flex items-baseline gap-1.5">
              {resData.peakDemandKw ?? 0}
              <span className="font-data-mono-md text-secondary">kW</span>
            </div>
          </div>
        </div>

        {/* Workflow Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 stone-panel rounded-2xl p-6 md:p-8 h-fit">
            {currentStep === 1 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary">Stage 1</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Appliance Inventory</h2>
                  </div>
                  <button
                    onClick={addItem}
                    className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-full hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add Appliance
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 flex-1 w-full">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Laptop size={18} />
                        </div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        disabled={items.length <= 1}
                        className="text-secondary hover:text-error disabled:opacity-30 cursor-pointer self-end sm:self-center p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleStep1Submit}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  Set Power Ratings (Watts) <ArrowRight size={16} />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary">Stage 2</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Appliance Power Ratings</h2>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="font-body-md font-bold text-on-surface w-full sm:w-1/2">{item.name}</span>
                      <div className="flex items-center gap-2 w-full sm:w-1/2">
                        <input
                          type="number"
                          min={1}
                          max={50000}
                          value={item.powerWatts}
                          onChange={(e) => updateItem(idx, 'powerWatts', Number(e.target.value))}
                          className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                        <span className="font-data-mono-md text-secondary">Watts</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep2Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Appliance Quantities <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary">Stage 3</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Appliance Quantity & Counts</h2>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="font-body-md font-bold text-on-surface w-full sm:w-1/2">{item.name}</span>
                      <div className="flex items-center gap-2 w-full sm:w-1/2">
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                        <span className="font-data-mono-md text-secondary">Units</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep3Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Daily Usage Hours <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary">Stage 4</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Daily Operating Hours</h2>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="font-body-md font-bold text-on-surface w-full sm:w-1/2">{item.name} ({item.powerWatts * item.quantity}W)</span>
                      <div className="flex items-center gap-2 w-full sm:w-1/2">
                        <input
                          type="number"
                          min={0}
                          max={24}
                          value={item.hoursPerDay}
                          onChange={(e) => updateItem(idx, 'hoursPerDay', Number(e.target.value))}
                          className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                        <span className="font-data-mono-md text-secondary">hrs/day</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-1/3 stone-panel hover:bg-surface-variant text-on-surface font-label-caps text-label-caps py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleStep4Submit}
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Review Profile <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary">Stage 5</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Review Load Profile</h2>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-6 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-label-caps text-label-caps text-primary mb-1">Ready for Analysis</p>
                    <p className="text-xs text-on-surface-variant">All appliance specifications confirmed. Click below to analyze peak surge demand and daily kWh energy consumption.</p>
                  </div>
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
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Analyze Energy Demand <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-6">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary">Stage 6</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Demand & Surge Analysis</h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-on-surface bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 mb-6">
                  <p className="font-label-caps text-label-caps text-primary">Electrical Load Calculation:</p>
                  <p>Total Connected Load: <strong className="font-bold text-primary">{resData.totalConnectedWatts} Watts</strong></p>
                  <p>Peak Surge Buffer (25%): <strong className="font-bold text-primary">{resData.peakDemandKw} kW</strong></p>
                  <p>Daily Energy Consumption: <strong className="font-bold text-primary">{resData.dailyEnergyDemandKwh} kWh/day</strong></p>
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
                    className="w-2/3 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Generate Engineering Report <CheckCircle2 size={16} />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 mb-4">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary">Stage 7</span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-primary" /> Engineering Report Ready
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} /> Edit Inventory
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant mb-4">Full engineering load profile report generated below. Scroll down to view.</p>
              </div>
            )}
          </div>

          {/* Results & Analysis Right Column */}
          <div className="lg:col-span-5">
            {isSuccess && (
              <>
                <ConfidenceIndicator
                  level={result.confidence}
                  reasoning={result.confidenceReasoning}
                />

                <EngineeringNotes
                  notes={result.supporting_notes}
                  assumptions={result.assumptions}
                  warnings={result.warnings}
                />

                {currentStep === 7 && (
                  <EngineeringReport
                    toolTitle="Appliance Load & Energy Consumption Calculator"
                    toolId="load-calculator"
                    result={result}
                    inputSummary={[
                      { label: 'Total Appliance Count', value: items.length },
                      { label: 'Inventory Items', value: items.map((i) => `${i.name} (×${i.quantity})`).join(', ') },
                    ]}
                    calculationSummary={[
                      { label: 'Total Connected Active Power', value: resData.totalConnectedWatts, unit: 'W' },
                      { label: 'Peak Surge Demand (kW)', value: resData.peakDemandKw, unit: 'kW' },
                      { label: 'Daily Energy Consumption', value: resData.dailyEnergyDemandKwh, unit: 'kWh/day' },
                      { label: 'Monthly Energy Consumption', value: resData.monthlyEnergyDemandKwh, unit: 'kWh/month' },
                    ]}
                    engineeringChecks={[
                      { label: 'Load Diversity Buffer Applied', value: '25% Surge Buffer', check: 'PASS' },
                      { label: 'Energy Requirement Adequacy', value: `${resData.dailyEnergyDemandKwh} kWh/day`, check: (resData.dailyEnergyDemandKwh ?? 0) > 0 ? 'PASS' : 'FAIL' },
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

        <PublicWaitlistForm interestedTool="Appliance Load Calculator" />
        <RelatedToolsList currentToolId="load-calculator" />
      </div>
    </main>
  );
}
