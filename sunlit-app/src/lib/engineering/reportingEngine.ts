import { SharedCalculationResult, AccessTier } from './types';
import { getFeatureFlags } from './featureFlags';

export interface EngineeringReport {
  reportId: string;
  generatedAt: string;
  toolId: string;
  title: string;
  accessTier: AccessTier;
  summary: Record<string, any>;
  equipmentBOM: any[];
  engineeringAssumptions: Record<string, any>;
  notes: string[];
  warnings: any[];
  confidence: string;
  isUnlocked: boolean;
}

export function generateEngineeringReport(
  result: SharedCalculationResult,
  tier: AccessTier = 'PUBLIC'
): EngineeringReport {
  const flags = getFeatureFlags(tier);
  const isUnlocked = flags.canViewDetailedCalculations;

  return {
    reportId: `RPT-${result.toolId.toUpperCase()}-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    toolId: result.toolId,
    title: `Sunlit Certified Engineering Report — ${result.toolId.replace(/-/g, ' ').toUpperCase()}`,
    accessTier: tier,
    summary: result.engineering_results,
    equipmentBOM: isUnlocked ? result.recommended_configuration.equipmentList || [] : [],
    engineeringAssumptions: result.assumptions,
    notes: result.supporting_notes,
    warnings: result.warnings,
    confidence: result.confidence,
    isUnlocked,
  };
}
