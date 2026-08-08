'use client';

import { useState } from 'react';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { RecommendationCard } from '@/shared/components/tools/RecommendationCard';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Zap, Calculator, ArrowRight } from 'lucide-react';

export function SolarSystemSizingClient() {
  const [monthlyBill, setMonthlyBill] = useState<number>(150000);
  const [autonomyDays, setAutonomyDays] = useState<number>(1.0);
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');
  const [location, setLocation] = useState('Lagos');

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateSolarSystemSizing({
      monthlyBillNaira: 150000,
      daysOfAutonomy: 1.0,
      propertyType: 'residential',
      location: 'Lagos',
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateSolarSystemSizing({
      monthlyBillNaira: monthlyBill,
      daysOfAutonomy: autonomyDays,
      propertyType,
      location,
    });
    setResult(res);
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar System Sizing Calculator"
        category="System Design & Autonomy"
        description="Calculate required solar array kWp, battery kWh storage, and inverter kVA capacity tailored for property power requirements in Nigeria."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Calculator Input Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Zap size={20} className="text-primary" /> Project Parameters
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Monthly Electricity Bill (₦) *
                </label>
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-primary outline-none"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Estimated based on Band A tariff (₦225/kWh).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Battery Autonomy Requirement *
                </label>
                <select
                  value={autonomyDays}
                  onChange={(e) => setAutonomyDays(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value={0.5}>0.5 Days (Night backup only)</option>
                  <option value={1.0}>1.0 Day (Full 24-hour backup)</option>
                  <option value={1.5}>1.5 Days (Extended rainy day backup)</option>
                  <option value={2.0}>2.0 Days (Critical off-grid independence)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="residential">Residential Home / Villa</option>
                  <option value="commercial">Commercial Office / Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Location State
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Lagos">Lagos State (4.8 PSH)</option>
                  <option value="Abuja">Abuja (5.2 PSH)</option>
                  <option value="Ogun">Ogun State (4.7 PSH)</option>
                  <option value="Kano">Kano State (5.8 PSH)</option>
                  <option value="Port Harcourt">Rivers State (4.2 PSH)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Calculate System Size <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator
                  level={result.confidence}
                  reasoning={result.confidenceReasoning}
                />

                <CalculationSummary
                  metrics={[
                    {
                      label: 'Solar Array Capacity',
                      value: resData.recommendedSolarArrayKwp,
                      unit: 'kWp',
                      description: `${resData.recommendedPanelCount} × 550W Panels (~${resData.estimatedRoofAreaM2} m²)`,
                    },
                    {
                      label: 'Battery Storage',
                      value: resData.recommendedBatteryKwh,
                      unit: 'kWh',
                      description: `${autonomyDays} day(s) autonomy @ 80% max DoD`,
                    },
                    {
                      label: 'Inverter Rating',
                      value: resData.recommendedInverterKva,
                      unit: 'kVA',
                      description: 'Pure Sine Wave / Hybrid Inverter',
                    },
                    {
                      label: 'Daily Generation',
                      value: resData.dailyEnergyDemandKwh,
                      unit: 'kWh/day',
                      description: 'Estimated average daily yield',
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

        <PublicWaitlistForm interestedTool="Solar System Sizing Calculator" />
        <RelatedToolsList currentToolId="solar-system-sizing" />
      </div>
    </main>
  );
}
