import { AccessTier } from './types';

export interface FeatureFlagRules {
  canViewBasicSummary: boolean;
  canViewDetailedCalculations: boolean;
  canViewEquipmentRecommendations: boolean;
  canViewBOM: boolean;
  canExportPDF: boolean;
  canSaveProject: boolean;
  canAccessInstallerQuotes: boolean;
  canAccessAdvancedSimulation: boolean;
}

export function getFeatureFlags(tier: AccessTier = 'PUBLIC'): FeatureFlagRules {
  switch (tier) {
    case 'ENTERPRISE':
    case 'EPC':
    case 'INSTALLER':
      return {
        canViewBasicSummary: true,
        canViewDetailedCalculations: true,
        canViewEquipmentRecommendations: true,
        canViewBOM: true,
        canExportPDF: true,
        canSaveProject: true,
        canAccessInstallerQuotes: true,
        canAccessAdvancedSimulation: true,
      };

    case 'REGISTERED':
      return {
        canViewBasicSummary: true,
        canViewDetailedCalculations: true,
        canViewEquipmentRecommendations: true,
        canViewBOM: true,
        canExportPDF: true,
        canSaveProject: true,
        canAccessInstallerQuotes: true,
        canAccessAdvancedSimulation: false,
      };

    case 'PUBLIC':
    default:
      return {
        canViewBasicSummary: true,
        canViewDetailedCalculations: false,
        canViewEquipmentRecommendations: false,
        canViewBOM: false,
        canExportPDF: false,
        canSaveProject: false,
        canAccessInstallerQuotes: true,
        canAccessAdvancedSimulation: false,
      };
  }
}
