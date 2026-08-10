import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope } from '../core/envelope';
import { validateInverterCapacity } from '../core/validation';
import { INVERTER_CATALOG } from '../catalog/equipmentCatalog';

export interface InverterSizingInput {
  continuousLoadWatts: number;
  peakSurgeWatts?: number;
  surgeLoadWatts?: number;
  growthMargin?: number;
  inverterType?: string; // Alias for backward compatibility
  surgeDurationSec?: number;
  powerFactor?: number;
  systemVoltageDc?: number;
  systemVoltage?: number; // Alias for UI modal compatibility
  phaseType?: 'single-phase' | 'three-phase';
  selectedInverterId?: string;
  pvArrayKwp?: number;
}

export function calculateInverterSizing(input: InverterSizingInput): SharedCalculationResult {
  const errors: string[] = [];
  if (!input.continuousLoadWatts || input.continuousLoadWatts <= 0) {
    errors.push('Continuous load (Watts) must be specified and > 0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'inverter-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing or invalid continuous load wattage.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Enter active continuous load in Watts.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const pf = input.powerFactor ?? 0.85;
  const surgeWatts = input.peakSurgeWatts ?? input.surgeLoadWatts ?? Math.round(input.continuousLoadWatts * 2.0);
  const continuousKva = input.continuousLoadWatts / 1000 / pf;
  const surgeKva = surgeWatts / 1000 / pf;
  const phase = input.phaseType ?? 'single-phase';

  const marginMult = 1.0 + (input.growthMargin ? input.growthMargin / 100 : 0.25);
  const minRequiredKva = Number((continuousKva * marginMult).toFixed(2));

  let catInverter = INVERTER_CATALOG.find((inv) => inv.id === input.selectedInverterId);
  if (!catInverter) {
    catInverter = INVERTER_CATALOG.find(
      (inv) => inv.ratedKva >= minRequiredKva && inv.surgeKva >= surgeKva && inv.phaseType === phase
    ) ?? INVERTER_CATALOG[INVERTER_CATALOG.length - 1];
  }

  const validationGates = validateInverterCapacity({
    continuousLoadWatts: input.continuousLoadWatts,
    peakSurgeWatts: surgeWatts,
    inverterRatingKva: catInverter.ratedKva,
    inverterSurgeCapacityKva: catInverter.surgeKva,
    powerFactor: pf,
  });

  const isValid = validationGates.every((g) => g.status === 'PASS');

  const engineeringResults = {
    continuousLoadWatts: input.continuousLoadWatts,
    peakSurgeWatts: surgeWatts,
    powerFactor: pf,
    continuousLoadKva: Number(continuousKva.toFixed(2)),
    surgeLoadKva: Number(surgeKva.toFixed(2)),
    minRequiredInverterKva: minRequiredKva,
    recommendedInverterKva: catInverter.ratedKva,
    recommendedInverterModel: `${catInverter.manufacturer} ${catInverter.model}`,
    surgeCapacityKva: catInverter.surgeKva,
    surgeDurationCapabilitySec: catInverter.surgeDurationSec,
    phaseType: catInverter.phaseType,
    maxPvInputPowerW: catInverter.maxPvPowerW,
    maxDcVoltageV: catInverter.maxDcVoltageV,
    mpptMinVoltageV: catInverter.mpptVoltageRangeV.min,
    mpptMaxVoltageV: catInverter.mpptVoltageRangeV.max,
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'inverter-sizing',
    status: isValid ? 'ENGINEERING_VALIDATED' : 'DESIGN_REVIEW_REQUIRED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'Deterministic Apparent Power & Inductive Surge Matching Engine',
      governingStandards: ['IEC 62109-1', 'IEEE 1547'],
      keyEquations: [
        'S_continuous_kVA = P_active_kW / PowerFactor',
        'S_surge_kVA = P_surge_kW / PowerFactor',
        'Headroom = (S_inverter - S_continuous) / S_continuous',
      ],
      deratingFactorsApplied: {
        powerFactor: pf,
        headroomMarginPercent: Math.round((marginMult - 1.0) * 100),
      },
    },
    validationGates,
    inputsUsed: input as any,
  });

  return {
    toolId: 'inverter-sizing',
    calculation_status: isValid ? 'SUCCESS' : 'VALIDATION_ERROR',
    confidence: isValid ? 'HIGH' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: isValid
      ? 'Inverter continuous rating and surge capacity verified against electrical load profile.'
      : 'Selected inverter is insufficient for continuous or surge load requirements.',
    engineering_results: engineeringResults,
    recommended_configuration: {
      inverterRatingKva: catInverter.ratedKva,
      equipmentList: [
        {
          id: catInverter.id,
          name: `${catInverter.ratedKva} kVA ${catInverter.manufacturer} ${catInverter.model} Hybrid Inverter`,
          category: 'inverter',
          specifications: {
            rating: `${catInverter.ratedKva} kVA`,
            surge: `${catInverter.surgeKva} kVA (${catInverter.surgeDurationSec}s)`,
            maxPv: `${catInverter.maxPvPowerW} W`,
          },
          recommendedQuantity: 1,
          reason: 'Engineered to support continuous load and motor startup surges.',
        },
      ],
    },
    warnings: validationGates.filter((g) => g.status === 'FAIL').map((g) => ({
      code: g.gateId.toUpperCase(),
      message: g.message,
      severity: 'critical' as const,
      suggestion: 'Select a larger inverter model.',
    })),
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      'Inverter rating is sized strictly from apparent power (kVA) and surge currents, NOT daily kWh alone.',
      `Selected ${catInverter.model} supports up to ${catInverter.surgeKva} kVA motor startup surges.`
    ],
    engine_version: '2.0.0',
    validation_status: { isValid, errors: validationGates.filter((g) => g.status === 'FAIL').map((g) => g.message) },
  };
}
