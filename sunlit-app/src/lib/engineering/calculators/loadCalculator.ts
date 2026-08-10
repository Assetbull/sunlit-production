import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope, StandardizedEngineeringResponse } from '../core/envelope';
import { resolveApplianceInput } from '../catalog/applianceCatalog';

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
  powerFactor?: number;
  dutyCycle?: number;
}

export interface LoadInput {
  items: LoadItem[];
  surgeFactor?: number;
  userType?: string;
  profileTitle?: string;
  rawSearchQuery?: string; // Optional auto-recognition search string
}

export function calculateLoad(input: LoadInput): SharedCalculationResult {
  const errors: string[] = [];

  // Check auto-recognition if raw search query provided
  if (input.rawSearchQuery && (!input.items || input.items.length === 0)) {
    const res = resolveApplianceInput(input.rawSearchQuery);
    if (res.status === 'EXACT_MATCH' && res.exactMatch) {
      input.items = [
        {
          name: `${res.exactMatch.name} (${res.exactMatch.variant})`,
          powerWatts: res.exactMatch.ratedPowerW,
          quantity: 1,
          hoursPerDay: res.exactMatch.typicalHoursPerDay,
          surgeMultiplier: res.exactMatch.startupMultiplier,
          powerFactor: res.exactMatch.powerFactor,
          dutyCycle: res.exactMatch.dutyCycle,
        },
      ];
    } else if (res.status === 'AMBIGUOUS_MATCH') {
      errors.push(`Multiple appliance catalog matches found for "${input.rawSearchQuery}". Please select a specific variant.`);
    } else {
      errors.push(`Appliance "${input.rawSearchQuery}" not found in library. Please use + Add Custom Appliance.`);
    }
  }

  if (!input.items || input.items.length === 0) {
    if (errors.length === 0) {
      errors.push('At least one appliance or electrical load item must be specified.');
    }
  }

  let totalConnectedWatts = 0;
  let totalPeakSurgeWatts = 0;
  let totalDailyWh = 0;
  let criticalWatts = 0;
  let criticalDailyWh = 0;
  let weightedPfSum = 0;

  const categoryTotals: Record<string, { watts: number; dailyKwh: number; itemCount: number }> = {};

  input.items?.forEach((item, idx) => {
    if (item.powerWatts <= 0) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) power must be > 0 Watts.`);
    if (item.quantity <= 0) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) quantity must be >= 1.`);
    if (item.hoursPerDay < 0 || item.hoursPerDay > 24) errors.push(`Item ${idx + 1} (${item.name || 'Appliance'}) operating hours must be 0–24 hours/day.`);

    const daysMultiplier = (item.daysPerWeek ?? 7) / 7;
    const itemActiveWatts = item.powerWatts * item.quantity;
    const itemSurgeMult = item.surgeMultiplier ?? 1.5;
    const itemSurgeWatts = Math.round(itemActiveWatts * itemSurgeMult);
    const dutyCycle = item.dutyCycle ?? 1.0;
    const itemDailyWh = itemActiveWatts * item.hoursPerDay * daysMultiplier * dutyCycle;
    const pf = item.powerFactor ?? 0.85;

    totalConnectedWatts += itemActiveWatts;
    totalPeakSurgeWatts += itemSurgeWatts;
    totalDailyWh += itemDailyWh;
    weightedPfSum += itemActiveWatts * pf;

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
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Review appliance specs.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const avgPowerFactor = totalConnectedWatts > 0 ? Number((weightedPfSum / totalConnectedWatts).toFixed(2)) : 0.85;
  const globalSurgeMult = input.surgeFactor ?? 1.25;
  const peakDemandKw = Number((Math.max(totalConnectedWatts * globalSurgeMult, totalPeakSurgeWatts) / 1000).toFixed(2));
  const peakKva = Number((peakDemandKw / avgPowerFactor).toFixed(2));
  const dailyEnergyKwh = Number((totalDailyWh / 1000).toFixed(2));
  const monthlyEnergyKwh = Number((dailyEnergyKwh * 30).toFixed(2));
  const criticalDailyKwh = Number((criticalDailyWh / 1000).toFixed(2));

  let confidence: 'HIGH' | 'MODERATE' | 'REVIEW_RECOMMENDED' = 'HIGH';
  if (dailyEnergyKwh > 100) confidence = 'MODERATE';
  if (dailyEnergyKwh > 500) confidence = 'REVIEW_RECOMMENDED';

  const engineeringResults = {
    totalConnectedWatts: Math.round(totalConnectedWatts),
    totalConnectedKw: Number((totalConnectedWatts / 1000).toFixed(2)),
    peakDemandKw,
    peakKva,
    averagePowerFactor: avgPowerFactor,
    peakSurgeWatts: totalPeakSurgeWatts,
    dailyEnergyDemandKwh: dailyEnergyKwh,
    monthlyEnergyDemandKwh: monthlyEnergyKwh,
    criticalLoadWatts: criticalWatts,
    criticalDailyKwh,
    itemCount: input.items.length,
    categoryTotals,
    profileTitle: input.profileTitle ?? 'Standard Appliance Load Profile',
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'load-calculator',
    status: 'ENGINEERING_VALIDATED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'Deterministic Multi-Appliance Load Aggregation Model',
      governingStandards: ['IEEE 141 Red Book', 'IEC 60364-8-1'],
      keyEquations: [
        'P_total = Σ (P_rated × Qty)',
        'E_daily = Σ (P_rated × Qty × Hours/day × DutyCycle)',
        'S_peak = Max(P_connected × SurgeFactor, Σ Surge_watts) / PowerFactor',
      ],
      deratingFactorsApplied: {
        globalSurgeFactor: globalSurgeMult,
        averagePowerFactor: avgPowerFactor,
      },
    },
    inputsUsed: input as any,
  });

  return {
    toolId: 'load-calculator',
    calculation_status: 'SUCCESS',
    confidence,
    confidenceReasoning: 'Load calculated directly from detailed appliance catalog profiles with motor surge multipliers and duty cycles.',
    engineering_results: engineeringResults,
    recommended_configuration: {
      systemCapacityKw: Number((peakDemandKw * 1.1).toFixed(2)),
      inverterRatingKva: Math.ceil(peakKva * 1.25),
      batteryCapacityKwh: Number((dailyEnergyKwh * 1.2).toFixed(1)),
    },
    warnings: dailyEnergyKwh > 80 ? [{
      code: 'HIGH_LOAD',
      message: 'High daily energy consumption (>80 kWh/day). Consider commercial three-phase design.',
      severity: 'warning' as const,
      suggestion: 'Perform a detailed professional energy audit before equipment procurement.'
    }] : [],
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      'Total daily energy consumption is the baseline requirement for battery autonomy calculations.',
      'Peak surge demand includes a safety margin for inductive motor startup currents (e.g. AC compressors, pumps).'
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
