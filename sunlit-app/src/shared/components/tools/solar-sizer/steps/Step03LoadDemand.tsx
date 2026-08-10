'use client';

import React from 'react';
import { LoadDemandState } from '../types';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SunlitIcon, SunlitIconName } from '@/shared/components/ui/SunlitIcon';
import { ApplianceCard } from '../ApplianceCard';

interface Step03Props {
  data: LoadDemandState;
  onChange: (updated: Partial<LoadDemandState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface CommonAppliance {
  name: string;
  watts: number;
  defaultHours: number;
  icon: SunlitIconName;
  description: string;
}

const COMMON_APPLIANCES: CommonAppliance[] = [
  {
    name: 'Air Conditioner 1.5 HP',
    watts: 1200,
    defaultHours: 8,
    icon: 'ac_unit',
    description: 'Inverter split AC cooling',
  },
  {
    name: 'Double-Door Refrigerator',
    watts: 250,
    defaultHours: 24,
    icon: 'kitchen',
    description: 'Continuous continuous cold storage',
  },
  {
    name: 'Deep Freezer',
    watts: 300,
    defaultHours: 12,
    icon: 'kitchen',
    description: 'Chest or upright freezer unit',
  },
  {
    name: 'LED Smart TV (55")',
    watts: 120,
    defaultHours: 6,
    icon: 'computer',
    description: 'Entertainment & media hub',
  },
  {
    name: 'Water Pumping Machine (1 HP)',
    watts: 750,
    defaultHours: 1,
    icon: 'water_drop',
    description: 'Borehole or overhead tank pump',
  },
  {
    name: 'LED House Lighting (10 Bulbs)',
    watts: 100,
    defaultHours: 8,
    icon: 'lightbulb',
    description: 'Energy-efficient room lighting',
  },
  {
    name: 'Laptop & Router Workstation',
    watts: 150,
    defaultHours: 10,
    icon: 'computer',
    description: 'Home office & internet setup',
  },
  {
    name: 'Washing Machine',
    watts: 500,
    defaultHours: 2,
    icon: 'local_laundry_service',
    description: 'Laundry & spin dryer',
  },
];

export function Step03LoadDemand({ data, onChange, onNext, onBack }: Step03Props) {
  // Compute live estimate based on input mode
  let estimatedDailyKwh = 0;
  let estimatedPeakWatts = 0;

  if (data.inputMode === 'bill' && data.monthlyBillNaira > 0) {
    const tariff = 225; // ₦225/kWh benchmark
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

  const getItemQuantity = (appName: string): number => {
    const found = data.loadItems.find((i) => i.name === appName);
    return found ? found.quantity : 0;
  };

  const handleApplianceToggle = (app: CommonAppliance) => {
    const currentQty = getItemQuantity(app.name);
    if (currentQty === 0) {
      const newItem: LoadItem = {
        name: app.name,
        powerWatts: app.watts,
        quantity: 1,
        hoursPerDay: app.defaultHours,
      };
      onChange({ loadItems: [...data.loadItems, newItem] });
    } else {
      const updated = data.loadItems.filter((i) => i.name !== app.name);
      onChange({ loadItems: updated });
    }
  };

  const handleQuantityDelta = (app: CommonAppliance, delta: number) => {
    const existingIndex = data.loadItems.findIndex((i) => i.name === app.name);
    if (existingIndex >= 0) {
      const updated = [...data.loadItems];
      const newQty = updated[existingIndex].quantity + delta;
      if (newQty <= 0) {
        updated.splice(existingIndex, 1);
      } else {
        updated[existingIndex].quantity = newQty;
      }
      onChange({ loadItems: updated });
    } else if (delta > 0) {
      const newItem: LoadItem = {
        name: app.name,
        powerWatts: app.watts,
        quantity: 1,
        hoursPerDay: app.defaultHours,
      };
      onChange({ loadItems: [...data.loadItems, newItem] });
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 03 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Load & Energy Demand Profile
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Calculate your property daily kWh energy consumption and peak continuous electrical load.
        </p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex rounded-2xl bg-[#f6ece6] p-1.5 border border-[#bfcaba]/40 shadow-xs">
        {[
          { id: 'bill', label: 'Monthly DISCO Bill (₦)' },
          { id: 'appliances', label: 'Appliance Checklist' },
          { id: 'direct_kwh', label: 'Direct Daily kWh' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange({ inputMode: tab.id as any })}
            className={`flex-1 py-2.5 px-3 rounded-xl font-sans text-xs font-bold transition-all text-center cursor-pointer ${
              data.inputMode === tab.id
                ? 'bg-[#00490e] text-white shadow-sm'
                : 'text-[#40493d] hover:text-[#1f1b17]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Mode Content */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#bfcaba]/40 shadow-xs space-y-4">
        {data.inputMode === 'bill' && (
          <div className="space-y-3">
            <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
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
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-3.5 font-headline font-bold text-xl text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e] transition-all"
                placeholder="e.g. 150000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline font-bold text-base text-[#707a6c]">
                ₦ / month
              </span>
            </div>
            <p className="font-sans text-xs text-[#40493d]">
              Calculated using standard Band A tariff benchmark (~₦225/kWh).
            </p>
          </div>
        )}

        {data.inputMode === 'direct_kwh' && (
          <div className="space-y-3">
            <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
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
                className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-3.5 font-headline font-bold text-xl text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e] transition-all"
                placeholder="e.g. 25.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline font-bold text-base text-[#707a6c]">
                kWh / day
              </span>
            </div>
          </div>
        )}

        {data.inputMode === 'appliances' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
                Select Appliances & Quantities
              </label>
              <span className="font-sans text-xs font-semibold text-[#00490e]">
                {data.loadItems.length} Selected
              </span>
            </div>

            {/* Controlled 2-column grid on desktop, 1-column on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMON_APPLIANCES.map((app) => {
                const qty = getItemQuantity(app.name);
                return (
                  <ApplianceCard
                    key={app.name}
                    icon={app.icon}
                    title={app.name}
                    description={app.description}
                    wattage={app.watts}
                    quantity={qty}
                    isSelected={qty > 0}
                    onClick={() => handleApplianceToggle(app)}
                    onQuantityChange={(delta) => handleQuantityDelta(app, delta)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Live Energy Demand Calculation Summary */}
      <div className="bg-gradient-to-r from-[#00490e] to-[#0f631b] text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div>
          <span className="text-[11px] font-bold text-[#8cdd86] uppercase tracking-wider block">
            Calculated Sizing Basis
          </span>
          <div className="flex items-baseline gap-4 mt-1">
            <div>
              <span className="font-headline font-extrabold text-3xl sm:text-4xl">
                {estimatedDailyKwh}
              </span>
              <span className="text-sm font-semibold text-[#8cdd86] ml-1.5">kWh / day</span>
            </div>
            <div className="text-xs text-[#ceee93] border-l border-white/20 pl-4">
              <span>Estimated Peak Load: </span>
              <span className="font-bold text-white">
                {(estimatedPeakWatts / 1000).toFixed(2)} kW
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 font-semibold shrink-0">
          Target Energy Demand
        </span>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to Property Profile"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={estimatedDailyKwh <= 0}
          aria-label="Continue to Energy Profile"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Energy Profile</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
