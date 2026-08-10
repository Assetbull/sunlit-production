import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope } from '../core/envelope';
import { validateCable } from '../core/validation';
import { CABLE_CATALOG } from '../catalog/equipmentCatalog';

export interface CableSizingInput {
  circuitCurrentAmp?: number;
  currentAmps?: number;
  systemVoltage: number;
  cableLengthMeters: number;
  circuitType?: 'DC_STRING' | 'DC_BATTERY' | 'AC_SINGLE_PHASE' | 'AC_THREE_PHASE';
  conductorMaterial?: 'copper' | 'aluminum' | 'COPPER' | 'ALUMINUM';
  ambientTempC?: number;
  maxVoltageDropPercent?: number;
  installationMethod?: string; // Alias for backward compatibility
}

export function calculateCableSizing(input: CableSizingInput): SharedCalculationResult {
  const currentAmp = input.circuitCurrentAmp ?? input.currentAmps ?? 0;
  const errors: string[] = [];
  if (!currentAmp || currentAmp <= 0) errors.push('Circuit current (Amps) must be specified and > 0.');
  if (!input.systemVoltage || input.systemVoltage <= 0) errors.push('System voltage (Volts) must be specified and > 0.');
  if (!input.cableLengthMeters || input.cableLengthMeters <= 0) errors.push('One-way cable length (meters) must be specified and > 0.');

  if (errors.length > 0) {
    return {
      toolId: 'cable-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing or invalid electrical circuit inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Review circuit current, voltage, and length.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const circuitType = input.circuitType ?? 'DC_BATTERY';
  const rawMaterial = (input.conductorMaterial ?? 'copper').toLowerCase();
  const material = rawMaterial === 'aluminum' ? 'aluminum' : 'copper';
  const ambientTemp = input.ambientTempC ?? 35;
  const isAc = circuitType.startsWith('AC');
  const maxVoltageDropPct = input.maxVoltageDropPercent ?? (isAc ? 2.5 : 1.5);

  const tempDerating = Number(Math.sqrt((70 - Math.min(ambientTemp, 60)) / 40).toFixed(2));
  const effectiveDesignCurrent = Number((currentAmp / tempDerating).toFixed(1));

  let recommendedCable = CABLE_CATALOG[0];
  let calculatedVdVolts = 0;
  let calculatedVdPercent = 0;

  for (const cable of CABLE_CATALOG) {
    if (cable.conductorMaterial !== material) continue;

    const ampacity = isAc ? cable.acAmpacityA : cable.dcAmpacityA;
    if (ampacity < effectiveDesignCurrent) continue;

    const loopLengthMultiplier = circuitType === 'AC_THREE_PHASE' ? Math.sqrt(3) : 2.0;
    const rLoop = (loopLengthMultiplier * input.cableLengthMeters * cable.resistanceOhmPerKm) / 1000.0;

    calculatedVdVolts = currentAmp * rLoop;
    calculatedVdPercent = (calculatedVdVolts / input.systemVoltage) * 100.0;

    recommendedCable = cable;
    if (calculatedVdPercent <= maxVoltageDropPct) {
      break;
    }
  }

  const powerLossWatts = Number((Math.pow(currentAmp, 2) * ((2 * input.cableLengthMeters * recommendedCable.resistanceOhmPerKm) / 1000)).toFixed(1));

  const validationGates = validateCable({
    circuitCurrentAmp: currentAmp,
    cableAmpacityAmp: (isAc ? recommendedCable.acAmpacityA : recommendedCable.dcAmpacityA) * tempDerating,
    calculatedVoltageDropPercent: calculatedVdPercent,
    maxAllowableVoltageDropPercent: maxVoltageDropPct,
  });

  const isValid = validationGates.every((g) => g.status === 'PASS');

  const engineeringResults = {
    circuitCurrentAmp: currentAmp,
    systemVoltageV: input.systemVoltage,
    cableLengthMeters: input.cableLengthMeters,
    circuitType,
    conductorMaterial: material,
    ambientTempC: ambientTemp,
    thermalDeratingFactor: tempDerating,
    effectiveDesignCurrentAmp: effectiveDesignCurrent,
    recommendedCableCrossSectionMm2: recommendedCable.crossSectionMm2,
    ratedAmpacityAmp: isAc ? recommendedCable.acAmpacityA : recommendedCable.dcAmpacityA,
    deratedAmpacityAmp: Number(((isAc ? recommendedCable.acAmpacityA : recommendedCable.dcAmpacityA) * tempDerating).toFixed(1)),
    calculatedVoltageDropV: Number(calculatedVdVolts.toFixed(2)),
    calculatedVoltageDropPercent: Number(calculatedVdPercent.toFixed(2)),
    maxAllowableVoltageDropPercent: maxVoltageDropPct,
    powerLossWatts,
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'cable-sizing',
    status: isValid ? 'ENGINEERING_VALIDATED' : 'DESIGN_REVIEW_REQUIRED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'IEC 60287 Cable Thermal Ampacity & Loop Resistance Voltage Drop Model',
      governingStandards: ['IEC 60364-5-52', 'BS 7671 18th Edition'],
      keyEquations: [
        'I_design = I_circuit / K_temperature',
        'V_drop = (Multiplier × L × R_km × I) / 1000',
        'V_drop_% = (V_drop / V_nominal) × 100',
      ],
      deratingFactorsApplied: {
        temperatureDerating: tempDerating,
        maxVoltageDropPercent: maxVoltageDropPct,
      },
    },
    validationGates,
    inputsUsed: input as any,
  });

  return {
    toolId: 'cable-sizing',
    calculation_status: isValid ? 'SUCCESS' : 'VALIDATION_ERROR',
    confidence: isValid ? 'HIGH' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: isValid ? 'Cable cross-section engineered for thermal ampacity and voltage drop limits.' : 'Selected cable size exceeds voltage drop or ampacity threshold.',
    engineering_results: engineeringResults,
    recommended_configuration: {
      recommendedCableSizeMm2: recommendedCable.crossSectionMm2,
      equipmentList: [
        {
          id: recommendedCable.id,
          name: `${recommendedCable.crossSectionMm2} mm² ${material.toUpperCase()} Solar Cable`,
          category: 'cable',
          specifications: {
            crossSection: `${recommendedCable.crossSectionMm2} mm²`,
            material,
            ampacity: `${isAc ? recommendedCable.acAmpacityA : recommendedCable.dcAmpacityA} A`,
          },
          recommendedQuantity: input.cableLengthMeters * 2,
          reason: `Derated ampacity (${Number(((isAc ? recommendedCable.acAmpacityA : recommendedCable.dcAmpacityA) * tempDerating).toFixed(1))} A) and voltage drop (${Number(calculatedVdPercent.toFixed(2))}%) satisfy standards.`,
        },
      ],
    },
    warnings: validationGates.filter((g) => g.status === 'FAIL').map((g) => ({
      code: g.gateId.toUpperCase(),
      message: g.message,
      severity: 'critical' as const,
      suggestion: 'Increase cable cross-sectional area in mm².',
    })),
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      `Voltage drop is restricted to ${calculatedVdPercent.toFixed(2)}% (limit: ${maxVoltageDropPct}%).`,
      `Conductor thermal derating applied for ${ambientTemp}°C ambient operating temperature.`
    ],
    engine_version: '2.0.0',
    validation_status: { isValid, errors: validationGates.filter((g) => g.status === 'FAIL').map((g) => g.message) },
  };
}
