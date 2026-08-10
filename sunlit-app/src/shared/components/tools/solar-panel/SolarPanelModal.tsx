'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  SolarPanelSessionState,
  SolarPanelWizardStep,
  SOLAR_PANEL_STEP_TITLES,
  PRESET_PANELS,
} from './types';
import { calculateSolarPanelSizing } from '@/lib/engineering/calculators/solarPanelSizing';

// Step Component Imports
import { Step01Introduction } from './steps/Step01Introduction';
import { Step02UserType } from './steps/Step02UserType';
import { Step03EnergyRequirement } from './steps/Step03EnergyRequirement';
import { Step04Location } from './steps/Step04Location';
import { Step05PanelSelection } from './steps/Step05PanelSelection';
import { Step06Calculating } from './steps/Step06Calculating';
import { Step07PrimaryResult } from './steps/Step07PrimaryResult';
import { Step08PanelConfiguration } from './steps/Step08PanelConfiguration';
import { Step09NextToolLeadCapture } from './steps/Step09NextToolLeadCapture';

interface SolarPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: SolarPanelWizardStep;
}

const INITIAL_SESSION_STATE: SolarPanelSessionState = {
  step: 1,
  userType: 'Residential Homeowner',
  dailyEnergyDemandKwh: 30,
  monthlyBillNgn: 150000,
  locationRegion: 'Abuja (FCT)',
  peakSunHours: 5.2,
  panelWattage: 550,
  panelModelName: '550W Tier-1 Monocrystalline PERC',
  panelEfficiency: 21.5,
  systemLossesFactor: 0.82,
  profileTitle: '7.7 kWp Monocrystalline Solar Array Specification',
  userClassification: 'Homeowner',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  calculationResult: null,
  isCalculating: false,
  calculationProgress: 0,
};

export function SolarPanelModal({
  isOpen,
  onClose,
  initialStep = 1,
}: SolarPanelModalProps) {
  const [session, setSession] = useState<SolarPanelSessionState>({
    ...INITIAL_SESSION_STATE,
    step: initialStep,
  });

  const [transitioning, setTransitioning] = useState(false);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute calculation engine
  const runEngineCalculation = useCallback(() => {
    const res = calculateSolarPanelSizing({
      dailyEnergyDemandKwh: session.dailyEnergyDemandKwh,
      peakSunHours: session.peakSunHours,
      panelWattage: session.panelWattage,
      systemLossesFactor: session.systemLossesFactor,
      location: session.locationRegion,
    });

    setSession((prev) => ({
      ...prev,
      calculationResult: res,
    }));

    return res;
  }, [
    session.dailyEnergyDemandKwh,
    session.peakSunHours,
    session.panelWattage,
    session.systemLossesFactor,
    session.locationRegion,
  ]);

  const goToStep = (targetStep: SolarPanelWizardStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setSession((prev) => ({ ...prev, step: targetStep }));
      setTransitioning(false);
    }, 150);
  };

  const handleNextStep = () => {
    if (session.step < 9) {
      goToStep((session.step + 1) as SolarPanelWizardStep);
    }
  };

  const handleBackStep = () => {
    if (session.step > 1) {
      goToStep((session.step - 1) as SolarPanelWizardStep);
    }
  };

  const handleStartCalculation = () => {
    runEngineCalculation();
    goToStep(6);
  };

  const handleCalculationComplete = () => {
    runEngineCalculation();
    goToStep(7);
  };

  const handleRestart = () => {
    setSession({
      ...INITIAL_SESSION_STATE,
      step: 1,
    });
  };

  if (!isOpen) return null;

  const currentTitle = SOLAR_PANEL_STEP_TITLES[session.step];
  const progressPercent = Math.round((session.step / 9) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-md animate-fade-in">
      {/* Elevated Modal Surface */}
      <div className="relative w-full max-w-5xl bg-[#f7fbf1] text-[#191d17] rounded-3xl border border-white/40 shadow-[0_16px_48px_rgba(31,27,23,0.18)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Progress Bar Top Indicator */}
        <div className="w-full bg-[#e0e4db] h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00490e] to-[#2b6b2c] h-full transition-all duration-400 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header Bar */}
        <header className="px-6 py-4 bg-[#f7fbf1] border-b border-[#c0c9bb]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00490e] text-white flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                solar_power
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-[#00490e]">
                  Sunlit Solar Panel Sizing Calculator
                </span>
                <span className="text-[11px] font-bold bg-[#ecefe6] text-[#41493e] px-2 py-0.5 rounded-full border border-[#c0c9bb]/30">
                  {session.step} of 9
                </span>
              </div>
              <span className="font-sans text-xs text-[#717a6d]">
                Step {session.step}: {currentTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#ecefe6] hover:bg-[#e0e4db] text-[#191d17] flex items-center justify-center transition-colors"
              title="Close modal"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </header>

        {/* Scrollable Step Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
              transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {session.step === 1 && (
              <Step01Introduction onNext={() => goToStep(2)} />
            )}

            {session.step === 2 && (
              <Step02UserType
                userType={session.userType}
                onChangeType={(type) => setSession((prev) => ({ ...prev, userType: type }))}
                onNext={() => goToStep(3)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 3 && (
              <Step03EnergyRequirement
                dailyKwh={session.dailyEnergyDemandKwh}
                monthlyBillNgn={session.monthlyBillNgn}
                onChangeDailyKwh={(kwh) => setSession((prev) => ({ ...prev, dailyEnergyDemandKwh: kwh }))}
                onChangeBill={(bill) => setSession((prev) => ({ ...prev, monthlyBillNgn: bill }))}
                onNext={() => goToStep(4)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 4 && (
              <Step04Location
                locationRegion={session.locationRegion}
                peakSunHours={session.peakSunHours}
                systemLossesFactor={session.systemLossesFactor}
                onChangeLocation={(loc, psh) =>
                  setSession((prev) => ({ ...prev, locationRegion: loc, peakSunHours: psh }))
                }
                onChangeLosses={(losses) => setSession((prev) => ({ ...prev, systemLossesFactor: losses }))}
                onNext={() => goToStep(5)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 5 && (
              <Step05PanelSelection
                panelWattage={session.panelWattage}
                panelModelName={session.panelModelName}
                panelEfficiency={session.panelEfficiency}
                onChangePanel={(watt, name, eff) =>
                  setSession((prev) => ({
                    ...prev,
                    panelWattage: watt,
                    panelModelName: name,
                    panelEfficiency: eff,
                  }))
                }
                onNext={handleStartCalculation}
                onBack={handleBackStep}
              />
            )}

            {session.step === 6 && (
              <Step06Calculating onComplete={handleCalculationComplete} />
            )}

            {session.step === 7 && (
              <Step07PrimaryResult
                calculationResult={session.calculationResult}
                onNext={() => goToStep(8)}
                onBack={() => goToStep(5)}
              />
            )}

            {session.step === 8 && (
              <Step08PanelConfiguration
                calculationResult={session.calculationResult}
                onNext={() => goToStep(9)}
                onBack={() => goToStep(7)}
              />
            )}

            {session.step === 9 && (
              <Step09NextToolLeadCapture
                profileTitle={session.profileTitle}
                userClassification={session.userClassification}
                contactName={session.contactName}
                contactEmail={session.contactEmail}
                contactPhone={session.contactPhone}
                calculationResult={session.calculationResult}
                onUpdateTitle={(title) => setSession((prev) => ({ ...prev, profileTitle: title }))}
                onUpdateUserClass={(cls) => setSession((prev) => ({ ...prev, userClassification: cls }))}
                onUpdateContact={(name, email, phone) =>
                  setSession((prev) => ({
                    ...prev,
                    contactName: name,
                    contactEmail: email,
                    contactPhone: phone,
                  }))
                }
                onRestart={handleRestart}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
