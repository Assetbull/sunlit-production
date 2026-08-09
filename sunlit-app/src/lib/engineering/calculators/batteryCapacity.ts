import { SharedCalculationResult } from '../types';

export interface BatteryInput {
  dailyEnergyKwh: number;
  daysOfAutonomy: number; // e.g., 1.0 or 1.5 days
  systemVoltage: 12 | 24 | 48 | 51.2 | 96 | 192; // Volts DC
  chemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  maxDepthOfDischarge?: number; // e.g., 0.8 for Lithium, 0.5 for Gel (fraction, not percent)
  inverterEfficiency?: number; // e.g., 0.92
  temperatureDerating?: number; // e.g., 0.95 for well-ventilated, 0.85 for hot outdoor
}

export function calculateBatteryCapacity(input: BatteryInput): SharedCalculationResult {
  const errors: string[] = [];

  // Input validation
  if (!Number.isFinite(input.dailyEnergyKwh) || input.dailyEnergyKwh <= 0) {
    errors.push('Daily energy requirement (kWh) must be a positive number.');
  }
  if (!Number.isFinite(input.daysOfAutonomy) || input.daysOfAutonomy < 0.25 || input.daysOfAutonomy > 5) {
    errors.push('Days of autonomy must be between 0.25 and 5 days.');
  }

  const chemistry = input.chemistry ?? 'LITHIUM_LIFEPO4';
  const rawDod = input.maxDepthOfDischarge ?? (chemistry === 'LITHIUM_LIFEPO4' ? 0.8 : 0.5);

  if (!Number.isFinite(rawDod) || rawDod <= 0 || rawDod > 1) {
    errors.push('Max depth of discharge must be between 0.01 and 1.0 (e.g. 0.80 for 80%).');
  }

  const efficiency = input.inverterEfficiency ?? 0.92;
  if (!Number.isFinite(efficiency) || efficiency <= 0 || efficiency > 1) {
    errors.push('Inverter efficiency must be between 0.01 and 1.0 (e.g. 0.92 for 92%).');
  }

  const tempDerating = input.temperatureDerating ?? 0.95;
  if (!Number.isFinite(tempDerating) || tempDerating <= 0 || tempDerating > 1) {
    errors.push('Temperature derating factor must be between 0.01 and 1.0.');
  }

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
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const dod = rawDod;

  // Energy required from battery, accounting for inverter efficiency AND temperature derating
  // Formula: Gross kWh = (Daily kWh × Autonomy Days) / (DoD × Inverter Efficiency × Temp Derating)
  const requiredUsableKwh = Number((input.dailyEnergyKwh * input.daysOfAutonomy).toFixed(2));
  const rawKwhRequired = requiredUsableKwh / (dod * efficiency * tempDerating);

  if (!Number.isFinite(rawKwhRequired)) {
    return {
      toolId: 'battery-capacity',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Calculation produced an invalid result. Check system voltage and efficiency values.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Calculation error: result is not a finite number.'] },
    };
  }

  const requiredAmpHours = rawKwhRequired * 1000 / input.systemVoltage;

  // Round up to recommended standard battery module size
  const moduleSizeKwh = chemistry === 'LITHIUM_LIFEPO4' ? 5.12 : 2.4;
  const recommendedModuleCount = Math.max(1, Math.ceil(rawKwhRequired / moduleSizeKwh));
  const installedCapacityKwh = Number((recommendedModuleCount * moduleSizeKwh).toFixed(2));
  const installedAmpHours = Math.round((installedCapacityKwh * 1000) / input.systemVoltage);

  // Engineering validation checks
  const isCapacityAdequate = installedCapacityKwh * dod >= requiredUsableKwh;
  const isDodSafe = dod <= (chemistry === 'LITHIUM_LIFEPO4' ? 0.9 : 0.6);

  const warnings = [];
  if (chemistry !== 'LITHIUM_LIFEPO4') {
    warnings.push({
      code: 'BATTERY_CHEMISTRY_LEAD_ACID',
      message: 'Lead-acid / Gel batteries suffer from Peukert effect and lower cycle life (800–1500 cycles) compared to LiFePO4 (4000–6000 cycles).',
      severity: 'info' as const,
      suggestion: 'Upgrade to Lithium LiFePO4 for longer lifespan and lower total cost of ownership.',
    });
  }
  if (dod > 0.85 && chemistry === 'LITHIUM_LIFEPO4') {
    warnings.push({
      code: 'HIGH_DOD_LIFEPO4',
      message: 'DoD above 85% significantly reduces LiFePO4 cycle life. Manufacturer warranty may require max 80% DoD.',
      severity: 'warning' as const,
      suggestion: 'Limit DoD to 80% for optimal battery lifespan and warranty compliance.',
    });
  }
  if (tempDerating < 0.90) {
    warnings.push({
      code: 'HIGH_TEMPERATURE_DERATING',
      message: 'Significant ambient temperature derating applied. Battery capacity is derated by more than 10% due to heat.',
      severity: 'warning' as const,
      suggestion: 'Install batteries in a cool, well-ventilated enclosure or air-conditioned battery room.',
    });
  }

  return {
    toolId: 'battery-capacity',
    calculation_status: 'SUCCESS',
    confidence: isCapacityAdequate && isDodSafe ? 'HIGH' : 'MODERATE',
    confidenceReasoning: 'Battery sizing based on Depth of Discharge (DoD) limits, round-trip inverter efficiency, and ambient temperature derating.',
    engineering_results: {
      requiredUsableKwh,
      requiredGrossKwh: Number(rawKwhRequired.toFixed(2)),
      requiredAmpHours: Math.round(requiredAmpHours),
      installedCapacityKwh,
      installedAmpHours,
      recommendedModuleCount,
      systemVoltage: input.systemVoltage,
      chemistry,
      dod: Number((dod * 100).toFixed(0)),
      temperatureDerating: Number((tempDerating * 100).toFixed(0)),
      inverterEfficiency: Number((efficiency * 100).toFixed(0)),
      // Legacy alias for older code compatibility
      recommendedAhCapacity: installedAmpHours,
      recommendedNominalCapacityKwh: installedCapacityKwh,
      // Engineering validation
      capacityAdequacyCheck: isCapacityAdequate ? 'PASS' : 'FAIL',
      dodSafetyCheck: isDodSafe ? 'PASS' : 'REVIEW',
    },
    recommended_configuration: {
      batteryCapacityKwh: installedCapacityKwh,
      equipmentList: [
        {
          id: 'bat-mod-1',
          name: chemistry === 'LITHIUM_LIFEPO4'
            ? `${moduleSizeKwh} kWh 48V LiFePO4 Wall-Mount Battery Module`
            : `200Ah 12V Deep Cycle Tubular Gel Battery`,
          category: 'battery',
          specifications: {
            nominalVoltage: `${input.systemVoltage}V DC`,
            capacityKwh: moduleSizeKwh,
            chemistry,
            maxDod: `${Math.round(dod * 100)}%`,
            cycleLife: chemistry === 'LITHIUM_LIFEPO4' ? '4,000–6,000 cycles @ 80% DoD' : '800–1,500 cycles @ 50% DoD',
          },
          recommendedQuantity: recommendedModuleCount,
          reason: `Provides ${installedCapacityKwh} kWh total installed capacity, delivering ${requiredUsableKwh} kWh usable energy at ${Math.round(dod * 100)}% max DoD for ${input.daysOfAutonomy} day(s) autonomy.`,
        },
      ],
    },
    warnings,
    assumptions: {
      depthOfDischarge: `${Math.round(dod * 100)}%`,
      inverterEfficiency: `${Math.round(efficiency * 100)}%`,
      temperatureDerating: `${Math.round(tempDerating * 100)}%`,
      moduleSizeKwh: `${moduleSizeKwh} kWh`,
      chemistry,
    },
    supporting_notes: [
      `Usable energy = Installed capacity × DoD = ${installedCapacityKwh} kWh × ${Math.round(dod * 100)}% = ${Number((installedCapacityKwh * dod).toFixed(2))} kWh usable.`,
      `Inverter conversion efficiency derated at ${Math.round(efficiency * 100)}% to account for DC–AC conversion losses.`,
      `Ambient temperature derating applied at ${Math.round(tempDerating * 100)}% — electro-chemical performance reduces in high heat.`,
      `Amp-hour rating at ${input.systemVoltage}V DC bus: ${installedAmpHours} Ah total installed.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
