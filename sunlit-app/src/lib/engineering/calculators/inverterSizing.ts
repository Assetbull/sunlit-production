import { SharedCalculationResult } from '../types';

export interface InverterInput {
  continuousLoadWatts: number;
  surgeLoadWatts?: number;
  powerFactor?: number; // e.g. 0.8 or 1.0
  growthMargin?: number; // e.g. 1.2 (20% safety margin)
  inverterType?: 'HYBRID' | 'OFF_GRID' | 'GRID_TIED';
}

export function calculateInverterSizing(input: InverterInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.continuousLoadWatts <= 0) errors.push('Continuous load (Watts) must be greater than 0.');

  const pf = input.powerFactor ?? 0.8;
  const margin = input.growthMargin ?? 1.25; // 25% reserve capacity
  const type = input.inverterType ?? 'HYBRID';

  if (errors.length > 0) {
    return {
      toolId: 'inverter-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to missing continuous load value.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Active power (kW) -> Apparent power (kVA)
  const minActiveWatts = input.continuousLoadWatts * margin;
  const minApparentKva = minActiveWatts / (1000 * pf);

  const surgeWatts = input.surgeLoadWatts ?? input.continuousLoadWatts * 2;
  const minSurgeKva = surgeWatts / (1000 * pf);

  // Standard inverter ratings in kVA: 1.5, 3.5, 5, 8, 10, 12, 15, 20, 30, 50
  const standardRatings = [1.5, 3.5, 5, 8, 10, 12, 15, 20, 30, 50, 100];
  const recommendedKva = standardRatings.find(r => r >= minApparentKva) ?? Math.ceil(minApparentKva);

  const recommendedDcVoltage = recommendedKva <= 3.5 ? 24 : recommendedKva <= 15 ? 48 : 192;

  return {
    toolId: 'inverter-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Inverter rated with continuous load factor, power factor derating, and motor surge buffer.',
    engineering_results: {
      continuousLoadWatts: input.continuousLoadWatts,
      surgeLoadWatts: surgeWatts,
      minimumInverterKva: Number(minApparentKva.toFixed(2)),
      recommendedInverterKva: recommendedKva,
      recommendedDcVoltage,
      inverterType: type,
    },
    recommended_configuration: {
      inverterRatingKva: recommendedKva,
      equipmentList: [
        {
          id: 'inv-mod-1',
          name: `${recommendedKva}kVA / ${recommendedKva * pf}kW ${type === 'HYBRID' ? 'Hybrid Solar' : 'Pure Sine Wave'} Inverter`,
          category: 'inverter',
          specifications: {
            ratingKva: recommendedKva,
            dcVoltage: `${recommendedDcVoltage}V DC`,
            powerFactor: pf,
            surgeRating: `${recommendedKva * 2}kVA for 5s`,
          },
          recommendedQuantity: 1,
          reason: `Provides continuous ${recommendedKva * pf}kW output capacity with ${margin * 100 - 100}% safety margin.`,
        },
      ],
    },
    warnings: minSurgeKva > recommendedKva * 2 ? [{
      code: 'HIGH_SURGE_DEMAND',
      message: 'Surge demand exceeds 2x inverter rating. High motor loads may trip inverter.',
      severity: 'warning',
      suggestion: 'Select a heavy-duty low-frequency inverter or increase inverter rating by one tier.'
    }] : [],
    assumptions: {
      powerFactor: pf,
      growthMargin: `${margin * 100 - 100}% reserve`,
    },
    supporting_notes: [
      `Sized at power factor ${pf} for inductive loads (pumps, compressors, motors).`,
      `DC battery bus recommended at ${recommendedDcVoltage}V for efficiency.`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
