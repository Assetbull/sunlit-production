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
  batteryVoltageV?: number;
  inverterDcVoltageV?: number;
  batteryChemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  autonomyDays?: number;
  pvArrayKwp?: number;
  dailyGenerationKwh?: number;
  stringVocMaxV?: number;
  stringVmpMinV?: number;
  inverterMaxDcVoltageV?: number;
  inverterMpptMinV?: number;
  inverterMpptMaxV?: number;
  dcCableVoltageDropPercent?: number;
  maxApplianceDailyHours?: number;
}

export function validateCrossCalculatorConsistency(
  inputs: CrossCalculatorInputs
): { isValid: boolean; findings: V3ValidationFinding[] } {
  const findings: V3ValidationFinding[] = [];

  // 1. Inverter Sizing vs Peak Continuous Load
  if (inputs.inverterRatingKva !== undefined && inputs.peakLoadContinuousWatts !== undefined && inputs.peakLoadContinuousWatts > 0) {
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
    } else if (inputs.inverterRatingKva >= 15 && inverterContinuousWatts > inputs.peakLoadContinuousWatts * 3.5) {
      findings.push({
        code: 'INVERTER_MASSIVELY_OVERSIZED',
        severity: 'WARNING',
        category: 'SYSTEM_EFFICIENCY',
        message: `Inverter rating (${inputs.inverterRatingKva} kVA) is significantly oversized relative to peak demand (${Math.round(inputs.peakLoadContinuousWatts)} W), causing low-load standby losses.`,
        affectedComponent: 'Inverter',
        recommendedAction: 'Verify if future 3-phase machinery expansion is specifically intended.',
      });
    }
  }

  // 2. Inverter Surge Rating vs Load Surge Demand
  if (inputs.inverterSurgeKva !== undefined && inputs.peakLoadSurgeWatts !== undefined && inputs.peakLoadSurgeWatts > 0) {
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

  // 3. Battery Usable Capacity vs Nighttime Energy Requirement & Autonomy
  if (inputs.batteryUsableKwh !== undefined && inputs.nightEnergyKwh !== undefined && inputs.nightEnergyKwh > 0) {
    if (inputs.batteryUsableKwh < inputs.nightEnergyKwh * 0.70) {
      findings.push({
        code: 'INSUFFICIENT_BATTERY_NIGHT_AUTONOMY',
        severity: 'WARNING',
        category: 'ENERGY_BALANCE',
        message: `Battery usable storage (${inputs.batteryUsableKwh.toFixed(1)} kWh) provides less than 70% of nighttime demand (${inputs.nightEnergyKwh.toFixed(1)} kWh).`,
        affectedComponent: 'Battery Bank',
        recommendedAction: `Increase battery nominal capacity or schedule non-critical night loads during daytime.`,
      });
    }
  }

  // 3b. Battery Massively Oversized Check
  if (inputs.dailyEnergyKwh !== undefined && inputs.batteryNominalKwh !== undefined && inputs.dailyEnergyKwh > 0) {
    if (inputs.batteryNominalKwh > inputs.dailyEnergyKwh * 4.0 && inputs.batteryNominalKwh >= 30) {
      findings.push({
        code: 'BATTERY_MASSIVELY_OVERSIZED',
        severity: 'WARNING',
        category: 'ECONOMIC_VIABILITY',
        message: `Battery storage (${inputs.batteryNominalKwh} kWh) exceeds 4 days of total daily consumption (${inputs.dailyEnergyKwh.toFixed(1)} kWh/day).`,
        affectedComponent: 'Battery Bank',
        recommendedAction: 'Verify if deep off-grid multi-day cloudy autonomy is explicitly required.',
      });
    }
  }

  // 4. Solar PV / Inverter DC-to-AC Ratio
  if (inputs.pvArrayKwp !== undefined && inputs.inverterRatingKva !== undefined && inputs.inverterRatingKva > 0 && inputs.pvArrayKwp > 0) {
    const dcAcRatio = inputs.pvArrayKwp / (inputs.inverterRatingKva * 0.85);
    if (dcAcRatio < 0.70) {
      findings.push({
        code: 'PV_INVERTER_RATIO_UNDERSIZED',
        severity: 'WARNING',
        category: 'HARVEST_EFFICIENCY',
        message: `Solar array (${inputs.pvArrayKwp.toFixed(1)} kWp) significantly under-utilizes inverter capacity (${inputs.inverterRatingKva} kVA, DC/AC ratio ${dcAcRatio.toFixed(2)}).`,
        affectedComponent: 'PV Array & Inverter',
        recommendedAction: 'Add more PV modules or downsize inverter for optimum energy harvest economics.',
      });
    } else if (dcAcRatio > 1.65) {
      findings.push({
        code: 'PV_INVERTER_RATIO_SEVERE_CLIPPING',
        severity: 'WARNING',
        category: 'EQUIPMENT_PROTECTION',
        message: `Solar array DC/AC ratio (${dcAcRatio.toFixed(2)}) is high, causing thermal throttling and midday inverter clipping.`,
        affectedComponent: 'Inverter',
        recommendedAction: 'Upgrade inverter capacity or optimize string tilt angle to limit peak clipping.',
      });
    }
  }

  // 5. Battery and Inverter System Voltage Mismatch
  if (inputs.batteryVoltageV !== undefined && inputs.inverterDcVoltageV !== undefined && inputs.batteryVoltageV > 0 && inputs.inverterDcVoltageV > 0) {
    if (inputs.batteryVoltageV !== inputs.inverterDcVoltageV) {
      findings.push({
        code: 'BATTERY_INVERTER_VOLTAGE_MISMATCH',
        severity: 'BLOCKED',
        category: 'ELECTRICAL_SAFETY',
        message: `Battery nominal voltage (${inputs.batteryVoltageV} V) does not match inverter DC bus requirement (${inputs.inverterDcVoltageV} V).`,
        affectedComponent: 'DC Busbar & Battery',
        recommendedAction: `Reconfigure battery bank series/parallel connections to match ${inputs.inverterDcVoltageV} V.`,
      });
    }
  }

  // 6. Battery C-Rate Discharge and Charge Current Limits
  if (inputs.inverterRatingKva !== undefined && inputs.batteryNominalKwh !== undefined && inputs.batteryNominalKwh > 0) {
    const isLithium = inputs.batteryChemistry !== 'TUBULAR_GEL' && inputs.batteryChemistry !== 'AGM';
    const maxRecommendedDischargeKw = isLithium ? inputs.batteryNominalKwh * 1.0 : inputs.batteryNominalKwh * 0.25;
    const continuousInverterKw = inputs.inverterRatingKva * 0.85;

    if (continuousInverterKw > maxRecommendedDischargeKw * 1.25) {
      findings.push({
        code: 'BATTERY_DISCHARGE_CRATE_EXCEEDED',
        severity: 'WARNING',
        category: 'EQUIPMENT_LIFECYCLE',
        message: `Max inverter draw (${continuousInverterKw.toFixed(1)} kW) exceeds safe continuous discharge limit (${maxRecommendedDischargeKw.toFixed(1)} kW) for ${inputs.batteryChemistry || 'LITHIUM_LIFEPO4'}.`,
        affectedComponent: 'Battery Bank',
        recommendedAction: 'Expand battery capacity to prevent BMS over-current shutdown and accelerated degradation.',
      });
    }
  }

  // 7. Excessive Autonomy Assumption
  if (inputs.autonomyDays !== undefined && inputs.autonomyDays > 3) {
    findings.push({
      code: 'EXCESSIVE_AUTONOMY_ASSUMPTION',
      severity: 'WARNING',
      category: 'DESIGN_ASSUMPTIONS',
      message: `Autonomy assumption (${inputs.autonomyDays} days) is unusually high for Nigerian grid/hybrid deployments.`,
      affectedComponent: 'System Sizing',
      recommendedAction: 'Consider 1–2 days of battery backup combined with automated generator integration.',
    });
  }

  // 8. Solar Array Generation vs Total Daily Energy + Battery Charging Loss
  if (inputs.dailyGenerationKwh !== undefined && inputs.dailyEnergyKwh !== undefined && inputs.dailyEnergyKwh > 0) {
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

  // 9. Specific Solar Yield Plausibility Check (Nigeria Irradiance Bounds: 2.5–6.5 kWh/kWp/day)
  if (inputs.dailyGenerationKwh !== undefined && inputs.pvArrayKwp !== undefined && inputs.pvArrayKwp > 0) {
    const specificYield = inputs.dailyGenerationKwh / inputs.pvArrayKwp;
    if (specificYield < 2.5 || specificYield > 6.5) {
      findings.push({
        code: 'UNREALISTIC_SOLAR_YIELD',
        severity: 'WARNING',
        category: 'METEOROLOGICAL_BOUNDS',
        message: `Calculated specific solar yield (${specificYield.toFixed(2)} kWh/kWp/day) falls outside valid Nigerian solar climate benchmarks (2.5–6.5 kWh/kWp/day).`,
        affectedComponent: 'Yield Model',
        recommendedAction: 'Verify solar insolation PSH data and shading derate factors.',
      });
    }
  }

  // 10. String Voc vs Inverter Max DC Voltage
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

  // 11. String Vmp vs Inverter MPPT Operating Range
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

  // 12. Cable Voltage Drop Compliance (IEC 60364-7-712 standard)
  if (inputs.dcCableVoltageDropPercent !== undefined) {
    if (inputs.dcCableVoltageDropPercent > 2.5) {
      findings.push({
        code: 'CABLE_EXCESSIVE_VOLTAGE_DROP',
        severity: inputs.dcCableVoltageDropPercent > 3.0 ? 'BLOCKED' : 'WARNING',
        category: 'WIRING_STANDARDS',
        message: `DC cable voltage drop is ${inputs.dcCableVoltageDropPercent.toFixed(2)}% (standard recommends ≤ 1.5% - 2.5% max, >3.0% blocked).`,
        affectedComponent: 'DC Cabling',
        recommendedAction: 'Increase cable cross-section (mm²) or decrease route distance.',
      });
    }
  }

  // 13. Unrealistic Single Appliance Runtime Warning
  if (inputs.maxApplianceDailyHours !== undefined && inputs.maxApplianceDailyHours > 18) {
    findings.push({
      code: 'UNREALISTIC_APPLIANCE_RUNTIME',
      severity: 'WARNING',
      category: 'LOAD_MODELING',
      message: 'One or more high-draw or intermittent appliances is modeled running >18 hours/day.',
      affectedComponent: 'Load Schedule',
      recommendedAction: 'Verify operating duty cycle to ensure battery is not over-sized for intermittent equipment.',
    });
  }

  const hasBlocked = findings.some((f) => f.severity === 'BLOCKED');

  return {
    isValid: !hasBlocked,
    findings,
  };
}
