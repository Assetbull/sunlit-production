import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { assessConfidence } from '../core/confidence';

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
});
