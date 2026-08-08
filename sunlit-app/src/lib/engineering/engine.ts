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

export function runEngineeringCalculation(toolId: string, inputData: any): SharedCalculationResult {
  switch (toolId) {
    case 'load-calculator':
      return calculateLoad(inputData);
    case 'battery-capacity':
      return calculateBatteryCapacity(inputData);
    case 'inverter-sizing':
      return calculateInverterSizing(inputData);
    case 'solar-panel-sizing':
      return calculateSolarPanelSizing(inputData);
    case 'solar-system-sizing':
      return calculateSolarSystemSizing(inputData);
    case 'cable-sizing':
      return calculateCableSizing(inputData);
    case 'pv-configuration':
      return calculatePvConfiguration(inputData);
    case 'energy-yield':
      return calculateEnergyYield(inputData);
    case 'solar-savings':
      return calculateSolarSavings(inputData);
    case 'roi-calculator':
      return calculateRoi(inputData);
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
        engine_version: '1.0.0',
        validation_status: { isValid: false, errors: [`Unrecognized tool module ID: ${toolId}`] },
      };
  }
}
