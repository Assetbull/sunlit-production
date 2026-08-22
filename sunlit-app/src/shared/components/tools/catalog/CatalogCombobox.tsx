'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, ChevronDown, Wrench } from 'lucide-react';

export interface ComboboxOption {
  id: string;
  name: string;
  variant: string;
  primarySpec: string; // e.g. "1500 W", "550 W", "5 kVA"
  secondarySpec?: string; // e.g. "PF 0.85", "Efficiency 21.8%"
  category?: string;
  rawItem?: any;
}

interface CatalogComboboxProps {
  type: 'appliance' | 'module' | 'inverter' | 'battery' | 'cable';
  label?: string;
  placeholder?: string;
  value?: string;
  onSelect: (option: ComboboxOption) => void;
  onAddCustom?: () => void;
}

export function CatalogCombobox({
  type,
  label = 'Select Equipment Profile',
  placeholder = 'Type to search library (e.g. AC 1.5 HP, Deye 5kVA, JA Solar 550W)...',
  value,
  onSelect,
  onAddCustom,
}: CatalogComboboxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ComboboxOption | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/engineering/catalog?type=${type}&q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          const items = (json.data || []).map((item: any) => {
            if (type === 'appliance') {
              return {
                id: item.id,
                name: item.name,
                variant: item.variant,
                primarySpec: `${item.ratedPowerW} W`,
                secondarySpec: `PF ${item.powerFactor} • ${item.startupMultiplier}× surge`,
                category: item.category,
                rawItem: item,
              };
            } else if (type === 'module') {
              return {
                id: item.id,
                name: `${item.manufacturer} ${item.model}`,
                variant: `${item.ratedPowerW}W Monocrystalline`,
                primarySpec: `${item.ratedPowerW} W`,
                secondarySpec: `Voc ${item.vocStcV}V • Imp ${item.impStcA}A`,
                category: 'pv_module',
                rawItem: item,
              };
            } else if (type === 'inverter') {
              return {
                id: item.id,
                name: `${item.manufacturer} ${item.model}`,
                variant: `${item.ratedKva} kVA ${item.topology.toUpperCase()}`,
                primarySpec: `${item.ratedKva} kVA`,
                secondarySpec: `Surge ${item.surgeKva}kVA • Max PV ${item.maxPvPowerW}W`,
                category: 'inverter',
                rawItem: item,
              };
            } else if (type === 'battery') {
              return {
                id: item.id,
                name: `${item.manufacturer} ${item.model}`,
                variant: `${item.capacityKwh} kWh LiFePO4`,
                primarySpec: `${item.capacityKwh} kWh`,
                secondarySpec: `DoD ${item.recommendedDodPercent}% • ${item.nominalVoltageV}V`,
                category: 'battery',
                rawItem: item,
              };
            } else {
              return {
                id: item.id,
                name: `${item.crossSectionMm2} mm² ${item.conductorMaterial.toUpperCase()} Cable`,
                variant: `Rating ${item.dcAmpacityA}A DC`,
                primarySpec: `${item.crossSectionMm2} mm²`,
                secondarySpec: `Ampacity ${item.dcAmpacityA}A`,
                category: 'cable',
                rawItem: item,
              };
            }
          });
          setOptions(items);
        }
      } catch (err) {
        console.error('Catalog lookup error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchOptions, 200);
    return () => clearTimeout(timer);
  }, [type, query]);

  return (
    <div className="relative w-full">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-[#41493e] mb-1.5">{label}</label>}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#717a6d]">
          <Search size={18} />
        </div>

        <input
          type="text"
          value={selectedOption ? `${selectedOption.name} — ${selectedOption.variant}` : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedOption(null);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-[#c0c9bb] rounded-xl text-sm font-medium text-[#191d17] focus:outline-none focus:ring-2 focus:ring-[#00490e] focus:border-transparent transition-all shadow-sm"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#717a6d] hover:text-[#191d17]"
        >
          <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Options Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-[#c0c9bb]/60 rounded-2xl shadow-xl max-h-72 overflow-y-auto divide-y divide-[#f0f4ec]">
          {loading ? (
            <div className="p-4 text-center text-xs text-[#717a6d]">Searching Sunlit equipment library...</div>
          ) : options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setSelectedOption(opt);
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className="p-3.5 hover:bg-[#f7fbf1] cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-sm font-bold text-[#191d17] group-hover:text-[#00490e] flex items-center gap-2">
                    <span>{opt.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#dce6d5] text-[#00490e]">{opt.variant}</span>
                  </div>
                  {opt.secondarySpec && <div className="text-xs text-[#717a6d] mt-0.5">{opt.secondarySpec}</div>}
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#00490e] bg-[#aef4a5]/40 px-2.5 py-1 rounded-lg border border-[#92d78b]">
                    {opt.primarySpec}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-[#717a6d] font-medium">Not found in Sunlit's equipment library</p>
            </div>
          )}

          {/* Explicit + Add Custom Equipment Button */}
          <div
            onClick={() => {
              setIsOpen(false);
              if (onAddCustom) onAddCustom();
            }}
            className="p-3 bg-[#f0f4ec] hover:bg-[#e2e9dc] cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-[#00490e] transition-colors"
          >
            <Plus size={16} />
            <span>+ Add Custom {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
