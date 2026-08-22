/**
 * Unified Solar Engineering Calculation Pipeline
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Orchestrates deterministic multi-stage execution across all individual calculators:
 * 1. Normalized Load Profile Synthesis (from appliances, kWh, or utility bill)
 * 2. Battery Storage Capacity Sizing (autonomy, DoD, roundtrip efficiency)
 * 3. Pure Sine Wave Inverter Sizing (continuous kVA, surge handling, system voltage)
 * 4. Solar Array Sizing & Panel Selection (kWp, module count, deratings)
 * 5. PV String Layout Configuration (MPPT voltage boundaries, Voc cold, Vmp hot)
 * 6. Cable Sizing & Voltage Drop Analysis (DC battery & PV array wiring)
 * 7. Energy Yield & Monthly Production Estimations
 * 8. Financial Savings, OPEX, Payback Period, NPV, and IRR
 * 9. Multi-Tier Recommendation Synthesis (Baseline, Recommended, Upgrade)
 * 10. Cross-Calculator Physical Consistency & Boundary Validation
 */

import {
  SharedCalculationResult,
  V3NormalizedLoadProfile,
  V3SystemOption,
  V3ConfidenceAssessment,
  V3ValidationFinding,
} from '../types';
import { calculateLoad } from '../calculators/loadCalculator';
import { calculateBatteryCapacity } from '../calculators/batteryCapacity';
import { calculateInverterSizing } from '../calculators/inverterSizing';
import { calculateSolarPanelSizing } from '../calculators/solarPanelSizing';
import { calculatePvConfiguration } from '../calculators/pvConfiguration';
import { calculateCableSizing } from '../calculators/cableSizing';
import { calculateEnergyYield } from '../calculators/energyYield';
import { calculateSolarSavings } from '../calculators/solarSavings';
import { calculateRoi } from '../calculators/roiCalculator';
import { generateSystemRecommendations } from './recommendationEngine';
import { validateCrossCalculatorConsistency } from './crossCalculatorValidation';

import { assessConfidence } from './confidence';
import { buildVersionBlock, ENGINE_VERSION } from './envelope';
import { buildLoadProfile, buildProfileFromDailyKwh } from './loadProfile';
import { LOCATION_SOLAR_CATALOG } from '../catalog/equipmentCatalog';


export interface UnifiedPipelineInput {
  // Input Method & Load Data
  inputMethod?: 'APPLIANCE_LIST' | 'KWH_DIRECT' | 'MONTHLY_BILL' | 'COMBINED';
  appliances?: Array<{
    name: string;
    powerWatts: number;
    quantity: number;
    hoursPerDay: number;
    isCritical?: boolean;
    priority?: 'CRITICAL' | 'IMPORTANT' | 'FLEXIBLE' | 'NON_CRITICAL';
    surgeMultiplier?: number;
    dayUsageHours?: number;
    nightUsageHours?: number;
  }>;
  dailyKwhDemand?: number;
  monthlyBillNaira?: number;

  // Geographic & Siting Parameters
  location?: string;
  gridTariffNairaPerKwh?: number;
  generatorFuelCostNairaPerLiter?: number;
  generatorRunHoursDaily?: number;

  // Engineering System Preferences
  systemVoltage?: number;
  targetAutonomyHours?: number;
  batteryChemistry?: 'LITHIUM_LIFEPO4' | 'TUBULAR_GEL' | 'AGM';
  desiredDepthOfDischarge?: number;
  panelWattage?: number;
  inverterEfficiency?: number;
  cableRunLengthMeters?: number;

  // Meta & Gating
  userType?: string;
  projectType?: 'residential' | 'commercial' | 'industrial';
  correlationId?: string;
}

export interface UnifiedSolarSystemResult {
  pipelineStatus: 'SUCCESS' | 'WARNING' | 'FAILED';
  versionBlock: ReturnType<typeof buildVersionBlock>;
  confidence: V3ConfidenceAssessment;
  normalizedLoad: V3NormalizedLoadProfile;
  recommendations: {
    baseline: V3SystemOption;
    recommended: V3SystemOption;
    upgrade: V3SystemOption;
  };
  individualResults: {
    load: SharedCalculationResult;
    battery: SharedCalculationResult;
    inverter: SharedCalculationResult;
    solarPanel: SharedCalculationResult;
    pvConfiguration: SharedCalculationResult;
    cableSizing: SharedCalculationResult;
    energyYield: SharedCalculationResult;
    solarSavings: SharedCalculationResult;
    roi: SharedCalculationResult;
  };
  crossValidation: {
    isValid: boolean;
    findings: V3ValidationFinding[];
  };
  summary: {
    recommendedSolarCapacityKwp: number;
    recommendedBatteryCapacityKwh: number;
    recommendedInverterRatingKva: number;
    systemVoltageV: number;
    estimatedDailyGenerationKwh: number;
    estimatedAnnualSavingsNaira: number;
    estimatedSimplePaybackYears: number;
    estimatedCapexNaira: number;
  };
}

/**
 * Execute the end-to-end deterministic Solar Engineering Pipeline.
 */
export function executeSolarEngineeringPipeline(
  input: UnifiedPipelineInput
): UnifiedSolarSystemResult {
  const locationName = input.location || 'Lagos';
  const locationMeta = LOCATION_SOLAR_CATALOG.find((l) =>
    l.name.toLowerCase().includes(locationName.toLowerCase()) ||
    l.state.toLowerCase().includes(locationName.toLowerCase())
  ) || LOCATION_SOLAR_CATALOG[0];

  const psh = locationMeta.annualMeanPsh || 4.8;
  const gridTariff = input.gridTariffNairaPerKwh || 225;
  const sysVoltage = input.systemVoltage || 48;
  const batteryChem = input.batteryChemistry || 'LITHIUM_LIFEPO4';
  const panelWatt = input.panelWattage || 550;

  // 1. Stage 1: Load Sizing & Normalization
  let normalizedProfile: V3NormalizedLoadProfile;
  let loadResult: SharedCalculationResult;

  if (input.appliances && input.appliances.length > 0) {
    const profileRes = buildLoadProfile({
      items: input.appliances.map((a) => ({
        name: a.name,
        powerWatts: a.powerWatts,
        quantity: a.quantity,
        hoursPerDay: a.hoursPerDay,
        priority: a.priority || (a.isCritical ? 'CRITICAL' : 'IMPORTANT'),
        surgeMultiplier: a.surgeMultiplier || 1.0,
        dayUsageHours: a.dayUsageHours,
        nightUsageHours: a.nightUsageHours,
      })),
    });
    normalizedProfile = profileRes.profile;
    loadResult = calculateLoad({
      items: input.appliances.map((a) => ({
        name: a.name,
        powerWatts: a.powerWatts,
        quantity: a.quantity,
        hoursPerDay: a.hoursPerDay,
        isCritical: a.isCritical,
        surgeMultiplier: a.surgeMultiplier,
      })),
    });
  } else {
    const dailyKwh = input.dailyKwhDemand || (input.monthlyBillNaira ? input.monthlyBillNaira / gridTariff / 30 : 15);
    normalizedProfile = buildProfileFromDailyKwh(dailyKwh);
    loadResult = calculateLoad({
      items: [
        { name: 'Estimated Equivalent Load', powerWatts: Math.round((dailyKwh * 1000) / 12), quantity: 1, hoursPerDay: 12 },
      ],
    });
  }



  // 2. Stage 2: Battery Storage Sizing
  const nightKwh = normalizedProfile.nighttimeEnergyKwh || normalizedProfile.dailyEnergyKwh * 0.55;
  const batteryResult = calculateBatteryCapacity({
    dailyEnergyKwh: nightKwh,
    autonomyDays: (input.targetAutonomyHours ? input.targetAutonomyHours / 24 : 1.0),
    systemVoltage: sysVoltage,
    batteryChemistry: batteryChem,
    depthOfDischargePercent: input.desiredDepthOfDischarge || (batteryChem === 'LITHIUM_LIFEPO4' ? 80 : 50),
  });

  const batteryNominalKwh = (batteryResult.engineering_results as any).nominalBatteryCapacityKwh || 10;
  const batteryUsableKwh = (batteryResult.engineering_results as any).usableBatteryCapacityKwh || (batteryNominalKwh * 0.8);

  // 3. Stage 3: Inverter Sizing
  const inverterResult = calculateInverterSizing({
    continuousLoadWatts: normalizedProfile.peakContinuousW || 3000,
    surgeLoadWatts: normalizedProfile.peakSurgeW || 6000,
    systemVoltage: sysVoltage,
    powerFactor: 0.85,
    safetyMarginPercent: 25,
  });
  const inverterRatingKva = (inverterResult.engineering_results as any).recommendedInverterRatingKva || 5;

  // 4. Stage 4: Solar Panel Array Sizing
  const panelResult = calculateSolarPanelSizing({
    dailyEnergyDemandKwh: normalizedProfile.dailyEnergyKwh,
    peakSunHours: psh,
    panelWattage: panelWatt,
    systemLossFactor: 0.14,
  });

  const solarArrayKwp = (panelResult.engineering_results as any).requiredArrayCapacityKwp || 5.5;
  const totalPanelsCount = (panelResult.engineering_results as any).recommendedPanelsCount || 10;

  // 5. Stage 5: PV String Configuration
  const minSeriesModules = Math.max(4, Math.ceil(125 / 41.96));
  const modulesPerString = Math.max(minSeriesModules, Math.min(totalPanelsCount, Math.floor(totalPanelsCount / 2) || totalPanelsCount));
  const parallelStrings = Math.max(1, Math.ceil(totalPanelsCount / modulesPerString));
  const pvConfigResult = calculatePvConfiguration({
    totalModulesCount: totalPanelsCount,
    modulesPerString: modulesPerString,
    parallelStringsCount: parallelStrings,
  });


  // 6. Stage 6: DC Cable Sizing
  const maxDcCurrent = (inverterRatingKva * 1000) / sysVoltage;
  const cableResult = calculateCableSizing({
    circuitCurrentAmp: maxDcCurrent,
    systemVoltage: sysVoltage,
    cableLengthMeters: input.cableRunLengthMeters || 3,

    circuitType: 'DC_BATTERY',
  });
  const dcVoltageDropPct = (cableResult.engineering_results as any).calculatedVoltageDropPercent || 1.2;

  // 7. Stage 7: Energy Yield Estimation
  const yieldResult = calculateEnergyYield({
    systemCapacityKwp: solarArrayKwp,
    location: locationName,
    systemLossPercent: 14,
  });
  const dailyGenKwh = (yieldResult.engineering_results as any).dailyEnergyYieldKwh || (solarArrayKwp * psh * 0.86);

  // 8. Stage 8: Financial Savings & ROI
  const savingsResult = calculateSolarSavings({
    dailySolarGenKwh: dailyGenKwh,
    gridTariffNairaPerKwh: gridTariff,
    generatorFuelCostPerLiterNaira: input.generatorFuelCostNairaPerLiter || 1100,
    generatorDailyRunHours: input.generatorRunHoursDaily || 4,
    generatorFuelConsumptionLph: 2.5,
  });
  const annualSavings = (savingsResult.engineering_results as any).totalAnnualSavingsNaira || 2500000;

  const estimatedTurnkeyCapex = Math.round(
    (solarArrayKwp * 650000) +
    (batteryNominalKwh * 280000) +
    (inverterRatingKva * 120000) * 1.10
  );

  const roiResult = calculateRoi({
    systemCapexNaira: estimatedTurnkeyCapex,
    annualSavingsNaira: annualSavings,
    annualOpexNaira: estimatedTurnkeyCapex * 0.015,
    systemLifetimeYears: 25,
    discountRatePercent: 12,
  });
  const simplePayback = (roiResult.engineering_results as any).simplePaybackYears || 3.8;

  // 9. Stage 9: Multi-Tier Recommendation Synthesis
  const recResult = generateSystemRecommendations({
    loadProfile: normalizedProfile,
    location: locationName,
    loadItems: input.appliances ? input.appliances.map((a) => ({
      name: a.name,
      powerWatts: a.powerWatts,
      quantity: a.quantity,
      hoursPerDay: a.hoursPerDay,
      priority: a.priority || (a.isCritical ? 'CRITICAL' : 'IMPORTANT'),
      surgeMultiplier: a.surgeMultiplier || 1.0,
      dayUsageHours: a.dayUsageHours,
      nightUsageHours: a.nightUsageHours,
    })) : undefined,
    customerPriority: 'BALANCED',
  });
  const baselineOption = recResult.options.find((o) => o.tier === 'BASELINE') || recResult.options[0];
  const recommendedOption = recResult.options.find((o) => o.tier === 'RECOMMENDED') || recResult.options[1] || recResult.options[0];
  const upgradeOption = recResult.options.find((o) => o.tier === 'UPGRADE') || recResult.options[2] || recResult.options[0];

  const systemOptions = {
    baseline: baselineOption,
    recommended: recommendedOption,
    upgrade: upgradeOption,
  };



  // 10. Stage 10: Cross-Calculator Validation
  const maxApplianceHours = input.appliances && input.appliances.length > 0
    ? Math.max(...input.appliances.map((a) => a.hoursPerDay || 0))
    : 0;

  const crossValidation = validateCrossCalculatorConsistency({
    peakLoadContinuousWatts: normalizedProfile.peakContinuousW,
    peakLoadSurgeWatts: normalizedProfile.peakSurgeW,
    dailyEnergyKwh: normalizedProfile.dailyEnergyKwh,
    nightEnergyKwh: nightKwh,
    inverterRatingKva: inverterRatingKva,
    inverterSurgeKva: inverterRatingKva * 2,
    batteryNominalKwh: batteryNominalKwh,
    batteryUsableKwh: batteryUsableKwh,
    batteryVoltageV: systemOptions.recommended.systemVoltage,
    inverterDcVoltageV: systemOptions.recommended.systemVoltage,
    batteryChemistry: input.batteryChemistry || 'LITHIUM_LIFEPO4',
    autonomyDays: (input.targetAutonomyHours || 24) / 24,
    pvArrayKwp: solarArrayKwp,
    dailyGenerationKwh: dailyGenKwh,
    dcCableVoltageDropPercent: dcVoltageDropPct,
    maxApplianceDailyHours: maxApplianceHours,
  });

  // 11. Systematic Confidence Assessment
  const confidence = assessConfidence({
    providedRequiredFields: input.appliances && input.appliances.length > 0 ? 5 : (input.dailyKwhDemand ? 4 : 3),
    requiredFieldsTotal: 5,
    equipmentFromCatalog: true,
    specificEquipmentSelected: true,
    namedLocationUsed: Boolean(input.location),
    locationInCatalog: Boolean(locationMeta),
    systemComplexity: solarArrayKwp > 15 ? 0.4 : 0.2,
    hasValidationWarnings: !crossValidation.isValid,
    userOverrodAssumptions: false,
  });

  const pipelineStatus = !crossValidation.isValid
    ? 'WARNING'
    : (confidence.level === 'HIGH' ? 'SUCCESS' : 'WARNING');

  return {
    pipelineStatus,
    versionBlock: buildVersionBlock(),
    confidence,
    normalizedLoad: normalizedProfile,
    recommendations: systemOptions,
    individualResults: {
      load: loadResult,
      battery: batteryResult,
      inverter: inverterResult,
      solarPanel: panelResult,
      pvConfiguration: pvConfigResult,
      cableSizing: cableResult,
      energyYield: yieldResult,
      solarSavings: savingsResult,
      roi: roiResult,
    },
    crossValidation,
    summary: {
      recommendedSolarCapacityKwp: systemOptions.recommended.solarCapacityKwp,
      recommendedBatteryCapacityKwh: systemOptions.recommended.batteryNominalKwh,
      recommendedInverterRatingKva: systemOptions.recommended.inverterRatingKva,
      systemVoltageV: systemOptions.recommended.systemVoltage,
      estimatedDailyGenerationKwh: systemOptions.recommended.expectedDailyGenerationKwh,
      estimatedAnnualSavingsNaira: annualSavings,
      estimatedSimplePaybackYears: simplePayback,
      estimatedCapexNaira: systemOptions.recommended.estimatedCAPEXNaira || estimatedTurnkeyCapex,
    },
  };
}
