import { SharedCalculationResult } from './types';

export interface MarketplaceInstallerRfp {
  rfqId: string;
  toolId: string;
  systemCapacityKw: number;
  inverterRatingKva: number;
  batteryCapacityKwh: number;
  estimatedBudgetNaira: number;
  location: string;
  createdAt: string;
  status: 'DRAFT' | 'PUBLISHED_TO_MARKETPLACE';
}

export function createRfpFromCalculation(
  result: SharedCalculationResult,
  locationState: string = 'Lagos'
): MarketplaceInstallerRfp {
  const config = result.recommended_configuration;
  const kw = config.systemCapacityKw || 5;

  // Approximate turnkey system cost estimation (~₦850,000 per installed kW for hybrid storage system)
  const estCost = Math.round(kw * 850000);

  return {
    rfqId: `RFQ-ENG-${Date.now()}`,
    toolId: result.toolId,
    systemCapacityKw: kw,
    inverterRatingKva: config.inverterRatingKva || 5,
    batteryCapacityKwh: config.batteryCapacityKwh || 10,
    estimatedBudgetNaira: estCost,
    location: locationState,
    createdAt: new Date().toISOString(),
    status: 'DRAFT',
  };
}
