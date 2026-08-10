/**
 * V3 Systematic Confidence Engine
 * Sunlit Enterprise Engineering Platform
 * Engine Version 3.0.0
 *
 * Replaces hardcoded 'HIGH'/'MODERATE'/'REVIEW_RECOMMENDED' confidence levels
 * with systematic scoring from observable properties of the calculation.
 *
 * Score is 0–100:
 *   90–100 → HIGH
 *   70–89  → MODERATE
 *   0–69   → REVIEW_RECOMMENDED
 *
 * Factors:
 *   1. Input completeness   — how many required inputs were provided
 *   2. Equipment quality    — catalog data vs defaults vs user-supplied custom
 *   3. Location quality     — named city vs geographic default vs missing
 *   4. Complexity penalty   — larger / more complex systems are harder to estimate
 *
 * Never lie about confidence. REVIEW_RECOMMENDED must be surfaced visibly.
 */

import { ConfidenceLevel, V3ConfidenceAssessment } from '../types';

export interface ConfidenceInput {
  /** Number of required inputs that were explicitly provided (0–requiredFieldsTotal) */
  providedRequiredFields: number;
  /** Total number of required input fields for this tool */
  requiredFieldsTotal: number;
  /** Was equipment from the catalog (vs user-supplied guesses)? */
  equipmentFromCatalog: boolean;
  /** Was a specific equipment model selected (vs default catalog pick)? */
  specificEquipmentSelected: boolean;
  /** Was a named location used (vs default)? */
  namedLocationUsed: boolean;
  /** Was the location found in the Sunlit location catalog? */
  locationInCatalog: boolean;
  /** Estimated system complexity (0–1 where 1 = highest complexity) */
  systemComplexity: number;
  /** Are any validation gates in WARNING or FAIL state? */
  hasValidationWarnings: boolean;
  /** Were any assumptions overridden by the user? */
  userOverrodAssumptions: boolean;
}

/**
 * Calculates a V3 confidence assessment from observable calculation properties.
 */
export function assessConfidence(input: ConfidenceInput): V3ConfidenceAssessment {
  // 1. Input completeness (0–1)
  const inputCompleteness = input.requiredFieldsTotal > 0
    ? Math.min(input.providedRequiredFields / input.requiredFieldsTotal, 1.0)
    : 1.0;

  // 2. Equipment quality (0–1)
  // Full catalog + specific selection = 1.0
  // Catalog but default selection = 0.8
  // User-supplied specs = 0.65
  let equipmentQuality: number;
  if (input.equipmentFromCatalog && input.specificEquipmentSelected) {
    equipmentQuality = 1.0;
  } else if (input.equipmentFromCatalog) {
    equipmentQuality = 0.80;
  } else {
    equipmentQuality = 0.65;
  }

  // 3. Location quality (0–1)
  // Named city in catalog = 1.0
  // Named city not in catalog = 0.7
  // No location (using default) = 0.5
  let locationQuality: number;
  if (input.namedLocationUsed && input.locationInCatalog) {
    locationQuality = 1.0;
  } else if (input.namedLocationUsed) {
    locationQuality = 0.70;
  } else {
    locationQuality = 0.50;
  }

  // 4. Complexity penalty (0–1, higher = more complex = larger penalty)
  // Includes: system size, validation warnings, assumption overrides
  let complexityPenalty = input.systemComplexity;
  if (input.hasValidationWarnings) complexityPenalty = Math.min(complexityPenalty + 0.1, 1.0);
  if (input.userOverrodAssumptions) complexityPenalty = Math.min(complexityPenalty + 0.05, 1.0);

  // Weighted composite score
  // Weights: completeness 40%, equipment 25%, location 25%, complexity penalty 10%
  const rawScore =
    (inputCompleteness * 40) +
    (equipmentQuality * 25) +
    (locationQuality * 25) -
    (complexityPenalty * 10);

  const score = Math.max(0, Math.min(100, Number(rawScore.toFixed(1))));

  // Map to ConfidenceLevel
  let level: ConfidenceLevel;
  if (score >= 90) level = 'HIGH';
  else if (score >= 70) level = 'MODERATE';
  else level = 'REVIEW_RECOMMENDED';

  // Build human-readable reasoning
  const reasons: string[] = [];
  if (inputCompleteness < 0.7) reasons.push(`Only ${Math.round(inputCompleteness * 100)}% of required inputs provided.`);
  if (!input.equipmentFromCatalog) reasons.push('Custom equipment specifications reduce confidence — no catalog verification.');
  else if (!input.specificEquipmentSelected) reasons.push('Default catalog selection used — provide specific model for higher confidence.');
  if (!input.namedLocationUsed) reasons.push('Location defaulted to Lagos — provide site location for accurate irradiance data.');
  else if (!input.locationInCatalog) reasons.push('Location not in Sunlit catalog — default Lagos irradiance data used.');
  if (input.hasValidationWarnings) reasons.push('One or more validation gates raised warnings.');
  if (input.userOverrodAssumptions) reasons.push('User-overridden assumptions detected — verify with engineering team.');

  const reasoning = reasons.length > 0
    ? reasons.join(' ')
    : `${level} confidence: all required inputs provided, equipment from catalog, named location verified.`;

  return {
    level,
    score,
    reasoning,
    factors: {
      inputCompleteness: Number(inputCompleteness.toFixed(3)),
      equipmentQuality: Number(equipmentQuality.toFixed(3)),
      locationQuality: Number(locationQuality.toFixed(3)),
      complexityPenalty: Number(complexityPenalty.toFixed(3)),
    },
  };
}

/**
 * Quick confidence assessment from completion fraction (0–1).
 * Used for simple V3 tool results where full assessment context is not available.
 */
export function quickConfidence(
  completionFraction: number,
  hasWarnings = false,
  fromCatalog = true,
): V3ConfidenceAssessment {
  return assessConfidence({
    providedRequiredFields: Math.round(completionFraction * 10),
    requiredFieldsTotal: 10,
    equipmentFromCatalog: fromCatalog,
    specificEquipmentSelected: fromCatalog,
    namedLocationUsed: true,
    locationInCatalog: true,
    systemComplexity: 0.2,
    hasValidationWarnings: hasWarnings,
    userOverrodAssumptions: false,
  });
}

/**
 * Confidence level from legacy string → V3 assessment.
 * Used as a compatibility bridge for existing calculators.
 */
export function legacyConfidenceToV3(
  level: ConfidenceLevel,
  reasoning: string,
): V3ConfidenceAssessment {
  const score = level === 'HIGH' ? 92 : level === 'MODERATE' ? 75 : 55;
  return {
    level,
    score,
    reasoning,
    factors: {
      inputCompleteness: level === 'HIGH' ? 1.0 : level === 'MODERATE' ? 0.8 : 0.6,
      equipmentQuality: level === 'HIGH' ? 1.0 : 0.8,
      locationQuality: 1.0,
      complexityPenalty: level === 'HIGH' ? 0.1 : 0.3,
    },
  };
}
