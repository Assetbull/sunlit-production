'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  SizingSessionState,
  SizerStepNumber,
  STEP_TITLES,
} from './types';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';
import { SunlitIcon } from '@/shared/components/ui/SunlitIcon';

// Step Component Imports
import { Step01Introduction } from './steps/Step01Introduction';
import { Step02PropertyProfile } from './steps/Step02PropertyProfile';
import { Step03LoadDemand } from './steps/Step03LoadDemand';
import { Step04EnergyProfile } from './steps/Step04EnergyProfile';
import { Step05BackupRequirement } from './steps/Step05BackupRequirement';
import { Step06Calculating } from './steps/Step06Calculating';
import { Step07SystemConfiguration } from './steps/Step07SystemConfiguration';
import { Step08Results } from './steps/Step08Results';
import { Step09NextActions } from './steps/Step09NextActions';

interface SolarSizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: SizerStepNumber;
}

const INITIAL_SESSION_STATE: SizingSessionState = {
  step: 1,
  property: {
    propertyType: 'residential',
    location: 'Lagos State',
    occupants: 4,
    phaseType: 'single-phase',
    roofType: 'metal',
    roofAngle: 15,
  },
  load: {
    inputMode: 'bill',
    monthlyBillNaira: 150000,
    dailyKwhInput: 22.2,
    loadItems: [],
  },
  energy: {
    gridAvailabilityHours: 12,
    gridReliability: 'medium',
    hasGenerator: false,
    generatorKva: 5.5,
    generatorFuelExpenseMonth: 80000,
    daytimeUsagePercent: 60,
    nighttimeUsagePercent: 40,
  },
  backup: {
    autonomyDays: 1.0,
    backupScope: 'full',
    criticalLoads: ['refrigeration', 'lighting', 'water_pump', 'workstation'],
  },
  config: {
    selectedPanelWattage: 550,
    selectedBatteryType: 'lithium_lifepo4',
    selectedInverterType: 'hybrid_pure_sine',
  },
  calculationResult: null,
  isCalculating: false,
  calculationProgress: 0,
  calculatingStageIndex: 0,
  validationError: null,
};

export function SolarSizerModal({ isOpen, onClose, initialStep = 1 }: SolarSizerModalProps) {
  const [session, setSession] = useState<SizingSessionState>({
    ...INITIAL_SESSION_STATE,
    step: initialStep,
  });

  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'back'>('next');

  // Keyboard shortcut listener (Escape key to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute calculation engine when transitioning to calculation/results
  const runEngineCalculation = useCallback(() => {
    const res = calculateSolarSystemSizing({
      propertyType: session.property.propertyType,
      location: session.property.location,
      occupants: session.property.occupants,
      phaseType: session.property.phaseType,
      roofType: session.property.roofType,
      roofAngle: session.property.roofAngle,
      monthlyBillNaira: session.load.monthlyBillNaira,
      loadItems: session.load.loadItems,
      dailyKwhInput: session.load.inputMode === 'direct_kwh' ? session.load.dailyKwhInput : undefined,
      gridAvailabilityHours: session.energy.gridAvailabilityHours,
      gridReliability: session.energy.gridReliability,
      hasGenerator: session.energy.hasGenerator,
      generatorKva: session.energy.generatorKva,
      generatorFuelExpenseMonth: session.energy.generatorFuelExpenseMonth,
      daytimeUsagePercent: session.energy.daytimeUsagePercent,
      nighttimeUsagePercent: session.energy.nighttimeUsagePercent,
      daysOfAutonomy: session.backup.autonomyDays,
      backupScope: session.backup.backupScope,
      criticalLoads: session.backup.criticalLoads,
      selectedPanelWattage: session.config.selectedPanelWattage,
      selectedBatteryType: session.config.selectedBatteryType,
      selectedInverterType: session.config.selectedInverterType,
    });

    setSession((prev) => ({
      ...prev,
      calculationResult: res,
    }));

    return res;
  }, [session.property, session.load, session.energy, session.backup, session.config]);

  const goToStep = (targetStep: SizerStepNumber) => {
    setDirection(targetStep > session.step ? 'next' : 'back');
    setTransitioning(true);
    setTimeout(() => {
      setSession((prev) => ({ ...prev, step: targetStep }));
      setTransitioning(false);
    }, 160);
  };

  const handleNextStep = () => {
    if (session.step < 9) {
      goToStep((session.step + 1) as SizerStepNumber);
    }
  };

  const handleBackStep = () => {
    if (session.step > 1) {
      goToStep((session.step - 1) as SizerStepNumber);
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

  const currentTitle = STEP_TITLES[session.step];
  const progressPercent = Math.round((session.step / 9) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Elevated Modal Surface */}
      <div className="relative w-full max-w-5xl bg-[#fff8f5] text-[#1f1b17] rounded-3xl border border-white/60 shadow-[0_24px_64px_rgba(31,27,23,0.22)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Progress Bar Top Indicator */}
        <div className="w-full bg-[#f0e6e0] h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00490e] to-[#0f631b] h-full transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header Bar */}
        <header className="px-6 py-4 bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#bfcaba]/30 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00490e] text-white flex items-center justify-center shadow-sm shrink-0">
              <SunlitIcon name="solar_power" size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-base text-[#00490e] tracking-tight">
                  Sunlit Solar System Sizer
                </span>
                <span className="text-[11px] font-bold bg-[#f6ece6] text-[#40493d] px-2.5 py-0.5 rounded-full border border-[#bfcaba]/40">
                  {session.step} of 9
                </span>
              </div>
              <span className="font-sans text-xs text-[#707a6c] font-medium">
                Step {session.step}: {currentTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close calculator modal"
              className="w-9 h-9 rounded-full bg-[#f6ece6] hover:bg-[#f0e6e0] text-[#1f1b17] flex items-center justify-center transition-colors shadow-sm"
              title="Close modal"
            >
              <SunlitIcon name="close" size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Step Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-grow relative">
          <div
            className={`transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
              transitioning
                ? direction === 'next'
                  ? 'opacity-0 -translate-x-4'
                  : 'opacity-0 translate-x-4'
                : 'opacity-100 translate-x-0'
            }`}
          >
            {session.step === 1 && (
              <Step01Introduction onNext={() => goToStep(2)} />
            )}

            {session.step === 2 && (
              <Step02PropertyProfile
                data={session.property}
                onChange={(up) =>
                  setSession((prev) => ({ ...prev, property: { ...prev.property, ...up } }))
                }
                onNext={() => goToStep(3)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 3 && (
              <Step03LoadDemand
                data={session.load}
                onChange={(up) =>
                  setSession((prev) => ({ ...prev, load: { ...prev.load, ...up } }))
                }
                onNext={() => goToStep(4)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 4 && (
              <Step04EnergyProfile
                data={session.energy}
                onChange={(up) =>
                  setSession((prev) => ({ ...prev, energy: { ...prev.energy, ...up } }))
                }
                onNext={() => goToStep(5)}
                onBack={handleBackStep}
              />
            )}

            {session.step === 5 && (
              <Step05BackupRequirement
                data={session.backup}
                onChange={(up) =>
                  setSession((prev) => ({ ...prev, backup: { ...prev.backup, ...up } }))
                }
                onCalculate={handleStartCalculation}
                onBack={handleBackStep}
              />
            )}

            {session.step === 6 && (
              <Step06Calculating onComplete={handleCalculationComplete} />
            )}

            {session.step === 7 && (
              <Step07SystemConfiguration
                data={session.config}
                calculationResult={session.calculationResult}
                onChange={(up) => {
                  setSession((prev) => {
                    const newConfig = { ...prev.config, ...up };
                    const updatedSession = { ...prev, config: newConfig };
                    const res = calculateSolarSystemSizing({
                      propertyType: updatedSession.property.propertyType,
                      location: updatedSession.property.location,
                      occupants: updatedSession.property.occupants,
                      phaseType: updatedSession.property.phaseType,
                      roofType: updatedSession.property.roofType,
                      roofAngle: updatedSession.property.roofAngle,
                      monthlyBillNaira: updatedSession.load.monthlyBillNaira,
                      loadItems: updatedSession.load.loadItems,
                      dailyKwhInput: updatedSession.load.inputMode === 'direct_kwh' ? updatedSession.load.dailyKwhInput : undefined,
                      gridAvailabilityHours: updatedSession.energy.gridAvailabilityHours,
                      gridReliability: updatedSession.energy.gridReliability,
                      hasGenerator: updatedSession.energy.hasGenerator,
                      generatorKva: updatedSession.energy.generatorKva,
                      generatorFuelExpenseMonth: updatedSession.energy.generatorFuelExpenseMonth,
                      daytimeUsagePercent: updatedSession.energy.daytimeUsagePercent,
                      nighttimeUsagePercent: updatedSession.energy.nighttimeUsagePercent,
                      daysOfAutonomy: updatedSession.backup.autonomyDays,
                      backupScope: updatedSession.backup.backupScope,
                      criticalLoads: updatedSession.backup.criticalLoads,
                      selectedPanelWattage: newConfig.selectedPanelWattage,
                      selectedBatteryType: newConfig.selectedBatteryType,
                      selectedInverterType: newConfig.selectedInverterType,
                    });
                    return { ...updatedSession, calculationResult: res };
                  });
                }}
                onNext={() => goToStep(8)}
                onBack={() => goToStep(5)}
              />
            )}

            {session.step === 8 && (
              <Step08Results
                calculationResult={session.calculationResult}
                onNext={() => goToStep(9)}
                onBack={() => goToStep(7)}
              />
            )}

            {session.step === 9 && (
              <Step09NextActions onRestart={handleRestart} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
