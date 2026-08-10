import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { runEngineeringCalculation } from '../engine';
import { resolveApplianceInput } from '../catalog/applianceCatalog';
import { calculateCableSizing } from '../calculators/cableSizing';
import { calculatePvConfiguration } from '../calculators/pvConfiguration';
import { calculateRoi } from '../calculators/roiCalculator';
import { calculateEnergyYield } from '../calculators/energyYield';
import { calculateSolarSavings } from '../calculators/solarSavings';

describe('Sunlit Enterprise Engineering Tools Suite', () => {
  test('Auto Appliance Recognition resolves query string to catalog profile', () => {
    const res1 = resolveApplianceInput('ac 1.5hp');
    assert.equal(res1.status, 'EXACT_MATCH');
    assert.equal(res1.exactMatch?.ratedPowerW, 1500);

    const res2 = resolveApplianceInput('1hp water pump');
    assert.equal(res2.status, 'EXACT_MATCH');
    assert.equal(res2.exactMatch?.ratedPowerW, 750);
  });

  test('Cable Sizing Tool calculates voltage drop and recommends correct mm²', () => {
    const res = calculateCableSizing({
      circuitCurrentAmp: 50,
      systemVoltage: 48,
      cableLengthMeters: 10,
      circuitType: 'DC_BATTERY',
    });

    assert.equal(res.calculation_status, 'SUCCESS');
    assert.ok(res.engineering_results.recommendedCableCrossSectionMm2 >= 16);
    assert.ok(res.engineering_results.calculatedVoltageDropPercent <= 1.5);
  });

  test('PV String Layout Configurator enforces MPPT bounds', () => {
    const res = calculatePvConfiguration({
      totalModulesCount: 12,
      modulesPerString: 6,
      parallelStringsCount: 2,
    });

    assert.equal(res.calculation_status, 'SUCCESS');
    assert.equal(res.engineering_results.stringStatus, 'VALID');
    assert.ok(res.engineering_results.allowedModulesPerStringRange !== undefined);
  });

  test('Solar Energy Yield Estimator produces annual yield and performance ratio', () => {
    const res = calculateEnergyYield({
      systemCapacityKwp: 5.0,
      location: 'Lagos',
    });

    assert.equal(res.calculation_status, 'SUCCESS');
    assert.ok(res.engineering_results.annualProductionKwh > 6000);
    assert.ok(res.engineering_results.performanceRatioPercent > 75);
  });

  test('Solar Savings & ROI Calculators generate discounted cashflows, NPV, and IRR', () => {
    const savingsRes = calculateSolarSavings({
      dailySolarGenKwh: 25,
      gridTariffNairaPerKwh: 225,
    });

    assert.equal(savingsRes.calculation_status, 'SUCCESS');
    assert.ok(savingsRes.engineering_results.totalAnnualSavingsNaira > 1500000);

    const roiRes = calculateRoi({
      systemCapexNaira: 5000000,
      annualSavingsNaira: savingsRes.engineering_results.totalAnnualSavingsNaira,
    });

    assert.equal(roiRes.calculation_status, 'SUCCESS');
    assert.ok(roiRes.engineering_results.simplePaybackYears < 5.0);
    assert.ok(roiRes.engineering_results.irrPercent > 15);
  });

  test('Tool Engine Dispatcher runs all 10 tools', () => {
    const tools = [
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

    tools.forEach((toolId) => {
      const sampleInput = {
        dailyEnergyDemandKwh: 20,
        dailyEnergyKwh: 20,
        dailyKwhInput: 20,
        continuousLoadWatts: 2000,
        circuitCurrentAmp: 40,
        systemVoltage: 48,
        cableLengthMeters: 10,
        totalModulesCount: 10,
        systemCapacityKwp: 5,
        dailySolarGenKwh: 20,
        systemCapexNaira: 4000000,
        annualSavingsNaira: 1000000,
        items: [{ name: 'AC', powerWatts: 1500, quantity: 1, hoursPerDay: 8 }],
      };

      const result = runEngineeringCalculation(toolId, sampleInput);
      assert.equal(result.engine_version, '3.0.0', `${toolId}: engine_version must be 3.0.0`);
      assert.notEqual(result.calculation_status, 'ENGINE_ERROR', `${toolId}: must not return ENGINE_ERROR`);
    });
  });
});
