/**
 * Cross-Calculator Validation Engine
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Validates cross-domain engineering consistency across all individual calculator outputs.
 * Detects discrepancies such as:
 * - Inverter rating smaller than peak continuous or surge loads
 * - Battery capacity insufficient for night energy demands
 * - PV array generation insufficient to charge battery and satisfy daytime load
 * - String voltage violating inverter MPPT or maximum DC voltage limits
 * - Cable voltage drop exceeding allowable standards (IEC 60364-7-712)
 */

import { V3ValidationFinding } from '../types';

export interface CrossCalculatorInputs {
  peakLoadContinuousWatts?: number;
  peakLoadSurgeWatts?: number;
  dailyEnergyKwh?: number;
  nightEnergyKwh?: number;
  inverterRatingKva?: number;
  inverterSurgeKva?: number;
  batteryNominalKwh?: number;
  batteryUsableKwh?: number;
  pvArrayKwp?: number;
  dailyGenerationKwh?: number;
  stringVocMaxV?: number;
  stringVmpMinV?: number;
  inverterMaxDcVoltageV?: number;
  inverterMpptMinV?: number;
  inverterMpptMaxV?: number;
  dcCableVoltageDropPercent?: number;
}

export function validateCrossCalculatorConsistency(
  inputs: CrossCalculatorInputs
): { isValid: boolean; findings: V3ValidationFinding[] } {
  const findings: V3ValidationFinding[] = [];

  // 1. Inverter Sizing vs Peak Continuous Load
  if (inputs.inverterRatingKva !== undefined && inputs.peakLoadContinuousWatts !== undefined) {
    const inverterContinuousWatts = inputs.inverterRatingKva * 1000 * 0.85; // 0.85 default PF
    if (inverterContinuousWatts < inputs.peakLoadContinuousWatts) {
      findings.push({
        code: 'INSUFFICIENT_INVERTER_CONTINUOUS_CAPACITY',
        severity: 'BLOCKED',
        category: 'ELECTRICAL_SAFETY',
        message: `Inverter rating (${inputs.inverterRatingKva} kVA / ~${Math.round(inverterContinuousWatts)} W) is less than continuous peak demand (${Math.round(inputs.peakLoadContinuousWatts)} W).`,
        affectedComponent: 'Inverter',
        recommendedAction: `Upgrade inverter capacity to at least ${Math.ceil((inputs.peakLoadContinuousWatts / 0.85) / 1000)} kVA to prevent thermal tripping.`,
      });
    }
  }

  // 2. Inverter Surge Rating vs Load Surge Demand
  if (inputs.inverterSurgeKva !== undefined && inputs.peakLoadSurgeWatts !== undefined) {
    const inverterSurgeWatts = inputs.inverterSurgeKva * 1000;
    if (inverterSurgeWatts < inputs.peakLoadSurgeWatts) {
      findings.push({
        code: 'INSUFFICIENT_INVERTER_SURGE_CAPACITY',
        severity: 'WARNING',
        category: 'ELECTRICAL_SAFETY',
        message: `Inverter surge rating (${inputs.inverterSurgeKva} kVA) may not support motor startup surges (${Math.round(inputs.peakLoadSurgeWatts)} W).`,
        affectedComponent: 'Inverter',
        recommendedAction: 'Verify inductive loads have soft-starters or select an inverter with 2x surge headroom.',
      });
    }
  }

  // 3. Battery Usable Capacity vs Nighttime Energy Requirement
  if (inputs.batteryUsableKwh !== undefined && inputs.nightEnergyKwh !== undefined) {
    if (inputs.batteryUsableKwh < inputs.nightEnergyKwh * 0.9) {
      findings.push({
        code: 'INSUFFICIENT_BATTERY_NIGHT_AUTONOMY',
        severity: 'WARNING',
        category: 'ENERGY_BALANCE',
        message: `Battery usable storage (${inputs.batteryUsableKwh.toFixed(1)} kWh) provides less than nighttime requirement (${inputs.nightEnergyKwh.toFixed(1)} kWh).`,
        affectedComponent: 'Battery Bank',
        recommendedAction: `Increase battery nominal capacity or schedule non-critical night loads during daytime.`,
      });
    }
  }

  // 4. Solar Array Generation vs Total Daily Energy + Battery Charging Loss
  if (inputs.dailyGenerationKwh !== undefined && inputs.dailyEnergyKwh !== undefined) {
    const requiredEnergyWithLosses = inputs.dailyEnergyKwh * 1.15; // 15% system overhead
    if (inputs.dailyGenerationKwh < requiredEnergyWithLosses) {
      findings.push({
        code: 'PV_ARRAY_DEFICIT',
        severity: 'WARNING',
        category: 'ENERGY_BALANCE',
        message: `Expected solar generation (${inputs.dailyGenerationKwh.toFixed(1)} kWh/day) is below total daily requirement with losses (${requiredEnergyWithLosses.toFixed(1)} kWh/day).`,
        affectedComponent: 'PV Array',
        recommendedAction: 'Add more PV modules or optimize array tilt/orientation to achieve energy neutrality.',
      });
    }
  }

  // 5. String Voc vs Inverter Max DC Voltage
  if (inputs.stringVocMaxV !== undefined && inputs.inverterMaxDcVoltageV !== undefined) {
    if (inputs.stringVocMaxV > inputs.inverterMaxDcVoltageV) {
      findings.push({
        code: 'PV_STRING_OVERVOLTAGE_RISK',
        severity: 'BLOCKED',
        category: 'EQUIPMENT_PROTECTION',
        message: `Maximum cold-temperature string voltage (${inputs.stringVocMaxV.toFixed(1)} V) exceeds inverter DC limit (${inputs.inverterMaxDcVoltageV} V).`,
        affectedComponent: 'PV String Layout',
        recommendedAction: 'Reduce the number of modules in series per string to prevent permanent inverter damage.',
      });
    }
  }

  // 6. String Vmp vs Inverter MPPT Operating Range
  if (inputs.stringVmpMinV !== undefined && inputs.inverterMpptMinV !== undefined) {
    if (inputs.stringVmpMinV < inputs.inverterMpptMinV) {
      findings.push({
        code: 'PV_STRING_UNDERVOLTAGE_MPPT',
        severity: 'WARNING',
        category: 'HARVEST_EFFICIENCY',
        message: `Hot-temperature string Vmp (${inputs.stringVmpMinV.toFixed(1)} V) falls below minimum MPPT tracking voltage (${inputs.inverterMpptMinV} V).`,
        affectedComponent: 'PV String Layout',
        recommendedAction: 'Add at least one module in series per string to maintain MPPT tracking during hot weather.',
      });
    }
  }

  // 7. Cable Voltage Drop Compliance
  if (inputs.dcCableVoltageDropPercent !== undefined) {
    if (inputs.dcCableVoltageDropPercent > 2.5) {
      findings.push({
        code: 'CABLE_EXCESSIVE_VOLTAGE_DROP',
        severity: inputs.dcCableVoltageDropPercent > 3.0 ? 'BLOCKED' : 'WARNING',
        category: 'WIRING_STANDARDS',
        message: `DC cable voltage drop is ${inputs.dcCableVoltageDropPercent.toFixed(2)}% (standard recommends ≤ 1.5% - 2.5% max).`,
        affectedComponent: 'DC Cabling',
        recommendedAction: 'Increase cable cross-section (mm²) or decrease route distance.',
      });
    }
  }

  const hasBlocked = findings.some((f) => f.severity === 'BLOCKED');

  return {
    isValid: !hasBlocked,
    findings,
  };
}
