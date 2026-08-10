'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  SizingSessionState,
  SizerStepNumber,
  STEP_TITLES,
} from './types';
import { calculateSolarSystemSizing } from '@/lib/engineering/calculators/solarSystemSizing';

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
    setTransitioning(true);
    setTimeout(() => {
      setSession((prev) => ({ ...prev, step: targetStep }));
      setTransitioning(false);
    }, 150);
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
                  Sunlit Solar System Sizer
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
                    // Recalculate
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
