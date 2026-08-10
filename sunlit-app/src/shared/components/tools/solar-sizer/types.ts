import { SharedCalculationResult } from '@/lib/engineering/types';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';

export type SizerStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PropertyProfileState {
  propertyType: 'residential' | 'commercial' | 'industrial';
  location: string;
  occupants: number;
  phaseType: 'single-phase' | 'three-phase';
  roofType: 'metal' | 'concrete' | 'tile';
  roofAngle: number;
}

export interface LoadDemandState {
  inputMode: 'bill' | 'appliances' | 'direct_kwh';
  monthlyBillNaira: number;
  dailyKwhInput: number;
  loadItems: LoadItem[];
}

export interface EnergyProfileState {
  gridAvailabilityHours: number;
  gridReliability: 'high' | 'medium' | 'frequent_outages' | 'off_grid';
  hasGenerator: boolean;
  generatorKva: number;
  generatorFuelExpenseMonth: number;
  daytimeUsagePercent: number;
  nighttimeUsagePercent: number;
}

export interface BackupProfileState {
  autonomyDays: number;
  backupScope: 'essential' | 'full';
  criticalLoads: string[];
}

export interface SystemConfigState {
  selectedPanelWattage: number;
  selectedBatteryType: 'lithium_lifepo4' | 'gel_lead_acid';
  selectedInverterType: 'hybrid_pure_sine' | 'offgrid_sine';
}

export interface SizingSessionState {
  step: SizerStepNumber;
  property: PropertyProfileState;
  load: LoadDemandState;
  energy: EnergyProfileState;
  backup: BackupProfileState;
  config: SystemConfigState;
  calculationResult: SharedCalculationResult | null;
  isCalculating: boolean;
  calculationProgress: number;
  calculatingStageIndex: number;
  validationError: string | null;
}

export const STEP_TITLES: Record<SizerStepNumber, string> = {
  1: 'Introduction',
  2: 'Property Profile',
  3: 'Load & Demand',
  4: 'Energy Profile',
  5: 'Backup Requirement',
  6: 'Calculating',
  7: 'System Configuration',
  8: 'Results',
  9: 'Next Actions',
};
