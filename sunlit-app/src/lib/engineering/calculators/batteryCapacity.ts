import { SharedCalculationResult } from '../types';

export interface BatteryInput {
  dailyEnergyKwh: number;
  daysOfAutonomy: number; // e.g., 1.0 or 1.5 days
  systemVoltage: 12 | 24 | 48 | 51.2 | 96 | 192; // Volts DC
  chemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  maxDepthOfDischarge?: number; // e.g., 0.8 for Lithium, 0.5 for Gel
  inverterEfficiency?: number; // e.g., 0.92
}

export function calculateBatteryCapacity(input: BatteryInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.dailyEnergyKwh <= 0) errors.push('Daily energy requirement (kWh) must be greater than 0.');
  if (input.daysOfAutonomy < 0.25 || input.daysOfAutonomy > 5) errors.push('Days of autonomy must be between 0.25 and 5 days.');

  const chemistry = input.chemistry ?? 'LITHIUM_LIFEPO4';
  const dod = input.maxDepthOfDischarge ?? (chemistry === 'LITHIUM_LIFEPO4' ? 0.8 : 0.5);
  const efficiency = input.inverterEfficiency ?? 0.92;

  if (errors.length > 0) {
    return {
      toolId: 'battery-capacity',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid battery parameters.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Energy required from battery = (Daily kWh * Autonomy) / (DOD * Inverter Efficiency)
  const rawKwhRequired = (input.dailyEnergyKwh * input.daysOfAutonomy) / (dod * efficiency);
  const requiredAhAtVoltage = (rawKwhRequired * 1000) / input.systemVoltage;

  // Round up to recommended standard battery size (e.g. 5.12 kWh modules for Lithium)
  const moduleSizeKwh = chemistry === 'LITHIUM_LIFEPO4' ? 5.12 : 2.4;
  const recommendedModules = Math.max(1, Math.ceil(rawKwhRequired / moduleSizeKwh));
  const installedCapacityKwh = Number((recommendedModules * moduleSizeKwh).toFixed(2));

  return {
    toolId: 'battery-capacity',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Battery sizing based on Depth of Discharge (DoD) limits and round-trip efficiency derating.',
    engineering_results: {
      requiredUsableKwh: Number((input.dailyEnergyKwh * input.daysOfAutonomy).toFixed(2)),
      requiredGrossKwh: Number(rawKwhRequired.toFixed(2)),
      requiredAmpHours: Math.round(requiredAhAtVoltage),
      systemVoltage: input.systemVoltage,
      chemistry,
      recommendedModuleCount: recommendedModules,
      installedCapacityKwh,
    },
    recommended_configuration: {
      batteryCapacityKwh: installedCapacityKwh,
      equipmentList: [
        {
          id: 'bat-mod-1',
          name: `${chemistry === 'LITHIUM_LIFEPO4' ? '5.12kWh 48V LiFePO4 Battery Module' : '200Ah 12V Gel Battery'}`,
          category: 'battery',
          specifications: {
            nominalVoltage: input.systemVoltage,
            capacityKwh: moduleSizeKwh,
            chemistry,
            maxDod: `${dod * 100}%`,
          },
          recommendedQuantity: recommendedModules,
          reason: `Provides ${installedCapacityKwh} kWh total capacity at ${dod * 100}% max DoD for ${input.daysOfAutonomy} day(s) autonomy.`,
        },
      ],
    },
    warnings: chemistry !== 'LITHIUM_LIFEPO4' ? [{
      code: 'BATTERY_CHEMISTRY',
      message: 'Lead-acid / Gel batteries suffer from Peukert effect and lower cycle life compared to LiFePO4.',
      severity: 'info',
      suggestion: 'Upgrade to Lithium LiFePO4 for 3,500+ cycles and deeper discharge.'
    }] : [],
    assumptions: {
      depthOfDischarge: `${dod * 100}%`,
      inverterEfficiency: `${efficiency * 100}%`,
      moduleSizeKwh,
    },
    supporting_notes: [
      `Usable energy calculation accounts for ${dod * 100}% maximum DoD to prevent battery degradation.`,
      `Inverter conversion efficiency derated at ${efficiency * 100}%.`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
