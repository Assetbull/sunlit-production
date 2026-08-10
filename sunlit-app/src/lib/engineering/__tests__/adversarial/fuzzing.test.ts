import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { runEngineeringCalculation } from '../../engine';

describe('Adversarial Test Suite — Input Fuzzing & Structural Abuse', () => {
  const ALL_TOOLS = [
    'load-calculator',
    'battery-capacity',
    'inverter-sizing',
    'solar-panel-sizing',
    'solar-system-sizing',
    'cable-sizing',
    'pv-configuration',
    'energy-yield',
    'solar-savings',
    'roi-calculator',
  ];

  test('Fuzzing with NaN, Infinity, -Infinity rejected across all tools', () => {
    ALL_TOOLS.forEach((toolId) => {
      const toxicInputs = [
        { dailyEnergyDemandKwh: NaN, continuousLoadWatts: NaN, systemVoltage: NaN },
        { dailyEnergyDemandKwh: Infinity, continuousLoadWatts: Infinity, systemVoltage: Infinity },
        { dailyEnergyDemandKwh: -Infinity, continuousLoadWatts: -Infinity, systemVoltage: -Infinity },
      ];

      toxicInputs.forEach((badInput) => {
        const result = runEngineeringCalculation(toolId, badInput as Record<string, unknown>);
        assert.ok(
          result.calculation_status === 'VALIDATION_ERROR' ||
          result.calculation_status === 'ENGINE_ERROR' ||
          result.validation_status.isValid === false,
          `Tool ${toolId} should reject non-finite input`
        );
        // Ensure no NaN or Infinity exists in output results
        const jsonString = JSON.stringify(result);
        assert.ok(!jsonString.includes('NaN'), `Tool ${toolId} output must not contain NaN`);
        assert.ok(!jsonString.includes('Infinity'), `Tool ${toolId} output must not contain Infinity`);
      });
    });
  });

  test('Fuzzing with null, undefined, and non-object payloads fails safely', () => {
    ALL_TOOLS.forEach((toolId) => {
      // Non-object or empty inputs
      const result1 = runEngineeringCalculation(toolId, {} as Record<string, unknown>);
      assert.ok(result1.validation_status !== undefined);

      const result2 = runEngineeringCalculation(toolId, {
        items: null,
        dailyEnergyKwh: null,
        systemCapexNaira: undefined,
      } as unknown as Record<string, unknown>);

      assert.ok(result2.calculation_status !== 'SUCCESS' || result2.validation_status.isValid === false);
    });
  });

  test('Fuzzing with prototype pollution keys is neutralized', () => {
    const maliciousPayload = JSON.parse(
      '{"__proto__": {"isAdmin": true}, "constructor": {"prototype": {"polluted": true}}, "dailyEnergyDemandKwh": 20}'
    );

    const result = runEngineeringCalculation('solar-panel-sizing', maliciousPayload);
    assert.equal((Object.prototype as any).polluted, undefined);
    assert.equal((Object.prototype as any).isAdmin, undefined);
    assert.ok(result.calculation_status === 'SUCCESS');
  });

  test('Fuzzing with massive appliance arrays (>200 items) is rejected safely', () => {
    const hugeItemsList = Array.from({ length: 300 }, (_, i) => ({
      name: `Appliance ${i}`,
      powerWatts: 100,
      quantity: 1,
      hoursPerDay: 4,
    }));

    const result = runEngineeringCalculation('load-calculator', { items: hugeItemsList });
    assert.equal(result.calculation_status, 'VALIDATION_ERROR');
    assert.ok(result.validation_status.errors.some((e) => e.includes('exceeds maximum allowed limit')));
  });

  test('Fuzzing with absurdly large numbers (>1e12) is rejected by boundary validation', () => {
    const result = runEngineeringCalculation('roi-calculator', {
      systemCapexNaira: 1e15, // 1 Quadrillion Naira
      annualSavingsNaira: 1e15,
    });
    assert.equal(result.calculation_status, 'VALIDATION_ERROR');
  });
});
