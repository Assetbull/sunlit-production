'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  PvConfigSessionState,
  PvConfigWizardStep,
  PV_CONFIG_STEP_TITLES,
} from './types';
import { calculatePvConfiguration } from '@/lib/engineering/calculators/pvConfiguration';

// Step Component Imports
import { Step01Introduction } from './steps/Step01Introduction';
import { Step02ProjectLocation } from './steps/Step02ProjectLocation';
import { Step03Orientation } from './steps/Step03Orientation';
import { Step04AnnualYieldResult } from './steps/Step04AnnualYieldResult';
import { Step05MonthlyYieldChart } from './steps/Step05MonthlyYieldChart';
import { Step06PerformanceBreakdown } from './steps/Step06PerformanceBreakdown';
import { Step07ScenarioComparison } from './steps/Step07ScenarioComparison';
import { Step08UserSpecificAction } from './steps/Step08UserSpecificAction';

interface PvConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: PvConfigWizardStep;
}

const INITIAL_SESSION_STATE: PvConfigSessionState = {
  step: 1,
  systemCapacityKwp: 7.7,
  locationRegion: 'Abuja (FCT)',
  peakSunHours: 5.2,
  tiltAngle: 15,
  azimuthDeg: 180,
  panelWattage: 550,
  soilingLossPercent: 3.0,
  inverterEfficiencyPercent: 97.5,
  profileTitle: '7.7 kWp PV String Layout Specification',
  userClassification: 'Solar Installer',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  calculationResult: null,
  isCalculating: false,
  calculationProgress: 0,
};

export function PvConfigurationModal({
  isOpen,
  onClose,
  initialStep = 1,
}: PvConfigurationModalProps) {
  const [session, setSession] = useState<PvConfigSessionState>({
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
    const res = calculatePvConfiguration({
      systemCapacityKwp: session.systemCapacityKwp,
      locationRegion: session.locationRegion,
      peakSunHours: session.peakSunHours,
      tiltAngle: session.tiltAngle,
      azimuthDeg: session.azimuthDeg,
      panelWattage: session.panelWattage,
      soilingLossPercent: session.soilingLossPercent,
      inverterEfficiency: session.inverterEfficiencyPercent,
    });

    setSession((prev) => ({
      ...prev,
      calculationResult: res,
    }));

    return res;
  }, [
    session.systemCapacityKwp,
    session.locationRegion,
    session.peakSunHours,
    session.tiltAngle,
    session.azimuthDeg,
    session.panelWattage,
    session.soilingLossPercent,
    session.inverterEfficiencyPercent,
  ]);

  const goToStep = (targetStep: PvConfigWizardStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setSession((prev) => ({ ...prev, step: targetStep }));
      setTransitioning(false);
    }, 150);
  };

  const handleNextStep = () => {
    if (session.step < 8) {
      goToStep((session.step + 1) as PvConfigWizardStep);
    }
  };

  const handleBackStep = () => {
    if (session.step > 1) {
      goToStep((session.step - 1) as PvConfigWizardStep);
    }
  };

  const handleCalculateYield = () => {
    runEngineCalculation();
    goToStep(4);
  };

  const handleRestart = () => {
    setSession({
      ...INITIAL_SESSION_STATE,
      step: 1,
    });
  };

  if (!isOpen) return null;

  const currentTitle = PV_CONFIG_STEP_TITLES[session.step];
  const progressPercent = Math.round((session.step / 8) * 100);

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
                grid_view
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-[#00490e]">
                  Sunlit PV String Layout & Yield Configurator
                </span>
                <span className="text-[11px] font-bold bg-[#ecefe6] text-[#41493e] px-2 py-0.5 rounded-full border border-[#c0c9bb]/30">
                  {session.step} of 8
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
              <Step02ProjectLocation
                systemCapacityKwp={session.systemCapacityKwp}
                locationRegion={session.locationRegion}
                peakSunHours={session.peakSunHours}
                onChangeCapacity={(kwp) => setSession((prev) => ({ ...prev, systemCapacityKwp: kwp }))}
                onChangeLocation={(loc, psh) =>
                  setSession((prev) => ({ ...prev, locationRegion: loc, peakSunHours: psh }))
                }
                onNext={() => goToStep(3)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 3 && (
              <Step03Orientation
                tiltAngle={session.tiltAngle}
                azimuthDeg={session.azimuthDeg}
                soilingLossPercent={session.soilingLossPercent}
                onChangeTilt={(tilt) => setSession((prev) => ({ ...prev, tiltAngle: tilt }))}
                onChangeAzimuth={(azimuth) => setSession((prev) => ({ ...prev, azimuthDeg: azimuth }))}
                onChangeSoiling={(soiling) => setSession((prev) => ({ ...prev, soilingLossPercent: soiling }))}
                onNext={handleCalculateYield}
                onBack={handleBackStep}
              />
            )}

            {session.step === 4 && (
              <Step04AnnualYieldResult
                calculationResult={session.calculationResult}
                onNext={() => goToStep(5)}
                onBack={() => goToStep(3)}
              />
            )}

            {session.step === 5 && (
              <Step05MonthlyYieldChart
                calculationResult={session.calculationResult}
                onNext={() => goToStep(6)}
                onBack={() => goToStep(4)}
              />
            )}

            {session.step === 6 && (
              <Step06PerformanceBreakdown
                calculationResult={session.calculationResult}
                onNext={() => goToStep(7)}
                onBack={() => goToStep(5)}
              />
            )}

            {session.step === 7 && (
              <Step07ScenarioComparison
                calculationResult={session.calculationResult}
                onNext={() => goToStep(8)}
                onBack={() => goToStep(6)}
              />
            )}

            {session.step === 8 && (
              <Step08UserSpecificAction
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
