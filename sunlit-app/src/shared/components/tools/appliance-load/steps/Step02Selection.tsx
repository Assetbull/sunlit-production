'use client';

import React, { useState } from 'react';
import { LoadItem, ApplianceCategory } from '@/lib/engineering/calculators/loadCalculator';
import { PRESET_APPLIANCES } from '../types';

interface Step02Props {
  items: LoadItem[];
  onChange: (updatedItems: LoadItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'All', label: 'All Appliances' },
  { id: 'Cooling', label: 'Cooling & Fridge' },
  { id: 'HVAC', label: 'Air Conditioning' },
  { id: 'Lighting', label: 'Lighting' },
  { id: 'Utilities', label: 'Pumps & Laundry' },
  { id: 'Computing', label: 'Computing' },
  { id: 'Entertainment', label: 'Entertainment' },
  { id: 'Kitchen', label: 'Kitchen' },
];

export function Step02Selection({ items, onChange, onNext, onBack }: Step02Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Form State
  const [customName, setCustomName] = useState('');
  const [customWatts, setCustomWatts] = useState(300);
  const [customQty, setCustomQty] = useState(1);
  const [customHours, setCustomHours] = useState(8);
  const [customCategory, setCustomCategory] = useState<ApplianceCategory>('General');

  const filteredPresets = PRESET_APPLIANCES.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const getItemQuantity = (name: string): number => {
    const found = items.find((i) => i.name === name);
    return found ? found.quantity : 0;
  };

  const handleTogglePreset = (preset: typeof PRESET_APPLIANCES[0]) => {
    const existingIndex = items.findIndex((i) => i.name === preset.name);
    if (existingIndex >= 0) {
      // Remove
      onChange(items.filter((i) => i.name !== preset.name));
    } else {
      // Add
      const newItem: LoadItem = {
        name: preset.name,
        powerWatts: preset.powerWatts,
        quantity: preset.quantity,
        hoursPerDay: preset.hoursPerDay,
        category: preset.category,
        isCritical: preset.isCritical,
        surgeMultiplier: preset.surgeMultiplier,
      };
      onChange([...items, newItem]);
    }
  };

  const handleQuantityChange = (presetName: string, delta: number, e: React.MouseEvent) => {
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
      const preset = PRESET_APPLIANCES.find((p) => p.name === presetName);
      if (preset) {
        onChange([
          ...items,
          {
            name: preset.name,
            powerWatts: preset.powerWatts,
            quantity: 1,
            hoursPerDay: preset.hoursPerDay,
            category: preset.category,
            isCritical: preset.isCritical,
            surgeMultiplier: preset.surgeMultiplier,
          },
        ]);
      }
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const customItem: LoadItem = {
      name: customName.trim(),
      powerWatts: Math.max(1, customWatts),
      quantity: Math.max(1, customQty),
      hoursPerDay: Math.min(24, Math.max(0, customHours)),
      category: customCategory,
      isCritical: false,
      surgeMultiplier: 1.2,
    };
    onChange([...items, customItem]);
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1a1c19]">
          Appliance Inventory Selection
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Select all electrical appliances installed on your property to build your connected load profile.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === tab.id
                ? 'bg-[#00490e] text-white shadow-sm'
                : 'bg-[#eeeee9] text-[#41493e] hover:bg-[#e3e3de]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Appliance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPresets.map((preset) => {
          const qty = getItemQuantity(preset.name);
          const isSelected = qty > 0;

          return (
            <div
              key={preset.name}
              onClick={() => handleTogglePreset(preset)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#f4f4ee] border-[#00490e] shadow-sm'
                  : 'bg-white/80 backdrop-blur-md border-[#c0c9bb]/40 hover:bg-[#eeeee9]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#00490e] text-white' : 'bg-[#eeeee9] text-[#00490e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{preset.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-[#1a1c19]">{preset.name}</h4>
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

              {/* Card Footer: Power & Quantity Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#c0c9bb]/30 text-xs">
                <span className="font-mono font-bold text-[#00490e]">
                  {preset.powerWatts} Watts
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleQuantityChange(preset.name, -1, e)}
                    disabled={qty === 0}
                    className="w-7 h-7 rounded-lg bg-[#e3e3de] font-bold text-[#1a1c19] flex items-center justify-center hover:bg-[#c0c9bb] disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-headline font-bold text-sm text-[#1a1c19] min-w-[16px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleQuantityChange(preset.name, 1, e)}
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

      {/* Add Custom Appliance Trigger */}
      <div className="flex items-center justify-between p-4 bg-[#eeeee9]/60 rounded-2xl border border-[#c0c9bb]/40">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#1a1c19]">Need to add non-standard equipment?</h4>
          <p className="font-sans text-xs text-[#717a6d]">Add heavy machinery, custom pumps, or industrial loads.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 bg-white border border-[#c0c9bb] hover:border-[#00490e] text-[#1a1c19] px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add Custom Load</span>
        </button>
      </div>

      {/* Selected Items Summary Bar */}
      <div className="bg-[#00490e] text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs font-semibold text-[#aef4a5] uppercase tracking-wider block">
            Current Selection Inventory
          </span>
          <div className="font-headline font-bold text-lg mt-0.5">
            {items.length} Unique Appliance Types Selected
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          Ready for Usage Setup
        </span>
      </div>

      {/* Custom Appliance Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fafaf4] rounded-3xl p-6 max-w-md w-full border border-[#c0c9bb] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#c0c9bb]/30 pb-3">
              <h3 className="font-headline font-bold text-base text-[#00490e]">Add Custom Appliance Load</h3>
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
                <label className="font-sans font-bold text-[#1a1c19] block mb-1">Equipment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Deep Well Pump, Server Rack, Electric Oven"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#eeeee9] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#00490e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans font-bold text-[#1a1c19] block mb-1">Power Rating (Watts)</label>
                  <input
                    type="number"
                    min={1}
                    value={customWatts}
                    onChange={(e) => setCustomWatts(Number(e.target.value))}
                    className="w-full bg-[#eeeee9] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#1a1c19] block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customQty}
                    onChange={(e) => setCustomQty(Number(e.target.value))}
                    className="w-full bg-[#eeeee9] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans font-bold text-[#1a1c19] block mb-1">Daily Operating Hours</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-full bg-[#eeeee9] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#1a1c19] block mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-[#eeeee9] border border-[#c0c9bb]/60 rounded-xl px-3 py-2 font-bold text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#00490e]"
                  >
                    <option value="General">General</option>
                    <option value="Cooling">Cooling</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Computing">Computing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Kitchen">Kitchen</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#c0c9bb]/30">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#717a6d] hover:bg-[#eeeee9]"
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
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#1a1c19] font-sans text-sm font-semibold hover:bg-[#eeeee9] transition-all"
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
          <span>Continue to Usage Setup</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
