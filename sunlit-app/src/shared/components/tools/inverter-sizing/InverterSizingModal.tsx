'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  InverterSizingSessionState,
  InverterWizardStep,
  INVERTER_STEP_TITLES,
  DEFAULT_INVERTER_ITEMS,
} from './types';
import { calculateInverterSizing } from '@/lib/engineering/calculators/inverterSizing';

// Step Component Imports
import { Step01Introduction } from './steps/Step01Introduction';
import { Step02EnergyProfile } from './steps/Step02EnergyProfile';
import { Step03SurgeAssessment } from './steps/Step03SurgeAssessment';
import { Step04ReviewPlan } from './steps/Step04ReviewPlan';
import { Step05Calculating } from './steps/Step05Calculating';
import { Step06Results } from './steps/Step06Results';
import { Step07OptionsNextSteps } from './steps/Step07OptionsNextSteps';

interface InverterSizingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: InverterWizardStep;
}

const INITIAL_SESSION_STATE: InverterSizingSessionState = {
  step: 1,
  items: DEFAULT_INVERTER_ITEMS,
  continuousLoadWatts: 2800,
  surgeLoadWatts: 8400,
  powerFactor: 0.8,
  growthMargin: 1.25,
  inverterType: 'HYBRID',
  systemVoltage: 48,
  profileTitle: '5 kVA Pure Sine Wave Hybrid Inverter Spec',
  userClassification: 'Homeowner',
  calculationResult: null,
  isCalculating: false,
  calculationProgress: 0,
};

export function InverterSizingModal({
  isOpen,
  onClose,
  initialStep = 1,
}: InverterSizingModalProps) {
  const [session, setSession] = useState<InverterSizingSessionState>({
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
    const res = calculateInverterSizing({
      continuousLoadWatts: session.continuousLoadWatts,
      surgeLoadWatts: session.surgeLoadWatts,
      powerFactor: session.powerFactor,
      growthMargin: session.growthMargin,
      inverterType: session.inverterType,
      systemVoltage: session.systemVoltage,
    });

    setSession((prev) => ({
      ...prev,
      calculationResult: res,
    }));

    return res;
  }, [
    session.continuousLoadWatts,
    session.surgeLoadWatts,
    session.powerFactor,
    session.growthMargin,
    session.inverterType,
    session.systemVoltage,
  ]);

  const goToStep = (targetStep: InverterWizardStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setSession((prev) => ({ ...prev, step: targetStep }));
      setTransitioning(false);
    }, 150);
  };

  const handleNextStep = () => {
    if (session.step < 7) {
      goToStep((session.step + 1) as InverterWizardStep);
    }
  };

  const handleBackStep = () => {
    if (session.step > 1) {
      goToStep((session.step - 1) as InverterWizardStep);
    }
  };

  const handleStartCalculation = () => {
    runEngineCalculation();
    goToStep(5);
  };

  const handleCalculationComplete = () => {
    runEngineCalculation();
    goToStep(6);
  };

  const handleRestart = () => {
    setSession({
      ...INITIAL_SESSION_STATE,
      step: 1,
    });
  };

  if (!isOpen) return null;

  const currentTitle = INVERTER_STEP_TITLES[session.step];
  const progressPercent = Math.round((session.step / 7) * 100);

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
                speed
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-[#00490e]">
                  Sunlit Inverter Sizing Calculator
                </span>
                <span className="text-[11px] font-bold bg-[#ecefe6] text-[#41493e] px-2 py-0.5 rounded-full border border-[#c0c9bb]/30">
                  {session.step} of 7
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
              <Step02EnergyProfile
                continuousLoadWatts={session.continuousLoadWatts}
                inverterType={session.inverterType}
                systemVoltage={session.systemVoltage}
                onChangeWatts={(watts) => setSession((prev) => ({ ...prev, continuousLoadWatts: watts }))}
                onChangeType={(type) => setSession((prev) => ({ ...prev, inverterType: type }))}
                onChangeVoltage={(volts) => setSession((prev) => ({ ...prev, systemVoltage: volts }))}
                onNext={() => goToStep(3)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 3 && (
              <Step03SurgeAssessment
                continuousWatts={session.continuousLoadWatts}
                surgeWatts={session.surgeLoadWatts}
                powerFactor={session.powerFactor}
                growthMargin={session.growthMargin}
                onChangeSurgeWatts={(surge) => setSession((prev) => ({ ...prev, surgeLoadWatts: surge }))}
                onChangePowerFactor={(pf) => setSession((prev) => ({ ...prev, powerFactor: pf }))}
                onChangeMargin={(margin) => setSession((prev) => ({ ...prev, growthMargin: margin }))}
                onNext={() => goToStep(4)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 4 && (
              <Step04ReviewPlan
                continuousWatts={session.continuousLoadWatts}
                surgeWatts={session.surgeLoadWatts}
                powerFactor={session.powerFactor}
                growthMargin={session.growthMargin}
                inverterType={session.inverterType}
                systemVoltage={session.systemVoltage}
                items={session.items}
                onNext={handleStartCalculation}
                onBack={handleBackStep}
                onEdit={() => goToStep(2)}
              />
            )}

            {session.step === 5 && (
              <Step05Calculating onComplete={handleCalculationComplete} />
            )}

            {session.step === 6 && (
              <Step06Results
                calculationResult={session.calculationResult}
                onNext={() => goToStep(7)}
                onBack={() => goToStep(4)}
              />
            )}

            {session.step === 7 && (
              <Step07OptionsNextSteps
                profileTitle={session.profileTitle}
                userClassification={session.userClassification}
                calculationResult={session.calculationResult}
                onUpdateTitle={(title) => setSession((prev) => ({ ...prev, profileTitle: title }))}
                onUpdateUserClass={(cls) => setSession((prev) => ({ ...prev, userClassification: cls }))}
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
