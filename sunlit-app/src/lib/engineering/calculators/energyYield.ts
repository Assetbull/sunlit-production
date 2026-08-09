import { SharedCalculationResult } from '../types';

// Nigerian location PSH data (annual average peak sun hours)
export const NIGERIA_PSH_DATA: Record<string, number> = {
  'Lagos': 4.8,
  'Abuja': 5.2,
  'Kano': 6.0,
  'Port Harcourt': 4.5,
  'Ibadan': 4.9,
  'Enugu': 4.7,
  'Benin City': 4.6,
  'Kaduna': 5.4,
  'Jos': 5.6,
  'Maiduguri': 6.2,
};

// Orientation adjustment factors (relative to true south)
const ORIENTATION_FACTOR: Record<string, number> = {
  'SOUTH': 1.00,
  'SOUTH_WEST': 0.97,
  'SOUTH_EAST': 0.97,
  'EAST_WEST': 0.88, // split array — each side captures ~88%
  'NORTH': 0.72,     // worst case in northern hemisphere
  'FLAT': 0.95,      // flat roof with minimal tilt
};

// Tilt angle correction factor for Nigeria (~6° North latitude)
// Optimal tilt ≈ 6–15°. Below optimal or too steep reduces yield.
function getTiltFactor(tiltDeg: number): number {
  // Simplified correction relative to 10° optimal for Nigeria
  const optimal = 10;
  const delta = Math.abs(tiltDeg - optimal);
  if (delta <= 5) return 1.00;
  if (delta <= 15) return 0.98;
  if (delta <= 25) return 0.95;
  if (delta <= 35) return 0.91;
  return 0.86;
}

export interface EnergyYieldInput {
  systemCapacityKwp: number;
  locationPeakSunHours?: number; // e.g. 4.8
  location?: string;             // e.g. 'Lagos'
  performanceRatio?: number;     // PR e.g. 0.78 (78% system efficiency) — must be 0–1
  tiltDeg?: number;              // e.g. 15 degrees
  azimuthDeg?: number;           // e.g. 180 = true south (degrees from north, clockwise)
  orientation?: string;          // e.g. 'SOUTH' | 'SOUTH_WEST' | 'EAST_WEST'
  annualDegradationRate?: number; // e.g. 0.005 = 0.5%/year
}

export function calculateEnergyYield(input: EnergyYieldInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.systemCapacityKwp) || input.systemCapacityKwp <= 0) {
    errors.push('System capacity (kWp) must be a positive number.');
  }

  const pr = input.performanceRatio ?? 0.78;
  if (!Number.isFinite(pr) || pr <= 0 || pr > 1) {
    errors.push('Performance Ratio must be between 0.01 and 1.0 (e.g. 0.78 for 78%).');
  }

  const psh = input.locationPeakSunHours ?? (input.location ? NIGERIA_PSH_DATA[input.location] ?? 4.8 : 4.8);
  if (!Number.isFinite(psh) || psh <= 0 || psh > 12) {
    errors.push('Peak Sun Hours must be between 0.1 and 12 hours/day.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'energy-yield',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid system capacity or performance parameters.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Apply orientation and tilt correction factors
  const orientationKey = input.orientation ?? 'SOUTH';
  const orientationFactor = ORIENTATION_FACTOR[orientationKey] ?? 1.0;
  const tiltFactor = getTiltFactor(input.tiltDeg ?? 15);
  const effectivePsh = psh * orientationFactor * tiltFactor;

  // Daily yield = Capacity (kWp) × Effective PSH × Performance Ratio
  const dailyYieldKwh = input.systemCapacityKwp * effectivePsh * pr;
  const monthlyYieldKwh = dailyYieldKwh * 30.4167; // average days per month
  const annualYieldKwh = dailyYieldKwh * 365;

  if (!Number.isFinite(dailyYieldKwh)) {
    return {
      toolId: 'energy-yield',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Calculation produced a non-finite result. Review all input parameters.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: yield calculation produced an invalid number.'] },
    };
  }

  // 25-Year degradation yield simulation (default 0.5%/year)
  const degradationRate = input.annualDegradationRate ?? 0.005;
  let lifetimeKwh = 0;
  for (let year = 1; year <= 25; year++) {
    const yearDegradationFactor = Math.pow(1 - degradationRate, year - 1);
    lifetimeKwh += annualYieldKwh * yearDegradationFactor;
  }

  const specificYield = Math.round(annualYieldKwh / input.systemCapacityKwp);

  const warnings = [];
  if (pr < 0.70) {
    warnings.push({
      code: 'LOW_PERFORMANCE_RATIO',
      message: `Performance Ratio of ${Math.round(pr * 100)}% is below the 70% threshold. High ambient temperatures or significant losses are reducing system output.`,
      severity: 'warning' as const,
      suggestion: 'Improve panel ventilation, reduce cable resistance losses, and verify inverter efficiency. Consider micro-inverters.',
    });
  }
  if (orientationKey === 'NORTH') {
    warnings.push({
      code: 'SUBOPTIMAL_ORIENTATION',
      message: 'North-facing array in West Africa produces approximately 28% less energy than south-facing.',
      severity: 'warning' as const,
      suggestion: 'Reorient panels towards south or southwest for optimal annual energy yield.',
    });
  }
  if (specificYield < 1200) {
    warnings.push({
      code: 'LOW_SPECIFIC_YIELD',
      message: `Specific yield of ${specificYield} kWh/kWp/year is below the West Africa baseline of 1,200 kWh/kWp/year.`,
      severity: 'info' as const,
      suggestion: 'Verify peak sun hours data for the installation location and review performance ratio assumptions.',
    });
  }

  return {
    toolId: 'energy-yield',
    calculation_status: 'SUCCESS',
    confidence: pr >= 0.70 ? 'HIGH' : 'MODERATE',
    confidenceReasoning: 'Simulated using standard PV performance ratio (PR) model with 25-year panel degradation schedule and location-adjusted PSH.',
    engineering_results: {
      systemCapacityKwp: input.systemCapacityKwp,
      peakSunHours: Number(psh.toFixed(2)),
      effectivePeakSunHours: Number(effectivePsh.toFixed(2)),
      performanceRatio: pr,
      orientationFactor: Number(orientationFactor.toFixed(3)),
      tiltFactor: Number(tiltFactor.toFixed(3)),
      // Primary output fields — correctly named
      estimatedDailyYieldKwh: Number(dailyYieldKwh.toFixed(2)),
      estimatedMonthlyYieldKwh: Math.round(monthlyYieldKwh),
      estimatedAnnualYieldKwh: Math.round(annualYieldKwh),
      estimated25YearLifetimeKwh: Math.round(lifetimeKwh),
      estimated25YearLifetimeMwh: Number((lifetimeKwh / 1000).toFixed(1)),
      specificYieldKwhPerKwp: specificYield,
      // Aliases for legacy frontend references
      estimatedDailyKwh: Number(dailyYieldKwh.toFixed(2)),
      estimatedAnnualKwh: Math.round(annualYieldKwh),
      lifetime25YearKwh: Math.round(lifetimeKwh),
      lifetime25YearMwh: Number((lifetimeKwh / 1000).toFixed(1)),
    },
    recommended_configuration: {
      systemCapacityKw: input.systemCapacityKwp,
    },
    warnings,
    assumptions: {
      performanceRatio: `${Math.round(pr * 100)}%`,
      panelAnnualDegradation: `${(degradationRate * 100).toFixed(1)}% per year`,
      orientationFactor: `${Math.round(orientationFactor * 100)}% of peak (${orientationKey})`,
      tiltFactor: `${Math.round(tiltFactor * 100)}% of peak (${input.tiltDeg ?? 15}° tilt)`,
      daysInYear: 365,
    },
    supporting_notes: [
      `Daily yield: ${Number(dailyYieldKwh.toFixed(2))} kWh from ${input.systemCapacityKwp} kWp array at ${Number(effectivePsh.toFixed(2))} effective PSH.`,
      `Specific yield: ${specificYield} kWh/kWp/year — benchmark for ${input.location ?? 'Nigeria'} region.`,
      `25-year lifetime output: ${Number((lifetimeKwh / 1000).toFixed(1))} MWh accounting for ${(degradationRate * 100).toFixed(1)}%/year panel degradation.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
