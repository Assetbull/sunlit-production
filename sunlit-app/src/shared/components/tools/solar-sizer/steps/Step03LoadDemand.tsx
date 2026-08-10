'use client';

import React from 'react';
import { LoadDemandState } from '../types';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';

interface Step03Props {
  data: LoadDemandState;
  onChange: (updated: Partial<LoadDemandState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const COMMON_APPLIANCES = [
  { name: 'Air Conditioner 1.5 HP (Inverter)', watts: 1200, defaultHours: 8, category: 'ac' },
  { name: 'Double-Door Refrigerator', watts: 250, defaultHours: 24, category: 'fridge' },
  { name: 'Deep Freezer', watts: 300, defaultHours: 12, category: 'fridge' },
  { name: 'LED Smart TV (55")', watts: 120, defaultHours: 6, category: 'entertainment' },
  { name: 'Water Pumping Machine (1 HP)', watts: 750, defaultHours: 1, category: 'pump' },
  { name: 'LED House Lighting (10 Bulbs)', watts: 100, defaultHours: 8, category: 'lighting' },
  { name: 'Laptop Workstation & Router', watts: 150, defaultHours: 10, category: 'office' },
  { name: 'Washing Machine', watts: 500, defaultHours: 2, category: 'laundry' },
];

export function Step03LoadDemand({ data, onChange, onNext, onBack }: Step03Props) {
  // Compute live estimate based on input mode
  let estimatedDailyKwh = 0;
  let estimatedPeakWatts = 0;

  if (data.inputMode === 'bill' && data.monthlyBillNaira > 0) {
    const tariff = 225; // ₦225/kWh
    estimatedDailyKwh = Number(((data.monthlyBillNaira / tariff) / 30).toFixed(2));
    estimatedPeakWatts = Math.round((estimatedDailyKwh * 1000) / 8);
  } else if (data.inputMode === 'direct_kwh' && data.dailyKwhInput > 0) {
    estimatedDailyKwh = data.dailyKwhInput;
    estimatedPeakWatts = Math.round((estimatedDailyKwh * 1000) / 8);
  } else if (data.inputMode === 'appliances' && data.loadItems.length > 0) {
    const totalWatts = data.loadItems.reduce((acc, item) => acc + item.quantity * item.powerWatts, 0);
    const totalDailyWh = data.loadItems.reduce(
      (acc, item) => acc + item.quantity * item.powerWatts * item.hoursPerDay,
      0
    );
    estimatedDailyKwh = Number((totalDailyWh / 1000).toFixed(2));
    estimatedPeakWatts = totalWatts;
  }

  const addAppliance = (app: typeof COMMON_APPLIANCES[0]) => {
    const existingIndex = data.loadItems.findIndex((i) => i.name === app.name);
    if (existingIndex >= 0) {
      const updated = [...data.loadItems];
      updated[existingIndex].quantity += 1;
      onChange({ loadItems: updated });
    } else {
      const newItem: LoadItem = {
        name: app.name,
        powerWatts: app.watts,
        quantity: 1,
        hoursPerDay: app.defaultHours,
      };
      onChange({ loadItems: [...data.loadItems, newItem] });
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...data.loadItems];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    onChange({ loadItems: updated });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 03 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Load & Energy Demand Profile
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Calculate your property daily kWh energy consumption and peak continuous electrical load.
        </p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex rounded-2xl bg-[#f2f5ec] p-1.5 border border-[#c0c9bb]/40">
        {[
          { id: 'bill', label: 'Monthly DISCO Bill (₦)' },
          { id: 'appliances', label: 'Appliance Checklist' },
          { id: 'direct_kwh', label: 'Direct Daily kWh' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange({ inputMode: tab.id as any })}
            className={`flex-1 py-2.5 px-3 rounded-xl font-sans text-xs font-bold transition-all text-center ${
              data.inputMode === tab.id
                ? 'bg-[#00490e] text-white shadow-sm'
                : 'text-[#41493e] hover:text-[#191d17]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Mode Content */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
        {data.inputMode === 'bill' && (
          <div className="space-y-3">
            <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
              Average Monthly DISCO Electricity Bill (₦)
            </label>
            <div className="relative">
              <input
                type="number"
                min={5000}
                max={50000000}
                step={5000}
                value={data.monthlyBillNaira}
                onChange={(e) => onChange({ monthlyBillNaira: Math.max(0, Number(e.target.value)) })}
                className="w-full bg-[#f2f5ec] border border-[#c0c9bb]/60 rounded-xl px-4 py-3.5 font-headline font-bold text-xl text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 150000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline font-bold text-lg text-[#717a6d]">
                ₦ / month
              </span>
            </div>
            <p className="font-sans text-xs text-[#41493e]">
              Calculated using standard Band A tariff benchmark (~₦225/kWh).
            </p>
          </div>
        )}

        {data.inputMode === 'direct_kwh' && (
          <div className="space-y-3">
            <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
              Target Daily Energy Consumption (kWh/day)
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={500}
                step={0.5}
                value={data.dailyKwhInput}
                onChange={(e) => onChange({ dailyKwhInput: Math.max(0, Number(e.target.value)) })}
                className="w-full bg-[#f2f5ec] border border-[#c0c9bb]/60 rounded-xl px-4 py-3.5 font-headline font-bold text-xl text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 25.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline font-bold text-lg text-[#717a6d]">
                kWh / day
              </span>
            </div>
          </div>
        )}

        {data.inputMode === 'appliances' && (
          <div className="space-y-4">
            <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
              Quick Add Common Appliances
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_APPLIANCES.map((app) => (
                <button
                  key={app.name}
                  type="button"
                  onClick={() => addAppliance(app)}
                  className="p-2.5 rounded-xl border border-[#c0c9bb]/50 bg-[#f2f5ec] hover:bg-[#ecefe6] text-left transition-all"
                >
                  <div className="font-sans font-bold text-xs text-[#191d17] truncate">{app.name}</div>
                  <div className="font-sans text-[10px] text-[#717a6d] mt-0.5">{app.watts}W</div>
                </button>
              ))}
            </div>

            {data.loadItems.length > 0 && (
              <div className="pt-2 border-t border-[#c0c9bb]/30 space-y-2">
                <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
                  Selected Load Inventory ({data.loadItems.length})
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {data.loadItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-[#f7fbf1] rounded-xl border border-[#c0c9bb]/30 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#191d17]">{item.name}</span>
                        <span className="text-[#717a6d] ml-2">
                          ({item.powerWatts}W × {item.hoursPerDay}h/day)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="w-6 h-6 rounded-lg bg-[#e0e4db] font-bold text-[#191d17] flex items-center justify-center hover:bg-[#c0c9bb]"
                        >
                          -
                        </button>
                        <span className="font-bold text-[#191d17] px-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="w-6 h-6 rounded-lg bg-[#00490e] text-white font-bold flex items-center justify-center hover:bg-[#003006]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Energy Demand Calculation Summary */}
      <div className="bg-gradient-to-r from-[#00490e] to-[#003006] text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div>
          <span className="text-xs font-semibold text-[#aef4a5] uppercase tracking-wider block">
            Calculated Sizing Basis
          </span>
          <div className="flex items-baseline gap-4 mt-1">
            <div>
              <span className="font-headline font-extrabold text-3xl">{estimatedDailyKwh}</span>
              <span className="text-sm font-semibold text-[#92d78b] ml-1">kWh / day</span>
            </div>
            <div className="text-xs text-[#dce6d5] border-l border-white/20 pl-4">
              <span>Estimated Peak Load: </span>
              <span className="font-bold text-white">
                {(estimatedPeakWatts / 1000).toFixed(2)} kW
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          Target Energy Demand
        </span>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={estimatedDailyKwh <= 0}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Energy Profile</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
