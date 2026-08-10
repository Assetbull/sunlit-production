import { SharedCalculationResult } from '@/lib/engineering/types';
import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { BackupGoal } from '@/lib/engineering/calculators/batteryCapacity';

export type BatteryWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface BatteryCapacitySessionState {
  step: BatteryWizardStep;
  items: LoadItem[];
  backupGoal: BackupGoal;
  daysOfAutonomy: number;
  systemVoltage: 12 | 24 | 48 | 51.2 | 96 | 192;
  chemistry: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  maxDepthOfDischarge: number; // e.g. 0.8
  inverterEfficiency: number; // e.g. 0.92
  temperatureDerating: number; // e.g. 0.95
  profileTitle: string;
  userClassification: 'Homeowner' | 'Business Owner' | 'Installer' | 'EPC Contractor' | 'Engineer';
  calculationResult: SharedCalculationResult | null;
  isCalculating: boolean;
  calculationProgress: number;
}

export const BATTERY_STEP_TITLES: Record<BatteryWizardStep, string> = {
  1: 'Introduction',
  2: 'Select Appliances',
  3: 'Review Connected Plan',
  4: 'Backup Needs & Priority',
  5: 'Backup Duration & Voltage',
  6: 'Calculating Sizing',
  7: 'Battery Sizing Results',
  8: 'Save Specification & Next Steps',
};

export const DEFAULT_BATTERY_ITEMS: LoadItem[] = [
  {
    name: 'Refrigerator / Freezer',
    powerWatts: 300,
    quantity: 1,
    hoursPerDay: 24,
    category: 'Cooling',
    isCritical: true,
    surgeMultiplier: 4.0,
  },
  {
    name: 'LED Lighting Bulbs (10 Pack)',
    powerWatts: 15,
    quantity: 10,
    hoursPerDay: 8,
    category: 'Lighting',
    isCritical: true,
    surgeMultiplier: 1.0,
  },
  {
    name: 'Air Conditioner (1.5 HP Inverter)',
    powerWatts: 1200,
    quantity: 2,
    hoursPerDay: 10,
    category: 'HVAC',
    isCritical: false,
    surgeMultiplier: 3.0,
  },
  {
    name: 'Water Pumping Machine (1 HP)',
    powerWatts: 1100,
    quantity: 1,
    hoursPerDay: 2,
    category: 'Utilities',
    isCritical: true,
    surgeMultiplier: 3.0,
  },
];
