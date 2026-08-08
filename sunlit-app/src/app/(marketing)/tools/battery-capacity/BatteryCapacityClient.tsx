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
import { Battery, ArrowRight } from 'lucide-react';

export function BatteryCapacityClient() {
  const [dailyKwh, setDailyKwh] = useState<number>(20);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [voltage, setVoltage] = useState<48 | 24 | 51.2>(48);
  const [chemistry, setChemistry] = useState<'LITHIUM_LIFEPO4' | 'TUBULAR_GEL'>('LITHIUM_LIFEPO4');

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateBatteryCapacity({
      dailyEnergyKwh: 20,
      daysOfAutonomy: 1.0,
      systemVoltage: 48,
      chemistry: 'LITHIUM_LIFEPO4',
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(
      calculateBatteryCapacity({
        dailyEnergyKwh: dailyKwh,
        daysOfAutonomy: autonomyDays,
        systemVoltage: voltage,
        chemistry,
      })
    );
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Battery Capacity Calculator"
        category="Energy Storage & Autonomy"
        description="Determine required battery bank storage capacity (kWh & Amp-Hours) with Depth of Discharge (DoD) and temperature derating."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Battery size={20} className="text-primary" /> Storage Parameters
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Daily Energy Consumption (kWh) *
                </label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={dailyKwh}
                  onChange={(e) => setDailyKwh(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Days of Autonomy *
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={autonomyDays}
                  onChange={(e) => setAutonomyDays(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Battery Chemistry *
                </label>
                <select
                  value={chemistry}
                  onChange={(e) => setChemistry(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value="LITHIUM_LIFEPO4">Lithium LiFePO4 (80% DoD, 3,500+ cycles)</option>
                  <option value="TUBULAR_GEL">Tubular Deep Cycle Gel (50% DoD, 1,200 cycles)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  System Bus Voltage *
                </label>
                <select
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value) as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                >
                  <option value={48}>48V DC Bus (Recommended standard)</option>
                  <option value={24}>24V DC Bus (Small installations)</option>
                  <option value={51.2}>51.2V DC High Voltage</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Calculate Battery Size <ArrowRight size={18} />
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
                  title="Battery Storage Requirements"
                  metrics={[
                    {
                      label: 'Installed Battery Storage',
                      value: resData.installedCapacityKwh,
                      unit: 'kWh',
                      description: `${resData.recommendedModuleCount} × Battery Modules`,
                    },
                    {
                      label: 'Required Ampere-Hours',
                      value: resData.requiredAmpHours,
                      unit: `Ah @ ${resData.systemVoltage}V`,
                      description: 'Total DC capacity required',
                    },
                    {
                      label: 'Usable Storage',
                      value: resData.requiredUsableKwh,
                      unit: 'kWh',
                      description: `Net energy for ${autonomyDays} day(s)`,
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

        <PublicWaitlistForm interestedTool="Battery Capacity Calculator" />
        <RelatedToolsList currentToolId="battery-capacity" />
      </div>
    </main>
  );
}
