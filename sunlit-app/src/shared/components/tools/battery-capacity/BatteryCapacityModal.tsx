'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  BatteryCapacitySessionState,
  BatteryWizardStep,
  BATTERY_STEP_TITLES,
  DEFAULT_BATTERY_ITEMS,
} from './types';
import { calculateBatteryCapacity } from '@/lib/engineering/calculators/batteryCapacity';

// Step Component Imports
import { Step01Introduction } from './steps/Step01Introduction';
import { Step02Selection } from './steps/Step02Selection';
import { Step03ReviewPlan } from './steps/Step03ReviewPlan';
import { Step04BackupNeeds } from './steps/Step04BackupNeeds';
import { Step05BackupDuration } from './steps/Step05BackupDuration';
import { Step06Calculating } from './steps/Step06Calculating';
import { Step07Results } from './steps/Step07Results';
import { Step08NextSteps } from './steps/Step08NextSteps';

interface BatteryCapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: BatteryWizardStep;
}

const INITIAL_SESSION_STATE: BatteryCapacitySessionState = {
  step: 1,
  items: DEFAULT_BATTERY_ITEMS,
  backupGoal: 'FULL_HOME',
  daysOfAutonomy: 1.0,
  systemVoltage: 48,
  chemistry: 'LITHIUM_LIFEPO4',
  maxDepthOfDischarge: 0.8,
  inverterEfficiency: 0.92,
  temperatureDerating: 0.95,
  profileTitle: '30.72 kWh LiFePO4 Battery Specification',
  userClassification: 'Homeowner',
  calculationResult: null,
  isCalculating: false,
  calculationProgress: 0,
};

export function BatteryCapacityModal({
  isOpen,
  onClose,
  initialStep = 1,
}: BatteryCapacityModalProps) {
  const [session, setSession] = useState<BatteryCapacitySessionState>({
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
    const dailyWh = session.items.reduce(
      (acc, i) => acc + i.powerWatts * i.quantity * i.hoursPerDay,
      0
    );
    const dailyKwh = Math.max(1.0, Number((dailyWh / 1000).toFixed(2)));

    const res = calculateBatteryCapacity({
      dailyEnergyKwh: dailyKwh,
      daysOfAutonomy: session.daysOfAutonomy,
      systemVoltage: session.systemVoltage,
      chemistry: session.chemistry,
      maxDepthOfDischarge: session.maxDepthOfDischarge,
      inverterEfficiency: session.inverterEfficiency,
      temperatureDerating: session.temperatureDerating,
      backupGoal: session.backupGoal,
      items: session.items,
      profileTitle: session.profileTitle,
    });

    setSession((prev) => ({
      ...prev,
      calculationResult: res,
    }));

    return res;
  }, [
    session.items,
    session.daysOfAutonomy,
    session.systemVoltage,
    session.chemistry,
    session.maxDepthOfDischarge,
    session.inverterEfficiency,
    session.temperatureDerating,
    session.backupGoal,
    session.profileTitle,
  ]);

  const goToStep = (targetStep: BatteryWizardStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setSession((prev) => ({ ...prev, step: targetStep }));
      setTransitioning(false);
    }, 150);
  };

  const handleNextStep = () => {
    if (session.step < 8) {
      goToStep((session.step + 1) as BatteryWizardStep);
    }
  };

  const handleBackStep = () => {
    if (session.step > 1) {
      goToStep((session.step - 1) as BatteryWizardStep);
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

  const currentTitle = BATTERY_STEP_TITLES[session.step];
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
                battery_charging_full
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-sm text-[#00490e]">
                  Sunlit Battery Capacity Calculator
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
              <Step02Selection
                items={session.items}
                onChange={(updatedItems) =>
                  setSession((prev) => ({ ...prev, items: updatedItems }))
                }
                onNext={() => goToStep(3)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 3 && (
              <Step03ReviewPlan
                items={session.items}
                onNext={() => goToStep(4)}
                onBack={handleBackStep}
                onEdit={() => goToStep(2)}
              />
            )}

            {session.step === 4 && (
              <Step04BackupNeeds
                backupGoal={session.backupGoal}
                onChangeGoal={(goal) => setSession((prev) => ({ ...prev, backupGoal: goal }))}
                onNext={() => goToStep(5)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 5 && (
              <Step05BackupDuration
                daysOfAutonomy={session.daysOfAutonomy}
                systemVoltage={session.systemVoltage}
                chemistry={session.chemistry}
                maxDepthOfDischarge={session.maxDepthOfDischarge}
                temperatureDerating={session.temperatureDerating}
                onChangeAutonomy={(days) => setSession((prev) => ({ ...prev, daysOfAutonomy: days }))}
                onChangeVoltage={(volts) => setSession((prev) => ({ ...prev, systemVoltage: volts }))}
                onChangeChemistry={(chem) => setSession((prev) => ({ ...prev, chemistry: chem }))}
                onChangeDod={(dod) => setSession((prev) => ({ ...prev, maxDepthOfDischarge: dod }))}
                onChangeTempDerating={(factor) => setSession((prev) => ({ ...prev, temperatureDerating: factor }))}
                onNext={handleStartCalculation}
                onBack={handleBackStep}
              />
            )}

            {session.step === 6 && (
              <Step06Calculating onComplete={handleCalculationComplete} />
            )}

            {session.step === 7 && (
              <Step07Results
                calculationResult={session.calculationResult}
                onNext={() => goToStep(8)}
                onBack={() => goToStep(5)}
              />
            )}

            {session.step === 8 && (
              <Step08NextSteps
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
