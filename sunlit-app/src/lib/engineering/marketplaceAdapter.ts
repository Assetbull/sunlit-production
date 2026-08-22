/**
 * Marketplace & Installer RFP Handoff Adapter
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Bridges preliminary engineering calculations into Sunlit Marketplace RFQs:
 * - Creates structured Request for Proposals (RFP) for verified installer bidding
 * - Exports preliminary Bill of Materials (BOM)
 * - Defines scope of work (SOW) based on system specifications
 * - Tags certification level as PRELIMINARY_ESTIMATE requiring installer site survey
 */

import { SharedCalculationResult, RecommendedEquipmentItem } from './types';
import { UnifiedSolarSystemResult } from './core/calculationPipeline';

export interface MarketplaceInstallerRfp {
  rfqId: string;
  toolId: string;
  systemCapacityKw: number;
  inverterRatingKva: number;
  batteryCapacityKwh: number;
  batteryChemistry?: string;
  estimatedBudgetNaira: number;
  location: string;
  certificationLevel: string;
  createdAt: string;
  status: 'DRAFT' | 'PUBLISHED_TO_MARKETPLACE';
  scopeOfWork: string[];
  equipmentBOM: RecommendedEquipmentItem[];
  siteSurveyRequired: boolean;
}

export function createRfpFromCalculation(
  result: SharedCalculationResult,
  locationState: string = 'Lagos'
): MarketplaceInstallerRfp {
  const config = result.recommended_configuration;
  const kw = config.systemCapacityKw || 5;
  const invKva = config.inverterRatingKva || 5;
  const battKwh = config.batteryCapacityKwh || 10;

  // Approximate turnkey system cost estimation (~₦850,000 per installed kW for hybrid storage system)
  const estCost = Math.round(kw * 850000);

  const scopeOfWork: string[] = [
    `Supply and installation of ~${kw.toFixed(1)} kWp solar PV array and mounting structures`,
    `Installation and commissioning of ${invKva} kVA pure sine wave hybrid inverter with surge protection`,
    `Installation and DC busbar wiring for ~${battKwh.toFixed(1)} kWh battery storage system`,
    'DC & AC surge protection device (SPD) integration and grounding installation',
    'Main distribution panel integration and essential/non-essential load separation',
    'System commissioning, parameter configuration, and performance verification testing',
  ];

  return {
    rfqId: `RFQ-ENG-${Date.now()}`,
    toolId: result.toolId,
    systemCapacityKw: kw,
    inverterRatingKva: invKva,
    batteryCapacityKwh: battKwh,
    estimatedBudgetNaira: estCost,
    location: locationState,
    certificationLevel: result.provenance?.certificationLevel || 'PRELIMINARY_ESTIMATE',
    createdAt: new Date().toISOString(),
    status: 'DRAFT',
    scopeOfWork,
    equipmentBOM: config.equipmentList || [],
    siteSurveyRequired: true,
  };
}

export function createRfpFromUnifiedPipeline(
  unified: UnifiedSolarSystemResult,
  locationState: string = 'Lagos'
): MarketplaceInstallerRfp {
  const rec = unified.recommendations.recommended;
  const kw = rec.solarCapacityKwp;
  const invKva = rec.inverterRatingKva;
  const battKwh = rec.batteryNominalKwh;

  const equipmentBOM: RecommendedEquipmentItem[] = [
    {
      id: 'pv-array-bom',
      name: `${rec.panelCount}× ${rec.panelWattageW}W Tier-1 Solar PV Modules (${rec.solarCapacityKwp} kWp total)`,
      category: 'panel',
      specifications: { capacityKwp: rec.solarCapacityKwp, panelWattage: rec.panelWattageW },
      recommendedQuantity: rec.panelCount,
      reason: `Sized for ${rec.expectedDailyGenerationKwh.toFixed(1)} kWh/day expected generation`,
    },
    {
      id: 'hybrid-inverter-bom',
      name: `${rec.inverterRatingKva} kVA Pure Sine Wave Hybrid Solar Inverter (${rec.systemVoltage}V DC)`,
      category: 'inverter',
      specifications: { kva: rec.inverterRatingKva, voltage: rec.systemVoltage },
      recommendedQuantity: 1,
      reason: 'Sized to cover continuous peak demand and motor startup surges',
    },
    {
      id: 'battery-bank-bom',
      name: `${rec.batteryNominalKwh} kWh LiFePO4 Lithium Battery Storage (${rec.batteryUsableKwh} kWh usable @ 80% DoD)`,
      category: 'battery',
      specifications: { nominalKwh: rec.batteryNominalKwh, usableKwh: rec.batteryUsableKwh },
      recommendedQuantity: 1,
      reason: `Provides ~${rec.autonomyHours.toFixed(1)} hours of autonomous backup power`,
    },
  ];

  const scopeOfWork: string[] = [
    `Roof structural assessment and installation of ${rec.panelCount}× ${rec.panelWattageW}W PV modules (~${(rec.panelCount * 2.2).toFixed(0)} m² array area)`,
    `Installation and DC string termination for ${rec.inverterRatingKva} kVA hybrid inverter`,
    `Battery rack mounting, 48V DC busbar installation, and BMS communication configuration`,
    `AC/DC surge protection, double-pole isolators, and equipment grounding to earthing pit (< 5 Ohms)`,
    `Essential circuit rewiring in consumer unit for critical load backup`,
    `On-site commissioning and preliminary estimate validation with Project Owner`,
  ];

  return {
    rfqId: `RFQ-UNIFIED-${Date.now()}`,
    toolId: 'unified-pipeline',
    systemCapacityKw: kw,
    inverterRatingKva: invKva,
    batteryCapacityKwh: battKwh,
    batteryChemistry: 'LITHIUM_LIFEPO4',
    estimatedBudgetNaira: rec.estimatedCAPEXNaira,
    location: locationState,
    certificationLevel: 'ENGINEERING_ESTIMATE',
    createdAt: new Date().toISOString(),
    status: 'DRAFT',
    scopeOfWork,
    equipmentBOM,
    siteSurveyRequired: true,
  };
}

/**
 * Enterprise Structured Solar Assessment Payload
 * Governed by Section 7 & 27 of Sunlit Solar Engineering Standards.
 */
export interface StructuredSolarAssessmentPayload {
  customer_requirements: {
    property_type?: string;
    target_autonomy_hours?: number;
    backup_scope?: 'full' | 'essential';
    preferred_battery_chemistry?: string;
    monthly_bill_naira?: number;
    timeline?: string;
    notes?: string;
  };
  property_context: {
    state: string;
    city?: string;
    psh_annual_mean?: number;
  };
  appliances: Array<{
    name: string;
    power_watts: number;
    quantity: number;
    hours_per_day: number;
    is_critical?: boolean;
    surge_multiplier?: number;
    duty_cycle?: number;
  }>;
  load_summary: {
    daily_energy_kwh: number;
    peak_continuous_watts: number;
    peak_surge_watts: number;
    daytime_energy_kwh: number;
    nighttime_energy_kwh: number;
  };
  energy_summary: {
    annual_generation_kwh: number;
    estimated_annual_savings_naira: number;
    grid_tariff_naira_per_kwh: number;
  };
  peak_load_kw: number;
  surge_load_kw: number;
  backup_requirement_hours: number;
  recommended_options: {
    baseline: Record<string, any>;
    recommended: Record<string, any>;
    upgrade: Record<string, any>;
  };
  selected_option: 'BASELINE' | 'RECOMMENDED' | 'UPGRADE';
  equipment_references: RecommendedEquipmentItem[];
  pricing_reference: {
    pricing_source: string;
    reference_range_formatted: string;
    min_naira?: number;
    recommended_naira?: number;
    max_naira?: number;
    disclaimer: string;
  };
  assumptions: Record<string, any>;
  warnings: string[];
  confidence: {
    level: string;
    score: number;
    reasoning: string;
  };
  confidence_layer?: any;
  engineering_confidence?: string;
  input_quality?: string;
  pricing_confidence?: string;
  requires_site_verification?: boolean;
  commercial_phase?: string;
  calculation_version: string;
  created_at: string;
}

/**
 * Builds the canonical structured solar assessment payload for RFQ ingestion and persistence.
 */
export function buildStructuredSolarAssessmentPayload(
  pipelineResult: UnifiedSolarSystemResult,
  userContext: {
    propertyType?: string;
    state?: string;
    city?: string;
    selectedOptionTier?: 'BASELINE' | 'RECOMMENDED' | 'UPGRADE';
    notes?: string;
    timeline?: string;
    monthlyBillNaira?: number;
    targetInstallerId?: string;
    installerSlug?: string;
    facilityType?: string;
    customerPriority?: string;
  } = {}
): StructuredSolarAssessmentPayload {
  const selectedTier = userContext.selectedOptionTier || 'RECOMMENDED';
  const selectedRec =
    selectedTier === 'BASELINE'
      ? pipelineResult.recommendations.baseline
      : selectedTier === 'UPGRADE'
      ? pipelineResult.recommendations.upgrade
      : pipelineResult.recommendations.recommended;

  return {
    customer_requirements: {
      property_type: userContext.facilityType || userContext.propertyType || 'residential',
      target_autonomy_hours: selectedRec.autonomyHours,
      backup_scope: 'full',
      preferred_battery_chemistry: 'LITHIUM_LIFEPO4',
      monthly_bill_naira: userContext.monthlyBillNaira,
      timeline: userContext.timeline || 'Within 1 Month',
      notes: userContext.notes,
    },
    property_context: {
      state: userContext.state || 'Lagos',
      city: userContext.city || 'Lagos City',
      psh_annual_mean: 4.8,
    },
    appliances: (pipelineResult.normalizedLoad.itemCount > 0 && pipelineResult.individualResults.load?.engineering_results?.breakdown)
      ? pipelineResult.individualResults.load.engineering_results.breakdown.map((b: any) => ({
          name: b.name,
          power_watts: b.powerWatts,
          quantity: b.quantity,
          hours_per_day: b.hoursPerDay,
          is_critical: b.isCritical,
          surge_multiplier: b.surgeMultiplier || 1.0,
          duty_cycle: b.dutyCycle || 1.0,
        }))
      : [],
    load_summary: {
      daily_energy_kwh: pipelineResult.normalizedLoad.dailyEnergyKwh,
      peak_continuous_watts: pipelineResult.normalizedLoad.peakContinuousW,
      peak_surge_watts: pipelineResult.normalizedLoad.peakSurgeW,
      daytime_energy_kwh: pipelineResult.normalizedLoad.daytimeEnergyKwh,
      nighttime_energy_kwh: pipelineResult.normalizedLoad.nighttimeEnergyKwh,
    },
    energy_summary: {
      annual_generation_kwh: pipelineResult.summary.estimatedDailyGenerationKwh * 365,
      estimated_annual_savings_naira: pipelineResult.summary.estimatedAnnualSavingsNaira,
      grid_tariff_naira_per_kwh: 225,
    },
    peak_load_kw: Number((pipelineResult.normalizedLoad.peakContinuousW / 1000).toFixed(2)),
    surge_load_kw: Number((pipelineResult.normalizedLoad.peakSurgeW / 1000).toFixed(2)),
    backup_requirement_hours: selectedRec.autonomyHours,
    recommended_options: {
      baseline: pipelineResult.recommendations.baseline,
      recommended: pipelineResult.recommendations.recommended,
      upgrade: pipelineResult.recommendations.upgrade,
    },
    selected_option: selectedTier,
    equipment_references: [
      {
        id: 'solar-pv-bom',
        name: `${selectedRec.panelCount}× ${selectedRec.panelWattageW}W Tier-1 PV Modules (${selectedRec.solarCapacityKwp} kWp)`,
        category: 'panel',
        specifications: { capacityKwp: selectedRec.solarCapacityKwp, panelWattage: selectedRec.panelWattageW },
        recommendedQuantity: selectedRec.panelCount,
        reason: 'Sized to meet calculated daily solar generation requirements',
      },
      {
        id: 'inverter-bom',
        name: `${selectedRec.inverterRatingKva} kVA Pure Sine Wave Hybrid Inverter`,
        category: 'inverter',
        specifications: { kva: selectedRec.inverterRatingKva, systemVoltage: selectedRec.systemVoltage },
        recommendedQuantity: 1,
        reason: 'Sized to handle continuous load and motor startup surges',
      },
      {
        id: 'battery-bom',
        name: `${selectedRec.batteryNominalKwh} kWh LiFePO4 Battery Storage System`,
        category: 'battery',
        specifications: { nominalKwh: selectedRec.batteryNominalKwh, usableKwh: selectedRec.batteryUsableKwh },
        recommendedQuantity: 1,
        reason: 'Sized for designated autonomy and depth of discharge protection',
      },
    ],
    pricing_reference: {
      pricing_source: selectedRec.pricingResolution?.pricingSource || 'APPROVED_REFERENCE_DATASET',
      reference_range_formatted: selectedRec.formattedPriceRange || `₦${(selectedRec.estimatedCAPEXNaira * 0.9).toLocaleString('en-NG')} – ₦${(selectedRec.estimatedCAPEXNaira * 1.15).toLocaleString('en-NG')}`,
      min_naira: selectedRec.pricingResolution?.minEstimatedCapexNaira,
      recommended_naira: selectedRec.pricingResolution?.recommendedEstimatedCapexNaira || selectedRec.estimatedCAPEXNaira,
      max_naira: selectedRec.pricingResolution?.maxEstimatedCapexNaira,
      disclaimer: selectedRec.caution,
    },
    assumptions: {
      engine_version: pipelineResult.versionBlock.calculationEngineVersion,
      standards_profile: pipelineResult.versionBlock.standardsProfileVersion,
      equipment_dataset: pipelineResult.versionBlock.equipmentDatasetVersion,
    },
    warnings: pipelineResult.crossValidation?.findings?.map((f) => f.message) || [],
    confidence: {
      level: pipelineResult.confidence.level,
      score: pipelineResult.confidence.score,
      reasoning: pipelineResult.confidence.reasoning,
    },
    confidence_layer: selectedRec.confidenceLayer,
    engineering_confidence: selectedRec.engineeringConfidence || selectedRec.confidence,
    input_quality: selectedRec.inputQuality || 'HIGH',
    pricing_confidence: selectedRec.pricingConfidence || 'MEDIUM',
    requires_site_verification: true,
    commercial_phase: 'PRELIMINARY_RECOMMENDATION',
    calculation_version: pipelineResult.versionBlock.calculationEngineVersion,
    created_at: new Date().toISOString(),
  };
}
