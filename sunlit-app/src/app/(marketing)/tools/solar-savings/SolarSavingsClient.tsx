'use client';

import { useState } from 'react';
import { calculateSolarSavings } from '@/lib/engineering/calculators/solarSavings';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { DollarSign, ArrowRight } from 'lucide-react';

export function SolarSavingsClient() {
  const [gridBill, setGridBill] = useState<number>(100000);
  const [dieselBill, setDieselBill] = useState<number>(180000);
  const [kwp, setKwp] = useState<number>(8);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateSolarSavings({
      currentMonthlyGridBillNaira: 100000,
      currentMonthlyDieselBillNaira: 180000,
      solarSystemCapacityKwp: 8,
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(
      calculateSolarSavings({
        currentMonthlyGridBillNaira: gridBill,
        currentMonthlyDieselBillNaira: dieselBill,
        solarSystemCapacityKwp: kwp,
      })
    );
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar Savings Calculator"
        category="Financial Savings Modeling"
        description="Calculate expected monthly and annual financial savings by replacing grid utility tariffs and diesel generator fuel spending."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <DollarSign size={20} className="text-primary" /> Energy Spending Inputs
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Solar System Size (kWp) *
                </label>
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  value={kwp}
                  onChange={(e) => setKwp(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Monthly DISCO Grid Bill (₦)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={gridBill}
                  onChange={(e) => setGridBill(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Monthly Diesel Generator Spending (₦)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={dieselBill}
                  onChange={(e) => setDieselBill(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
              >
                Calculate Monthly Savings <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Financial Savings Forecast"
                  metrics={[
                    {
                      label: 'Total Monthly Savings',
                      value: `₦${Number(resData.totalMonthlySavingsNaira).toLocaleString()}`,
                      description: 'Displaced utility & diesel cost',
                    },
                    {
                      label: 'Annual Cost Savings',
                      value: `₦${Number(resData.totalAnnualSavingsNaira).toLocaleString()}`,
                      description: 'First year net cash savings',
                    },
                    {
                      label: '10-Year Cumulative Savings',
                      value: `₦${(resData.cumulative10YearSavingsNaira / 1000000).toFixed(1)}M`,
                      description: 'Assumes 10% annual energy inflation',
                    },
                  ]}
                />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />
                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar Savings Calculator" />
        <RelatedToolsList currentToolId="solar-savings" />
      </div>
    </main>
  );
}
