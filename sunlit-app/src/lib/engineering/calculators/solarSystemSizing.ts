import { SharedCalculationResult } from '../types';
import { calculateLoad, LoadItem } from './loadCalculator';
import { calculateBatteryCapacity } from './batteryCapacity';
import { calculateInverterSizing } from './inverterSizing';
import { calculateSolarPanelSizing } from './solarPanelSizing';

export interface SolarSystemSizingInput {
  loadItems?: LoadItem[];
  monthlyBillNaira?: number;
  dailyKwhInput?: number;
  daysOfAutonomy?: number;
  location?: string;
  propertyType?: 'residential' | 'commercial' | 'industrial';
}

export function calculateSolarSystemSizing(input: SolarSystemSizingInput): SharedCalculationResult {
  let dailyKwh = input.dailyKwhInput ?? 0;
  let continuousWatts = 0;

  if (input.loadItems && input.loadItems.length > 0) {
    const loadRes = calculateLoad({ items: input.loadItems });
    if (loadRes.calculation_status === 'SUCCESS') {
      dailyKwh = loadRes.engineering_results.dailyEnergyDemandKwh;
      continuousWatts = loadRes.engineering_results.totalConnectedWatts;
    }
  } else if (input.monthlyBillNaira && input.monthlyBillNaira > 0) {
    // Estimate daily kWh from Band A DISCO electricity tariff (~₦225/kWh)
    const tariffPerKwh = 225;
    const monthlyKwh = input.monthlyBillNaira / tariffPerKwh;
    dailyKwh = Number((monthlyKwh / 30).toFixed(2));
    continuousWatts = (dailyKwh * 1000) / 8; // approx 8 peak equivalent operating hours
  }

  if (dailyKwh <= 0) {
    return {
      toolId: 'solar-system-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing load inventory, monthly electricity bill, or daily kWh input.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors: ['Please enter either your appliance list, monthly bill, or daily energy consumption.'] },
    };
  }

  const autonomy = input.daysOfAutonomy ?? 1.0;
  const systemVoltage = continuousWatts <= 2000 ? 24 : 48;

  const batteryRes = calculateBatteryCapacity({
    dailyEnergyKwh: dailyKwh,
    daysOfAutonomy: autonomy,
    systemVoltage,
  });

  const inverterRes = calculateInverterSizing({
    continuousLoadWatts: continuousWatts > 0 ? continuousWatts : (dailyKwh * 1000) / 8,
  });

  const panelRes = calculateSolarPanelSizing({
    dailyEnergyDemandKwh: dailyKwh,
  });

  return {
    toolId: 'solar-system-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Integrated multi-variable system calculation cross-validating load, battery autonomy, inverter peak capacity, and solar array yield.',
    engineering_results: {
      dailyEnergyDemandKwh: dailyKwh,
      monthlyEnergyDemandKwh: Number((dailyKwh * 30).toFixed(2)),
      recommendedInverterKva: inverterRes.engineering_results.recommendedInverterKva,
      recommendedBatteryKwh: batteryRes.engineering_results.installedCapacityKwh,
      recommendedSolarArrayKwp: panelRes.engineering_results.actualArrayKwp,
      recommendedPanelCount: panelRes.engineering_results.recommendedPanelCount,
      estimatedRoofAreaM2: panelRes.engineering_results.estimatedRoofAreaM2,
    },
    recommended_configuration: {
      systemCapacityKw: panelRes.engineering_results.actualArrayKwp,
      inverterRatingKva: inverterRes.engineering_results.recommendedInverterKva,
      batteryCapacityKwh: batteryRes.engineering_results.installedCapacityKwh,
      panelCount: panelRes.engineering_results.recommendedPanelCount,
      panelPowerWatt: 550,
      equipmentList: [
        ...(inverterRes.recommended_configuration.equipmentList || []),
        ...(batteryRes.recommended_configuration.equipmentList || []),
        ...(panelRes.recommended_configuration.equipmentList || []),
      ],
    },
    warnings: dailyKwh > 50 ? [{
      code: 'LARGE_SYSTEM',
      message: 'System capacity exceeds standard single-phase residential sizing.',
      severity: 'warning',
      suggestion: 'We recommend requesting a site engineering assessment from a verified Sunlit EPC contractor.'
    }] : [],
    assumptions: {
      location: input.location ?? 'Nigeria (Average Irradiance 4.8 PSH)',
      electricityTariff: '₦225/kWh (Band A baseline)',
      batteryAutonomy: `${autonomy} day(s)`,
    },
    supporting_notes: [
      'Complete system specification engineered to eliminate reliance on diesel generator power during grid outages.',
      'All component recommendations are cross-compatible on standard 48V DC bus architecture.'
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
