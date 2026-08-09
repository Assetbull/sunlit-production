import { SharedCalculationResult } from './types';
import { calculateLoad } from './calculators/loadCalculator';
import { calculateBatteryCapacity } from './calculators/batteryCapacity';
import { calculateInverterSizing } from './calculators/inverterSizing';
import { calculateSolarPanelSizing } from './calculators/solarPanelSizing';
import { calculateSolarSystemSizing } from './calculators/solarSystemSizing';
import { calculateCableSizing } from './calculators/cableSizing';
import { calculatePvConfiguration } from './calculators/pvConfiguration';
import { calculateEnergyYield } from './calculators/energyYield';
import { calculateSolarSavings } from './calculators/solarSavings';
import { calculateRoi } from './calculators/roiCalculator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInput = any;

export function runEngineeringCalculation(toolId: string, inputData: Record<string, unknown>): SharedCalculationResult {
  const input = inputData as AnyInput;

  switch (toolId) {
    case 'load-calculator':
      return calculateLoad(input);
    case 'battery-capacity':
      return calculateBatteryCapacity(input);
    case 'inverter-sizing':
      return calculateInverterSizing(input);
    case 'solar-panel-sizing':
      return calculateSolarPanelSizing(input);
    case 'solar-system-sizing':
      return calculateSolarSystemSizing(input);
    case 'cable-sizing':
      return calculateCableSizing(input);
    case 'pv-configuration':
      return calculatePvConfiguration(input);
    case 'energy-yield':
      return calculateEnergyYield(input);
    case 'solar-savings':
      return calculateSolarSavings(input);
    case 'roi-calculator':
      return calculateRoi(input);
    default:
      return {
        toolId,
        calculation_status: 'ENGINE_ERROR',
        confidence: 'REVIEW_RECOMMENDED',
        confidenceReasoning: `Unknown tool engine requested: ${toolId}`,
        engineering_results: {},
        recommended_configuration: {},
        warnings: [],
        assumptions: {},
        supporting_notes: [],
        engine_version: '2.0.0',
        validation_status: { isValid: false, errors: [`Unrecognized tool module ID: ${toolId}`] },
      };
  }
}
