/**
 * V3 Load Profile Engine
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Produces a normalized NormalizedLoadProfile from appliance inputs.
 * This is the canonical intermediate representation consumed by:
 * - Recommendation Engine
 * - Battery sizing
 * - Inverter sizing
 * - PV array sizing
 * - Yield estimation
 * - Savings & ROI analysis
 *
 * The engine distinguishes:
 * - WHEN appliances operate (daylight vs night)
 * - HOW LONG they operate
 * - WHETHER they require battery backup
 * - WHETHER they create startup surge
 * - WHETHER they are critical
 * - WHETHER they can be shifted to daylight hours
 */

import { V3NormalizedLoadProfile, V3LoadItem, ApplianceLoadPriority, CalculationCertificationLevel } from '../types';

// Solar production window assumption: 08:00–18:00 (10 hours)
export const SOLAR_PRODUCTION_HOURS_START = 8;
export const SOLAR_PRODUCTION_HOURS_END = 18;
export const SOLAR_PRODUCTION_HOURS = SOLAR_PRODUCTION_HOURS_END - SOLAR_PRODUCTION_HOURS_START; // 10 hrs

// Categories of appliances that are inherently daytime-shiftable
const DAYTIME_SHIFTABLE_CATEGORIES = new Set([
  'pumping',
  'laundry',
  'water_heating',
  'kitchen',
  'computing',
]);

// Default priority mappings by appliance category when not explicitly set
const CATEGORY_DEFAULT_PRIORITY: Record<string, ApplianceLoadPriority> = {
  refrigeration: 'CRITICAL',
  pumping: 'IMPORTANT',
  lighting: 'IMPORTANT',
  computing: 'IMPORTANT',
  air_conditioning: 'FLEXIBLE',
  laundry: 'FLEXIBLE',
  kitchen: 'FLEXIBLE',
  water_heating: 'FLEXIBLE',
  entertainment: 'NON_CRITICAL',
  general: 'NON_CRITICAL',
};

export interface LoadProfileInput {
  items: V3LoadItem[];
  surgeFactor?: number;
  profileTitle?: string;
}

export interface LoadProfileResult {
  profile: V3NormalizedLoadProfile;
  validationErrors: string[];
  warnings: string[];
  itemBreakdown: ItemBreakdown[];
}

export interface ItemBreakdown {
  name: string;
  priority: ApplianceLoadPriority;
  powerW: number;
  dailyKwh: number;
  daytimeKwh: number;
  nighttimeKwh: number;
  isDaytimeShiftable: boolean;
  surgeW: number;
  category: string;
}

/**
 * Resolves effective priority for a load item.
 * V3 four-tier priority takes precedence over V2 boolean isCritical.
 */
function resolveItemPriority(item: V3LoadItem): ApplianceLoadPriority {
  if (item.priority) return item.priority;
  if (item.isCritical) return 'CRITICAL';
  return CATEGORY_DEFAULT_PRIORITY[item.category ?? 'general'] ?? 'NON_CRITICAL';
}

/**
 * Determines what fraction of an appliance's energy is daytime vs night.
 * If dayUsageHours/nightUsageHours are specified, uses those directly.
 * Otherwise applies a heuristic based on appliance category and total hours.
 */
function splitDayNight(item: V3LoadItem): { daytimeFraction: number; nighttimeFraction: number } {
  const hoursPerDay = item.hoursPerDay;

  // Explicit operating time profile
  if (item.dayUsageHours !== undefined || item.nightUsageHours !== undefined) {
    const dayHrs = item.dayUsageHours ?? 0;
    const nightHrs = item.nightUsageHours ?? 0;
    const total = dayHrs + nightHrs;
    if (total > 0) {
      return { daytimeFraction: dayHrs / total, nighttimeFraction: nightHrs / total };
    }
  }

  // Heuristic: appliances that run 24h/day are split by time of day
  if (hoursPerDay >= 20) {
    // e.g. fridge, router — roughly proportional to solar production window
    const dayFraction = SOLAR_PRODUCTION_HOURS / 24;
    return { daytimeFraction: dayFraction, nighttimeFraction: 1 - dayFraction };
  }

  // Category-based defaults
  const cat = item.category ?? 'general';
  if (DAYTIME_SHIFTABLE_CATEGORIES.has(cat)) {
    // Assume fully daytime-capable
    return { daytimeFraction: 1.0, nighttimeFraction: 0.0 };
  }
  if (cat === 'air_conditioning') {
    // AC typically split 70% daylight / 30% night
    return { daytimeFraction: 0.7, nighttimeFraction: 0.3 };
  }
  if (cat === 'lighting') {
    // Lighting mostly night: 20% day / 80% night
    return { daytimeFraction: 0.2, nighttimeFraction: 0.8 };
  }
  if (cat === 'entertainment') {
    // Entertainment mostly evening/night
    return { daytimeFraction: 0.3, nighttimeFraction: 0.7 };
  }

  // Default: assume 50/50 if under solar production hours, else all daytime
  if (hoursPerDay <= SOLAR_PRODUCTION_HOURS) {
    return { daytimeFraction: 0.6, nighttimeFraction: 0.4 };
  }
  return { daytimeFraction: SOLAR_PRODUCTION_HOURS / 24, nighttimeFraction: 1 - SOLAR_PRODUCTION_HOURS / 24 };
}

/**
 * Resolves whether an item is daytime-shiftable.
 */
function resolveShiftable(item: V3LoadItem): boolean {
  if (item.isDaytimeShiftable !== undefined) return item.isDaytimeShiftable;
  const cat = item.category ?? 'general';
  return DAYTIME_SHIFTABLE_CATEGORIES.has(cat);
}

/**
 * V3 Load Profile Engine — Main Entry Point
 *
 * Produces a NormalizedLoadProfile from a list of V3LoadItems.
 * This profile is the single source of truth for all downstream calculators.
 */
export function buildLoadProfile(input: LoadProfileInput): LoadProfileResult {
  const validationErrors: string[] = [];
  const warnings: string[] = [];

  if (!input.items || input.items.length === 0) {
    validationErrors.push('At least one appliance or load item is required.');
    return {
      profile: emptyProfile(),
      validationErrors,
      warnings,
      itemBreakdown: [],
    };
  }

  // Per-item validation
  input.items.forEach((item, idx) => {
    const label = `Item ${idx + 1} (${item.name || 'Appliance'})`;
    if (item.powerWatts <= 0) validationErrors.push(`${label} rated power must be > 0 W.`);
    if (item.quantity < 1) validationErrors.push(`${label} quantity must be ≥ 1.`);
    if (item.hoursPerDay < 0 || item.hoursPerDay > 24) validationErrors.push(`${label} hours/day must be 0–24.`);
    if (item.dutyCycle !== undefined && (item.dutyCycle < 0.01 || item.dutyCycle > 1.0)) {
      warnings.push(`${label} duty cycle clamped to 0.01–1.0 range.`);
    }
  });

  if (validationErrors.length > 0) {
    return { profile: emptyProfile(), validationErrors, warnings, itemBreakdown: [] };
  }

  // Aggregation
  let totalConnectedW = 0;
  let totalPeakSurgeW = 0;
  let totalDailyWh = 0;
  let totalDaytimeWh = 0;
  let totalNighttimeWh = 0;
  let criticalWh = 0;
  let importantWh = 0;
  let flexibleWh = 0;
  let nonCriticalWh = 0;
  let shiftableWh = 0;
  let weightedPfSum = 0;

  const itemBreakdown: ItemBreakdown[] = [];

  for (const item of input.items) {
    const daysMultiplier = (item.daysPerWeek ?? 7) / 7;
    const dutyCycle = Math.min(Math.max(item.dutyCycle ?? 1.0, 0.01), 1.0);
    const pf = item.powerFactor ?? 0.85;
    const ratedPower = item.ratedWatts ?? item.powerWatts;
    const surgeMultiplier = item.surgeMultiplier ?? 1.5;
    const startingPower = item.startingWatts ?? (ratedPower * surgeMultiplier);
    const simFactor = item.simultaneityFactor ?? (item.quantity > 2 ? 0.75 : 1.0);

    const activeW = Math.round(ratedPower * item.quantity * simFactor);
    const rawConnectedW = ratedPower * item.quantity;
    const surgeW = Math.round(startingPower * item.quantity);
    const dailyWh = rawConnectedW * item.hoursPerDay * daysMultiplier * dutyCycle;

    const { daytimeFraction, nighttimeFraction } = splitDayNight(item);
    const daytimeWh = dailyWh * daytimeFraction;
    const nighttimeWh = dailyWh * nighttimeFraction;

    const priority = resolveItemPriority(item);
    const isShiftable = resolveShiftable(item);

    totalConnectedW += activeW;
    totalPeakSurgeW += surgeW;
    totalDailyWh += dailyWh;
    totalDaytimeWh += daytimeWh;
    totalNighttimeWh += nighttimeWh;
    weightedPfSum += activeW * pf;

    if (isShiftable) shiftableWh += daytimeWh; // already in daylight; flexible load that's shiftable

    switch (priority) {
      case 'CRITICAL':    criticalWh += dailyWh; break;
      case 'IMPORTANT':   importantWh += dailyWh; break;
      case 'FLEXIBLE':    flexibleWh += dailyWh; break;
      case 'NON_CRITICAL': nonCriticalWh += dailyWh; break;
    }

    itemBreakdown.push({
      name: `${item.quantity > 1 ? item.quantity + '× ' : ''}${item.name}`,
      priority,
      powerW: activeW,
      dailyKwh: Number((dailyWh / 1000).toFixed(3)),
      daytimeKwh: Number((daytimeWh / 1000).toFixed(3)),
      nighttimeKwh: Number((nighttimeWh / 1000).toFixed(3)),
      isDaytimeShiftable: isShiftable,
      surgeW: Math.round(surgeW),
      category: item.category ?? 'general',
    });
  }

  const globalSurgeFactor = input.surgeFactor ?? 1.25;
  const peakSurgeW = Math.max(totalConnectedW * globalSurgeFactor, totalPeakSurgeW);
  const avgPf = totalConnectedW > 0 ? Number((weightedPfSum / totalConnectedW).toFixed(3)) : 0.85;
  const dailyKwh = Number((totalDailyWh / 1000).toFixed(3));

  // Certification level: detailed appliance input = ENGINEERING_ESTIMATE
  const certificationLevel: CalculationCertificationLevel = 'ENGINEERING_ESTIMATE';

  const profile: V3NormalizedLoadProfile = {
    dailyEnergyKwh: dailyKwh,
    peakContinuousW: Math.round(totalConnectedW),
    peakSurgeW: Math.round(peakSurgeW),
    daytimeEnergyKwh: Number((totalDaytimeWh / 1000).toFixed(3)),
    nighttimeEnergyKwh: Number((totalNighttimeWh / 1000).toFixed(3)),
    criticalEnergyKwh: Number((criticalWh / 1000).toFixed(3)),
    importantEnergyKwh: Number((importantWh / 1000).toFixed(3)),
    flexibleEnergyKwh: Number((flexibleWh / 1000).toFixed(3)),
    nonCriticalEnergyKwh: Number((nonCriticalWh / 1000).toFixed(3)),
    simultaneousLoadW: Math.round(totalConnectedW),
    daytimeShiftableKwh: Number((shiftableWh / 1000).toFixed(3)),
    certificationLevel,
    itemCount: input.items.length,
    averagePowerFactor: avgPf,
    monthlyEnergyKwh: Number((dailyKwh * 30).toFixed(2)),
    annualEnergyKwh: Number((dailyKwh * 365).toFixed(1)),
  };

  // Issue warnings for high-load or unusual profiles
  if (dailyKwh > 100) {
    warnings.push('Daily load exceeds 100 kWh/day — consider commercial three-phase design.');
  }
  if (profile.nighttimeEnergyKwh > profile.daytimeEnergyKwh * 2) {
    warnings.push('Night-heavy load profile: battery capacity will be the dominant cost driver.');
  }
  if (profile.criticalEnergyKwh === 0) {
    warnings.push('No CRITICAL priority loads defined — constrained-mode backup cannot be prioritized.');
  }

  return { profile, validationErrors: [], warnings, itemBreakdown };
}

/**
 * Creates a load profile from simple daily kWh input (without appliance detail).
 * Returns PRELIMINARY_ESTIMATE certification level — not suitable for sizing without review.
 */
export function buildProfileFromDailyKwh(
  dailyKwh: number,
  daytimePercent = 60,
  options?: { peakContinuousW?: number; peakSurgeW?: number }
): V3NormalizedLoadProfile {
  const daytimeFraction = daytimePercent / 100;
  const nighttimeFraction = 1 - daytimeFraction;
  const impliedW = (dailyKwh * 1000) / 8; // assume 8-hour load profile
  const continuousW = options?.peakContinuousW ?? impliedW;
  const surgeW = options?.peakSurgeW ?? continuousW * 2.0;

  return {
    dailyEnergyKwh: dailyKwh,
    peakContinuousW: Math.round(continuousW),
    peakSurgeW: Math.round(surgeW),
    daytimeEnergyKwh: Number((dailyKwh * daytimeFraction).toFixed(3)),
    nighttimeEnergyKwh: Number((dailyKwh * nighttimeFraction).toFixed(3)),
    criticalEnergyKwh: Number((dailyKwh * 0.4).toFixed(3)), // assume 40% critical
    importantEnergyKwh: Number((dailyKwh * 0.3).toFixed(3)),
    flexibleEnergyKwh: Number((dailyKwh * 0.2).toFixed(3)),
    nonCriticalEnergyKwh: Number((dailyKwh * 0.1).toFixed(3)),
    simultaneousLoadW: Math.round(continuousW),
    daytimeShiftableKwh: Number((dailyKwh * 0.15).toFixed(3)), // estimate 15% shiftable
    certificationLevel: 'PRELIMINARY_ESTIMATE',
    itemCount: 0,
    averagePowerFactor: 0.85,
    monthlyEnergyKwh: Number((dailyKwh * 30).toFixed(2)),
    annualEnergyKwh: Number((dailyKwh * 365).toFixed(1)),
  };
}

function emptyProfile(): V3NormalizedLoadProfile {
  return {
    dailyEnergyKwh: 0,
    peakContinuousW: 0,
    peakSurgeW: 0,
    daytimeEnergyKwh: 0,
    nighttimeEnergyKwh: 0,
    criticalEnergyKwh: 0,
    importantEnergyKwh: 0,
    flexibleEnergyKwh: 0,
    nonCriticalEnergyKwh: 0,
    simultaneousLoadW: 0,
    daytimeShiftableKwh: 0,
    certificationLevel: 'PRELIMINARY_ESTIMATE',
    itemCount: 0,
    averagePowerFactor: 0.85,
    monthlyEnergyKwh: 0,
    annualEnergyKwh: 0,
  };
}
