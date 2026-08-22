'use client';

import React, { useState } from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { ApplianceCard } from '@/shared/components/tools/solar-sizer/ApplianceCard';
import { SunlitIcon, SunlitIconName } from '@/shared/components/ui/SunlitIcon';

interface Step02Props {
  items: LoadItem[];
  onChange: (updatedItems: LoadItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_OPTIONS: (LoadItem & { icon: string; description: string })[] = [
  {
    name: 'Refrigerator / Freezer',
    powerWatts: 300,
    quantity: 1,
    hoursPerDay: 24,
    category: 'Cooling',
    isCritical: true,
    surgeMultiplier: 4.0,
    icon: 'kitchen',
    description: 'Continuous food preservation & cooling',
  },
  {
    name: 'LED Lighting Bulbs (10 Pack)',
    powerWatts: 15,
    quantity: 10,
    hoursPerDay: 8,
    category: 'Lighting',
    isCritical: true,
    surgeMultiplier: 1.0,
    icon: 'lightbulb',
    description: 'Essential indoor & security lighting',
  },
  {
    name: 'Air Conditioner (1.5 HP Inverter)',
    powerWatts: 1200,
    quantity: 2,
    hoursPerDay: 10,
    category: 'HVAC',
    isCritical: false,
    surgeMultiplier: 3.0,
    icon: 'ac_unit',
    description: 'Bedroom & living space cooling compressor',
  },
  {
    name: 'Water Pumping Machine (1 HP)',
    powerWatts: 1100,
    quantity: 1,
    hoursPerDay: 2,
    category: 'Utilities',
    isCritical: true,
    surgeMultiplier: 3.0,
    icon: 'water_drop',
    description: 'Overhead tank & borehole pumping motor',
  },
  {
    name: 'LED Smart TV (55")',
    powerWatts: 120,
    quantity: 1,
    hoursPerDay: 6,
    category: 'Entertainment',
    isCritical: false,
    surgeMultiplier: 1.0,
    icon: 'computer',
    description: 'Living room entertainment center',
  },
  {
    name: 'Laptop Workstation & Wi-Fi',
    powerWatts: 150,
    quantity: 2,
    hoursPerDay: 10,
    category: 'Computing',
    isCritical: true,
    surgeMultiplier: 1.0,
    icon: 'computer',
    description: 'Home office & internet router equipment',
  },
];

export function Step02Selection({ items, onChange, onNext, onBack }: Step02Props) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState(250);
  const [customQty, setCustomQty] = useState(1);
  const [customHours, setCustomHours] = useState(8);

  const getItemQuantity = (name: string): number => {
    const found = items.find((i) => i.name === name);
    return found ? found.quantity : 0;
  };

  const handleToggle = (preset: typeof PRESET_OPTIONS[0]) => {
    const existingIndex = items.findIndex((i) => i.name === preset.name);
    if (existingIndex >= 0) {
      onChange(items.filter((i) => i.name !== preset.name));
    } else {
      onChange([...items, { ...preset }]);
    }
  };

  const handleQuantityDelta = (presetName: string, delta: number) => {
    const existingIndex = items.findIndex((i) => i.name === presetName);
    if (existingIndex >= 0) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + delta;
      if (newQty <= 0) {
        updated.splice(existingIndex, 1);
      } else {
        updated[existingIndex].quantity = newQty;
      }
      onChange(updated);
    } else if (delta > 0) {
      const preset = PRESET_OPTIONS.find((p) => p.name === presetName);
      if (preset) {
        onChange([...items, { ...preset, quantity: 1 }]);
      }
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    onChange([
      ...items,
      {
        name: customName.trim(),
        powerWatts: Math.max(1, customWatts),
        quantity: Math.max(1, customQty),
        hoursPerDay: Math.min(24, Math.max(0, customHours)),
        category: 'General',
        isCritical: false,
        surgeMultiplier: 1.2,
      },
    ]);
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Select Connected Electrical Appliances
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Choose the appliances requiring battery backup to calculate your daily energy storage baseline.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESET_OPTIONS.map((preset) => {
          const qty = getItemQuantity(preset.name);
          return (
            <ApplianceCard
              key={preset.name}
              icon={preset.icon as SunlitIconName}
              title={preset.name}
              description={preset.description}
              wattage={preset.powerWatts}
              quantity={qty}
              isSelected={qty > 0}
              onClick={() => handleToggle(preset)}
              onQuantityChange={(delta) => handleQuantityDelta(preset.name, delta)}
            />
          );
        })}
      </div>

      {/* Add Custom Appliance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#fcf2eb] rounded-2xl border border-[#bfcaba]/40 gap-3">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#1f1b17]">Add custom electrical equipment?</h4>
          <p className="font-sans text-xs text-[#707a6c] mt-0.5">Add medical devices, electric gates, or specialized loads.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 bg-white border border-[#707a6c] hover:border-[#00490e] text-[#1f1b17] px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <SunlitIcon name="add" size={16} className="text-[#00490e]" />
          <span>Custom Equipment</span>
        </button>
      </div>

      {/* Selected Items Summary Bar */}
      <div className="bg-[#00490e] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-[11px] font-bold text-[#8cdd86] uppercase tracking-wider block">
            Current Appliance Selection
          </span>
          <div className="font-headline font-bold text-lg mt-0.5">
            {items.length} Appliance Types Selected
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 font-semibold shrink-0">
          Ready for Plan Review
        </span>
      </div>

      {/* Custom Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fff8f5] rounded-3xl p-6 max-w-md w-full border border-[#bfcaba] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/30 pb-3">
              <h3 className="font-headline font-bold text-base text-[#00490e]">Add Custom Equipment</h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-[#707a6c] font-bold text-lg hover:text-[#1f1b17] cursor-pointer"
              >
                <SunlitIcon name="close" size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-sans font-bold text-[#1f1b17] block mb-1">Equipment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Oxygen Concentrator, Security CCTV"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Watts</label>
                  <input
                    type="number"
                    min={1}
                    value={customWatts}
                    onChange={(e) => setCustomWatts(Number(e.target.value))}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-2 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customQty}
                    onChange={(e) => setCustomQty(Number(e.target.value))}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-2 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Hours/Day</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-2 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#bfcaba]/30">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#707a6c] hover:bg-[#f6ece6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className="px-5 py-2 rounded-full text-xs font-bold bg-[#00490e] text-white hover:bg-[#0f631b] disabled:opacity-40 cursor-pointer"
              >
                Add Equipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back to introduction"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={items.length === 0}
          aria-label="Continue to Review Plan"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Review Plan</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
