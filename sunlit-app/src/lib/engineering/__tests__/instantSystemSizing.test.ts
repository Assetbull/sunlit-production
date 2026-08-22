import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateInstantSystemSizing, NIGERIAN_SOLAR_ZONES } from '../calculators/instantSizingModel';

describe('Instant System Sizing Model — Comprehensive Verification Suite', () => {
  test('Golden Reference Case: Lagos 31 kWh/day with 32 Hours Autonomy', () => {
    const result = calculateInstantSystemSizing({
      customerType: 'homeowner',
      dailyEnergyKwh: 31,
      autonomyHours: 32,
      locationKey: 'Lagos State (Ikeja / Lekki / VI / Ikoyi)',
    });

    // Verify Hardware Specifications matching approved visual specifications
    assert.equal(result.solarArrayKwp, 8.07, 'Solar Array must equal 8.07 kWp (15 × 550W panels)');
    assert.equal(result.recommendedPanelsCount, 15, 'Recommended panel count must be 15');
    assert.equal(result.storageCapacityKwh, 48.6, 'Storage capacity must equal 48.6 kWh LiFePO4');
    assert.equal(result.inverterCapacityKva, 8.1, 'Inverter capacity must equal 8.1 kVA Pure Sine Wave');
    assert.equal(result.estimatedMonthlySavingsNaira, 209250, 'Monthly savings must equal ₦209,250');

    // Turnkey Investment Range
    assert.equal(result.estimatedCostMinNaira, 17567700, 'Min turnkey cost must equal ₦17,567,700');
    assert.equal(result.estimatedCostMaxNaira, 21432594, 'Max turnkey cost must equal ₦21,432,594');
    assert.equal(result.generatorFuelSavingsPercent, 85);
    assert.equal(result.sizingModelVersion, '3.0.0');
    assert.equal(result.engineeringStatus, 'PRELIMINARY ESTIMATE');
  });

  test('Small Residential Profile: 3 kWh/day with 8h Autonomy', () => {
    const res = calculateInstantSystemSizing({
      customerType: 'homeowner',
      dailyEnergyKwh: 3,
      autonomyHours: 8,
      locationKey: 'Lagos State (Ikeja / Lekki / VI / Ikoyi)',
    });

    assert.ok(res.solarArrayKwp >= 0.75, 'Small residential system has valid PV sizing');
    assert.ok(res.storageCapacityKwh >= 1.0, 'Storage must be non-zero and positive');
    assert.ok(res.inverterCapacityKva >= 3.5, 'Minimum safe inverter capacity is 3.5 kVA');
    assert.ok(res.estimatedCostMinNaira > 0, 'Cost is positive and non-zero');
  });

  test('Commercial SME Profile: 45 kWh/day with 18h Autonomy', () => {
    const res = calculateInstantSystemSizing({
      customerType: 'business',
      dailyEnergyKwh: 45,
      autonomyHours: 18,
      locationKey: 'Abuja FCT (Maitama / Wuse / Gwarinpa)',
    });

    assert.equal(res.customerType, 'business');
    assert.ok(res.solarArrayKwp > 10.0);
    assert.ok(res.storageCapacityKwh > 35.0);
    assert.ok(res.inverterCapacityKva >= 11.5);
    assert.equal(res.assumptions.powerFactor, 0.80);
  });

  test('Developer / Estate Profile: 250 kWh/day with 24h Autonomy', () => {
    const res = calculateInstantSystemSizing({
      customerType: 'developer',
      dailyEnergyKwh: 250,
      autonomyHours: 24,
      locationKey: 'Lagos State (Ikeja / Lekki / VI / Ikoyi)',
    });

    assert.equal(res.customerType, 'developer');
    assert.equal(res.phaseType, 'Three-Phase', 'Large infrastructure must recommend Three-Phase');
    assert.ok(res.solarArrayKwp > 60.0);
    assert.ok(res.storageCapacityKwh > 280.0);
    assert.ok(res.inverterCapacityKva > 50.0);
  });

  test('Location Solar Irradiance Sensitivity', () => {
    const lagos = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 30, autonomyHours: 24, locationKey: 'Lagos State (Ikeja / Lekki / VI / Ikoyi)' });
    const kano = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 30, autonomyHours: 24, locationKey: 'Kano State' });
    const ph = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 30, autonomyHours: 24, locationKey: 'Rivers State (Port Harcourt / GRA)' });

    // Kano has higher PSH (5.9) than Lagos (4.8), so required PV kWp is lower
    assert.ok(kano.solarArrayKwp < lagos.solarArrayKwp, 'Kano higher PSH requires fewer panels for same energy');
    // Port Harcourt has lower PSH (4.2) than Lagos (4.8), so required PV kWp is higher
    assert.ok(ph.solarArrayKwp > lagos.solarArrayKwp, 'Port Harcourt lower PSH requires more panels');
  });

  test('Defensive Input Handling: Zero, Negative, Missing, and Extreme inputs', () => {
    const zeroRes = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 0, autonomyHours: 0 });
    assert.ok(zeroRes.dailyEnergyKwh >= 1.0, 'Sanitized zero daily kWh to safe minimum');
    assert.ok(zeroRes.autonomyHours >= 4.0, 'Sanitized zero autonomy to safe minimum');

    const negRes = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: -50, autonomyHours: -10 });
    assert.ok(negRes.dailyEnergyKwh >= 1.0);
    assert.ok(negRes.autonomyHours >= 4.0);

    const extRes = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 5000, autonomyHours: 200 });
    assert.ok(extRes.dailyEnergyKwh <= 1000.0);
    assert.ok(extRes.autonomyHours <= 72.0);
  });

  test('Deterministic Reproducibility: Identical inputs produce identical outputs', () => {
    const run1 = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 31, autonomyHours: 32 });
    const run2 = calculateInstantSystemSizing({ customerType: 'homeowner', dailyEnergyKwh: 31, autonomyHours: 32 });

    assert.equal(run1.solarArrayKwp, run2.solarArrayKwp);
    assert.equal(run1.storageCapacityKwh, run2.storageCapacityKwh);
    assert.equal(run1.inverterCapacityKva, run2.inverterCapacityKva);
    assert.equal(run1.estimatedCostMinNaira, run2.estimatedCostMinNaira);
    assert.equal(run1.estimatedCostMaxNaira, run2.estimatedCostMaxNaira);
  });
});
