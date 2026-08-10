/**
 * Sunlit Enterprise Engineering Platform
 * V3 Master Type Contract
 * Engine Version 3.0.0
 */

// ============================================================
// EXISTING V2 TYPES (preserved for backward compatibility)
// ============================================================

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

// ============================================================
// V3 ENGINEERING PLATFORM — EXTENDED TYPE CONTRACTS
// ============================================================

/**
 * V3 Explicit Certification Level.
 * Never claim FINAL_ENGINEERING_DESIGN without the required evidence workflow.
 */
export type CalculationCertificationLevel =
  | 'PRELIMINARY_ESTIMATE'
  | 'ENGINEERING_ESTIMATE'
  | 'VALIDATED'
  | 'REQUIRES_ENGINEER_REVIEW'
  | 'FINAL_ENGINEERING_DESIGN';

/**
 * V3 Calculation Version Block.
 * Every result must carry full provenance for reproducibility and auditability.
 * Identical inputs + versions must produce identical outputs.
 */
export interface V3CalculationVersionBlock {
  calculationEngineVersion: string;  // e.g. '3.0.0'
  toolVersion: string;               // e.g. '3.0.0'
  formulaVersion: string;            // e.g. '3.0.0'
  standardsProfileVersion: string;   // e.g. 'NG-DEFAULT-1.0'
  equipmentDatasetVersion: string;   // e.g. '2026.1'
  locationDatasetVersion: string;    // e.g. '2026.1'
  assumptionProfileVersion: string;  // e.g. 'DEFAULT-3.0'
  calculatedAt: string;              // ISO 8601 timestamp
}

/**
 * V3 Result Provenance Block.
 * Explains WHY a result was produced and what data sources were used.
 * Enables engineers to reproduce calculations from archived snapshots.
 */
export interface V3ResultProvenance {
  inputMethod: 'APPLIANCE_LIST' | 'KWH_DIRECT' | 'MONTHLY_BILL' | 'COMBINED';
  locationSource: 'CATALOG' | 'USER_SUPPLIED' | 'DEFAULT';
  equipmentSource: 'CATALOG' | 'USER_SUPPLIED' | 'DEFAULT';
  assumptionSource: 'REGISTRY' | 'USER_OVERRIDDEN';
  certificationLevel: CalculationCertificationLevel;
  warnings: string[];
  calculationId: string;
}

/**
 * V3 Structured Validation Finding.
 * Replaces simple error strings with structured status + recovery actions.
 */
export interface V3ValidationFinding {
  code: string;
  severity: 'PASS' | 'WARNING' | 'BLOCKED' | 'INVALID' | 'REQUIRES_REVIEW';
  category: string;
  message: string;
  affectedComponent: string;
  recommendedAction: string;
}

/**
 * V3 Confidence Assessment.
 * Systematic scoring from input completeness, data quality, and complexity.
 * Never present LOW confidence results as HIGH confidence.
 */
export interface V3ConfidenceAssessment {
  level: ConfidenceLevel;
  score: number;              // 0–100 numeric score
  reasoning: string;
  factors: {
    inputCompleteness: number;    // 0–1 (proportion of required inputs provided)
    equipmentQuality: number;     // 0–1 (catalog vs default vs custom)
    locationQuality: number;      // 0–1 (named city vs geographic default)
    complexityPenalty: number;    // 0–1 (higher = more complex = lower confidence)
  };
}

/**
 * Solar Engineering Confidence Layer
 * Governed by Enterprise Solar Engineering Transparency Standards
 */
export interface SolarEngineeringConfidenceLayer {
  engineeringConfidence: 'HIGH' | 'MODERATE' | 'REVIEW_RECOMMENDED';
  inputQuality: 'HIGH' | 'MODERATE' | 'LOW';
  pricingConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNAVAILABLE';
  requiresSiteVerification: boolean;
  score: number;
  reasoning: string;
  factorBreakdown: {
    inputCompletenessScore: number;
    equipmentGroundingScore: number;
    locationResolutionScore: number;
    loadDynamicsClarityScore: number;
  };
}

/**
 * V3 Appliance Runtime Result.
 * Per-appliance coverage analysis showing what can actually run,
 * accounting for battery usable capacity, efficiency, and system constraints.
 * Do NOT show misleading theoretical runtime.
 */
export interface V3ApplianceRuntime {
  appliance: string;
  requestedHours: number;
  supportedHours: number;
  coverage: 'FULL' | 'PARTIAL' | 'DAYLIGHT_ONLY' | 'BACKUP_ONLY' | 'NOT_SUPPORTED' | 'REQUIRES_LOAD_SHIFT';
  period: 'DAYLIGHT' | 'NIGHT' | 'BOTH' | 'N/A';
  explanation: string;
}

/**
 * V3 System Option — one of Baseline / Recommended / Upgrade.
 * Generated by the Recommendation Engine from the normalized load profile.
 * Every option must explain: WHY this system, WHY NOT smaller, WHY NOT larger.
 */
export interface V3SystemOption {
  tier: 'BASELINE' | 'RECOMMENDED' | 'UPGRADE';
  label: string;
  description: string;
  solarCapacityKwp: number;
  panelCount: number;
  panelWattageW: number;
  batteryNominalKwh: number;
  batteryUsableKwh: number;
  inverterRatingKva: number;
  systemVoltage: number;
  expectedDailyGenerationKwh: number;
  autonomyHours: number;
  autonomyDays: number;
  daytimeCoveragePercent: number;
  nightCoveragePercent: number;
  loadCoveragePercent: number;
  estimatedCAPEXNaira: number;
  formattedPriceRange?: string;
  pricingResolution?: any;
  caution: string;                      // Required disclaimer on cost estimates
  applianceRuntime: V3ApplianceRuntime[];
  limitations: string[];
  advantages: string[];
  status: 'PASS' | 'WARNING' | 'CONSTRAINED';
  confidence: ConfidenceLevel;
  confidenceLayer?: SolarEngineeringConfidenceLayer;
  engineeringConfidence?: 'HIGH' | 'MODERATE' | 'REVIEW_RECOMMENDED';
  inputQuality?: 'HIGH' | 'MODERATE' | 'LOW';
  pricingConfidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNAVAILABLE';
  requiresSiteVerification?: boolean;
  explanation: string;
  validationFindings: V3ValidationFinding[];
}

/**
 * V3 Normalized Load Profile.
 * The canonical intermediate representation produced by the Load Profile Engine.
 * Consumed by the Recommendation Engine and all downstream calculators.
 * This is the primary input for battery, inverter, solar array, yield, savings, ROI sizing.
 */
export interface V3NormalizedLoadProfile {
  dailyEnergyKwh: number;
  peakContinuousW: number;
  peakSurgeW: number;
  daytimeEnergyKwh: number;         // During solar production hours (typically 08:00–18:00)
  nighttimeEnergyKwh: number;       // Battery-backed hours
  criticalEnergyKwh: number;        // CRITICAL priority loads only
  importantEnergyKwh: number;       // IMPORTANT priority loads
  flexibleEnergyKwh: number;        // FLEXIBLE / daytime-shiftable loads
  nonCriticalEnergyKwh: number;     // NON_CRITICAL — first to shed in constrained mode
  simultaneousLoadW: number;        // Max concurrent draw at any moment
  daytimeShiftableKwh: number;      // Loads that CAN be moved to daylight hours
  certificationLevel: CalculationCertificationLevel;
  itemCount: number;
  averagePowerFactor: number;
  monthlyEnergyKwh: number;
  annualEnergyKwh: number;
}

/**
 * V3 Load Priority Classification.
 * Applied per-appliance to enable constrained-mode operation.
 */
export type ApplianceLoadPriority = 'CRITICAL' | 'IMPORTANT' | 'FLEXIBLE' | 'NON_CRITICAL';

/**
 * Electrical Load Classification for accurate surge and duty modeling.
 */
export type LoadElectricalType = 'RESISTIVE' | 'INDUCTIVE_MOTOR' | 'ELECTRONIC' | 'HEATING' | 'INTERMITTENT';

/**
 * V3 Load Item — extended with explicit electrical dynamics and operating profile.
 */
export interface V3LoadItem {
  name: string;
  powerWatts: number;
  quantity: number;
  hoursPerDay: number;
  category?: string;
  loadType?: LoadElectricalType;
  ratedWatts?: number;                      // Continuous nameplate watts
  startingWatts?: number;                   // Peak starting/surge watts
  typicalOperatingWatts?: number;           // Actual average draw factoring duty cycle & PF
  simultaneityFactor?: number;              // Coincidence multiplier (0.1 to 1.0)
  isCritical?: boolean;                     // V2 backward compat
  priority?: ApplianceLoadPriority;         // V3 four-tier priority
  surgeMultiplier?: number;
  daysPerWeek?: number;
  powerFactor?: number;
  dutyCycle?: number;                       // 0.05 to 1.0
  voltage?: number;                         // e.g. 230V or 400V
  dayUsageHours?: number;                   // Hours during solar production period
  nightUsageHours?: number;                 // Hours during battery-backed period
  isDaytimeShiftable?: boolean;             // Can this appliance move to daylight?
  isInterruptible?: boolean;                // Can this appliance be paused?
}

/**
 * Extended SharedCalculationResult with optional V3 fields.
 * V2 fields are fully preserved for backward compatibility.
 * V3 fields are optional — existing calculators continue working without them.
 */
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

  // ---- V3 Extended Fields (optional — backward-compatible) ----
  /** V3 full calculation version block for auditability and reproducibility */
  calculation?: V3CalculationVersionBlock;
  /** V3 result provenance — data sources and certification level */
  provenance?: V3ResultProvenance;
  /** V3 structured validation findings with severity and recovery actions */
  v3Validation?: V3ValidationFinding[];
  /** V3 systematic confidence assessment with factor breakdown */
  v3Confidence?: V3ConfidenceAssessment;
  /** V3 system options (Baseline / Recommended / Upgrade) */
  systemOptions?: V3SystemOption[];
  /** V3 normalized load profile used as primary calculation input */
  normalizedInputs?: V3NormalizedLoadProfile;
}
