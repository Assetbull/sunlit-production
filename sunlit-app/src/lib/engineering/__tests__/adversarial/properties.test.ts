import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { runEngineeringCalculation } from '../../engine';

describe('Adversarial Test Suite — Engineering Properties & Invariants', () => {
  test('Deterministic execution invariant: 20 identical runs yield identical results', () => {
    const input = {
      dailyEnergyDemandKwh: 25.5,
      location: 'Lagos',
      panelWattage: 550,
    };

    const firstRun = runEngineeringCalculation('solar-panel-sizing', input);
    for (let i = 0; i < 20; i++) {
      const repeatedRun = runEngineeringCalculation('solar-panel-sizing', input);
      assert.deepEqual(repeatedRun.engineering_results, firstRun.engineering_results);
      assert.equal(repeatedRun.calculation_status, firstRun.calculation_status);
    }
  });

  test('Monotonic capacity invariant: increasing daily energy demand increases installed PV kWp', () => {
    const resLow = runEngineeringCalculation('solar-panel-sizing', { dailyEnergyDemandKwh: 10 });
    const resMed = runEngineeringCalculation('solar-panel-sizing', { dailyEnergyDemandKwh: 25 });
    const resHigh = runEngineeringCalculation('solar-panel-sizing', { dailyEnergyDemandKwh: 50 });

    assert.ok(resLow.engineering_results.actualArrayKwp < resMed.engineering_results.actualArrayKwp);
    assert.ok(resMed.engineering_results.actualArrayKwp < resHigh.engineering_results.actualArrayKwp);
  });

  test('Monotonic storage invariant: increasing autonomy days increases battery installed kWh', () => {
    const res1Day = runEngineeringCalculation('battery-capacity', { dailyEnergyKwh: 20, daysOfAutonomy: 1.0 });
    const res2Day = runEngineeringCalculation('battery-capacity', { dailyEnergyKwh: 20, daysOfAutonomy: 2.0 });

    assert.ok(res1Day.engineering_results.installedCapacityKwh < res2Day.engineering_results.installedCapacityKwh);
  });

  test('Output finiteness invariant: all numbers in engineering results are finite floats', () => {
    const res = runEngineeringCalculation('solar-system-sizing', {
      dailyKwhInput: 30,
      daysOfAutonomy: 1.5,
      location: 'Abuja',
    });

    assert.equal(res.calculation_status, 'SUCCESS');
    for (const [key, val] of Object.entries(res.engineering_results)) {
      if (typeof val === 'number') {
        assert.ok(Number.isFinite(val), `Field ${key} must be a finite number`);
      }
    }
  });
});
