import { SharedCalculationResult } from '@/lib/engineering/types';

export type PvConfigWizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface PvConfigSessionState {
  step: PvConfigWizardStep;
  systemCapacityKwp: number;
  locationRegion: string;
  peakSunHours: number;
  tiltAngle: number;
  azimuthDeg: number;
  panelWattage: number;
  soilingLossPercent: number;
  inverterEfficiencyPercent: number;
  profileTitle: string;
  userClassification: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  calculationResult: SharedCalculationResult | null;
  isCalculating: boolean;
  calculationProgress: number;
}

export const PV_CONFIG_STEP_TITLES: Record<PvConfigWizardStep, string> = {
  1: 'Tool Introduction',
  2: 'Project Location & Capacity',
  3: 'Roof Tilt & Orientation',
  4: 'Annual Energy Yield Result',
  5: '12-Month Yield Chart',
  6: 'Performance Loss Breakdown',
  7: 'Scenario Comparison Matrix',
  8: 'Options, Save & Next Tool',
};
