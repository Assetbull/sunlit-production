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
import { Cpu, ArrowRight } from 'lucide-react';

export function InverterSizingClient() {
  const [watts, setWatts] = useState<number>(4500);
  const [surgeWatts, setSurgeWatts] = useState<number>(9000);
  const [powerFactor, setPowerFactor] = useState<number>(0.8);
  const [type, setType] = useState<'HYBRID' | 'OFF_GRID'>('HYBRID');

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateInverterSizing({
      continuousLoadWatts: 4500,
      surgeLoadWatts: 9000,
      powerFactor: 0.8,
      inverterType: 'HYBRID',
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(
      calculateInverterSizing({
        continuousLoadWatts: watts,
        surgeLoadWatts: surgeWatts,
        powerFactor,
        inverterType: type,
      })
    );
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Inverter Sizing Calculator"
        category="Inverter & Electrical Ratings"
        description="Calculate required inverter kVA rating, DC bus voltage, and surge capacity based on active continuous load and power factor."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Cpu size={20} className="text-primary" /> Load & Inverter Input
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Continuous Load (Watts) *
                </label>
                <input
                  type="number"
                  min={100}
                  step={500}
                  value={watts}
                  onChange={(e) => setWatts(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Peak Surge Load (Watts)
                </label>
                <input
                  type="number"
                  min={100}
                  step={500}
                  value={surgeWatts}
                  onChange={(e) => setSurgeWatts(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                />
                <p className="text-[11px] text-stone-500 mt-1">Motor startup surge (pumps, compressors).</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Power Factor (PF)
                </label>
                <select
                  value={powerFactor}
                  onChange={(e) => setPowerFactor(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value={0.8}>0.8 PF (Standard inductive motor loads)</option>
                  <option value={0.9}>0.9 PF (Commercial office)</option>
                  <option value={1.0}>1.0 PF (Pure resistive loads)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Inverter Topology
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value="HYBRID">Hybrid Solar Inverter (Grid + PV + Battery)</option>
                  <option value="OFF_GRID">Pure Off-Grid Inverter</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Calculate Inverter Sizing <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator
                  level={result.confidence}
                  reasoning={result.confidenceReasoning}
                />

                <CalculationSummary
                  title="Inverter Sizing Results"
                  metrics={[
                    {
                      label: 'Recommended Inverter Rating',
                      value: resData.recommendedInverterKva,
                      unit: 'kVA',
                      description: `Rated for ${resData.recommendedInverterKva * powerFactor} kW active power`,
                    },
                    {
                      label: 'Minimum Required Capacity',
                      value: resData.minimumInverterKva,
                      unit: 'kVA',
                      description: 'Includes 25% safety expansion margin',
                    },
                    {
                      label: 'DC Battery Bus Voltage',
                      value: resData.recommendedDcVoltage,
                      unit: 'V DC',
                      description: 'Optimal DC input voltage',
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />

                <EngineeringNotes
                  notes={result.supporting_notes}
                  assumptions={result.assumptions}
                  warnings={result.warnings}
                />

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
