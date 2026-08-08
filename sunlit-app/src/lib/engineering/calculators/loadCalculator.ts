import { SharedCalculationResult } from '../types';

export interface LoadItem {
  name: string;
  powerWatts: number;
  quantity: number;
  hoursPerDay: number;
}

export interface LoadInput {
  items: LoadItem[];
  surgeFactor?: number; // e.g. 1.25
}

export function calculateLoad(input: LoadInput): SharedCalculationResult {
  const errors: string[] = [];
  if (!input.items || input.items.length === 0) {
    errors.push('At least one appliance or electrical load item must be specified.');
  }

  let totalConnectedWatts = 0;
  let totalDailyKwh = 0;

  input.items?.forEach((item, idx) => {
    if (item.powerWatts <= 0) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) power must be > 0 Watts.`);
    if (item.quantity <= 0) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) quantity must be >= 1.`);
    if (item.hoursPerDay < 0 || item.hoursPerDay > 24) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) operating hours must be 0–24 hours/day.`);

    const watts = item.powerWatts * item.quantity;
    totalConnectedWatts += watts;
    totalDailyKwh += (watts * item.hoursPerDay) / 1000;
  });

  if (errors.length > 0) {
    return {
      toolId: 'load-calculator',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid or missing appliance inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const surgeMultiplier = input.surgeFactor ?? 1.25;
  const peakDemandKw = (totalConnectedWatts * surgeMultiplier) / 1000;

  let confidence: 'HIGH' | 'MODERATE' | 'REVIEW_RECOMMENDED' = 'HIGH';
  if (totalDailyKwh > 100) confidence = 'MODERATE';
  if (totalDailyKwh > 500) confidence = 'REVIEW_RECOMMENDED';

  return {
    toolId: 'load-calculator',
    calculation_status: 'SUCCESS',
    confidence,
    confidenceReasoning: 'Load calculated directly from detailed appliance inventory with surge multiplier.',
    engineering_results: {
      totalConnectedWatts: Math.round(totalConnectedWatts),
      peakDemandKw: Number(peakDemandKw.toFixed(2)),
      dailyEnergyDemandKwh: Number(totalDailyKwh.toFixed(2)),
      monthlyEnergyDemandKwh: Number((totalDailyKwh * 30).toFixed(2)),
      itemCount: input.items.length,
    },
    recommended_configuration: {
      systemCapacityKw: Number((peakDemandKw * 1.1).toFixed(2)),
    },
    warnings: totalDailyKwh > 80 ? [{
      code: 'HIGH_LOAD',
      message: 'High daily energy consumption (>80 kWh/day). Consider commercial three-phase design.',
      severity: 'warning',
      suggestion: 'Perform a detailed professional energy audit before equipment procurement.'
    }] : [],
    assumptions: {
      surgeMultiplier,
      daysPerMonth: 30,
    },
    supporting_notes: [
      'Total daily energy consumption is the baseline requirement for battery autonomy calculations.',
      'Peak surge demand includes a safety margin for inductive motor startup currents (e.g. AC compressors, pumps).'
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
