'use client';

import React from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';

interface Step03Props {
  items: LoadItem[];
  onChange: (updatedItems: LoadItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step03UsageSetup({ items, onChange, onNext, onBack }: Step03Props) {
  const updateItem = (index: number, field: keyof LoadItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const totalWh = items.reduce(
    (acc, i) => acc + i.powerWatts * i.quantity * i.hoursPerDay * ((i.daysPerWeek ?? 7) / 7),
    0
  );
  const totalWatts = items.reduce((acc, i) => acc + i.powerWatts * i.quantity, 0);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 03 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1a1c19]">
          Appliance Operating Usage Setup
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Configure operating hours per day, quantity, and critical load priorities for selected equipment.
        </p>
      </div>

      {/* Equipment Usage Config List */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const itemWatts = item.powerWatts * item.quantity;
          const itemDailyKwh = ((itemWatts * item.hoursPerDay * ((item.daysPerWeek ?? 7) / 7)) / 1000).toFixed(1);
          const surgeMult = item.surgeMultiplier ?? (item.category === 'HVAC' || item.category === 'Cooling' || item.category === 'Utilities' ? 3.0 : 1.2);
          const itemSurgeWatts = Math.round(itemWatts * surgeMult);

          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4 hover:border-[#00490e]/40 transition-all"
            >
              {/* Header Row: Title, Category Badge, Critical Checkbox, Delete */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#c0c9bb]/30 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#eeeee9] flex items-center justify-center text-[#00490e] shrink-0">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-base text-[#1a1c19]">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eeeee9] text-[#41493e] uppercase">
                        {item.category || 'General'}
                      </span>
                      <span className="text-[10px] font-mono text-[#717a6d]">
                        Surge Factor: {surgeMult}× ({itemSurgeWatts.toLocaleString()}W peak)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#00490e] select-none">
                    <input
                      type="checkbox"
                      checked={!!item.isCritical}
                      onChange={(e) => updateItem(idx, 'isCritical', e.target.checked)}
                      className="rounded border-[#c0c9bb] text-[#00490e] focus:ring-[#00490e]"
                    />
                    Critical Backup Load
                  </label>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    className="text-[#717a6d] hover:text-red-600 disabled:opacity-30 p-1 rounded-lg hover:bg-[#eeeee9]"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              {/* Usage Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Operating Hours Slider & Input */}
                <div className="space-y-1.5 bg-[#f4f4ee] p-3 rounded-xl border border-[#c0c9bb]/30">
                  <div className="flex justify-between items-center">
                    <label className="font-sans font-bold text-[#1a1c19]">Daily Operating Hours</label>
                    <span className="font-headline font-extrabold text-sm text-[#00490e]">
                      {item.hoursPerDay} hrs/day
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={0.5}
                    value={item.hoursPerDay}
                    onChange={(e) => updateItem(idx, 'hoursPerDay', Number(e.target.value))}
                    className="w-full accent-[#00490e] cursor-pointer py-1"
                  />
                </div>

                {/* Quantity & Power Rating Inputs */}
                <div className="grid grid-cols-2 gap-2 bg-[#f4f4ee] p-3 rounded-xl border border-[#c0c9bb]/30">
                  <div>
                    <label className="font-sans font-bold text-[#1a1c19] block mb-1">Power (W)</label>
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={item.powerWatts}
                      onChange={(e) => updateItem(idx, 'powerWatts', Number(e.target.value))}
                      className="w-full bg-white border border-[#c0c9bb]/60 rounded-lg px-2 py-1 font-bold text-[#1a1c19] outline-none focus:ring-1 focus:ring-[#00490e]"
                    />
                  </div>
                  <div>
                    <label className="font-sans font-bold text-[#1a1c19] block mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                      className="w-full bg-white border border-[#c0c9bb]/60 rounded-lg px-2 py-1 font-bold text-[#1a1c19] outline-none focus:ring-1 focus:ring-[#00490e]"
                    />
                  </div>
                </div>

                {/* Days Per Week & Daily kWh Summary */}
                <div className="space-y-1.5 bg-[#f4f4ee] p-3 rounded-xl border border-[#c0c9bb]/30 flex flex-col justify-between">
                  <div>
                    <label className="font-sans font-bold text-[#1a1c19] block mb-1">Usage Frequency</label>
                    <select
                      value={item.daysPerWeek ?? 7}
                      onChange={(e) => updateItem(idx, 'daysPerWeek', Number(e.target.value))}
                      className="w-full bg-white border border-[#c0c9bb]/60 rounded-lg px-2 py-1 font-bold text-[#1a1c19] outline-none focus:ring-1 focus:ring-[#00490e]"
                    >
                      <option value={7}>Every day (7 days/week)</option>
                      <option value={5}>Weekdays only (5 days/week)</option>
                      <option value={2}>Weekends only (2 days/week)</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span className="text-[#717a6d]">Subtotal Daily Energy:</span>
                    <span className="font-headline font-bold text-[#00490e]">{itemDailyKwh} kWh</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Mobile/Desktop Live Load Summary Bar */}
      <div className="bg-[#00490e] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-xs font-semibold text-[#aef4a5] uppercase tracking-wider block">
            Calculated Live Energy Consumption
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-headline font-extrabold text-3xl">
              {(totalWh / 1000).toFixed(2)}
            </span>
            <span className="text-sm font-bold text-[#92d78b]">kWh / day</span>
            <span className="text-xs text-[#dbe5da] border-l border-white/20 pl-3">
              Active Load: {(totalWatts / 1000).toFixed(2)} kW
            </span>
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20">
          {items.length} Items Configured
        </span>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#1a1c19] font-sans text-sm font-semibold hover:bg-[#eeeee9] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Inventory Review</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
