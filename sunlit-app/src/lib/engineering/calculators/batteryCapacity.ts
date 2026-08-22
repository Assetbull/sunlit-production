import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope, ENGINE_VERSION } from '../core/envelope';
import { BATTERY_CATALOG } from '../catalog/equipmentCatalog';
import { calculateLoad, LoadItem } from './loadCalculator';

export type BackupGoal = 'essential' | 'standard' | 'extended' | 'full' | 'FULL_HOME' | 'CRITICAL_ONLY' | 'NIGHTTIME';

export interface BatteryCapacityInput {
  dailyEnergyKwh?: number;
  daysOfAutonomy?: number;
  autonomyDays?: number; // Alias for pipeline compatibility
  systemVoltage?: number;
  chemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  batteryChemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM'; // Alias for pipeline compatibility
  depthOfDischargePercent?: number;
  maxDepthOfDischarge?: number;
  temperatureDerating?: number; // Alias for backward compatibility
  inverterEfficiencyPercent?: number;
  inverterEfficiency?: number;
  selectedBatteryId?: string;
  maxDischargePowerWatts?: number;
  backupGoal?: BackupGoal;
  items?: LoadItem[]; // Alias for UI modal compatibility
  profileTitle?: string; // Alias for UI modal compatibility
}

export function calculateBatteryCapacity(input: BatteryCapacityInput): SharedCalculationResult {
  let dailyKwh = input.dailyEnergyKwh ?? 0;
  if (dailyKwh <= 0 && input.items && input.items.length > 0) {
    const loadRes = calculateLoad({ items: input.items });
    if (loadRes.calculation_status === 'SUCCESS') {
      dailyKwh = loadRes.engineering_results.dailyEnergyDemandKwh;
    }
  }

  const errors: string[] = [];
  if (dailyKwh <= 0) {
    errors.push('Daily energy requirement (kWh/day) must be specified and > 0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'battery-capacity',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing or invalid daily energy requirement.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Enter daily kWh load.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: ENGINE_VERSION,
      validation_status: { isValid: false, errors },
    };
  }

  const autonomy = input.daysOfAutonomy ?? 1.0;
  const chemistry = input.chemistry ?? 'LITHIUM_LIFEPO4';
  const systemVoltage = input.systemVoltage ?? 48;

  const defaultDod = chemistry === 'LITHIUM_LIFEPO4' ? 0.80 : 0.50;
  const dodVal = input.depthOfDischargePercent ?? input.maxDepthOfDischarge;
  const dod = dodVal ? (dodVal > 1 ? dodVal / 100.0 : dodVal) : defaultDod;

  const batteryEff = chemistry === 'LITHIUM_LIFEPO4' ? 0.95 : 0.85;
  const invEffVal = input.inverterEfficiencyPercent ?? input.inverterEfficiency ?? 96;
  const invEff = (invEffVal > 1 ? invEffVal / 100.0 : invEffVal);

  const usableKwhRequired = Number(((dailyKwh * autonomy) / invEff).toFixed(2));
  const installedKwhRequired = Number((usableKwhRequired / (dod * batteryEff)).toFixed(2));
  const totalAhRequired = Math.round((installedKwhRequired * 1000) / systemVoltage);

  let catBattery = BATTERY_CATALOG.find((b) => b.id === input.selectedBatteryId);
  if (!catBattery) {
    catBattery = BATTERY_CATALOG.find((b) => b.chemistry === chemistry) ?? BATTERY_CATALOG[0];
  }

  const moduleCount = Math.ceil(installedKwhRequired / catBattery.capacityKwh);
  const actualInstalledKwh = Number((moduleCount * catBattery.capacityKwh).toFixed(2));
  const actualUsableKwh = Number((actualInstalledKwh * dod).toFixed(2));

  const maxWatts = input.maxDischargePowerWatts ?? (dailyKwh * 1000) / 6;
  const peakDischargeAmp = Number((maxWatts / (systemVoltage * invEff)).toFixed(1));

  const engineeringResults = {
    dailyEnergyKwh: dailyKwh,
    daysOfAutonomy: autonomy,
    systemVoltageDc: systemVoltage,
    batteryChemistry: chemistry,
    allowedDodPercent: dod * 100,
    installedCapacityKwh: actualInstalledKwh,
    usableCapacityKwh: actualUsableKwh,
    roundTripEfficiencyPercent: batteryEff * 100,
    usableCapacityKwhRequired: usableKwhRequired,
    installedCapacityKwhRequired: installedKwhRequired,
    actualInstalledKwh,
    actualUsableKwh,
    totalAmpHoursReq: totalAhRequired,
    recommendedModuleCount: moduleCount,
    selectedBatteryModel: `${catBattery.manufacturer} ${catBattery.model}`,
    peakDischargeCurrentAmp: peakDischargeAmp,
    maxContinuousAmpacityRatingAmp: moduleCount * catBattery.maxContinuousDischargeCurrentA,
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'battery-capacity',
    status: 'ENGINEERING_VALIDATED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'Deterministic Electrochemical Usable Energy Sizing Model',
      governingStandards: ['IEEE 1013', 'IEC 62619'],
      keyEquations: [
        'E_usable_req = (E_daily × Autonomy) / η_inverter',
        'E_nameplate_req = E_usable_req / (DoD × η_battery)',
        'I_discharge_peak = P_max_W / (V_bus × η_inverter)',
      ],
      deratingFactorsApplied: {
        depthOfDischargePercent: dod * 100,
        batteryEfficiencyPercent: batteryEff * 100,
        inverterEfficiencyPercent: invEff * 100,
      },
    },
    inputsUsed: input as any,
  });

  return {
    toolId: 'battery-capacity',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Battery storage engineered from exact autonomy requirement, chemistry DoD limits, and peak current discharge ratings.',
    engineering_results: engineeringResults,
    recommended_configuration: {
      batteryCapacityKwh: actualInstalledKwh,
      equipmentList: [
        {
          id: catBattery.id,
          name: `${moduleCount}× ${catBattery.manufacturer} ${catBattery.model} (${catBattery.capacityKwh} kWh)`,
          category: 'battery',
          specifications: {
            chemistry: catBattery.chemistry,
            capacity: `${catBattery.capacityKwh} kWh`,
            voltage: `${catBattery.nominalVoltageV} V`,
          },
          recommendedQuantity: moduleCount,
          reason: `Provides ${autonomy} day(s) of blackout protection (${actualUsableKwh} kWh usable).`,
        },
      ],
    },
    warnings: peakDischargeAmp > moduleCount * catBattery.maxContinuousDischargeCurrentA ? [{
      code: 'EXCEEDS_DISCHARGE_LIMIT',
      message: 'Peak discharge current exceeds battery BMS continuous rating.',
      severity: 'warning' as const,
      suggestion: 'Add parallel battery modules to increase peak current capacity.'
    }] : [],
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      `Selected ${chemistry} chemistry specified for ${dod * 100}% DoD operating envelope.`,
      `Battery bank output current rated up to ${moduleCount * catBattery.maxContinuousDischargeCurrentA} A continuous.`
    ],
    engine_version: ENGINE_VERSION,
    validation_status: { isValid: true, errors: [] },
  };
}
