import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSolarPricing } from '../core/pricingResolver';
import { generateSystemRecommendations } from '../core/recommendationEngine';
import { V3NormalizedLoadProfile } from '../types';

describe('Solar Pricing Resolver — 4-Tier Deterministic Resolution', () => {
  test('resolves valid price range for standard residential system', () => {
    const pricing = resolveSolarPricing({
      solarCapacityKwp: 5.5,
      inverterRatingKva: 5,
      batteryCapacityKwh: 10,
      locationState: 'Lagos',
    });

    assert.equal(pricing.status, 'PRICE_RESOLVED');
    assert.equal(pricing.pricingSource, 'APPROVED_REFERENCE_DATASET');
    assert.ok(pricing.recommendedEstimatedCapexNaira && pricing.recommendedEstimatedCapexNaira > 0);
    assert.ok(pricing.minEstimatedCapexNaira && pricing.minEstimatedCapexNaira < pricing.recommendedEstimatedCapexNaira);
    assert.ok(pricing.maxEstimatedCapexNaira && pricing.maxEstimatedCapexNaira > pricing.recommendedEstimatedCapexNaira);
    assert.ok(pricing.formattedRange.includes('₦'));
    assert.equal(pricing.currency, 'NGN');
    assert.ok(pricing.costBreakdown);
    assert.ok(pricing.costBreakdown.pvArrayNaira > 0);
    assert.ok(pricing.costBreakdown.batteryBankNaira > 0);
    assert.ok(pricing.costBreakdown.inverterNaira > 0);
    assert.ok(pricing.costBreakdown.bosAndProtectionNaira > 0);
    assert.ok(pricing.costBreakdown.mountingStructureNaira > 0);
    assert.ok(pricing.costBreakdown.installationAndLabourNaira > 0);
  });

  test('applies state logistics multiplier accurately', () => {
    const lagosPricing = resolveSolarPricing({
      solarCapacityKwp: 10,
      inverterRatingKva: 10,
      batteryCapacityKwh: 20,
      locationState: 'Lagos',
    });

    const bornoPricing = resolveSolarPricing({
      solarCapacityKwp: 10,
      inverterRatingKva: 10,
      batteryCapacityKwh: 20,
      locationState: 'Borno',
    });

    // Remote state has higher logistics multiplier
    assert.ok(bornoPricing.recommendedEstimatedCapexNaira! > lagosPricing.recommendedEstimatedCapexNaira!);
  });

  test('returns PRICE_UNAVAILABLE with mandatory reason when zero inputs are provided', () => {
    const pricing = resolveSolarPricing({
      solarCapacityKwp: 0,
      inverterRatingKva: 0,
      batteryCapacityKwh: 0,
    });

    assert.equal(pricing.status, 'PRICE_UNAVAILABLE');
    assert.equal(pricing.recommendedEstimatedCapexNaira, undefined);
    assert.equal(pricing.formattedRange, 'Investment estimate unavailable — installer pricing required.');
    assert.equal(pricing.unavailabilityReason, 'Investment estimate unavailable — installer pricing required.');
  });
});

describe('Recommendation Engine — Option Synthesis & Pricing Integration', () => {
  const mockLoadProfile: V3NormalizedLoadProfile = {
    dailyEnergyKwh: 20,
    peakContinuousW: 3500,
    peakSurgeW: 7000,
    daytimeEnergyKwh: 12,
    nighttimeEnergyKwh: 8,
    criticalEnergyKwh: 5,
    importantEnergyKwh: 10,
    flexibleEnergyKwh: 3,
    nonCriticalEnergyKwh: 2,
    simultaneousLoadW: 3000,
    daytimeShiftableKwh: 3,
    certificationLevel: 'ENGINEERING_ESTIMATE',
    itemCount: 8,
    averagePowerFactor: 0.85,
    monthlyEnergyKwh: 600,
    annualEnergyKwh: 7300,
  };

  test('generates 3 distinct validated options (Baseline, Recommended, Upgrade)', () => {
    const result = generateSystemRecommendations({
      loadProfile: mockLoadProfile,
      location: 'Lagos',
      customerPriority: 'BALANCED',
    });

    assert.equal(result.options.length, 3);
    const [baseline, recommended, upgrade] = result.options;

    assert.equal(baseline.tier, 'BASELINE');
    assert.equal(recommended.tier, 'RECOMMENDED');
    assert.equal(upgrade.tier, 'UPGRADE');

    // Upgrade has highest solar and battery capacity
    assert.ok(upgrade.solarCapacityKwp > recommended.solarCapacityKwp);
    assert.ok(recommended.solarCapacityKwp > baseline.solarCapacityKwp);

    // Each option has pricing resolution
    assert.ok(recommended.pricingResolution);
    assert.ok(recommended.formattedPriceRange && recommended.formattedPriceRange.includes('₦'));
    assert.ok(recommended.estimatedCAPEXNaira > 0);

    // Validation checks passed
    assert.equal(recommended.status, 'PASS');
  });

  test('flags OVERSPEC_WARNING if system capacity is disproportionately large', () => {
    const tinyProfile: V3NormalizedLoadProfile = {
      ...mockLoadProfile,
      dailyEnergyKwh: 2,
      peakContinuousW: 300,
      nighttimeEnergyKwh: 0.5,
    };

    const result = generateSystemRecommendations({
      loadProfile: tinyProfile,
      location: 'Lagos',
      customerPriority: 'MAXIMUM_RESILIENCE',
    });

    const upgrade = result.options.find((o) => o.tier === 'UPGRADE');
    assert.ok(upgrade);
    // Oversizing sanity check should trigger on overspec
    const hasOverspecWarning = upgrade?.validationFindings.some((f) => f.code === 'OVERSPEC_WARNING');
    assert.equal(hasOverspecWarning, true);
  });
});
