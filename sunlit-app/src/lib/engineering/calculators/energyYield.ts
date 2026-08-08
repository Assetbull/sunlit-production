import { SharedCalculationResult } from '../types';

export interface EnergyYieldInput {
  systemCapacityKwp: number;
  locationPeakSunHours?: number; // e.g. 4.8
  performanceRatio?: number; // PR e.g. 0.78 (78% system efficiency)
  tiltDeg?: number; // e.g. 15 degrees
  azimuthDeg?: number; // e.g. 180 degrees (South)
}

export function calculateEnergyYield(input: EnergyYieldInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.systemCapacityKwp <= 0) errors.push('System capacity (kWp) must be greater than 0.');

  const psh = input.locationPeakSunHours ?? 4.8;
  const pr = input.performanceRatio ?? 0.78; // 78% PR standard for tropical climates

  if (errors.length > 0) {
    return {
      toolId: 'energy-yield',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid system capacity.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Daily yield = Capacity (kWp) * Peak Sun Hours * Performance Ratio
  const dailyKwh = input.systemCapacityKwp * psh * pr;
  const monthlyKwh = dailyKwh * 30.4;
  const annualKwh = dailyKwh * 365;

  // 25-Year degradation yield simulation (0.5% degradation per year)
  let lifetimeKwh = 0;
  for (let year = 1; year <= 25; year++) {
    const yearDegradationFactor = Math.pow(1 - 0.005, year - 1);
    lifetimeKwh += annualKwh * yearDegradationFactor;
  }

  return {
    toolId: 'energy-yield',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Simulated using standard PV performance ratio (PR) model and 25-year panel degradation rate.',
    engineering_results: {
      systemCapacityKwp: input.systemCapacityKwp,
      peakSunHours: psh,
      performanceRatio: pr,
      estimatedDailyYieldKwh: Number(dailyKwh.toFixed(2)),
      estimatedMonthlyYieldKwh: Number(monthlyKwh.toFixed(0)),
      estimatedAnnualYieldKwh: Number(annualKwh.toFixed(0)),
      estimated25YearLifetimeKwh: Number(lifetimeKwh.toFixed(0)),
      specificYieldKwhPerKwp: Number((annualKwh / input.systemCapacityKwp).toFixed(0)),
    },
    recommended_configuration: {
      systemCapacityKw: input.systemCapacityKwp,
    },
    warnings: pr < 0.70 ? [{
      code: 'LOW_PERFORMANCE_RATIO',
      message: 'Performance Ratio below 70%. High ambient temperatures or inverter clipping suspected.',
      severity: 'info',
      suggestion: 'Ensure adequate ventilation beneath solar panels.'
    }] : [],
    assumptions: {
      performanceRatio: `${pr * 100}%`,
      panelAnnualDegradation: '0.5% per year',
      daysInYear: 365,
    },
    supporting_notes: [
      `Specific yield: ${(annualKwh / input.systemCapacityKwp).toFixed(0)} kWh generated per installed kWp annually in West Africa region.`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
