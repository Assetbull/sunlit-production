import { SharedCalculationResult } from '../types';

export type ApplianceCategory =
  | 'Cooling'
  | 'Lighting'
  | 'HVAC'
  | 'Utilities'
  | 'Entertainment'
  | 'Computing'
  | 'Kitchen'
  | 'General';

export interface LoadItem {
  name: string;
  powerWatts: number;
  quantity: number;
  hoursPerDay: number;
  category?: ApplianceCategory;
  isCritical?: boolean;
  surgeMultiplier?: number;
  daysPerWeek?: number;
}

export interface LoadInput {
  items: LoadItem[];
  surgeFactor?: number; // global surge multiplier fallback (e.g. 1.25)
  userType?: string;
  profileTitle?: string;
}

export function calculateLoad(input: LoadInput): SharedCalculationResult {
  const errors: string[] = [];
  if (!input.items || input.items.length === 0) {
    errors.push('At least one appliance or electrical load item must be specified.');
  }

  let totalConnectedWatts = 0;
  let totalPeakSurgeWatts = 0;
  let totalDailyWh = 0;
  let criticalWatts = 0;
  let criticalDailyWh = 0;

  const categoryTotals: Record<string, { watts: number; dailyKwh: number; itemCount: number }> = {};

  input.items?.forEach((item, idx) => {
    if (item.powerWatts <= 0) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) power must be > 0 Watts.`);
    if (item.quantity <= 0) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) quantity must be >= 1.`);
    if (item.hoursPerDay < 0 || item.hoursPerDay > 24) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) operating hours must be 0–24 hours/day.`);

    const daysMultiplier = (item.daysPerWeek ?? 7) / 7;
    const itemActiveWatts = item.powerWatts * item.quantity;
    const itemSurgeMult = item.surgeMultiplier ?? (item.category === 'HVAC' || item.category === 'Cooling' || item.category === 'Utilities' ? 3.0 : 1.2);
    const itemSurgeWatts = Math.round(itemActiveWatts * itemSurgeMult);
    const itemDailyWh = itemActiveWatts * item.hoursPerDay * daysMultiplier;

    totalConnectedWatts += itemActiveWatts;
    totalPeakSurgeWatts += itemSurgeWatts;
    totalDailyWh += itemDailyWh;

    if (item.isCritical) {
      criticalWatts += itemActiveWatts;
      criticalDailyWh += itemDailyWh;
    }

    const cat = item.category || 'General';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { watts: 0, dailyKwh: 0, itemCount: 0 };
    }
    categoryTotals[cat].watts += itemActiveWatts;
    categoryTotals[cat].dailyKwh += Number((itemDailyWh / 1000).toFixed(2));
    categoryTotals[cat].itemCount += item.quantity;
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
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const globalSurgeMult = input.surgeFactor ?? 1.25;
  const peakDemandKw = Number((Math.max(totalConnectedWatts * globalSurgeMult, totalPeakSurgeWatts) / 1000).toFixed(2));
  const dailyEnergyKwh = Number((totalDailyWh / 1000).toFixed(2));
  const monthlyEnergyKwh = Number((dailyEnergyKwh * 30).toFixed(2));
  const criticalDailyKwh = Number((criticalDailyWh / 1000).toFixed(2));

  let confidence: 'HIGH' | 'MODERATE' | 'REVIEW_RECOMMENDED' = 'HIGH';
  if (dailyEnergyKwh > 100) confidence = 'MODERATE';
  if (dailyEnergyKwh > 500) confidence = 'REVIEW_RECOMMENDED';

  return {
    toolId: 'load-calculator',
    calculation_status: 'SUCCESS',
    confidence,
    confidenceReasoning: 'Load calculated directly from detailed appliance inventory with motor surge multipliers and daily operational profiles.',
    engineering_results: {
      totalConnectedWatts: Math.round(totalConnectedWatts),
      totalConnectedKw: Number((totalConnectedWatts / 1000).toFixed(2)),
      peakDemandKw,
      peakSurgeWatts: totalPeakSurgeWatts,
      dailyEnergyDemandKwh: dailyEnergyKwh,
      monthlyEnergyDemandKwh: monthlyEnergyKwh,
      criticalLoadWatts: criticalWatts,
      criticalDailyKwh,
      itemCount: input.items.length,
      categoryTotals,
      profileTitle: input.profileTitle ?? 'Standard Appliance Load Profile',
    },
    recommended_configuration: {
      systemCapacityKw: Number((peakDemandKw * 1.1).toFixed(2)),
      inverterRatingKva: Math.ceil(peakDemandKw * 1.25),
      batteryCapacityKwh: Number((dailyEnergyKwh * 1.2).toFixed(1)),
    },
    warnings: dailyEnergyKwh > 80 ? [{
      code: 'HIGH_LOAD',
      message: 'High daily energy consumption (>80 kWh/day). Consider commercial three-phase design.',
      severity: 'warning' as const,
      suggestion: 'Perform a detailed professional energy audit before equipment procurement.'
    }] : [],
    assumptions: {
      surgeMultiplier: globalSurgeMult,
      daysPerMonth: 30,
      bandATariffNairaPerKwh: 225,
    },
    supporting_notes: [
      'Total daily energy consumption is the baseline requirement for battery autonomy calculations.',
      'Peak surge demand includes a safety margin for inductive motor startup currents (e.g. AC compressors, pumps).'
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
