import { LoadItem } from '@/lib/engineering/calculators/loadCalculator';
import { SharedCalculationResult } from '@/lib/engineering/types';

export type InverterWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface InverterSizingSessionState {
  step: InverterWizardStep;
  items: LoadItem[];
  continuousLoadWatts: number;
  surgeLoadWatts: number;
  powerFactor: number;
  growthMargin: number;
  inverterType: 'HYBRID' | 'OFF_GRID' | 'GRID_TIED';
  systemVoltage: 24 | 48 | 96 | 192;
  profileTitle: string;
  userClassification: 'Homeowner' | 'Business Owner' | 'Installer' | 'EPC Contractor' | 'Engineer';
  calculationResult: SharedCalculationResult | null;
  isCalculating: boolean;
  calculationProgress: number;
}

export const INVERTER_STEP_TITLES: Record<InverterWizardStep, string> = {
  1: 'Introduction',
  2: 'Energy Profile & Load',
  3: 'Surge Demand Assessment',
  4: 'Review Load Plan',
  5: 'Calculating Capacity',
  6: 'Sizing Results',
  7: 'Options & Next Steps',
};

export const DEFAULT_INVERTER_ITEMS: LoadItem[] = [
  {
    name: 'Air Conditioner (1.5 HP Inverter)',
    powerWatts: 1200,
    quantity: 2,
    hoursPerDay: 8,
    category: 'HVAC',
    isCritical: true,
    surgeMultiplier: 3.5,
  },
  {
    name: 'Refrigerator / Deep Freezer',
    powerWatts: 300,
    quantity: 1,
    hoursPerDay: 24,
    category: 'Cooling',
    isCritical: true,
    surgeMultiplier: 4.0,
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
  {
    name: 'LED Lighting & Smart TV',
    powerWatts: 250,
    quantity: 1,
    hoursPerDay: 8,
    category: 'General',
    isCritical: false,
    surgeMultiplier: 1.0,
  },
];
