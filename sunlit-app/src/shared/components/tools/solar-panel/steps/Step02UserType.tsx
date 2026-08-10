'use client';

import React from 'react';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

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
        <span className="text-[11px] font-bold text-[#00490e] uppercase tracking-wider block mb-1">
          STEP 02 OF 09
        </span>
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#1f1b17]">
          Select User & Project Classification
        </h2>
        <p className="font-sans text-sm text-[#40493d] mt-1 leading-relaxed">
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
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-[#fcf2eb] border-[#00490e] shadow-xs'
                  : 'bg-white/90 backdrop-blur-md border-[#bfcaba]/40 hover:bg-[#f6ece6]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#00490e] text-white' : 'bg-[#f6ece6] text-[#00490e]'
                    }`}
                  >
                    <SunlitIcon name={opt.icon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-[#1f1b17]">{opt.title}</h3>
                    <p className="font-sans text-xs font-semibold text-[#00490e] mt-0.5">{opt.subtitle}</p>
                  </div>
                </div>

                <SunlitIcon
                  name={isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  size={20}
                  className={isSelected ? 'text-[#00490e]' : 'text-[#bfcaba]'}
                />
              </div>

              <p className="font-sans text-xs text-[#40493d] leading-relaxed pt-2 border-t border-[#bfcaba]/30">
                {opt.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#bfcaba]/30">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go Back"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#707a6c] text-[#1f1b17] font-sans text-sm font-semibold hover:bg-[#f6ece6] transition-all cursor-pointer"
        >
          <SunlitIcon name="arrow_back" size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Continue to Energy Requirement"
          className="inline-flex items-center gap-2 bg-[#00490e] hover:bg-[#0f631b] text-white px-7 py-2.5 rounded-full font-sans text-sm font-semibold tracking-wide transition-all shadow-md group cursor-pointer"
        >
          <span>Continue to Energy Requirement</span>
          <SunlitIcon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
