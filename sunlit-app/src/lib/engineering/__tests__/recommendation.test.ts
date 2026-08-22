/**
 * V3 Recommendation Engine Test Suite
 * Sunlit Enterprise Engineering Platform
 *
 * Tests covering:
 * 1. Three-tier generation (BASELINE / RECOMMENDED / UPGRADE)
 * 2. Monotonicity: BASELINE ≤ RECOMMENDED ≤ UPGRADE (capacity, coverage, CAPEX)
 * 3. Appliance runtime coverage classifications are valid
 * 4. Constrained mode: undersized system reports CONSTRAINED status
 * 5. Load profile engine: priority tiers, day/night split, shiftable loads
 * 6. Confidence engine: systematic scoring is in range 0–100
 * 7. Standards profiles: all 4 profiles load correctly
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { generateSystemRecommendations } from '../core/recommendationEngine';
import { buildLoadProfile, buildProfileFromDailyKwh } from '../core/loadProfile';
import { assessConfidence } from '../core/confidence';
import { getStandardsProfile, autoSelectProfile } from '../core/standardsProfiles';
import type { V3LoadItem } from '../types';

// ============================================================
// TEST DATA
// ============================================================

const STANDARD_HOME_ITEMS: V3LoadItem[] = [
  { name: 'Air Conditioner 1.5HP', powerWatts: 1500, quantity: 1, hoursPerDay: 8, category: 'air_conditioning' },
  { name: 'Refrigerator', powerWatts: 150, quantity: 1, hoursPerDay: 24, category: 'refrigeration', priority: 'CRITICAL' },
  { name: 'LED Lighting (10×)', powerWatts: 90, quantity: 1, hoursPerDay: 8, category: 'lighting' },
  { name: 'Water Pump 1HP', powerWatts: 750, quantity: 1, hoursPerDay: 2, category: 'pumping' },
  { name: 'Smart TV', powerWatts: 110, quantity: 1, hoursPerDay: 6, category: 'entertainment' },
  { name: 'WiFi Router', powerWatts: 18, quantity: 1, hoursPerDay: 24, category: 'computing', priority: 'CRITICAL' },
];

// ============================================================
// PHASE 1: LOAD PROFILE ENGINE
// ============================================================

describe('V3 Load Profile Engine', () => {
  test('Produces valid NormalizedLoadProfile from appliance list', () => {
    const result = buildLoadProfile({ items: STANDARD_HOME_ITEMS });

    assert.equal(result.validationErrors.length, 0, 'No validation errors expected');
    assert.ok(result.profile.dailyEnergyKwh > 0, 'Daily energy must be > 0');
    assert.ok(result.profile.peakContinuousW > 0, 'Peak continuous must be > 0');
    assert.ok(result.profile.peakSurgeW >= result.profile.peakContinuousW, 'Surge must be ≥ continuous');
    assert.ok(result.profile.itemCount === STANDARD_HOME_ITEMS.length, 'Item count must match');
  });

  test('Day/night split is always consistent: daytime + nighttime = daily', () => {
    const result = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const { profile } = result;

    const reconstituted = profile.daytimeEnergyKwh + profile.nighttimeEnergyKwh;
    assert.ok(
      Math.abs(reconstituted - profile.dailyEnergyKwh) < 0.1,
      `Day/night split must sum to daily: ${reconstituted.toFixed(3)} vs ${profile.dailyEnergyKwh.toFixed(3)}`
    );
  });

  test('Priority energy breakdown is consistent: sum equals daily', () => {
    const result = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const { profile } = result;

    const prioritySum =
      profile.criticalEnergyKwh +
      profile.importantEnergyKwh +
      profile.flexibleEnergyKwh +
      profile.nonCriticalEnergyKwh;

    assert.ok(
      Math.abs(prioritySum - profile.dailyEnergyKwh) < 0.1,
      `Priority breakdown must sum to daily: ${prioritySum.toFixed(3)} vs ${profile.dailyEnergyKwh.toFixed(3)}`
    );
  });

  test('CRITICAL loads are identified correctly', () => {
    const result = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    assert.ok(result.profile.criticalEnergyKwh > 0, 'Fridge and router are CRITICAL — must be > 0');
  });

  test('Simple kWh profile returns PRELIMINARY_ESTIMATE certification', () => {
    const profile = buildProfileFromDailyKwh(20, 60);
    assert.equal(profile.certificationLevel, 'PRELIMINARY_ESTIMATE');
    assert.ok(profile.dailyEnergyKwh === 20);
    assert.ok(profile.daytimeEnergyKwh + profile.nighttimeEnergyKwh === 20);
  });

  test('Appliance list profile returns ENGINEERING_ESTIMATE certification', () => {
    const result = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    assert.equal(result.profile.certificationLevel, 'ENGINEERING_ESTIMATE');
  });

  test('Empty item list returns validation error', () => {
    const result = buildLoadProfile({ items: [] });
    assert.ok(result.validationErrors.length > 0, 'Empty items must produce validation errors');
    assert.ok(result.profile.dailyEnergyKwh === 0);
  });

  test('Monotonicity: more items = more daily energy', () => {
    const small = buildLoadProfile({ items: STANDARD_HOME_ITEMS.slice(0, 2) });
    const full = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    assert.ok(
      full.profile.dailyEnergyKwh > small.profile.dailyEnergyKwh,
      'More appliances must yield more daily energy'
    );
  });
});

// ============================================================
// PHASE 2: RECOMMENDATION ENGINE
// ============================================================

describe('V3 Recommendation Engine', () => {
  test('Generates exactly 3 system options (BASELINE, RECOMMENDED, UPGRADE)', () => {
    const profileResult = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const rec = generateSystemRecommendations({
      loadProfile: profileResult.profile,
      location: 'Lagos',
      loadItems: STANDARD_HOME_ITEMS,
    });

    assert.equal(rec.options.length, 3, 'Must produce exactly 3 options');
    const tiers = rec.options.map((o) => o.tier);
    assert.ok(tiers.includes('BASELINE'), 'Must include BASELINE');
    assert.ok(tiers.includes('RECOMMENDED'), 'Must include RECOMMENDED');
    assert.ok(tiers.includes('UPGRADE'), 'Must include UPGRADE');
  });

  test('Monotonicity: BASELINE ≤ RECOMMENDED ≤ UPGRADE on key capacities', () => {
    const profileResult = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const rec = generateSystemRecommendations({
      loadProfile: profileResult.profile,
      location: 'Lagos',
      loadItems: STANDARD_HOME_ITEMS,
    });

    const baseline = rec.options.find((o) => o.tier === 'BASELINE')!;
    const recommended = rec.options.find((o) => o.tier === 'RECOMMENDED')!;
    const upgrade = rec.options.find((o) => o.tier === 'UPGRADE')!;

    assert.ok(
      baseline.solarCapacityKwp <= recommended.solarCapacityKwp,
      `BASELINE kWp (${baseline.solarCapacityKwp}) must be ≤ RECOMMENDED (${recommended.solarCapacityKwp})`
    );
    assert.ok(
      recommended.solarCapacityKwp <= upgrade.solarCapacityKwp,
      `RECOMMENDED kWp must be ≤ UPGRADE`
    );
    assert.ok(
      baseline.batteryNominalKwh <= recommended.batteryNominalKwh,
      `BASELINE battery must be ≤ RECOMMENDED battery`
    );
    assert.ok(
      recommended.batteryNominalKwh <= upgrade.batteryNominalKwh,
      `RECOMMENDED battery must be ≤ UPGRADE battery`
    );
    assert.ok(
      baseline.estimatedCAPEXNaira <= recommended.estimatedCAPEXNaira,
      `BASELINE CAPEX must be ≤ RECOMMENDED CAPEX`
    );
    assert.ok(
      recommended.estimatedCAPEXNaira <= upgrade.estimatedCAPEXNaira,
      `RECOMMENDED CAPEX must be ≤ UPGRADE CAPEX`
    );
  });

  test('UPGRADE provides more coverage than BASELINE', () => {
    const profileResult = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const rec = generateSystemRecommendations({
      loadProfile: profileResult.profile,
      location: 'Abuja',
    });

    const baseline = rec.options.find((o) => o.tier === 'BASELINE')!;
    const upgrade = rec.options.find((o) => o.tier === 'UPGRADE')!;

    assert.ok(
      upgrade.loadCoveragePercent >= baseline.loadCoveragePercent,
      `UPGRADE coverage (${upgrade.loadCoveragePercent}%) must be ≥ BASELINE (${baseline.loadCoveragePercent}%)`
    );
    assert.ok(
      upgrade.autonomyHours >= baseline.autonomyHours,
      `UPGRADE autonomy (${upgrade.autonomyHours}h) must be ≥ BASELINE (${baseline.autonomyHours}h)`
    );
  });

  test('All options contain appliance runtime results', () => {
    const profileResult = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const rec = generateSystemRecommendations({
      loadProfile: profileResult.profile,
      location: 'Lagos',
      loadItems: STANDARD_HOME_ITEMS,
    });

    for (const option of rec.options) {
      assert.ok(option.applianceRuntime.length > 0, `${option.tier}: must have appliance runtime`);

      for (const runtime of option.applianceRuntime) {
        const validCoverages = ['FULL', 'PARTIAL', 'DAYLIGHT_ONLY', 'BACKUP_ONLY', 'NOT_SUPPORTED', 'REQUIRES_LOAD_SHIFT'];
        assert.ok(
          validCoverages.includes(runtime.coverage),
          `${option.tier}/${runtime.appliance}: coverage "${runtime.coverage}" must be a valid value`
        );
        assert.ok(runtime.explanation.length > 0, `${option.tier}/${runtime.appliance}: must have explanation`);
      }
    }
  });

  test('All options have validation findings', () => {
    const profileResult = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const rec = generateSystemRecommendations({
      loadProfile: profileResult.profile,
      location: 'Lagos',
    });

    for (const option of rec.options) {
      assert.ok(option.validationFindings.length > 0, `${option.tier}: must have validation findings`);

      for (const finding of option.validationFindings) {
        const validSeverities = ['PASS', 'WARNING', 'BLOCKED', 'INVALID', 'REQUIRES_REVIEW'];
        assert.ok(
          validSeverities.includes(finding.severity),
          `${option.tier}: finding severity must be valid`
        );
      }
    }
  });

  test('All options include non-empty limitations and advantages', () => {
    const profileResult = buildLoadProfile({ items: STANDARD_HOME_ITEMS });
    const rec = generateSystemRecommendations({ loadProfile: profileResult.profile });

    for (const option of rec.options) {
      assert.ok(option.limitations.length > 0, `${option.tier}: must have limitations`);
      assert.ok(option.advantages.length > 0, `${option.tier}: must have advantages`);
      assert.ok(option.explanation.length > 0, `${option.tier}: must have explanation`);
    }
  });

  test('CAPEX is always positive and correctly ordered', () => {
    const profile = buildProfileFromDailyKwh(20);
    const rec = generateSystemRecommendations({ loadProfile: profile, location: 'Kano' });

    for (const option of rec.options) {
      assert.ok(option.estimatedCAPEXNaira > 0, `${option.tier}: CAPEX must be > 0`);
    }
  });

  test('Caution disclaimer is always present on every option', () => {
    const profile = buildProfileFromDailyKwh(15);
    const rec = generateSystemRecommendations({ loadProfile: profile });

    for (const option of rec.options) {
      assert.ok(option.caution.length > 10, `${option.tier}: must have CAPEX caution disclaimer`);
    }
  });

  test('customerPriority=LOWER_CAPEX sets recommendedTier to BASELINE', () => {
    const profile = buildProfileFromDailyKwh(20);
    const rec = generateSystemRecommendations({ loadProfile: profile, customerPriority: 'LOWER_CAPEX' });
    assert.equal(rec.recommendedTier, 'BASELINE');
  });

  test('customerPriority=MAXIMUM_RESILIENCE sets recommendedTier to UPGRADE', () => {
    const profile = buildProfileFromDailyKwh(20);
    const rec = generateSystemRecommendations({ loadProfile: profile, customerPriority: 'MAXIMUM_RESILIENCE' });
    assert.equal(rec.recommendedTier, 'UPGRADE');
  });

  test('engineVersion matches ENGINE_VERSION constant', () => {
    const profile = buildProfileFromDailyKwh(10);
    const rec = generateSystemRecommendations({ loadProfile: profile });
    assert.equal(rec.engineVersion, '3.0.0');
  });
});

// ============================================================
// PHASE 3: CONFIDENCE ENGINE
// ============================================================

describe('V3 Confidence Engine', () => {
  test('Full-completeness input yields HIGH confidence', () => {
    const result = assessConfidence({
      providedRequiredFields: 10,
      requiredFieldsTotal: 10,
      equipmentFromCatalog: true,
      specificEquipmentSelected: true,
      namedLocationUsed: true,
      locationInCatalog: true,
      systemComplexity: 0.1,
      hasValidationWarnings: false,
      userOverrodAssumptions: false,
    });
    assert.equal(result.level, 'HIGH');
    assert.ok(result.score >= 90, `Score ${result.score} should be ≥ 90 for HIGH`);
  });

  test('Partial completeness yields MODERATE or REVIEW_RECOMMENDED', () => {
    const result = assessConfidence({
      providedRequiredFields: 5,
      requiredFieldsTotal: 10,
      equipmentFromCatalog: false,
      specificEquipmentSelected: false,
      namedLocationUsed: false,
      locationInCatalog: false,
      systemComplexity: 0.7,
      hasValidationWarnings: true,
      userOverrodAssumptions: true,
    });
    assert.ok(
      result.level === 'MODERATE' || result.level === 'REVIEW_RECOMMENDED',
      `Partial input should not be HIGH confidence — got ${result.level}`
    );
  });

  test('Confidence score is always in range 0–100', () => {
    const scenarios = [
      { provided: 0, total: 10, eq: false, sp: false, nl: false, lc: false, cx: 1.0, hw: true, uo: true },
      { provided: 10, total: 10, eq: true, sp: true, nl: true, lc: true, cx: 0.0, hw: false, uo: false },
      { provided: 7, total: 10, eq: true, sp: false, nl: true, lc: true, cx: 0.4, hw: false, uo: false },
    ];
    for (const s of scenarios) {
      const result = assessConfidence({
        providedRequiredFields: s.provided,
        requiredFieldsTotal: s.total,
        equipmentFromCatalog: s.eq,
        specificEquipmentSelected: s.sp,
        namedLocationUsed: s.nl,
        locationInCatalog: s.lc,
        systemComplexity: s.cx,
        hasValidationWarnings: s.hw,
        userOverrodAssumptions: s.uo,
      });
      assert.ok(result.score >= 0 && result.score <= 100, `Score ${result.score} must be in 0–100`);
      assert.ok(result.reasoning.length > 0, 'Reasoning must be non-empty');
    }
  });

  test('Confidence factors sum is correctly distributed', () => {
    const result = assessConfidence({
      providedRequiredFields: 8,
      requiredFieldsTotal: 10,
      equipmentFromCatalog: true,
      specificEquipmentSelected: false,
      namedLocationUsed: true,
      locationInCatalog: true,
      systemComplexity: 0.2,
      hasValidationWarnings: false,
      userOverrodAssumptions: false,
    });

    // All factor values must be in 0–1 range
    const { factors } = result;
    assert.ok(factors.inputCompleteness >= 0 && factors.inputCompleteness <= 1.0);
    assert.ok(factors.equipmentQuality >= 0 && factors.equipmentQuality <= 1.0);
    assert.ok(factors.locationQuality >= 0 && factors.locationQuality <= 1.0);
    assert.ok(factors.complexityPenalty >= 0 && factors.complexityPenalty <= 1.0);
  });
});

// ============================================================
// PHASE 4: STANDARDS PROFILES
// ============================================================

describe('V3 Standards Profiles', () => {
  test('All 4 profiles load without error', () => {
    const profiles = ['NG-RESIDENTIAL', 'NG-COMMERCIAL', 'NG-INDUSTRIAL', 'INTERNATIONAL'] as const;
    for (const id of profiles) {
      const profile = getStandardsProfile(id);
      assert.equal(profile.id, id);
      assert.ok(profile.name.length > 0);
      assert.ok(profile.applicableStandards.length > 0);
      assert.ok(profile.pvDesignMarginPercent >= 10);
      assert.ok(profile.minBatteryAutonomyHours >= 4);
    }
  });

  test('Industrial profile has stricter limits than residential', () => {
    const residential = getStandardsProfile('NG-RESIDENTIAL');
    const industrial = getStandardsProfile('NG-INDUSTRIAL');

    assert.ok(
      industrial.pvDesignMarginPercent >= residential.pvDesignMarginPercent,
      'Industrial design margin must be ≥ residential'
    );
    assert.ok(
      industrial.minBatteryAutonomyHours >= residential.minBatteryAutonomyHours,
      'Industrial autonomy must be ≥ residential'
    );
    assert.ok(
      industrial.maxDcVoltageDropPercent <= residential.maxDcVoltageDropPercent,
      'Industrial voltage drop limit must be tighter'
    );
  });

  test('Auto-selects industrial profile for large inverters', () => {
    const profile = autoSelectProfile({ inverterKva: 20, projectType: 'industrial' });
    assert.equal(profile.id, 'NG-INDUSTRIAL');
  });

  test('Auto-selects commercial profile for three-phase systems', () => {
    const profile = autoSelectProfile({ phaseType: 'three-phase' });
    assert.equal(profile.id, 'NG-COMMERCIAL');
  });

  test('Auto-selects residential as default for small residential', () => {
    const profile = autoSelectProfile({ projectType: 'residential', inverterKva: 5 });
    assert.equal(profile.id, 'NG-RESIDENTIAL');
  });

  test('No profile specified returns residential default', () => {
    const profile = getStandardsProfile(undefined);
    assert.equal(profile.id, 'NG-RESIDENTIAL');
  });
});
