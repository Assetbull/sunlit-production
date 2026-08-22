'use client';

import React from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step03Props {
  items: LoadItem[];
  onNext: () => void;
  onBack: () => void;
  onEdit: () => void;
}

export function Step03ReviewPlan({ items, onNext, onBack, onEdit }: Step03Props) {
  const totalActiveWatts = items.reduce((acc, i) => acc + i.powerWatts * i.quantity, 0);

  const totalDailyWh = items.reduce(
    (acc, i) => acc + i.powerWatts * i.quantity * i.hoursPerDay,
    0
  );

  const criticalDailyWh = items
    .filter((i) => i.isCritical)
    .reduce((acc, i) => acc + i.powerWatts * i.quantity * i.hoursPerDay, 0);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 03 OF 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Review Connected Energy Plan
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
          Review connected electrical equipment, operating hours, and baseline energy requirements before setting backup priorities.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Active Connected Power</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {(totalActiveWatts / 1000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#40493d]">kW</span>
          </div>
          <span className="text-[11px] text-[#707a6c]">{totalActiveWatts.toLocaleString()} Watts total</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Daily Energy Consumption</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {(totalDailyWh / 1000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#40493d]">kWh/day</span>
          </div>
          <span className="text-[11px] text-[#707a6c]">100% whole-home baseline</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#bfcaba]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#707a6c] uppercase block mb-1">Critical Load Baseline</span>
          <div className="font-headline font-extrabold text-3xl text-[#0f631b]">
            {(criticalDailyWh / 1000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#40493d]">kWh/day</span>
          </div>
          <span className="text-[11px] text-[#707a6c]">Essential backup loads</span>
        </div>
      </div>

      {/* Selected Items Breakdown */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#bfcaba]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#bfcaba]/30 pb-3">
          <span className="font-headline font-bold text-base text-[#1f1b17]">
            Connected Appliance Inventory ({items.length} Items)
          </span>
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
                <th className="py-2 px-2">Appliance Name</th>
                <th className="py-2 px-2">Quantity</th>
                <th className="py-2 px-2">Power (W)</th>
                <th className="py-2 px-2">Daily Hours</th>
                <th className="py-2 px-2">Priority</th>
                <th className="py-2 px-2 text-right">Subtotal Daily Energy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfcaba]/20">
              {items.map((item, idx) => {
                const subWatts = item.powerWatts * item.quantity;
                const subDailyKwh = ((subWatts * item.hoursPerDay) / 1000).toFixed(2);

                return (
                  <tr key={idx} className="hover:bg-[#fcf2eb]">
                    <td className="py-2.5 px-2 font-bold text-[#1f1b17]">{item.name}</td>
                    <td className="py-2.5 px-2 font-mono font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-2 font-mono">{subWatts} W</td>
                    <td className="py-2.5 px-2 font-mono">{item.hoursPerDay} hrs/day</td>
                    <td className="py-2.5 px-2">
                      {item.isCritical ? (
                        <span className="text-[9px] font-bold bg-[#ceee93]/40 text-[#00490e] px-2 py-0.5 rounded border border-[#00490e]/20">
                          Critical Backup
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-[#f6ece6] text-[#707a6c] px-2 py-0.5 rounded">
                          Standard Load
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-right text-[#00490e]">
                      {subDailyKwh} kWh
                    </td>
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
          aria-label="Go Back"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Continue to Backup Needs"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Backup Needs</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
