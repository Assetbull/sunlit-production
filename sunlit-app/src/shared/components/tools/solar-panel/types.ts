import { SharedCalculationResult } from '@/lib/engineering/types';

export type SolarPanelWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SolarPanelSessionState {
  step: SolarPanelWizardStep;
  userType: 'Residential Homeowner' | 'Commercial Business' | 'Installer / EPC' | 'Agriculture / Mini-Grid';
  dailyEnergyDemandKwh: number;
  monthlyBillNgn: number;
  locationRegion: string;
  peakSunHours: number;
  panelWattage: number;
  panelModelName: string;
  panelEfficiency: number;
  systemLossesFactor: number;
  profileTitle: string;
  userClassification: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  calculationResult: SharedCalculationResult | null;
  isCalculating: boolean;
  calculationProgress: number;
}

export const SOLAR_PANEL_STEP_TITLES: Record<SolarPanelWizardStep, string> = {
  1: 'Introduction',
  2: 'User & Project Classification',
  3: 'Energy Requirement Target',
  4: 'Location & Peak Sun Hours',
  5: 'Solar Panel Model Selection',
  6: 'Calculating Array Sizing',
  7: 'Primary PV Array Results',
  8: 'Panel Configuration & Wiring',
  9: 'Options, Save & Next Tool',
};

export const PRESET_PANELS = [
  {
    id: 'panel-550w-mono',
    name: '550W Tier-1 Monocrystalline PERC',
    wattage: 550,
    efficiency: 21.5,
    technology: 'Mono-PERC Half-Cell',
    dimensions: '2278 × 1134 × 35 mm',
    warranty: '25-Year Linear Warranty',
    description: 'High-efficiency industrial standard solar module for residential and commercial roofs.',
  },
  {
    id: 'panel-450w-topcon',
    name: '450W N-Type TOPCon High Efficiency',
    wattage: 450,
    efficiency: 22.3,
    technology: 'N-Type TOPCon Dual Glass',
    dimensions: '1903 × 1134 × 30 mm',
    warranty: '30-Year Performance Warranty',
    description: 'Premium high-temperature performance module with reduced degradation rate.',
  },
  {
    id: 'panel-580w-bifacial',
    name: '580W Bifacial Dual-Glass Module',
    wattage: 580,
    efficiency: 22.5,
    technology: 'Bifacial N-Type HJT',
    dimensions: '2384 × 1134 × 30 mm',
    warranty: '30-Year Linear Warranty',
    description: 'Captures ground albedo reflected light for up to +25% additional rear-side yield.',
  },
];
