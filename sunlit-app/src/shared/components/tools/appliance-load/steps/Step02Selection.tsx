'use client';

import React, { useState } from 'react';
import { LoadItem, ApplianceCategory } from '@/lib/engineering/calculators/loadCalculator';
import { PRESET_APPLIANCES } from '../types';
import { ApplianceCard } from '@/shared/components/tools/solar-sizer/ApplianceCard';
import { SunlitIcon, SunlitIconName } from '@/shared/components/ui/SunlitIcon';

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
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 07
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Appliance Inventory Selection
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Select all electrical appliances installed on your property to build your connected load profile.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#00490e] text-white shadow-xs'
                : 'bg-[#f6ece6] text-[#40493d] hover:bg-[#f0e6e0] hover:text-[#1f1b17]'
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
          return (
            <ApplianceCard
              key={preset.name}
              icon={preset.icon as SunlitIconName}
              title={preset.name}
              description={preset.description}
              wattage={preset.powerWatts}
              quantity={qty}
              isSelected={qty > 0}
              onClick={() => handleTogglePreset(preset)}
              onQuantityChange={(delta) => handleQuantityDelta(preset.name, delta)}
            />
          );
        })}
      </div>

      {/* Add Custom Appliance Trigger Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#fcf2eb] rounded-2xl border border-[#bfcaba]/40 gap-3">
        <div>
          <h4 className="font-headline font-bold text-sm text-[#1f1b17]">Need to add non-standard equipment?</h4>
          <p className="font-sans text-xs text-[#707a6c] mt-0.5">Add heavy machinery, custom pumps, or industrial loads.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 bg-white border border-[#707a6c] hover:border-[#00490e] text-[#1f1b17] px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <SunlitIcon name="add" size={16} className="text-[#00490e]" />
          <span>Add Custom Load</span>
        </button>
      </div>

      {/* Selected Items Inventory Summary Bar */}
      <div className="bg-[#00490e] text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-[11px] font-bold text-[#8cdd86] uppercase tracking-wider block">
            CURRENT SELECTION INVENTORY
          </span>
          <div className="font-headline font-extrabold text-lg mt-0.5">
            {items.length} Unique Appliance Types Selected
          </div>
        </div>

        <span className="text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 font-semibold shrink-0">
          Ready for Usage Setup
        </span>
      </div>

      {/* Custom Appliance Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fff8f5] rounded-3xl p-6 max-w-md w-full border border-[#bfcaba] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#bfcaba]/30 pb-3">
              <h3 className="font-headline font-bold text-base text-[#00490e]">Add Custom Appliance Load</h3>
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
                  placeholder="e.g. Deep Well Pump, Server Rack, Electric Oven"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Power Rating (Watts)</label>
                  <input
                    type="number"
                    min={1}
                    value={customWatts}
                    onChange={(e) => setCustomWatts(Number(e.target.value))}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customQty}
                    onChange={(e) => setCustomQty(Number(e.target.value))}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Daily Operating Hours</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={customHours}
                    onChange={(e) => setCustomHours(Number(e.target.value))}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
                  />
                </div>

                <div>
                  <label className="font-sans font-bold text-[#1f1b17] block mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-3 py-2 font-bold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e]"
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
          aria-label="Continue to Usage Setup"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Usage Setup</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
