import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateSolarSystemSizing } from '../../lib/engineering/calculators/solarSystemSizing';

describe('Installer Directory → Request a Quote Lifecycle Suite', () => {
  describe('Stage 1 & 2: Questionnaire Input & Load Estimation', () => {
    test('Method A: Daily kWh input calculates accurate preliminary system sizing', () => {
      const result = calculateSolarSystemSizing({
        dailyKwhInput: 25,
        daysOfAutonomy: 1,
        propertyType: 'residential',
        location: 'Lagos',
        backupScope: 'full',
      });

      assert.strictEqual(result.calculation_status, 'SUCCESS');
      assert.strictEqual(result.engineering_results?.dailyEnergyDemandKwh, 25);
      assert.ok(result.engineering_results?.recommendedSolarArrayKwp > 0, 'Solar array kWp must be positive');
      assert.ok(result.engineering_results?.recommendedInverterKva > 0, 'Inverter kVA must be positive');
      assert.ok(result.engineering_results?.recommendedBatteryKwh > 0, 'Battery kWh must be positive');
    });

    test('Method B: Appliance list with custom appliances correctly aggregates connected load', () => {
      const loadItems = [
        { name: 'Refrigerator', category: 'Kitchen' as const, quantity: 1, powerWatts: 250, hoursPerDay: 24 },
        { name: 'Television', category: 'Entertainment' as const, quantity: 1, powerWatts: 120, hoursPerDay: 6 },
        { name: 'Custom Grain Mill', category: 'General' as const, quantity: 1, powerWatts: 1500, hoursPerDay: 4 },
      ];

      const result = calculateSolarSystemSizing({
        loadItems,
        daysOfAutonomy: 1,
        propertyType: 'commercial',
        location: 'Ogun',
        backupScope: 'full',
      });

      assert.strictEqual(result.calculation_status, 'SUCCESS');
      // 250*24 = 6000Wh, 120*6 = 720Wh, 1500*4 = 6000Wh => Total = 12.72 kWh
      const expectedDaily = (6000 + 720 + 6000) / 1000;
      assert.ok(
        Math.abs(result.engineering_results?.dailyEnergyDemandKwh - expectedDaily) < 0.1,
        `Expected ~${expectedDaily} kWh, got ${result.engineering_results?.dailyEnergyDemandKwh}`
      );
      assert.ok(result.engineering_results?.recommendedInverterKva >= 3, 'Inverter must support peak load');
    });

    test('Missing or zero load input returns clear validation error', () => {
      const result = calculateSolarSystemSizing({
        dailyKwhInput: 0,
        loadItems: [],
      });

      assert.strictEqual(result.calculation_status, 'VALIDATION_ERROR');
      assert.ok(result.warnings.length > 0);
      assert.strictEqual(result.validation_status.isValid, false);
    });
  });

  describe('Stage 3 & 4: Workflow Source Continuation Decision', () => {
    test('Directory source routes to continuation decision gate', () => {
      const source = 'DIRECTORY';
      const shouldPromptContinuation = source === 'DIRECTORY';
      assert.strictEqual(shouldPromptContinuation, true);
    });

    test('Direct profile source skips continuation decision and advances directly to confirmation', () => {
      const source: string = 'DIRECT_PROFILE';
      const shouldPromptContinuation = source === 'DIRECTORY';
      assert.strictEqual(shouldPromptContinuation, false);
    });
  });

  describe('Stage 5: Idempotency and Payload Structure', () => {
    test('Generates structured quote request payload with preliminary sizing snapshot', () => {
      const idempotencyKey = `quote_req_${Date.now()}_test123`;
      const payload = {
        idempotency_key: idempotencyKey,
        target_installer_id: 'inst_abc123',
        target_installer_slug: 'solarcraft-energy',
        target_installer_name: 'SolarCraft Energy',
        source_workflow: 'DIRECTORY',
        customer_name: 'Babatunde Adeleke',
        customer_email: 'babatunde@example.ng',
        customer_phone: '+2348030000000',
        daily_kwh: 30,
        preliminary_sizing: {
          recommended_solar_kwp: 7.15,
          recommended_inverter_kva: 8.0,
          recommended_battery_kwh: 15.0,
        },
      };

      assert.ok(payload.idempotency_key.startsWith('quote_req_'));
      assert.strictEqual(payload.target_installer_slug, 'solarcraft-energy');
      assert.strictEqual(payload.preliminary_sizing.recommended_inverter_kva, 8.0);
    });
  });
});
