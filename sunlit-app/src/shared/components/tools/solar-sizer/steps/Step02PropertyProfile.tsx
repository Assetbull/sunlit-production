'use client';

import React from 'react';
import { PropertyProfileState } from '../types';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

interface Step02Props {
  data: PropertyProfileState;
  onChange: (updated: Partial<PropertyProfileState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const REGION_OPTIONS = [
  { name: 'Lagos State', psh: '4.8 PSH' },
  { name: 'Abuja FCT', psh: '5.2 PSH' },
  { name: 'Kano Belt', psh: '6.0 PSH' },
  { name: 'Port Harcourt', psh: '4.5 PSH' },
  { name: 'Ibadan / Oyo', psh: '4.9 PSH' },
  { name: 'Enugu / SE', psh: '4.7 PSH' },
];

export function Step02PropertyProfile({ data, onChange, onNext, onBack }: Step02Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Property & Infrastructure Profile
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1">
          Specify property classification, geographic region, electrical phase, and roof mounting structure.
        </p>
      </div>

      {/* Property Classification Selection Cards */}
      <div className="space-y-2">
        <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
          Property Classification
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'residential',
              icon: 'home',
              title: 'Residential',
              desc: 'Apartments, duplexes, bungalows & homes',
            },
            {
              id: 'commercial',
              icon: 'apartment',
              title: 'Commercial',
              desc: 'Offices, retail stores, banks & clinics',
            },
            {
              id: 'industrial',
              icon: 'factory',
              title: 'Industrial',
              desc: 'Warehouses, factories & heavy sites',
            },
          ].map((item) => {
            const isSelected = data.propertyType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ propertyType: item.id as any })}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-md -translate-y-0.5'
                    : 'bg-white/90 backdrop-blur-md text-[#1f1b17] border-[#bfcaba]/40 hover:bg-[#f6ece6]/60 hover:border-[#00490e]/40 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#fcf2eb] text-[#00490e] border border-[#bfcaba]/30'
                    }`}
                  >
                    <SunlitIcon name={item.icon} size={20} />
                  </div>
                  {isSelected && (
                    <SunlitIcon name="check_circle" size={20} className="text-[#8cdd86]" />
                  )}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-base leading-snug">{item.title}</h4>
                  <p
                    className={`font-sans text-xs mt-1 leading-relaxed ${
                      isSelected ? 'text-white/80' : 'text-[#40493d]'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Location, Phase, and Roof Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Geographic Region */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
            Geographic Region (Peak Sun Hours)
          </label>
          <div className="relative">
            <select
              value={data.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full bg-[#fcf2eb] border border-[#bfcaba]/60 rounded-xl px-4 py-3 font-sans text-sm font-semibold text-[#1f1b17] outline-none focus:ring-2 focus:ring-[#00490e] transition-all"
            >
              {REGION_OPTIONS.map((reg) => (
                <option key={reg.name} value={reg.name}>
                  {reg.name} ({reg.psh})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phase Type */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
            Electrical System Connection Phase
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'single-phase', label: 'Single-Phase 230V' },
              { id: 'three-phase', label: 'Three-Phase 400V' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ phaseType: p.id as any })}
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  data.phaseType === p.id
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-xs'
                    : 'bg-[#fcf2eb] text-[#1f1b17] border-[#bfcaba]/60 hover:bg-[#f6ece6]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roof Material */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
            Roof Material Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'metal', label: 'Metal Sheet' },
              { id: 'concrete', label: 'Concrete Flat' },
              { id: 'tile', label: 'Clay Tile' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onChange({ roofType: r.id as any })}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  data.roofType === r.id
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-xs'
                    : 'bg-[#fcf2eb] text-[#1f1b17] border-[#bfcaba]/60 hover:bg-[#f6ece6]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roof Tilt Angle */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-sans text-xs font-bold text-[#1f1b17] uppercase tracking-wider block">
              Estimated Roof Tilt Angle
            </label>
            <span className="font-mono text-xs font-bold text-[#00490e] bg-[#f6ece6] px-2 py-0.5 rounded-full border border-[#bfcaba]/30">
              {data.roofAngle}° Tilt
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={45}
            step={5}
            value={data.roofAngle}
            onChange={(e) => onChange({ roofAngle: Number(e.target.value) })}
            className="w-full accent-[#00490e] cursor-pointer py-2"
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30 mt-2">
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
          aria-label="Continue to Load & Demand"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Load & Demand</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
