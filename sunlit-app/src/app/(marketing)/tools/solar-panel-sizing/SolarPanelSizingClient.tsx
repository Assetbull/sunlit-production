'use client';

import { useState } from 'react';
import { calculateSolarPanelSizing } from '@/lib/engineering/calculators/solarPanelSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { RecommendationCard } from '@/shared/components/tools/RecommendationCard';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Sun, ArrowRight } from 'lucide-react';

export function SolarPanelSizingClient() {
  const [dailyKwh, setDailyKwh] = useState<number>(25);
  const [psh, setPsh] = useState<number>(4.8);
  const [wattage, setWattage] = useState<number>(550);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateSolarPanelSizing({ dailyEnergyDemandKwh: 25, peakSunHours: 4.8, panelWattage: 550 })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateSolarPanelSizing({ dailyEnergyDemandKwh: dailyKwh, peakSunHours: psh, panelWattage: wattage }));
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Panel Sizing Tool"
        category="Solar Array Engineering"
        description="Calculate total solar panel count, peak array capacity (kWp), and roof area required based on regional solar irradiance."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Sun size={20} className="text-primary" /> Array Parameters
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Daily Energy Required (kWh) *
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={dailyKwh}
                  onChange={(e) => setDailyKwh(Number(e.target.value))}
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
                  min={3.0}
                  max={7.0}
                  step={0.1}
                  value={psh}
                  onChange={(e) => setPsh(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                />
                <p className="text-[11px] text-stone-500 mt-1">Nigeria average: 4.8 h/day (Lagos), 5.2 h/day (Abuja).</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Panel Wattage (W)
                </label>
                <select
                  value={wattage}
                  onChange={(e) => setWattage(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value={550}>550W Monocrystalline PERC (Standard)</option>
                  <option value={600}>600W High Efficiency N-Type</option>
                  <option value={450}>450W Compact Panel</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Calculate Panel Array <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Solar Panel Sizing Results"
                  metrics={[
                    {
                      label: 'Recommended Panel Count',
                      value: resData.recommendedPanelCount,
                      unit: 'Panels',
                      description: `${wattage}W Panels`,
                    },
                    {
                      label: 'Installed Array Power',
                      value: resData.actualArrayKwp,
                      unit: 'kWp',
                      description: `Minimum required: ${resData.requiredArrayKwp} kWp`,
                    },
                    {
                      label: 'Required Roof Area',
                      value: resData.estimatedRoofAreaM2,
                      unit: 'm²',
                      description: 'Unshaded mounting surface',
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

        <PublicWaitlistForm interestedTool="Solar Panel Sizing Tool" />
        <RelatedToolsList currentToolId="solar-panel-sizing" />
      </div>
    </main>
  );
}
