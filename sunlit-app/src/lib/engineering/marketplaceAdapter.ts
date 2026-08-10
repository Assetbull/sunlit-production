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
