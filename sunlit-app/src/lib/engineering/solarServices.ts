/**
 * Sunlit Solar Intelligence & Shared Domain Services
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Authoritative, reusable solar domain services.
 * Governed by Section 1, 4, 6, 7 & 8 of Sunlit Solar Engineering Standards.
 *
 * ALL solar experiences (Tools, Project Owner Assessment, Request a Quote,
 * Installer Workspace, RFQ creation, AI / WhatsApp bots) MUST consume these
 * canonical services.
 */

import { runEngineeringCalculation } from './engine';
import { executeSolarEngineeringPipeline, UnifiedPipelineInput, UnifiedSolarSystemResult } from './core/calculationPipeline';
import { generateSystemRecommendations, RecommendationInput, RecommendationResult } from './core/recommendationEngine';
import { resolveSolarPricing, SolarSystemPricingInput, SolarPricingResolution } from './core/pricingResolver';
import { calculateLoad, LoadItem } from './calculators/loadCalculator';
import { calculateBatteryCapacity, BatteryCapacityInput } from './calculators/batteryCapacity';
import { calculateInverterSizing, InverterSizingInput } from './calculators/inverterSizing';
import { calculateSolarPanelSizing, SolarPanelSizingInput } from './calculators/solarPanelSizing';
import { calculateSolarSystemSizing, SolarSystemSizingInput as CoreSolarSystemSizingInput } from './calculators/solarSystemSizing';
import { calculatePvConfiguration, PvConfigurationInput } from './calculators/pvConfiguration';
import { calculateCableSizing, CableSizingInput } from './calculators/cableSizing';
import { calculateEnergyYield, EnergyYieldInput } from './calculators/energyYield';
import { calculateSolarSavings, SolarSavingsInput } from './calculators/solarSavings';
import { calculateRoi, RoiInput } from './calculators/roiCalculator';
import { createRfpFromUnifiedPipeline, MarketplaceInstallerRfp } from './marketplaceAdapter';
import { SharedCalculationResult } from './types';
import { APPLIANCE_CATALOG, searchApplianceCatalog, createManualAppliance, resolveApplianceInput, StructuredApplianceModel } from './catalog/applianceCatalog';
import { PV_MODULE_CATALOG, INVERTER_CATALOG, BATTERY_CATALOG, LOCATION_SOLAR_CATALOG } from './catalog/equipmentCatalog';

export const SolarLoadService = {
  calculate: (input: { items: LoadItem[] }): SharedCalculationResult => calculateLoad(input),
  searchAppliances: searchApplianceCatalog,
  resolveInput: resolveApplianceInput,
  createManualAppliance,
  catalog: APPLIANCE_CATALOG,
};

export const BatterySizingService = {
  calculate: (input: BatteryCapacityInput): SharedCalculationResult => calculateBatteryCapacity(input),
  catalog: BATTERY_CATALOG,
};

export const InverterSizingService = {
  calculate: (input: InverterSizingInput): SharedCalculationResult => calculateInverterSizing(input),
  catalog: INVERTER_CATALOG,
};

export const PVSizingService = {
  calculate: (input: SolarPanelSizingInput): SharedCalculationResult => calculateSolarPanelSizing(input),
  catalog: PV_MODULE_CATALOG,
};

export const PVStringService = {
  calculate: (input: PvConfigurationInput): SharedCalculationResult => calculatePvConfiguration(input),
};

export const CableSizingService = {
  calculate: (input: CableSizingInput): SharedCalculationResult => calculateCableSizing(input),
};

export const EnergyYieldService = {
  calculate: (input: EnergyYieldInput): SharedCalculationResult => calculateEnergyYield(input),
  locations: LOCATION_SOLAR_CATALOG,
};

export const SolarSavingsService = {
  calculate: (input: SolarSavingsInput): SharedCalculationResult => calculateSolarSavings(input),
};

export const SolarROIService = {
  calculate: (input: RoiInput): SharedCalculationResult => calculateRoi(input),
};

export const SolarRecommendationService = {
  generateOptions: (input: RecommendationInput): RecommendationResult => generateSystemRecommendations(input),
};

export const SolarPricingResolver = {
  resolve: (input: SolarSystemPricingInput): SolarPricingResolution => resolveSolarPricing(input),
};

export const SolarSizingService = {
  calculateSystem: (input: CoreSolarSystemSizingInput): SharedCalculationResult => calculateSolarSystemSizing(input),
  executePipeline: (input: UnifiedPipelineInput): UnifiedSolarSystemResult => executeSolarEngineeringPipeline(input),
};

export const SolarRfqService = {
  createStructuredRfp: (result: UnifiedSolarSystemResult, locationState?: string): MarketplaceInstallerRfp =>
    createRfpFromUnifiedPipeline(result, locationState),
};

/**
 * Universal Unified Calculation Entry Point
 */
export function executeAuthoritativeSolarCalculation(toolId: string, inputData: Record<string, unknown>, correlationId?: string): SharedCalculationResult {
  return runEngineeringCalculation(toolId, inputData, correlationId);
}
