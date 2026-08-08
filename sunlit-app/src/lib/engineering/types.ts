export type AccessTier = 'PUBLIC' | 'REGISTERED' | 'INSTALLER' | 'EPC' | 'INTERNAL' | 'ENTERPRISE';

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'REVIEW_RECOMMENDED';

export type UserType =
  | 'Homeowner'
  | 'Business Owner'
  | 'Installer'
  | 'EPC Contractor'
  | 'Engineer'
  | 'Consultant'
  | 'Facility Manager'
  | 'Student'
  | 'Other';

export interface BaseToolInput {
  toolId: string;
  userType?: UserType;
  location?: string;
  projectType?: 'residential' | 'commercial' | 'industrial';
}

export interface EngineeringWarning {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  suggestion: string;
}

export interface RecommendedEquipmentItem {
  id: string;
  name: string;
  category: 'panel' | 'inverter' | 'battery' | 'cable' | 'accessory';
  specifications: Record<string, string | number>;
  recommendedQuantity: number;
  reason: string;
}

export interface SharedCalculationResult<TData = Record<string, any>> {
  toolId: string;
  calculation_status: 'SUCCESS' | 'VALIDATION_ERROR' | 'ENGINE_ERROR';
  confidence: ConfidenceLevel;
  confidenceReasoning: string;
  engineering_results: TData;
  recommended_configuration: {
    systemCapacityKw?: number;
    inverterRatingKva?: number;
    batteryCapacityKwh?: number;
    panelCount?: number;
    panelPowerWatt?: number;
    recommendedCableSizeMm2?: number;
    equipmentList?: RecommendedEquipmentItem[];
  };
  warnings: EngineeringWarning[];
  assumptions: Record<string, string | number>;
  supporting_notes: string[];
  engine_version: string;
  validation_status: {
    isValid: boolean;
    errors: string[];
  };
}

export interface WaitlistSubmission {
  email: string;
  full_name?: string;
  phone?: string;
  company?: string;
  user_type: UserType;
  interested_tool?: string;
  project_type?: string;
  location?: string;
  timeline?: string;
  source?: string;
  campaign?: string;
  referral?: string;
}
