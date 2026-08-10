'use client';

import React from 'react';

interface Step03Props {
  dailyKwh: number;
  monthlyBillNgn: number;
  onChangeDailyKwh: (kwh: number) => void;
  onChangeBill: (bill: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step03EnergyRequirement({
  dailyKwh,
  monthlyBillNgn,
  onChangeDailyKwh,
  onChangeBill,
  onNext,
  onBack,
}: Step03Props) {
  // Convert NGN bill to estimated kWh assuming ~220 NGN / kWh average Band A/B tariff
  const handleBillChange = (bill: number) => {
    onChangeBill(bill);
    if (bill > 0) {
      const estimatedDaily = Math.round((bill / 30 / 220) * 10) / 10;
      onChangeDailyKwh(Math.max(1, estimatedDaily));
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 03 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Energy Requirement Target
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Enter your target daily solar energy production (kWh/day) or estimate demand from your monthly electricity bill.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Energy Demand Input */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">bolt</span>
            <span>Target Daily Solar Energy</span>
          </h4>

          <div className="space-y-2">
            <label className="font-sans font-bold text-xs text-[#191d17] block">
              Required Daily Production (kWh/day)
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={1000}
                step={0.5}
                value={dailyKwh}
                onChange={(e) => onChangeDailyKwh(Math.max(0.5, Number(e.target.value)))}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-4 py-3 font-headline font-bold text-2xl text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#717a6d]">
                KWH / DAY
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#717a6d]">
              Equivalent to {(dailyKwh * 30).toFixed(0)} kWh total monthly solar energy generation.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#717a6d] uppercase block mb-1.5">
              Quick Property Baseline Presets
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => onChangeDailyKwh(15)}
                className="p-2 bg-[#ecefe6] hover:bg-[#aef4a5]/40 rounded-xl border border-[#c0c9bb]/40 text-[#191d17] text-center"
              >
                15 kWh (3-Bed Home)
              </button>
              <button
                type="button"
                onClick={() => onChangeDailyKwh(30)}
                className="p-2 bg-[#ecefe6] hover:bg-[#aef4a5]/40 rounded-xl border border-[#c0c9bb]/40 text-[#191d17] text-center"
              >
                30 kWh (5-Bed Villa)
              </button>
              <button
                type="button"
                onClick={() => onChangeDailyKwh(75)}
                className="p-2 bg-[#ecefe6] hover:bg-[#aef4a5]/40 rounded-xl border border-[#c0c9bb]/40 text-[#191d17] text-center"
              >
                75 kWh (Commercial)
              </button>
            </div>
          </div>
        </div>

        {/* Estimate from Monthly Bill */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#c0c9bb]/40 shadow-sm space-y-4">
          <h4 className="font-headline font-bold text-sm text-[#00490e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">payments</span>
            <span>Estimate From Monthly Electricity Bill</span>
          </h4>

          <div className="space-y-2">
            <label className="font-sans font-bold text-xs text-[#191d17] block">
              Average Monthly Bill (NGN ₦)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={5000000}
                step={5000}
                value={monthlyBillNgn}
                onChange={(e) => handleBillChange(Number(e.target.value))}
                className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-4 py-3 font-headline font-bold text-xl text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                placeholder="e.g. 150000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#717a6d]">
                NGN ₦ / MONTH
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#717a6d]">
              Estimates kWh demand based on DISCO Band A / Band B average tariff (~₦220/kWh).
            </p>
          </div>
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
          <span>Continue to Location & Solar Resource</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
