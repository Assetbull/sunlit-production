import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { executeSolarEngineeringPipeline } from '../core/calculationPipeline';
import { validateCrossCalculatorConsistency } from '../core/crossCalculatorValidation';

describe('Unified Solar Engineering Calculation Pipeline', () => {
  test('Executes end-to-end pipeline with appliance list', () => {
    const result = executeSolarEngineeringPipeline({
      inputMethod: 'APPLIANCE_LIST',
      location: 'Lagos',
      systemVoltage: 48,
      appliances: [
        { name: '1.5HP Inverter AC', powerWatts: 1200, quantity: 2, hoursPerDay: 8, isCritical: false, dayUsageHours: 6, nightUsageHours: 2 },
        { name: 'Double Door Refrigerator', powerWatts: 150, quantity: 1, hoursPerDay: 24, isCritical: true, dayUsageHours: 12, nightUsageHours: 12 },
        { name: 'LED Lighting (10 bulbs)', powerWatts: 90, quantity: 1, hoursPerDay: 6, isCritical: true, dayUsageHours: 0, nightUsageHours: 6 },
        { name: 'Starlink Internet + Router', powerWatts: 65, quantity: 1, hoursPerDay: 24, isCritical: true, dayUsageHours: 12, nightUsageHours: 12 },
      ],
      targetAutonomyHours: 12,
    });

    // 1. Pipeline status and versions
    assert.ok(result.pipelineStatus === 'SUCCESS' || result.pipelineStatus === 'WARNING');
    assert.equal(result.versionBlock.calculationEngineVersion, '3.0.0');
    assert.ok(result.confidence.score > 0);

    // 2. Normalized Load Profile
    assert.ok(result.normalizedLoad.dailyEnergyKwh > 0);
    assert.ok(result.normalizedLoad.peakContinuousW > 1000);
    assert.ok(result.normalizedLoad.peakSurgeW >= result.normalizedLoad.peakContinuousW);

    // 3. Multi-tier recommendations
    assert.ok(result.recommendations.baseline !== undefined);
    assert.ok(result.recommendations.recommended !== undefined);
    assert.ok(result.recommendations.upgrade !== undefined);
    assert.ok(result.recommendations.recommended.solarCapacityKwp >= result.recommendations.baseline.solarCapacityKwp);
    assert.ok(result.recommendations.upgrade.batteryNominalKwh >= result.recommendations.recommended.batteryNominalKwh);

    // 4. Individual calculator outputs
    assert.equal(result.individualResults.load.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.battery.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.inverter.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.solarPanel.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.pvConfiguration.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.cableSizing.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.energyYield.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.solarSavings.calculation_status, 'SUCCESS');
    assert.equal(result.individualResults.roi.calculation_status, 'SUCCESS');

    // 5. Cross-calculator physical consistency
    assert.equal(result.crossValidation.isValid, true);
    assert.ok(result.summary.recommendedSolarCapacityKwp > 0);
    assert.ok(result.summary.estimatedAnnualSavingsNaira > 0);
  });

  test('Cross-Calculator Validator catches undersized inverter vs peak load', () => {
    const validation = validateCrossCalculatorConsistency({
      peakLoadContinuousWatts: 6000,
      inverterRatingKva: 3.5, // 3.5 kVA * 0.85 PF = 2975 W < 6000 W -> BLOCKED
    });

    assert.equal(validation.isValid, false);
    assert.ok(validation.findings.some((f) => f.code === 'INSUFFICIENT_INVERTER_CONTINUOUS_CAPACITY'));
  });

  test('Cross-Calculator Validator catches excessive DC cable voltage drop', () => {
    const validation = validateCrossCalculatorConsistency({
      dcCableVoltageDropPercent: 3.8, // > 3.0% -> BLOCKED
    });

    assert.equal(validation.isValid, false);
    assert.ok(validation.findings.some((f) => f.code === 'CABLE_EXCESSIVE_VOLTAGE_DROP'));
  });

  test('Cross-Calculator Validator blocks battery and inverter voltage mismatch', () => {
    const validation = validateCrossCalculatorConsistency({
      batteryVoltageV: 48,
      inverterDcVoltageV: 24,
    });

    assert.equal(validation.isValid, false);
    assert.ok(validation.findings.some((f) => f.code === 'BATTERY_INVERTER_VOLTAGE_MISMATCH'));
  });

  test('Cross-Calculator Validator raises warning for abnormal PV to Inverter ratio', () => {
    const validation = validateCrossCalculatorConsistency({
      pvArrayKwp: 12.0,
      inverterRatingKva: 5.0, // DC/AC ratio: 12.0 / (5.0 * 0.85) = 2.82 > 1.65
    });

    assert.ok(validation.findings.some((f) => f.code === 'PV_INVERTER_RATIO_SEVERE_CLIPPING'));
  });

  test('Cross-Calculator Validator warns when battery nominal storage is massively oversized', () => {
    const validation = validateCrossCalculatorConsistency({
      dailyEnergyKwh: 10,
      batteryNominalKwh: 60, // 6x daily energy & >= 30 kWh
    });

    assert.ok(validation.findings.some((f) => f.code === 'BATTERY_MASSIVELY_OVERSIZED'));
  });
});
