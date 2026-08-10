import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { runEngineeringCalculation } from '../../engine';

describe('Adversarial Test Suite — Engineering Boundaries & Physical Constraints', () => {
  test('Load Calculator: operating hours > 24 hours/day rejected', () => {
    const res = runEngineeringCalculation('load-calculator', {
      items: [{ name: 'Test AC', powerWatts: 1500, quantity: 1, hoursPerDay: 25 }],
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
    assert.ok(res.validation_status.errors.some((e) => e.includes('hoursPerDay')));
  });

  test('Load Calculator: negative power or quantity rejected', () => {
    const res = runEngineeringCalculation('load-calculator', {
      items: [{ name: 'Test AC', powerWatts: -500, quantity: -2, hoursPerDay: 4 }],
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('Battery Capacity: 0 or negative daily kWh rejected', () => {
    const res = runEngineeringCalculation('battery-capacity', {
      dailyEnergyKwh: -10,
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('Inverter Sizing: negative continuous load or invalid power factor rejected', () => {
    const res = runEngineeringCalculation('inverter-sizing', {
      continuousLoadWatts: -2000,
      powerFactor: 1.5, // PF cannot exceed 1.0
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('Cable Sizing: 0V or negative voltage rejected', () => {
    const res = runEngineeringCalculation('cable-sizing', {
      circuitCurrentAmp: 50,
      systemVoltage: -48,
      cableLengthMeters: 10,
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('Cable Sizing: extreme ambient temperature (>80°C or <-20°C) rejected', () => {
    const res = runEngineeringCalculation('cable-sizing', {
      circuitCurrentAmp: 50,
      systemVoltage: 48,
      cableLengthMeters: 10,
      ambientTempC: 95,
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('PV Configuration: 0 modules rejected', () => {
    const res = runEngineeringCalculation('pv-configuration', {
      totalModulesCount: 0,
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('Energy Yield: system capacity <= 0 kWp rejected', () => {
    const res = runEngineeringCalculation('energy-yield', {
      systemCapacityKwp: 0,
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });

  test('ROI Calculator: 0 CAPEX or negative savings rejected', () => {
    const res = runEngineeringCalculation('roi-calculator', {
      systemCapexNaira: 0,
      annualSavingsNaira: -100000,
    });
    assert.equal(res.calculation_status, 'VALIDATION_ERROR');
  });
});
