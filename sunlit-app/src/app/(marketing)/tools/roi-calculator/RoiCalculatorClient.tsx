'use client';

import { useState } from 'react';
import { calculateRoi } from '@/lib/engineering/calculators/roiCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { TrendingUp, ArrowRight } from 'lucide-react';

export function RoiCalculatorClient() {
  const [cost, setCost] = useState<number>(6500000);
  const [kwp, setKwp] = useState<number>(8);
  const [gridBill, setGridBill] = useState<number>(80000);
  const [dieselBill, setDieselBill] = useState<number>(150000);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateRoi({
      systemCostNaira: 6500000,
      solarSystemCapacityKwp: 8,
      currentMonthlyGridBillNaira: 80000,
      currentMonthlyDieselBillNaira: 150000,
    })
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(
      calculateRoi({
        systemCostNaira: cost,
        solarSystemCapacityKwp: kwp,
        currentMonthlyGridBillNaira: gridBill,
        currentMonthlyDieselBillNaira: dieselBill,
      })
    );
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Solar ROI & Payback Calculator"
        category="Financial Return & Cash Flow"
        description="Calculate simple ROI percentage, payback period in years, and 25-year Net Present Value (NPV) for solar investments in Nigeria."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Investment Inputs
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Total Solar System Turnkey Cost (₦) *
                </label>
                <input
                  type="number"
                  min={500000}
                  step={500000}
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-bold text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  System Array Size (kWp) *
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
                  Current Monthly Grid Bill (₦)
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
                  Current Monthly Diesel Generator Spend (₦)
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
                Calculate Payback & ROI <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {isSuccess && (
              <>
                <ConfidenceIndicator level={result.confidence} reasoning={result.confidenceReasoning} />

                <CalculationSummary
                  title="Financial Return Summary"
                  metrics={[
                    {
                      label: 'Payback Period',
                      value: resData.paybackPeriodYears,
                      unit: 'Years',
                      description: 'Full capital recovery timeframe',
                    },
                    {
                      label: 'Simple Annual Return (ROI)',
                      value: `${resData.simpleRoiPercent}%`,
                      description: 'Annual net savings / investment',
                    },
                    {
                      label: '25-Year Net Present Value (NPV)',
                      value: `₦${(resData.estimated25YearNpvNaira / 1000000).toFixed(1)}M`,
                      description: 'Discounted @ 12% hurdle rate',
                    },
                  ]}
                />

                <EngineeringNotes notes={result.supporting_notes} assumptions={result.assumptions} warnings={result.warnings} />
                <UnlockReportCTA />
              </>
            )}
          </div>
        </div>

        <PublicWaitlistForm interestedTool="Solar ROI & Payback Calculator" />
        <RelatedToolsList currentToolId="roi-calculator" />
      </div>
    </main>
  );
}
