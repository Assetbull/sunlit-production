import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { assessConfidence, buildSolarEngineeringConfidenceLayer } from '../core/confidence';

describe('Systematic Engineering Confidence Engine', () => {
  test('High completeness and catalog equipment yields HIGH confidence', () => {
    const assessment = assessConfidence({
      providedRequiredFields: 5,
      requiredFieldsTotal: 5,
      equipmentFromCatalog: true,
      specificEquipmentSelected: true,
      namedLocationUsed: true,
      locationInCatalog: true,
      systemComplexity: 0.1,
      hasValidationWarnings: false,
      userOverrodAssumptions: false,
    });

    assert.equal(assessment.level, 'HIGH');
    assert.ok(assessment.score >= 90);
    assert.equal(assessment.factors.inputCompleteness, 1.0);
    assert.equal(assessment.factors.equipmentQuality, 1.0);
    assert.equal(assessment.factors.locationQuality, 1.0);
  });

  test('Missing inputs and default location yields lower confidence score', () => {
    const assessment = assessConfidence({
      providedRequiredFields: 2,
      requiredFieldsTotal: 5,
      equipmentFromCatalog: false,
      specificEquipmentSelected: false,
      namedLocationUsed: false,
      locationInCatalog: false,
      systemComplexity: 0.5,
      hasValidationWarnings: true,
      userOverrodAssumptions: true,
    });

    assert.ok(assessment.score < 70);
    assert.equal(assessment.level, 'REVIEW_RECOMMENDED');
  });

  test('Multi-factor SolarEngineeringConfidenceLayer computes transparent breakdown', () => {
    const layer = buildSolarEngineeringConfidenceLayer({
      inputMethod: 'APPLIANCE_LIST',
      applianceCount: 5,
      hasCustomAppliances: false,
      hasDutyCycleOrHours: true,
      pricingSource: 'APPROVED_REFERENCE_DATASET',
      hasValidationWarnings: false,
      locationState: 'Lagos',
      systemKwp: 5.5,
    });

    assert.equal(layer.engineeringConfidence, 'HIGH');
    assert.equal(layer.inputQuality, 'HIGH');
    assert.equal(layer.pricingConfidence, 'MEDIUM');
    assert.equal(layer.requiresSiteVerification, true);
    assert.ok(layer.score >= 85);
    assert.ok(layer.factorBreakdown.inputCompletenessScore >= 90);
  });

  test('Fallback when price is unavailable reflects in pricing confidence', () => {
    const layer = buildSolarEngineeringConfidenceLayer({
      inputMethod: 'MONTHLY_BILL',
      applianceCount: 0,
      pricingSource: 'PRICE_UNAVAILABLE',
      hasValidationWarnings: true,
    });

    assert.equal(layer.pricingConfidence, 'UNAVAILABLE');
    assert.equal(layer.engineeringConfidence, 'REVIEW_RECOMMENDED');
    assert.equal(layer.requiresSiteVerification, true);
  });
});
