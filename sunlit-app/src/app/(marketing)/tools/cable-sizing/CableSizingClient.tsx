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
import { Cpu, ArrowRight } from 'lucide-react';

export function CableSizingClient() {
  const [currentAmps, setCurrentAmps] = useState<number>(40);
  const [lengthMeters, setLengthMeters] = useState<number>(15);
  const [voltage, setVoltage] = useState<48 | 24 | 12 | 230>(48);
  const [material, setMaterial] = useState<'COPPER' | 'ALUMINUM'>('COPPER');

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateCableSizing({ currentAmps: 40, cableLengthMeters: 15, systemVoltage: 48, conductorMaterial: 'COPPER' })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateCableSizing({ currentAmps, cableLengthMeters: lengthMeters, systemVoltage: voltage, conductorMaterial: material }));
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Cable Sizing Calculator"
        category="Electrical Wiring & Conductor Sizing"
        description="Calculate recommended cable gauge (mm²) and verify voltage drop stays below 3% max IEEE/IEC safety thresholds."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Cpu size={20} className="text-primary" /> Wiring Parameters
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Design Current (Amps) *
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={currentAmps}
                  onChange={(e) => setCurrentAmps(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  One-Way Cable Distance (Meters) *
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Circuit Voltage *
                </label>
                <select
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value) as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value={48}>48V DC Circuit</option>
                  <option value={24}>24V DC Circuit</option>
                  <option value={12}>12V DC Circuit</option>
                  <option value={230}>230V AC Single Phase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Conductor Material
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value="COPPER">Copper (Recommended for Solar DC)</option>
                  <option value="ALUMINUM">Aluminum (Commercial AC Feeders)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Calculate Cable Gauge <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Conductor Sizing Results"
                  metrics={[
                    {
                      label: 'Recommended Cable Size',
                      value: resData.recommendedCableSizeMm2,
                      unit: 'mm²',
                      description: `Exact calculated: ${resData.calculatedAreaMm2} mm²`,
                    },
                    {
                      label: 'Actual Voltage Drop',
                      value: resData.actualVoltageDropVolts,
                      unit: 'V',
                      description: `${resData.actualVoltageDropPercent}% voltage drop`,
                    },
                  ]}
                />

                <RecommendationCard items={result.recommended_configuration.equipmentList} />
                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />
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
