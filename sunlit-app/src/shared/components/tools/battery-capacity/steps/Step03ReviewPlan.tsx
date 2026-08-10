'use client';

import React from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';

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
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 03 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Review Connected Energy Plan
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Review connected electrical equipment, operating hours, and baseline energy requirements before setting backup priorities.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Active Connected Power</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {(totalActiveWatts / 1000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#41493e]">kW</span>
          </div>
          <span className="text-[11px] text-[#717a6d]">{totalActiveWatts.toLocaleString()} Watts total</span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Daily Energy Consumption</span>
          <div className="font-headline font-extrabold text-3xl text-[#00490e]">
            {(totalDailyWh / 1000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#41493e]">kWh/day</span>
          </div>
          <span className="text-[11px] text-[#717a6d]">100% whole-home baseline</span>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#c0c9bb]/40 shadow-sm">
          <span className="text-xs font-bold text-[#717a6d] uppercase block mb-1">Critical Load Baseline</span>
          <div className="font-headline font-extrabold text-3xl text-emerald-800">
            {(criticalDailyWh / 1000).toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#41493e]">kWh/day</span>
          </div>
          <span className="text-[11px] text-[#717a6d]">Essential backup loads</span>
        </div>
      </div>

      {/* Selected Items Breakdown */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#c0c9bb]/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#c0c9bb]/30 pb-3">
          <span className="font-headline font-bold text-base text-[#191d17]">
            Connected Appliance Inventory ({items.length} Items)
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-bold text-[#00490e] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Edit Inventory</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#c0c9bb]/30 text-[#717a6d] font-bold uppercase text-[10px]">
                <th className="py-2 px-2">Appliance Name</th>
                <th className="py-2 px-2">Quantity</th>
                <th className="py-2 px-2">Power (W)</th>
                <th className="py-2 px-2">Daily Hours</th>
                <th className="py-2 px-2">Priority</th>
                <th className="py-2 px-2 text-right">Subtotal Daily Energy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c0c9bb]/20">
              {items.map((item, idx) => {
                const subWatts = item.powerWatts * item.quantity;
                const subDailyKwh = ((subWatts * item.hoursPerDay) / 1000).toFixed(2);

                return (
                  <tr key={idx} className="hover:bg-[#f2f5ec]">
                    <td className="py-2.5 px-2 font-bold text-[#191d17]">{item.name}</td>
                    <td className="py-2.5 px-2 font-mono font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-2 font-mono">{subWatts} W</td>
                    <td className="py-2.5 px-2 font-mono">{item.hoursPerDay} hrs/day</td>
                    <td className="py-2.5 px-2">
                      {item.isCritical ? (
                        <span className="text-[9px] font-bold bg-[#aef4a5]/40 text-[#00490e] px-2 py-0.5 rounded border border-[#92d78b]">
                          Critical Backup
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-[#ecefe6] text-[#717a6d] px-2 py-0.5 rounded">
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
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Backup Needs</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
