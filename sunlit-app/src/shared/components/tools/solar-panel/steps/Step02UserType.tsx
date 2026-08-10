'use client';

import React from 'react';

interface Step02Props {
  userType: 'Residential Homeowner' | 'Commercial Business' | 'Installer / EPC' | 'Agriculture / Mini-Grid';
  onChangeType: (type: 'Residential Homeowner' | 'Commercial Business' | 'Installer / EPC' | 'Agriculture / Mini-Grid') => void;
  onNext: () => void;
  onBack: () => void;
}

const USER_OPTIONS: {
  id: 'Residential Homeowner' | 'Commercial Business' | 'Installer / EPC' | 'Agriculture / Mini-Grid';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'Residential Homeowner',
    title: 'Residential Property',
    subtitle: 'Rooftop solar sizing for single family houses, villas, and duplexes',
    description: 'Optimized for day-time household loads, air conditioning, refrigeration, and battery charging.',
    icon: 'home',
  },
  {
    id: 'Commercial Business',
    title: 'Commercial & Industrial (C&I)',
    subtitle: 'High-capacity solar array sizing for offices, factories, and plazas',
    description: 'Engineered to reduce grid tariff bills and offset expensive diesel generator operating costs.',
    icon: 'domain',
  },
  {
    id: 'Installer / EPC',
    title: 'Installer / Solar Engineer',
    subtitle: 'Technical engineering calculations for system design proposals',
    description: 'Includes precise temperature coefficients, STC panel derating, and voltage string calculations.',
    icon: 'engineering',
  },
  {
    id: 'Agriculture / Mini-Grid',
    title: 'Agriculture & Community Mini-Grid',
    subtitle: 'Solar irrigation pumps, cold storage facilities, and rural mini-grids',
    description: 'Designed for high daily energy demands and heavy water pumping equipment.',
    icon: 'agriculture',
  },
];

export function Step02UserType({ userType, onChangeType, onNext, onBack }: Step02Props) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div>
        <span className="text-xs font-semibold text-[#00490e] uppercase tracking-wider block mb-1">
          Step 02 of 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191d17]">
          Select User & Project Classification
        </h2>
        <p className="font-sans text-sm text-[#41493e] mt-1">
          Choose your project type to customize solar irradiance assumptions, load profiles, and array engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {USER_OPTIONS.map((opt) => {
          const isSelected = userType === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => onChangeType(opt.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#f2f5ec] border-[#00490e] shadow-md'
                  : 'bg-white/80 backdrop-blur-md border-[#c0c9bb]/40 hover:bg-[#ecefe6]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#00490e] text-white' : 'bg-[#ecefe6] text-[#00490e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {opt.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-[#191d17]">{opt.title}</h3>
                    <p className="font-sans text-xs font-semibold text-[#00490e]">{opt.subtitle}</p>
                  </div>
                </div>

                <span
                  className={`material-symbols-outlined text-xl ${
                    isSelected ? 'text-[#00490e]' : 'text-[#c0c9bb]'
                  }`}
                >
                  {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>

              <p className="font-sans text-xs text-[#41493e] leading-relaxed pt-2 border-t border-[#c0c9bb]/20">
                {opt.description}
              </p>
            </div>
          );
        })}
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
          <span>Continue to Energy Requirement</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
