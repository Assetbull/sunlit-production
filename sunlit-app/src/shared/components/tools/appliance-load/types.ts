import { SharedCalculationResult } from '@/lib/engineering/types';
import { LoadItem, ApplianceCategory } from '@/lib/engineering/calculators/loadCalculator';

export type LoadWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ApplianceLoadSessionState {
  step: LoadWizardStep;
  items: LoadItem[];
  profileTitle: string;
  userClassification: 'Homeowner' | 'Business Owner' | 'Installer' | 'EPC Contractor' | 'Engineer';
  calculationResult: SharedCalculationResult | null;
  isCalculating: boolean;
  calculationProgress: number;
  calculatingStageIndex: number;
}

export const LOAD_STEP_TITLES: Record<LoadWizardStep, string> = {
  1: 'Introduction',
  2: 'Appliance Selection',
  3: 'Usage Setup',
  4: 'Review Inventory',
  5: 'Calculating',
  6: 'Results & Summary',
  7: 'Save Profile & Next Steps',
};

export const PRESET_APPLIANCES: (LoadItem & { icon: string; description: string })[] = [
  {
    name: 'Refrigerator / Freezer',
    powerWatts: 300,
    quantity: 1,
    hoursPerDay: 24,
    category: 'Cooling',
    isCritical: true,
    surgeMultiplier: 4.0,
    icon: 'kitchen',
    description: 'Continuous food preservation & refrigeration',
  },
  {
    name: 'LED Lighting Bulbs (10 Pack)',
    powerWatts: 15,
    quantity: 10,
    hoursPerDay: 8,
    category: 'Lighting',
    isCritical: true,
    surgeMultiplier: 1.0,
    icon: 'lightbulb',
    description: 'High efficiency interior & security lighting',
  },
  {
    name: 'Air Conditioner (1.5 HP Inverter)',
    powerWatts: 1200,
    quantity: 2,
    hoursPerDay: 10,
    category: 'HVAC',
    isCritical: false,
    surgeMultiplier: 3.0,
    icon: 'ac_unit',
    description: 'Space cooling compressor unit',
  },
  {
    name: 'Water Pumping Machine (1 HP)',
    powerWatts: 1100,
    quantity: 1,
    hoursPerDay: 2,
    category: 'Utilities',
    isCritical: true,
    surgeMultiplier: 3.0,
    icon: 'water_drop',
    description: 'Borehole & overhead tank pumping motor',
  },
  {
    name: 'LED Smart TV (55")',
    powerWatts: 120,
    quantity: 1,
    hoursPerDay: 6,
    category: 'Entertainment',
    isCritical: false,
    surgeMultiplier: 1.0,
    icon: 'tv',
    description: 'Living room entertainment center',
  },
  {
    name: 'Laptop Workstation & Wi-Fi Router',
    powerWatts: 150,
    quantity: 2,
    hoursPerDay: 10,
    category: 'Computing',
    isCritical: true,
    surgeMultiplier: 1.0,
    icon: 'computer',
    description: 'Home office & connectivity equipment',
  },
  {
    name: 'Washing Machine (Front Load)',
    powerWatts: 600,
    quantity: 1,
    hoursPerDay: 2,
    category: 'Utilities',
    isCritical: false,
    surgeMultiplier: 2.0,
    icon: 'local_laundry_service',
    description: 'Laundry washing equipment',
  },
  {
    name: 'Microwave Oven (1000W)',
    powerWatts: 1000,
    quantity: 1,
    hoursPerDay: 0.5,
    category: 'Kitchen',
    isCritical: false,
    surgeMultiplier: 1.2,
    icon: 'microwave',
    description: 'High-power quick heating kitchen appliance',
  },
];
