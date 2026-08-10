'use client';

import React, { useState } from 'react';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { DEFAULT_BATTERY_ITEMS } from '../types';

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
    icon: 'tv',
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

  const handleQuantityDelta = (presetName: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
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
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 08
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Select Connected Electrical Appliances
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Choose the appliances requiring battery backup to calculate your daily energy storage baseline.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESET_OPTIONS.map((preset) => {
          const qty = getItemQuantity(preset.name);
          const isSelected = qty > 0;

          return (
            <div
              key={preset.name}
              onClick={() => handleToggle(preset)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#f2f5ec] border-[#00490e] shadow-sm'
                  : 'bg-white/80 backdrop-blur-md border-[#c0c9bb]/40 hover:bg-[#ecefe6]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#00490e] text-white' : 'bg-[#ecefe6] text-[#00490e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{preset.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-[#191d17]">{preset.name}</h4>
                    <p className="font-sans text-[11px] text-[#717a6d]">{preset.description}</p>
                  </div>
                </div>

                <span
                  className={`material-symbols-outlined text-xl ${
                    isSelected ? 'text-[#00490e]' : 'text-[#c0c9bb]'
                  }`}
                >
                  {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#c0c9bb]/30 text-xs">
                <span className="font-mono font-bold text-[#00490e]">
                  {preset.powerWatts} W (×{preset.hoursPerDay} hrs)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleQuantityDelta(preset.name, -1, e)}
                    disabled={qty === 0}
                    className="w-7 h-7 rounded-lg bg-[#e0e4db] font-bold text-[#191d17] flex items-center justify-center hover:bg-[#c0c9bb] disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-headline font-bold text-sm text-[#191d17] min-w-[16px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleQuantityDelta(preset.name, 1, e)}
                    className="w-7 h-7 rounded-lg bg-[#00490e] text-white font-bold flex items-center justify-center hover:bg-[#003006]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Appliance */}
      <div className="flex items-center justify-between p-4 bg-[#ecefe6]/60 rounded-2xl border border-[#c0c9bb]/40">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#191d17]">Add custom electrical equipment?</h4>
          <p className="font-sans text-xs text-[#717a6d]">Add medical devices, electric gates, or specialized loads.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 bg-white border border-[#c0c9bb] hover:border-[#00490e] text-[#191d17] px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Custom Equipment</span>
        </button>
      </div>

      {/* Selected Items Summary Bar */}
      <div className="bg-[#00490e] text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-[#aef4a5] uppercase tracking-wider block">
            Current Appliance Selection
          </span>
          <div className="font-headline font-bold text-lg mt-0.5">
            {items.length} Appliance Types Selected
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          Ready for Plan Review
        </span>
      </div>

      {/* Custom Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#f7fbf1] rounded-3xl p-6 max-w-md w-full border border-[#c0c9bb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#c0c9bb]/30 pb-3">
              <h3 className="font-headline font-bold text-base text-[#00490e]">Add Custom Equipment</h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-[#717a6d] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-sans font-bold text-[#191d17] block mb-1">Equipment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Oxygen Concentrator, Security CCTV"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-sans font-bold text-[#191d17] block mb-1">Watts</label>
                  <input
                    type="number"
                    min={1}
                    value={customWatts}
                    onChange={(e) => setCustomWatts(Number(e.target.value))}
                    className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-2 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#191d17] block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customQty}
                    onChange={(e) => setCustomQty(Number(e.target.value))}
                    className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-2 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#191d17] block mb-1">Hours/Day</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-full bg-[#ecefe6] border border-[#c0c9bb]/60 rounded-xl px-2 py-2 font-bold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#c0c9bb]/30">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#717a6d] hover:bg-[#ecefe6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className="px-5 py-2 rounded-full text-xs font-bold bg-[#00490e] text-white hover:bg-[#003006] disabled:opacity-40"
              >
                Add Equipment
              </button>
            </div>
          </div>
        </div>
      )}

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
          disabled={items.length === 0}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Review Plan</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
