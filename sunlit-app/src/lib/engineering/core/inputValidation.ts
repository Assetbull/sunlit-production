/**
 * Input Schema Validation and Boundary Enforcement Layer
 * Sunlit Enterprise Engineering Platform — Public Hardening
 */

import { isFiniteNumber } from './numericSafety';

export interface ValidationOutcome<T = Record<string, unknown>> {
  isValid: boolean;
  errors: string[];
  sanitizedInput: T;
}

/**
 * Strips dangerous object keys (__proto__, constructor, prototype)
 */
export function sanitizeObjectKeys(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObjectKeys);

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    clean[key] = sanitizeObjectKeys(value);
  }
  return clean;
}

/**
 * Validates a number is within [min, max] and is finite.
 */
export function validateNumberField(
  val: unknown,
  fieldName: string,
  min: number,
  max: number,
  errors: string[],
  isRequired = true
): number | undefined {
  if (val === undefined || val === null) {
    if (isRequired) {
      errors.push(`${fieldName} is required.`);
    }
    return undefined;
  }

  if (typeof val !== 'number' || !isFiniteNumber(val)) {
    errors.push(`${fieldName} must be a valid finite number.`);
    return undefined;
  }

  if (val < min) {
    errors.push(`${fieldName} cannot be less than ${min}.`);
    return undefined;
  }

  if (val > max) {
    errors.push(`${fieldName} exceeds maximum allowable threshold (${max}).`);
    return undefined;
  }

  return val;
}

/**
 * Validates a string is non-empty and within max length.
 */
export function validateStringField(
  val: unknown,
  fieldName: string,
  maxLength: number,
  errors: string[],
  isRequired = false,
  allowedValues?: string[]
): string | undefined {
  if (val === undefined || val === null) {
    if (isRequired) {
      errors.push(`${fieldName} is required.`);
    }
    return undefined;
  }

  if (typeof val !== 'string') {
    errors.push(`${fieldName} must be a string.`);
    return undefined;
  }

  const trimmed = val.trim();
  if (trimmed.length === 0 && isRequired) {
    errors.push(`${fieldName} cannot be empty.`);
    return undefined;
  }

  if (trimmed.length > maxLength) {
    errors.push(`${fieldName} cannot exceed ${maxLength} characters.`);
    return trimmed.substring(0, maxLength);
  }

  if (allowedValues && !allowedValues.includes(trimmed)) {
    errors.push(`${fieldName} must be one of: ${allowedValues.join(', ')}.`);
    return undefined;
  }

  return trimmed;
}

/**
 * Master input validation router for all 10 tools.
 */
export function validateToolInput(
  toolId: string,
  rawInput: unknown
): ValidationOutcome {
  const errors: string[] = [];

  if (typeof rawInput !== 'object' || rawInput === null || Array.isArray(rawInput)) {
    return {
      isValid: false,
      errors: ['Input payload must be a JSON object.'],
      sanitizedInput: {},
    };
  }

  const input = sanitizeObjectKeys(rawInput) as Record<string, unknown>;

  switch (toolId) {
    case 'load-calculator':
    case 'solar-appliance-load': {
      const items = input.items;
      if (items !== undefined) {
        if (!Array.isArray(items)) {
          errors.push('items must be an array of appliance objects.');
        } else if (items.length > 200) {
          errors.push('items array exceeds maximum allowed limit (200 appliances).');
        } else {
          items.forEach((item: unknown, idx: number) => {
            if (typeof item !== 'object' || item === null) {
              errors.push(`Item ${idx + 1} must be an object.`);
              return;
            }
            const rec = item as Record<string, unknown>;
            validateStringField(rec.name, `Item ${idx + 1} name`, 100, errors, false);
            validateNumberField(rec.powerWatts, `Item ${idx + 1} powerWatts`, 0.1, 500000, errors, true);
            validateNumberField(rec.quantity, `Item ${idx + 1} quantity`, 1, 1000, errors, true);
            validateNumberField(rec.hoursPerDay, `Item ${idx + 1} hoursPerDay`, 0, 24, errors, true);
            validateNumberField(rec.surgeMultiplier, `Item ${idx + 1} surgeMultiplier`, 1.0, 10.0, errors, false);
            validateNumberField(rec.powerFactor, `Item ${idx + 1} powerFactor`, 0.1, 1.0, errors, false);
            validateNumberField(rec.dutyCycle, `Item ${idx + 1} dutyCycle`, 0.01, 1.0, errors, false);
            validateNumberField(rec.daysPerWeek, `Item ${idx + 1} daysPerWeek`, 1, 7, errors, false);
          });
        }
      }
      validateNumberField(input.surgeFactor, 'surgeFactor', 1.0, 5.0, errors, false);
      validateStringField(input.rawSearchQuery, 'rawSearchQuery', 200, errors, false);
      break;
    }

    case 'battery-capacity': {
      validateNumberField(input.dailyEnergyKwh, 'dailyEnergyKwh', 0.01, 100000, errors, false);
      validateNumberField(input.daysOfAutonomy, 'daysOfAutonomy', 0.1, 10.0, errors, false);
      validateNumberField(input.systemVoltage, 'systemVoltage', 12, 1000, errors, false);
      validateNumberField(input.depthOfDischargePercent, 'depthOfDischargePercent', 1, 100, errors, false);
      validateNumberField(input.inverterEfficiencyPercent, 'inverterEfficiencyPercent', 50, 100, errors, false);
      validateStringField(input.chemistry, 'chemistry', 50, errors, false, ['LITHIUM_LIFEPO4', 'TUBULAR_GEL', 'AGM']);
      break;
    }

    case 'inverter-sizing': {
      validateNumberField(input.continuousLoadWatts, 'continuousLoadWatts', 1, 1000000, errors, false);
      validateNumberField(input.peakSurgeWatts, 'peakSurgeWatts', 1, 5000000, errors, false);
      validateNumberField(input.powerFactor, 'powerFactor', 0.1, 1.0, errors, false);
      validateNumberField(input.growthMargin, 'growthMargin', 0, 200, errors, false);
      validateStringField(input.phaseType, 'phaseType', 30, errors, false, ['single-phase', 'three-phase']);
      break;
    }

    case 'solar-panel-sizing': {
      validateNumberField(input.dailyEnergyDemandKwh, 'dailyEnergyDemandKwh', 0.01, 100000, errors, false);
      validateNumberField(input.peakSunHours, 'peakSunHours', 1.0, 12.0, errors, false);
      validateNumberField(input.panelWattage, 'panelWattage', 50, 1000, errors, false);
      validateNumberField(input.systemLossFactor, 'systemLossFactor', 0.01, 0.60, errors, false);
      validateNumberField(input.designMargin, 'designMargin', 1.0, 3.0, errors, false);
      validateStringField(input.location, 'location', 100, errors, false);
      break;
    }

    case 'solar-system-sizing': {
      validateNumberField(input.dailyKwhInput, 'dailyKwhInput', 0.01, 100000, errors, false);
      validateNumberField(input.monthlyBillNaira, 'monthlyBillNaira', 100, 1000000000, errors, false);
      validateNumberField(input.daysOfAutonomy, 'daysOfAutonomy', 0.1, 10.0, errors, false);
      validateNumberField(input.selectedPanelWattage, 'selectedPanelWattage', 50, 1000, errors, false);
      validateNumberField(input.gridAvailabilityHours, 'gridAvailabilityHours', 0, 24, errors, false);
      validateStringField(input.location, 'location', 100, errors, false);
      validateStringField(input.phaseType, 'phaseType', 30, errors, false, ['single-phase', 'three-phase']);
      validateStringField(input.selectedBatteryType, 'selectedBatteryType', 50, errors, false, ['lithium_lifepo4', 'gel_lead_acid']);
      break;
    }

    case 'cable-sizing': {
      validateNumberField(input.circuitCurrentAmp ?? input.currentAmps, 'circuitCurrentAmp', 0.1, 5000, errors, false);
      validateNumberField(input.systemVoltage, 'systemVoltage', 1, 2000, errors, false);
      validateNumberField(input.cableLengthMeters, 'cableLengthMeters', 0.1, 5000, errors, false);
      validateNumberField(input.ambientTempC, 'ambientTempC', -20, 80, errors, false);
      validateNumberField(input.maxVoltageDropPercent, 'maxVoltageDropPercent', 0.1, 20.0, errors, false);
      validateStringField(input.conductorMaterial, 'conductorMaterial', 30, errors, false, ['copper', 'aluminum', 'COPPER', 'ALUMINUM']);
      validateStringField(input.circuitType, 'circuitType', 50, errors, false, ['DC_STRING', 'DC_BATTERY', 'AC_SINGLE_PHASE', 'AC_THREE_PHASE']);
      break;
    }

    case 'pv-configuration': {
      validateNumberField(input.totalModulesCount, 'totalModulesCount', 1, 100000, errors, false);
      validateNumberField(input.modulesPerString, 'modulesPerString', 1, 1000, errors, false);
      validateNumberField(input.parallelStringsCount, 'parallelStringsCount', 1, 1000, errors, false);
      validateNumberField(input.systemCapacityKwp, 'systemCapacityKwp', 0.1, 100000, errors, false);
      validateNumberField(input.tempMinC, 'tempMinC', -40, 50, errors, false);
      validateNumberField(input.tempMaxC, 'tempMaxC', 20, 100, errors, false);
      break;
    }

    case 'energy-yield': {
      validateNumberField(input.systemCapacityKwp, 'systemCapacityKwp', 0.01, 100000, errors, false);
      validateNumberField(input.locationPeakSunHours, 'locationPeakSunHours', 1.0, 12.0, errors, false);
      validateNumberField(input.systemLossFactor, 'systemLossFactor', 0.01, 0.60, errors, false);
      validateNumberField(input.performanceRatio, 'performanceRatio', 0.1, 100, errors, false);
      validateStringField(input.location, 'location', 100, errors, false);
      break;
    }

    case 'solar-savings': {
      validateNumberField(input.dailySolarGenKwh, 'dailySolarGenKwh', 0.01, 100000, errors, false);
      validateNumberField(input.solarSystemCapacityKwp, 'solarSystemCapacityKwp', 0.01, 100000, errors, false);
      validateNumberField(input.gridTariffNairaPerKwh, 'gridTariffNairaPerKwh', 1, 5000, errors, false);
      validateNumberField(input.dieselPriceNairaPerLiter, 'dieselPriceNairaPerLiter', 10, 20000, errors, false);
      validateNumberField(input.monthlyGridBillNaira ?? input.currentMonthlyGridBillNaira, 'monthlyGridBillNaira', 100, 1000000000, errors, false);
      validateNumberField(input.monthlyDieselFuelExpenseNaira ?? input.currentMonthlyDieselBillNaira, 'monthlyDieselFuelExpenseNaira', 100, 1000000000, errors, false);
      validateNumberField(input.tariffEscalationPercent, 'tariffEscalationPercent', 0, 100, errors, false);
      break;
    }

    case 'roi-calculator': {
      validateNumberField(input.systemCapexNaira ?? input.systemCostNaira, 'systemCapexNaira', 100, 100000000000, errors, false);
      validateNumberField(input.annualSavingsNaira, 'annualSavingsNaira', 100, 100000000000, errors, false);
      validateNumberField(input.annualOpexNaira ?? input.annualMaintenanceCostNaira, 'annualOpexNaira', 0, 10000000000, errors, false);
      validateNumberField(input.discountRatePercent, 'discountRatePercent', 0.1, 100, errors, false);
      validateNumberField(input.systemLifetimeYears, 'systemLifetimeYears', 1, 50, errors, false);
      validateNumberField(input.annualDegradationPercent, 'annualDegradationPercent', 0, 20, errors, false);
      break;
    }

    default:
      errors.push(`Unrecognized toolId: "${toolId}".`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedInput: input,
  };
}
