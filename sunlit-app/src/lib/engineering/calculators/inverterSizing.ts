import { SharedCalculationResult } from '../types';

export interface InverterInput {
  continuousLoadWatts: number;
  surgeLoadWatts?: number;
  powerFactor?: number; // 0.1–1.0
  growthMargin?: number; // e.g. 1.25 (25% safety margin)
  inverterType?: 'HYBRID' | 'OFF_GRID' | 'GRID_TIED';
  systemVoltage?: 24 | 48 | 96 | 192;
}

export function calculateInverterSizing(input: InverterInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.continuousLoadWatts) || input.continuousLoadWatts <= 0) {
    errors.push('Continuous load (Watts) must be a positive number.');
  }

  const pf = input.powerFactor ?? 0.8;
  if (!Number.isFinite(pf) || pf <= 0 || pf > 1) {
    errors.push('Power factor must be between 0.1 and 1.0.');
  }

  const margin = input.growthMargin ?? 1.25;
  if (!Number.isFinite(margin) || margin < 1.0 || margin > 3.0) {
    errors.push('Growth/safety margin must be between 1.0 and 3.0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'inverter-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed. Review continuous load and power factor values.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const type = input.inverterType ?? 'HYBRID';

  // Active power (W) → Apparent power (VA) → kVA
  const minActiveWatts = input.continuousLoadWatts * margin;
  const minApparentKva = minActiveWatts / (1000 * pf);

  const surgeWatts = input.surgeLoadWatts ?? input.continuousLoadWatts * 2.5;
  const minSurgeKva = surgeWatts / (1000 * pf);

  // Standard inverter ratings in kVA: IEC / industry standard sizes
  const standardRatings = [1.5, 3.0, 3.5, 5, 6, 8, 10, 12, 15, 20, 30, 50, 100];
  const recommendedKva = standardRatings.find(r => r >= minApparentKva) ?? Math.ceil(minApparentKva);

  if (!Number.isFinite(recommendedKva) || recommendedKva <= 0) {
    return {
      toolId: 'inverter-sizing',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Could not determine a standard inverter rating. Review load inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: invalid inverter kVA calculation result.'] },
    };
  }

  // Recommend DC bus voltage based on system size
  const recommendedDcVoltage: 24 | 48 | 96 | 192 =
    input.systemVoltage ??
    (recommendedKva <= 3 ? 24 : recommendedKva <= 15 ? 48 : recommendedKva <= 30 ? 96 : 192);

  const activeKw = Number((recommendedKva * pf).toFixed(2));
  const isSurgeHighRisk = minSurgeKva > recommendedKva * 2.5;

  // Engineering validation checks
  const continuousOk = minActiveWatts <= recommendedKva * 1000 * pf;
  const surgeOk = surgeWatts <= recommendedKva * 1000 * 3; // most inverters handle 3x surge for 5s

  const warnings = [];
  if (isSurgeHighRisk) {
    warnings.push({
      code: 'HIGH_SURGE_DEMAND',
      message: `Surge demand of ${Math.round(surgeWatts / 1000 * 10) / 10} kW exceeds 2.5× inverter rating. High motor/compressor loads may trip the inverter.`,
      severity: 'warning' as const,
      suggestion: 'Select a heavy-duty low-frequency (LF) transformer inverter rated for ≥3× surge, or increase inverter rating by one tier.',
    });
  }
  if (pf < 0.85) {
    warnings.push({
      code: 'LOW_POWER_FACTOR',
      message: `Power factor of ${pf} indicates significant inductive loads (motors, compressors, AC units). Inverter must be rated for this PF.`,
      severity: 'info' as const,
      suggestion: 'Ensure inverter datasheet specifies the output power factor and derated kW output at this power factor.',
    });
  }

  return {
    toolId: 'inverter-sizing',
    calculation_status: 'SUCCESS',
    confidence: continuousOk && !isSurgeHighRisk ? 'HIGH' : 'MODERATE',
    confidenceReasoning: `Inverter rated with ${Math.round((margin - 1) * 100)}% safety margin on continuous load, power factor derating, and motor surge buffer.`,
    engineering_results: {
      continuousLoadWatts: input.continuousLoadWatts,
      surgeLoadWatts: Math.round(surgeWatts),
      minimumContinuousKva: Number(minApparentKva.toFixed(2)),
      recommendedInverterKva: recommendedKva,
      recommendedActiveKw: activeKw,
      recommendedDcVoltage,
      inverterType: type,
      powerFactor: pf,
      safetyMargin: `${Math.round((margin - 1) * 100)}%`,
      // Engineering validation
      continuousCheck: continuousOk ? 'PASS' : 'FAIL',
      surgeCheck: surgeOk ? 'PASS' : 'WARNING',
    },
    recommended_configuration: {
      inverterRatingKva: recommendedKva,
      equipmentList: [
        {
          id: 'inv-mod-1',
          name: `${recommendedKva} kVA / ${activeKw} kW ${type === 'HYBRID' ? 'Hybrid Solar Inverter-Charger' : type === 'OFF_GRID' ? 'Off-Grid Pure Sine Wave Inverter' : 'Grid-Tied Solar Inverter'}`,
          category: 'inverter',
          specifications: {
            ratingKva: `${recommendedKva} kVA`,
            continuousOutputKw: `${activeKw} kW`,
            dcVoltage: `${recommendedDcVoltage}V DC`,
            powerFactor: pf,
            surgeRating: `${Math.round(recommendedKva * 3)} kVA for 5 seconds`,
            topology: type === 'HYBRID' ? 'Low Frequency Transformer' : 'High Frequency',
          },
          recommendedQuantity: 1,
          reason: `Provides ${activeKw} kW continuous output with ${Math.round((margin - 1) * 100)}% reserve headroom for load growth and future expansion.`,
        },
      ],
    },
    warnings,
    assumptions: {
      powerFactor: pf,
      safetyMargin: `${Math.round((margin - 1) * 100)}% reserve capacity`,
      surgeRatingBasis: `${Math.round(surgeWatts / 1000 * 10) / 10} kW surge load`,
    },
    supporting_notes: [
      `Sized at power factor ${pf} for inductive loads (pumps, compressors, air conditioners).`,
      `DC battery bus recommended at ${recommendedDcVoltage}V for optimal efficiency at this power level.`,
      `${recommendedKva} kVA rating provides ${Number(((recommendedKva * 1000 * pf - input.continuousLoadWatts) / input.continuousLoadWatts * 100).toFixed(0))}% headroom above stated continuous load.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
