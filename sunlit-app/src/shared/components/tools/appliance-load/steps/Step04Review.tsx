'use client';

import React from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step04Props {
  items: LoadItem[];
  onCalculate: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export function Step04Review({ items, onCalculate, onBack, onEdit }: Step04Props) {
  const totalActiveWatts = items.reduce((acc, i) => acc + i.powerWatts * i.quantity, 0);

  const totalSurgeWatts = items.reduce((acc, i) => {
    const mult = i.surgeMultiplier ?? (i.category === 'HVAC' || i.category === 'Cooling' || i.category === 'Utilities' ? 3.0 : 1.2);
    return acc + Math.round(i.powerWatts * i.quantity * mult);
  }, 0);

  const totalDailyWh = items.reduce(
    (acc, i) => acc + i.powerWatts * i.quantity * i.hoursPerDay * ((i.daysPerWeek ?? 7) / 7),
    0
  );

  const criticalWh = items.filter((i) => i.isCritical).reduce(
    (acc, i) => acc + i.powerWatts * i.quantity * i.hoursPerDay * ((i.daysPerWeek ?? 7) / 7),
    0
  );

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 04 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Review Load Inventory & Parameters
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Review appliance counts, operating hours, and surge multipliers before running the calculation engine.
        </p>
      </div>

      {/* Summary Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-xs font-bold text-[#707a6c] uppercase block mb-1">Active Power</span>
          <div className="font-headline font-extrabold text-2xl text-[#00490e]">
            {(totalActiveWatts / 1000).toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#40493d]">kW</span>
          </div>
          <span className="text-[10px] text-[#707a6c]">{totalActiveWatts.toLocaleString()} Watts connected</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-xs font-bold text-[#707a6c] uppercase block mb-1">Peak Surge</span>
          <div className="font-headline font-extrabold text-2xl text-amber-700">
            {(totalSurgeWatts / 1000).toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#40493d]">kW</span>
          </div>
          <span className="text-[10px] text-[#707a6c]">Inverter surge headroom limit</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-xs font-bold text-[#707a6c] uppercase block mb-1">Daily Energy</span>
          <div className="font-headline font-extrabold text-2xl text-[#00490e]">
            {(totalDailyWh / 1000).toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#40493d]">kWh</span>
          </div>
          <span className="text-[10px] text-[#707a6c]">Battery sizing baseline</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-xs font-bold text-[#707a6c] uppercase block mb-1">Critical Subset</span>
          <div className="font-headline font-extrabold text-2xl text-[#0f631b]">
            {(criticalWh / 1000).toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#40493d]">kWh</span>
          </div>
          <span className="text-[10px] text-[#707a6c]">Essential backup circuits</span>
        </div>
      </div>

      {/* Inventory Breakdown Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#bfcaba]/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-base text-[#1f1b17]">
              Configured Load Profile ({items.length} Items)
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-[#00490e] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <SunlitIcon name="edit" size={14} />
            <span>Edit Inventory</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#bfcaba]/30 text-[#707a6c] font-bold uppercase text-[10px]">
                <th className="py-2 px-2">Equipment Name</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2">Qty</th>
                <th className="py-2 px-2">Rated Power</th>
                <th className="py-2 px-2">Daily Hours</th>
                <th className="py-2 px-2">Peak Surge</th>
                <th className="py-2 px-2 text-right">Daily kWh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfcaba]/20">
              {items.map((item, i) => {
                const subWatts = item.powerWatts * item.quantity;
                const mult = item.surgeMultiplier ?? (item.category === 'HVAC' || item.category === 'Cooling' || item.category === 'Utilities' ? 3.0 : 1.2);
                const surgeW = Math.round(subWatts * mult);
                const subDailyKwh = ((subWatts * item.hoursPerDay * ((item.daysPerWeek ?? 7) / 7)) / 1000).toFixed(2);

                return (
                  <tr key={i} className="hover:bg-[#fcf2eb]">
                    <td className="py-3 px-2 font-bold text-[#1f1b17]">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.isCritical && (
                          <span className="text-[9px] font-bold bg-[#ceee93]/40 text-[#00490e] px-1.5 py-0.5 rounded border border-[#00490e]/20">
                            Critical
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#707a6c]">{item.category || 'General'}</td>
                    <td className="py-3 px-2 font-mono font-bold text-[#1f1b17]">{item.quantity}</td>
                    <td className="py-3 px-2 font-mono">{subWatts} W</td>
                    <td className="py-3 px-2 font-mono">{item.hoursPerDay} hrs/day</td>
                    <td className="py-3 px-2 font-mono text-amber-700">{surgeW} W ({mult}×)</td>
                    <td className="py-3 px-2 font-mono font-bold text-right text-[#00490e]">{subDailyKwh} kWh</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to usage setup"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onCalculate}
          aria-label="Calculate Appliance Load Profile"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-8 py-3 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <SunlitIcon name="analytics" size={18} />
          <span>Calculate Appliance Load Profile</span>
        </button>
      </div>
    </div>
  );
}
