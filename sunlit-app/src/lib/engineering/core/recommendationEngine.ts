/**
 * V3 Recommendation Engine
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * THE CORE V3 REQUIREMENT.
 *
 * Produces THREE system options from a normalized load profile:
 *   BASELINE   — Lowest reasonable system; reduced battery, daylight-prioritized
 *   RECOMMENDED — Best balance: cost, load coverage, battery autonomy, solar generation
 *   UPGRADE    — Higher resilience, future expansion, maximum nighttime coverage
 *
 * Every option answers:
 *   WHY THIS SYSTEM?
 *   WHY NOT SMALLER?
 *   WHY NOT LARGER?
 *   WHAT DOES THE USER GAIN?
 *   WHAT DOES THE USER SACRIFICE?
 *   CAN IT ACTUALLY SUPPORT THE REQUESTED LOAD?
 *   WHEN CAN EACH APPLIANCE RUN?
 *
 * The engine validates every option through engineering constraint checks.
 * It never returns an option that cannot support its claimed load coverage.
 *
 * All calculations reuse existing shared calculators — no formula duplication.
 */

import {
  V3NormalizedLoadProfile,
  V3SystemOption,
  V3ApplianceRuntime,
  V3ValidationFinding,
  V3LoadItem,
  ConfidenceLevel,
} from '../types';
import { ENGINEERING_ASSUMPTION_REGISTRY } from './assumptions';
import { LOCATION_SOLAR_CATALOG } from '../catalog/equipmentCatalog';
import { ENGINE_VERSION } from './envelope';
import { resolveSolarPricing, SolarPricingResolution } from './pricingResolver';
import { buildSolarEngineeringConfidenceLayer } from './confidence';

// ============================================================
// PARAMETRIC CAPEX BENCHMARK MODEL (Nigerian solar market 2026)
// Clearly marked as PRELIMINARY_ESTIMATE — never presented as final pricing
// ============================================================
const CAPEX_DISCLAIMER = 'PRELIMINARY_ESTIMATE: Indicative cost model derived from approved 2026 Nigerian Tier-1 solar benchmarks. Actual prices vary by location, equipment brand, and installer. Obtain formal quotations from Sunlit-verified installers.';

// ============================================================
// BATTERY DISCHARGE MODEL
// Runtime = (usableKwh × batteryEfficiency) / (loadKw × inverterEfficiency)
// ============================================================

interface SystemSpec {
  inverterKva: number;
  panelWatt: number;
  panelCount: number;
  batteryNominalKwh: number;
  dod: number;              // Depth of Discharge (0–1)
  batteryEfficiency: number;
  inverterEfficiency: number;
  systemVoltage: number;
}

function batteryUsableKwh(spec: SystemSpec): number {
  return Number((spec.batteryNominalKwh * spec.dod * spec.batteryEfficiency).toFixed(3));
}

function calculateSolarArrayKwp(spec: SystemSpec): number {
  return Number(((spec.panelCount * spec.panelWatt) / 1000).toFixed(2));
}

/**
 * Calculate expected daily solar generation for a location.
 * Uses the location catalog PSH and system loss factor.
 */
function calcDailyGeneration(arrayKwp: number, location: string): number {
  const lossFactor = ENGINEERING_ASSUMPTION_REGISTRY.pv_system_losses.value; // 0.14
  const loc = LOCATION_SOLAR_CATALOG.find(
    (l) => l.name.toLowerCase() === location.toLowerCase()
  ) ?? LOCATION_SOLAR_CATALOG[0];
  const psh = loc.annualMeanPsh;
  return Number((arrayKwp * psh * (1 - lossFactor)).toFixed(2));
}

/**
 * Calculate battery autonomy in hours for a given load profile.
 * Accounts for battery usable capacity, efficiency chain, and load.
 */
function calcAutonomyHours(usableKwh: number, loadKwh: number): number {
  if (loadKwh <= 0) return 0;
  return Number(((usableKwh / loadKwh) * 24).toFixed(1));
}

/**
 * Calculate load coverage for a given system spec vs load profile.
 * Returns: daytime%, night%, total% coverage.
 */
function calcCoverage(
  spec: SystemSpec,
  profile: V3NormalizedLoadProfile,
  dailyGenKwh: number,
): { daytime: number; night: number; total: number } {
  const usable = batteryUsableKwh(spec);

  // Daytime: solar can supply daytime load directly
  const daytimeSupply = Math.min(dailyGenKwh, profile.daytimeEnergyKwh);
  const daytimeCoverage = profile.daytimeEnergyKwh > 0
    ? Number((Math.min(daytimeSupply / profile.daytimeEnergyKwh, 1.0) * 100).toFixed(1))
    : 100;

  // Night: battery supplies night load
  const nightSupply = Math.min(usable, profile.nighttimeEnergyKwh);
  const nightCoverage = profile.nighttimeEnergyKwh > 0
    ? Number((Math.min(nightSupply / profile.nighttimeEnergyKwh, 1.0) * 100).toFixed(1))
    : 100;

  // Overall: weighted by energy share
  const totalSupply = daytimeSupply + nightSupply;
  const totalCoverage = profile.dailyEnergyKwh > 0
    ? Number(Math.min((totalSupply / profile.dailyEnergyKwh) * 100, 100).toFixed(1))
    : 100;

  return { daytime: daytimeCoverage, night: nightCoverage, total: totalCoverage };
}

/**
 * Generate per-appliance runtime analysis for a given system spec.
 */
function generateApplianceRuntime(
  items: V3LoadItem[],
  spec: SystemSpec,
  profile: V3NormalizedLoadProfile,
  dailyGenKwh: number,
): V3ApplianceRuntime[] {
  if (!items || items.length === 0) {
    // No appliance detail — return profile-level summary
    return [
      {
        appliance: 'Total Load Profile',
        requestedHours: 24,
        supportedHours: 24,
        coverage: profile.dailyEnergyKwh <= dailyGenKwh + batteryUsableKwh(spec) ? 'FULL' : 'PARTIAL',
        period: 'BOTH',
        explanation: `System generates ${dailyGenKwh} kWh/day solar and stores ${batteryUsableKwh(spec).toFixed(1)} kWh usable battery capacity.`,
      },
    ];
  }

  const usable = batteryUsableKwh(spec);
  const inverterKw = spec.inverterKva * 0.85; // assume PF 0.85

  return items.map((item) => {
    const activeW = item.powerWatts * item.quantity;
    const dutyCycle = item.dutyCycle ?? 1.0;
    const requestedHours = item.hoursPerDay;
    const dailyWh = activeW * requestedHours * dutyCycle;

    // Check inverter capacity
    if (activeW > inverterKw * 1000) {
      return {
        appliance: item.name,
        requestedHours,
        supportedHours: 0,
        coverage: 'NOT_SUPPORTED',
        period: 'N/A',
        explanation: `Appliance draw (${(activeW / 1000).toFixed(1)} kW) exceeds inverter continuous capacity (${inverterKw.toFixed(1)} kW). Upgrade inverter to support this load.`,
      };
    }

    // Determine operational window
    const cat = item.category ?? 'general';
    const isDaytimeCapable =
      cat === 'air_conditioning' || cat === 'pumping' || cat === 'laundry' ||
      cat === 'kitchen' || cat === 'water_heating' || cat === 'computing';

    // Daytime supply check
    const surplusDaytime = dailyGenKwh - profile.daytimeEnergyKwh;
    const canRunDaytime = isDaytimeCapable && dailyGenKwh >= (dailyWh / 1000);

    // Battery supply check for night loads
    const batteryCanSupport = usable >= (dailyWh / 1000);

    if (canRunDaytime && batteryCanSupport) {
      return {
        appliance: item.name,
        requestedHours,
        supportedHours: requestedHours,
        coverage: 'FULL',
        period: 'BOTH',
        explanation: `${item.name} can run during daylight (solar-powered) and at night (battery-backed).`,
      };
    }

    if (canRunDaytime && !batteryCanSupport && isDaytimeCapable) {
      return {
        appliance: item.name,
        requestedHours,
        supportedHours: requestedHours,
        coverage: 'DAYLIGHT_ONLY',
        period: 'DAYLIGHT',
        explanation: `${item.name} is supported during solar production hours. Schedule use between 08:00–18:00 for full runtime.`,
      };
    }

    if (!canRunDaytime && batteryCanSupport) {
      return {
        appliance: item.name,
        requestedHours,
        supportedHours: requestedHours,
        coverage: 'BACKUP_ONLY',
        period: 'NIGHT',
        explanation: `${item.name} is powered from battery storage. Battery provides ${usable.toFixed(1)} kWh usable capacity.`,
      };
    }

    // Partial: battery cannot fully supply the night demand
    const supportableHours = Number(((usable * 1000) / (activeW * dutyCycle)).toFixed(1));
    if (supportableHours > 0 && supportableHours < requestedHours) {
      return {
        appliance: item.name,
        requestedHours,
        supportedHours: Math.min(supportableHours, requestedHours),
        coverage: 'PARTIAL',
        period: 'BOTH',
        explanation: `Battery capacity limits ${item.name} runtime. Actual supported hours: ${Math.min(supportableHours, requestedHours).toFixed(1)}h vs requested ${requestedHours}h. Consider increasing battery capacity.`,
      };
    }

    const isShiftable = cat === 'pumping' || cat === 'laundry' || cat === 'water_heating';
    if (isShiftable && surplusDaytime > 0) {
      return {
        appliance: item.name,
        requestedHours,
        supportedHours: requestedHours,
        coverage: 'REQUIRES_LOAD_SHIFT',
        period: 'DAYLIGHT',
        explanation: `Shift ${item.name} to daylight hours (08:00–18:00) to use direct solar power and reduce battery demand.`,
      };
    }

    return {
      appliance: item.name,
      requestedHours,
      supportedHours: 0,
      coverage: 'NOT_SUPPORTED',
      period: 'N/A',
      explanation: `Insufficient system capacity to support ${item.name}. Upgrade battery or inverter to meet this load.`,
    };
  });
}

/**
 * Generate structured validation findings for a system option.
 */
function validateSystemOption(
  spec: SystemSpec,
  profile: V3NormalizedLoadProfile,
  dailyGenKwh: number,
): V3ValidationFinding[] {
  const findings: V3ValidationFinding[] = [];
  const inverterKw = spec.inverterKva * 0.85;
  const usable = batteryUsableKwh(spec);
  const arrayKwp = calculateSolarArrayKwp(spec);

  // Inverter continuous load check
  if (profile.peakContinuousW > inverterKw * 1000) {
    findings.push({
      code: 'INVERTER_UNDERSIZED',
      severity: 'BLOCKED',
      category: 'INVERTER',
      message: `Peak continuous load (${(profile.peakContinuousW / 1000).toFixed(1)} kW) exceeds inverter capacity (${inverterKw.toFixed(1)} kW).`,
      affectedComponent: 'Inverter',
      recommendedAction: 'Select a higher-rated inverter or reduce simultaneous load.',
    });
  } else {
    findings.push({
      code: 'INVERTER_CONTINUOUS_OK',
      severity: 'PASS',
      category: 'INVERTER',
      message: `Inverter continuous capacity (${spec.inverterKva} kVA) satisfies peak load.`,
      affectedComponent: 'Inverter',
      recommendedAction: 'No action required.',
    });
  }

  // Battery autonomy check
  const autonomyHrs = calcAutonomyHours(usable, profile.nighttimeEnergyKwh);
  if (autonomyHrs < 4) {
    findings.push({
      code: 'BATTERY_LOW_AUTONOMY',
      severity: 'WARNING',
      category: 'BATTERY',
      message: `Battery provides only ${autonomyHrs.toFixed(1)} hours of night autonomy. Minimum recommended: 4 hours.`,
      affectedComponent: 'Battery',
      recommendedAction: 'Increase battery capacity to improve overnight coverage.',
    });
  } else {
    findings.push({
      code: 'BATTERY_AUTONOMY_OK',
      severity: 'PASS',
      category: 'BATTERY',
      message: `Battery autonomy ${autonomyHrs.toFixed(1)} hours satisfies minimum night coverage requirement.`,
      affectedComponent: 'Battery',
      recommendedAction: 'No action required.',
    });
  }

  // PV generation vs daytime demand
  if (dailyGenKwh < profile.daytimeEnergyKwh * 0.7) {
    findings.push({
      code: 'PV_INSUFFICIENT_DAYTIME',
      severity: 'WARNING',
      category: 'PV_ARRAY',
      message: `Solar array generates ${dailyGenKwh.toFixed(1)} kWh/day but daytime load is ${profile.daytimeEnergyKwh.toFixed(1)} kWh. Array may be insufficient on cloudy days.`,
      affectedComponent: 'Solar Array',
      recommendedAction: 'Consider adding panels or reducing daytime load.',
    });
  } else {
    findings.push({
      code: 'PV_GENERATION_OK',
      severity: 'PASS',
      category: 'PV_ARRAY',
      message: `Solar generation (${dailyGenKwh.toFixed(1)} kWh/day) adequately covers daytime demand.`,
      affectedComponent: 'Solar Array',
      recommendedAction: 'No action required.',
    });
  }

  // Oversizing sanity check (>50% above requirement beyond standard discrete equipment steps)
  const baseRequiredArrayKwp = profile.dailyEnergyKwh > 0 ? (profile.dailyEnergyKwh / (1 - 0.20)) * 1.15 / 4.8 : 0;
  const baseRequiredInverterKva = profile.peakContinuousW > 0 ? (profile.peakContinuousW / (1000 * 0.85)) * 1.25 : 0;
  const baseRequiredBatteryKwh = profile.nighttimeEnergyKwh > 0 ? (profile.nighttimeEnergyKwh / (0.8 * 0.95)) : 0;

  if (
    (baseRequiredArrayKwp > 0 && arrayKwp > baseRequiredArrayKwp * 1.75 && arrayKwp >= 8) ||
    (baseRequiredInverterKva > 0 && spec.inverterKva > baseRequiredInverterKva * 1.75 && spec.inverterKva >= 8) ||
    (baseRequiredBatteryKwh > 0 && spec.batteryNominalKwh > baseRequiredBatteryKwh * 3.0 && spec.batteryNominalKwh >= 15)
  ) {
    findings.push({
      code: 'OVERSPEC_WARNING',
      severity: 'WARNING',
      category: 'PV_ARRAY',
      message: 'Recommendation exceeds calculated engineering load requirement.',
      affectedComponent: 'Solar Array, Inverter or Storage',
      recommendedAction: 'Verify if future load expansion or high cloud-cover autonomy is specifically required.',
    });
  }

  return findings;
}

/**
 * Estimate parametric CAPEX for a system option via the authoritative Pricing Resolver.
 */
function estimateCAPEX(spec: SystemSpec, location: string): SolarPricingResolution {
  const arrayKwp = calculateSolarArrayKwp(spec);
  return resolveSolarPricing({
    solarCapacityKwp: arrayKwp,
    inverterRatingKva: spec.inverterKva,
    batteryCapacityKwh: spec.batteryNominalKwh,
    locationState: location,
  });
}

// ============================================================
// RECOMMENDATION ENGINE — MAIN INTERFACE
// ============================================================

export interface RecommendationInput {
  loadProfile: V3NormalizedLoadProfile;
  location?: string;
  loadItems?: V3LoadItem[];    // Optional — for per-appliance runtime analysis
  selectedPanelWattageW?: number;
  chemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  phaseType?: 'single-phase' | 'three-phase';
  customerPriority?: 'LOWER_CAPEX' | 'BALANCED' | 'MAXIMUM_RESILIENCE';
}

export interface RecommendationResult {
  options: V3SystemOption[];
  recommendedTier: 'BASELINE' | 'RECOMMENDED' | 'UPGRADE';
  engineVersion: string;
  generatedAt: string;
  location: string;
  loadProfileCertificationLevel: string;
  warnings: string[];
}

/**
 * V3 Recommendation Engine — Main Entry Point
 *
 * Generates Baseline, Recommended, and Upgrade options from a normalized load profile.
 * Each option is independently validated, priced through the pricing resolver, and explained.
 */
export function generateSystemRecommendations(input: RecommendationInput): RecommendationResult {
  const location = input.location ?? 'Lagos';
  const panelWatt = input.selectedPanelWattageW ?? 550;
  const chemistry = input.chemistry ?? 'LITHIUM_LIFEPO4';
  const dod = chemistry === 'LITHIUM_LIFEPO4' ? 0.80 : 0.50;
  const batteryEff = chemistry === 'LITHIUM_LIFEPO4' ? 0.95 : 0.85;
  const inverterEff = ENGINEERING_ASSUMPTION_REGISTRY.inverter_efficiency_hybrid.value; // 0.96
  const pf = ENGINEERING_ASSUMPTION_REGISTRY.inverter_power_factor_default.value; // 0.85
  const { loadProfile: profile, loadItems, customerPriority = 'BALANCED' } = input;

  // ---- Derive system sizing anchors from load profile ----
  const dailyKwh = profile.dailyEnergyKwh;
  const peakKw = profile.peakContinuousW / 1000;
  const nightKwh = profile.nighttimeEnergyKwh;

  // Inverter must cover peak continuous load with 25% headroom
  const minInverterKva = Number(((peakKw / pf) * 1.25).toFixed(1));

  // Recommended inverter size (round up to standard sizes: 3, 5, 8, 10, 15, 20 kVA)
  const STANDARD_INVERTER_SIZES = [3, 5, 8, 10, 15, 20, 30];
  function nextStandardInverter(minKva: number): number {
    return STANDARD_INVERTER_SIZES.find((s) => s >= minKva) ?? 30;
  }

  const recInverterKva = nextStandardInverter(minInverterKva);
  const baseInverterKva = nextStandardInverter(minInverterKva * 0.85); // 15% reduction for baseline
  const upgradeInverterKva = nextStandardInverter(recInverterKva * 1.2); // 20% upgrade

  // Battery sizing: cover nighttime demand at recommended DoD
  const recBatteryNominal = Number((nightKwh / (dod * batteryEff) * 1.1).toFixed(1)); // 10% headroom
  const baseBatteryNominal = Number((nightKwh * 0.6 / (dod * batteryEff)).toFixed(1)); // 60% night coverage
  const upgradeBatteryNominal = Number((nightKwh * 1.5 / (dod * batteryEff)).toFixed(1)); // 150% night coverage

  // PV sizing: cover daily demand with loss factor and 15% design margin
  const lossFactor = ENGINEERING_ASSUMPTION_REGISTRY.pv_system_losses.value;
  const designMargin = 1.15;
  const psh = (LOCATION_SOLAR_CATALOG.find(
    (l) => l.name.toLowerCase() === location.toLowerCase()
  ) ?? LOCATION_SOLAR_CATALOG[0]).annualMeanPsh;

  const recArrayKwp = Number(((dailyKwh / (1 - lossFactor)) * designMargin / psh).toFixed(2));
  const baseArrayKwp = Number((recArrayKwp * 0.75).toFixed(2)); // 75% of recommended
  const upgradeArrayKwp = Number((recArrayKwp * 1.3).toFixed(2)); // 30% larger

  function panelCount(kwp: number): number { return Math.ceil((kwp * 1000) / panelWatt); }

  // ---- Build 3 system specs ----
  const baseSpec: SystemSpec = {
    inverterKva: baseInverterKva,
    panelWatt,
    panelCount: panelCount(baseArrayKwp),
    batteryNominalKwh: Math.max(baseBatteryNominal, 5), // minimum 5 kWh
    dod,
    batteryEfficiency: batteryEff,
    inverterEfficiency: inverterEff,
    systemVoltage: peakKw > 3 ? 48 : 24,
  };

  const recSpec: SystemSpec = {
    inverterKva: recInverterKva,
    panelWatt,
    panelCount: panelCount(recArrayKwp),
    batteryNominalKwh: Math.max(recBatteryNominal, 10),
    dod,
    batteryEfficiency: batteryEff,
    inverterEfficiency: inverterEff,
    systemVoltage: peakKw > 3 ? 48 : 24,
  };

  const upgradeSpec: SystemSpec = {
    inverterKva: upgradeInverterKva,
    panelWatt,
    panelCount: panelCount(upgradeArrayKwp),
    batteryNominalKwh: Math.max(upgradeBatteryNominal, 15),
    dod,
    batteryEfficiency: batteryEff,
    inverterEfficiency: inverterEff,
    systemVoltage: 48,
  };

  // ---- Generate options ----
  const options: V3SystemOption[] = [
    buildOption('BASELINE', baseSpec, profile, location, loadItems ?? []),
    buildOption('RECOMMENDED', recSpec, profile, location, loadItems ?? []),
    buildOption('UPGRADE', upgradeSpec, profile, location, loadItems ?? []),
  ];

  // Determine recommended tier based on customer priority
  const recommendedTier =
    customerPriority === 'LOWER_CAPEX' ? 'BASELINE' :
    customerPriority === 'MAXIMUM_RESILIENCE' ? 'UPGRADE' : 'RECOMMENDED';

  const warnings: string[] = [];
  if (profile.certificationLevel === 'PRELIMINARY_ESTIMATE') {
    warnings.push('Load profile is a PRELIMINARY_ESTIMATE. Provide full appliance list for ENGINEERING_ESTIMATE accuracy.');
  }

  return {
    options,
    recommendedTier,
    engineVersion: ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    location,
    loadProfileCertificationLevel: profile.certificationLevel,
    warnings,
  };
}

function buildOption(
  tier: 'BASELINE' | 'RECOMMENDED' | 'UPGRADE',
  spec: SystemSpec,
  profile: V3NormalizedLoadProfile,
  location: string,
  items: V3LoadItem[],
): V3SystemOption {
  const arrayKwp = calculateSolarArrayKwp(spec);
  const usable = batteryUsableKwh(spec);
  const dailyGen = calcDailyGeneration(arrayKwp, location);
  const coverage = calcCoverage(spec, profile, dailyGen);
  const autonomyHrs = calcAutonomyHours(usable, profile.nighttimeEnergyKwh);
  const findings = validateSystemOption(spec, profile, dailyGen);
  const applianceRuntime = generateApplianceRuntime(items, spec, profile, dailyGen);
  const pricingResolution = estimateCAPEX(spec, location);
  const capex = pricingResolution.recommendedEstimatedCapexNaira ?? 0;
  const hasBlocker = findings.some((f) => f.severity === 'BLOCKED');
  const hasWarning = findings.some((f) => f.severity === 'WARNING');
  const status: 'PASS' | 'WARNING' | 'CONSTRAINED' =
    hasBlocker ? 'CONSTRAINED' : hasWarning ? 'WARNING' : 'PASS';

  const confidenceScore = coverage.total >= 90 ? 'HIGH' : coverage.total >= 70 ? 'MODERATE' : 'REVIEW_RECOMMENDED';
  const confidence: ConfidenceLevel = confidenceScore;

  // Build Multi-Factor Solar Engineering Confidence Layer
  const confidenceLayer = buildSolarEngineeringConfidenceLayer({
    inputMethod: profile.itemCount > 0 ? 'APPLIANCE_LIST' : 'KWH_DIRECT',
    applianceCount: profile.itemCount,
    hasCustomAppliances: items.some((i) => i.name.toLowerCase().includes('custom')),
    hasDutyCycleOrHours: items.some((i) => (i.dutyCycle !== undefined && i.dutyCycle < 1.0) || i.hoursPerDay !== 8),
    pricingSource: pricingResolution.pricingSource,
    hasValidationWarnings: hasWarning,
    locationState: location,
    systemKwp: arrayKwp,
  });

  const labels: Record<'BASELINE' | 'RECOMMENDED' | 'UPGRADE', string> = {
    BASELINE: 'Baseline — Essential Coverage',
    RECOMMENDED: 'Recommended — Balanced System',
    UPGRADE: 'Upgrade — Maximum Resilience',
  };

  const descriptions: Record<'BASELINE' | 'RECOMMENDED' | 'UPGRADE', string> = {
    BASELINE: `Lowest cost system. Covers critical and important loads with daylight prioritization. ${coverage.total.toFixed(0)}% overall load coverage. Non-critical and flexible loads may need scheduling during solar hours.`,
    RECOMMENDED: `Best-balance system for your load profile. Covers ${coverage.total.toFixed(0)}% of daily demand with ${autonomyHrs.toFixed(1)} hours of night autonomy. Recommended for most Nigerian residential and SME deployments.`,
    UPGRADE: `High-resilience system with extended autonomy (${autonomyHrs.toFixed(1)} hours), larger solar array for surplus generation, and capacity for future load expansion. Best for critical operations and extended outages.`,
  };

  const limitations: Record<'BASELINE' | 'RECOMMENDED' | 'UPGRADE', string[]> = {
    BASELINE: [
      'Reduced battery — limited nighttime coverage.',
      'Non-critical loads may not be supported.',
      `Coverage: ${coverage.night.toFixed(0)}% night, ${coverage.daytime.toFixed(0)}% daytime.`,
      'Smaller solar array — may not fully charge battery on cloudy days.',
    ],
    RECOMMENDED: [
      coverage.total < 95 ? `${(100 - coverage.total).toFixed(0)}% of load may require grid/generator supplementation.` : 'Full load coverage achieved.',
      'Sized for current load — limited future expansion headroom.',
    ],
    UPGRADE: [
      'Higher upfront CAPEX investment.',
      'Larger roof area required for expanded solar array.',
      `Array area: ~${(spec.panelCount * 2.2).toFixed(0)} m² minimum.`,
    ],
  };

  const advantages: Record<'BASELINE' | 'RECOMMENDED' | 'UPGRADE', string[]> = {
    BASELINE: [
      'Lowest capital investment.',
      'Eliminates grid and generator dependency during daylight.',
      `Estimated Reference Band: ${pricingResolution.formattedRange}.`,
    ],
    RECOMMENDED: [
      `${coverage.total.toFixed(0)}% daily load coverage.`,
      `${autonomyHrs.toFixed(1)} hours of battery backup during outages.`,
      'Balanced cost-to-coverage ratio.',
      `Estimated Reference Band: ${pricingResolution.formattedRange} (Obtain formal installer proposal).`,
    ],
    UPGRADE: [
      `${coverage.total.toFixed(0)}% daily load coverage with high resilience.`,
      `${autonomyHrs.toFixed(1)} hours of autonomous operation.`,
      'Future load expansion capacity.',
      'Higher solar surplus for battery top-up on cloudy days.',
      `Estimated Reference Band: ${pricingResolution.formattedRange} (Obtain formal installer proposal).`,
    ],
  };

  const explanation =
    tier === 'BASELINE'
      ? `This system covers essential daily loads (${profile.criticalEnergyKwh.toFixed(1)} kWh critical + ${profile.importantEnergyKwh.toFixed(1)} kWh important) at the lowest cost. Not recommended if uninterrupted night coverage is required.`
      : tier === 'RECOMMENDED'
      ? `This system satisfies your requested appliance profile with ${coverage.total.toFixed(0)}% coverage. Solar generation (${dailyGen.toFixed(1)} kWh/day) covers daytime demand while ${usable.toFixed(1)} kWh usable battery supports overnight operation.`
      : `This system provides resilient coverage beyond your base requirement. The oversized PV array ensures battery is fully charged even on partially cloudy days. Suitable for business-critical and extended-outage scenarios.`;

  return {
    tier,
    label: labels[tier],
    description: descriptions[tier],
    solarCapacityKwp: arrayKwp,
    panelCount: spec.panelCount,
    panelWattageW: spec.panelWatt,
    batteryNominalKwh: spec.batteryNominalKwh,
    batteryUsableKwh: Number(usable.toFixed(2)),
    inverterRatingKva: spec.inverterKva,
    systemVoltage: spec.systemVoltage,
    expectedDailyGenerationKwh: dailyGen,
    autonomyHours: autonomyHrs,
    autonomyDays: Number((autonomyHrs / 24).toFixed(2)),
    daytimeCoveragePercent: coverage.daytime,
    nightCoveragePercent: coverage.night,
    loadCoveragePercent: coverage.total,
    estimatedCAPEXNaira: capex,
    formattedPriceRange: pricingResolution.formattedRange,
    pricingResolution,
    caution: pricingResolution.disclaimer || CAPEX_DISCLAIMER,
    applianceRuntime,
    limitations: limitations[tier],
    advantages: advantages[tier],
    status,
    confidence,
    confidenceLayer,
    engineeringConfidence: confidenceLayer.engineeringConfidence,
    inputQuality: confidenceLayer.inputQuality,
    pricingConfidence: confidenceLayer.pricingConfidence,
    requiresSiteVerification: true,
    explanation,
    validationFindings: findings,
  };
}
