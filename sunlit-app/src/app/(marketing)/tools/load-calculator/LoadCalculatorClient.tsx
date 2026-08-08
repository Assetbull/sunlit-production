'use client';

import { useState } from 'react';
import { calculateLoad, LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';
import { ToolHeader } from '@/shared/components/tools/ToolHeader';
import { ConfidenceIndicator } from '@/shared/components/tools/ConfidenceIndicator';
import { CalculationSummary } from '@/shared/components/tools/CalculationSummary';
import { EngineeringNotes } from '@/shared/components/tools/EngineeringNotes';
import { UnlockReportCTA } from '@/shared/components/tools/UnlockReportCTA';
import { PublicWaitlistForm } from '@/shared/components/tools/PublicWaitlistForm';
import { RelatedToolsList } from '@/shared/components/tools/RelatedToolsList';
import { Plus, Trash2, Zap, ArrowRight } from 'lucide-react';

const DEFAULT_ITEMS: LoadItem[] = [
  { name: '1.5HP Inverter AC', powerWatts: 1100, quantity: 1, hoursPerDay: 8 },
  { name: 'Refrigerator / Freezer', powerWatts: 250, quantity: 1, hoursPerDay: 24 },
  { name: 'LED Bulbs', powerWatts: 15, quantity: 10, hoursPerDay: 6 },
  { name: 'Smart TV (55")', powerWatts: 120, quantity: 1, hoursPerDay: 5 },
  { name: 'WiFi Router & Laptops', powerWatts: 80, quantity: 2, hoursPerDay: 12 },
];

export function LoadCalculatorClient() {
  const [items, setItems] = useState<LoadItem[]>(DEFAULT_ITEMS);

  const [result, setResult] = useState<SharedCalculationResult>(() =>
    calculateLoad({ items: DEFAULT_ITEMS })
  );

  const updateItem = (index: number, field: keyof LoadItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
    setResult(calculateLoad({ items: updated }));
  };

  const addItem = () => {
    const updated = [...items, { name: 'New Appliance', powerWatts: 100, quantity: 1, hoursPerDay: 4 }];
    setItems(updated);
    setResult(calculateLoad({ items: updated }));
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    setResult(calculateLoad({ items: updated }));
  };

  const isSuccess = result.calculation_status === 'SUCCESS';
  const resData = result.engineering_results;

  return (
    <main className="bg-surface min-h-screen pb-24">
      <ToolHeader
        title="Appliance Load Calculator"
        category="Load Sizing & Energy Consumption"
        description="Estimate total connected wattage, peak surge demand, and daily energy consumption (kWh) across household or commercial appliances."
      />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Appliance Inventory Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-3">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Zap size={20} className="text-primary" /> Electrical Appliance Inventory
              </h2>
              <button
                onClick={addItem}
                className="bg-primary/10 text-primary font-bold px-3.5 py-1.5 rounded-full text-xs hover:bg-primary/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Appliance
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-12 sm:col-span-4">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Appliance Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-stone-900"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Watts (W)</label>
                    <input
                      type="number"
                      min={1}
                      value={item.powerWatts}
                      onChange={(e) => updateItem(idx, 'powerWatts', Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs font-bold text-stone-900"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs font-bold text-stone-900"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-3">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Hours/Day</label>
                    <input
                      type="number"
                      min={0}
                      max={24}
                      value={item.hoursPerDay}
                      onChange={(e) => updateItem(idx, 'hoursPerDay', Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1.5 text-xs font-bold text-stone-900"
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                      className="text-stone-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5">
            {isSuccess && (
              <>
                <ConfidenceIndicator
                  level={result.confidence}
                  reasoning={result.confidenceReasoning}
                />

                <CalculationSummary
                  title="Electrical Demand Summary"
                  metrics={[
                    {
                      label: 'Connected Active Power',
                      value: (resData.totalConnectedWatts / 1000).toFixed(2),
                      unit: 'kW',
                      description: `${resData.totalConnectedWatts} Total Watts`,
                    },
                    {
                      label: 'Peak Surge Demand',
                      value: resData.peakDemandKw,
                      unit: 'kW',
                      description: 'Includes 25% motor startup buffer',
                    },
                    {
                      label: 'Daily Energy Requirement',
                      value: resData.dailyEnergyDemandKwh,
                      unit: 'kWh/day',
                      description: `${resData.monthlyEnergyDemandKwh} kWh/month`,
                    },
                  ]}
                />

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

        <PublicWaitlistForm interestedTool="Appliance Load Calculator" />
        <RelatedToolsList currentToolId="load-calculator" />
      </div>
    </main>
  );
}
