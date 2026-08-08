'use client';

import { useState } from 'react';
import { calculateEnergyYield } from '@/lib/engineering/calculators/energyYield';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Sun, ArrowRight } from 'lucide-react';

export function EnergyYieldClient() {
  const [kwp, setKwp] = useState<number>(10);
  const [psh, setPsh] = useState<number>(4.8);
  const [pr, setPr] = useState<number>(0.78);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateEnergyYield({ systemCapacityKwp: 10, locationPeakSunHours: 4.8, performanceRatio: 0.78 })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateEnergyYield({ systemCapacityKwp: kwp, locationPeakSunHours: psh, performanceRatio: pr }));
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Energy Yield Estimator"
        category="Yield & Performance Simulation"
        description="Simulate daily, monthly, and 25-year cumulative kWh generation using solar Performance Ratio (PR) and degradation models."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Sun size={20} className="text-primary" /> Simulation Inputs
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Installed System Capacity (kWp) *
                </label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={kwp}
                  onChange={(e) => setKwp(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Peak Sun Hours (PSH)
                </label>
                <input
                  type="number"
                  min={3}
                  max={7}
                  step={0.1}
                  value={psh}
                  onChange={(e) => setPsh(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Performance Ratio (PR)
                </label>
                <select
                  value={pr}
                  onChange={(e) => setPr(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value={0.78}>78% PR (Standard Tropical System)</option>
                  <option value={0.82}>82% PR (High-Efficiency Premium System)</option>
                  <option value={0.72}>72% PR (Unventilated Flat Roof Sizing)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Run Yield Simulation <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Simulated Generation Results"
                  metrics={[
                    {
                      label: 'Daily Energy Generation',
                      value: resData.estimatedDailyYieldKwh,
                      unit: 'kWh/day',
                      description: 'Average daily production',
                    },
                    {
                      label: 'Annual Energy Yield',
                      value: resData.estimatedAnnualYieldKwh,
                      unit: 'kWh/year',
                      description: `${resData.specificYieldKwhPerKwp} kWh/kWp specific yield`,
                    },
                    {
                      label: '25-Year Lifetime Production',
                      value: (resData.estimated25YearLifetimeKwh / 1000).toFixed(1),
                      unit: 'MWh',
                      description: 'Includes 0.5%/yr degradation',
                    },
                  ]}
                />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />
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
