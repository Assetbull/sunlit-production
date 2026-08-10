'use client';

import React from 'react';
import { PropertyProfileState } from '../types';

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
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Property & Infrastructure Profile
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Specify property classification, geographic region, electrical phase, and roof mounting structure.
        </p>
      </div>

      {/* Property Classification Selection Cards */}
      <div className="space-y-2">
        <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
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
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-[#00490e] text-white border-[#00490e] shadow-md'
                    : 'bg-white/80 backdrop-blur-md text-[#191d17] border-[#c0c9bb]/40 hover:bg-[#ecefe6]/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#00490e]/10 text-[#00490e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-base">{item.title}</h4>
                  <p
                    className={`font-sans text-xs mt-0.5 ${
                      isSelected ? 'text-white/80' : 'text-[#41493e]'
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
          <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
            Geographic Region (Peak Sun Hours)
          </label>
          <div className="relative">
            <select
              value={data.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full bg-[#f2f5ec] border border-[#c0c9bb]/60 rounded-xl px-4 py-3 font-sans text-sm font-semibold text-[#191d17] outline-none focus:ring-2 focus:ring-[#00490e]"
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
          <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
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
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  data.phaseType === p.id
                    ? 'bg-[#00490e] text-white border-[#00490e]'
                    : 'bg-[#f2f5ec] text-[#191d17] border-[#c0c9bb]/60 hover:bg-[#ecefe6]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roof Material */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
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
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${
                  data.roofType === r.id
                    ? 'bg-[#00490e] text-white border-[#00490e]'
                    : 'bg-[#f2f5ec] text-[#191d17] border-[#c0c9bb]/60 hover:bg-[#ecefe6]'
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
            <label className="font-sans text-xs font-bold text-[#191d17] uppercase tracking-wider block">
              Estimated Roof Tilt Angle
            </label>
            <span className="font-mono text-xs font-bold text-[#00490e]">
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
      <div className="flex items-center justify-between pt-4 border-t border-[#c0c9bb]/30 mt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#c0c9bb] text-[#191d17] font-sans text-sm font-semibold hover:bg-[#ecefe6] transition-all"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#003006] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group"
        >
          <span>Continue to Load & Demand</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
