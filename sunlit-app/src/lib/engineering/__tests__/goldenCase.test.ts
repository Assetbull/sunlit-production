import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSolarSystemSizing } from '../calculators/solarSystemSizing';
import { calculateLoad } from '../calculators/loadCalculator';

describe('Golden Engineering Case — Reference Lagos Customer Scenario', () => {
  const LAGOS_GOLDEN_INPUT = {
    location: 'Lagos',
    dailyKwhInput: 22.22,
    daysOfAutonomy: 1.0,
    selectedPanelWattage: 550,
    selectedBatteryType: 'lithium_lifepo4' as const,
    phaseType: 'single-phase' as const,
  };

  test('Golden Case: Solar System Master Sizer executes deterministically', () => {
    const res = calculateSolarSystemSizing(LAGOS_GOLDEN_INPUT);

    assert.equal(res.calculation_status, 'SUCCESS');
    assert.equal(res.engine_version, '3.0.0');

    const results = res.engineering_results;

    // Verify daily kWh demand
    assert.equal(results.dailyEnergyDemandKwh, 22.22);

    // Verify Inverter Sizing
    assert.ok(results.recommendedInverterKva >= 5.0);

    // Verify Battery Capacity
    assert.ok(results.recommendedBatteryKwh >= 25.0);

    // Verify Solar Array Sizing
    assert.ok(results.recommendedPanelCount >= 11);
    assert.ok(results.recommendedSolarArrayKwp >= 6.0);
  });

  test('Golden Case: Multi-Appliance Load Aggregation matches expected total energy', () => {
    const loadRes = calculateLoad({
      items: [
        { name: '1.5 HP AC', powerWatts: 1500, quantity: 1, hoursPerDay: 8, surgeMultiplier: 2.5 },
        { name: 'Refrigerator', powerWatts: 150, quantity: 1, hoursPerDay: 24, dutyCycle: 0.45 },
        { name: 'LED Lights', powerWatts: 90, quantity: 1, hoursPerDay: 8 },
        { name: 'Smart TV', powerWatts: 110, quantity: 1, hoursPerDay: 6 },
      ],
    });

    assert.equal(loadRes.calculation_status, 'SUCCESS');
    assert.ok(loadRes.engineering_results.dailyEnergyDemandKwh > 14.0);
    assert.ok(loadRes.engineering_results.peakSurgeWatts >= 3750);
  });
});
