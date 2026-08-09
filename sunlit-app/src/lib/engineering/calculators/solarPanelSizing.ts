import { SharedCalculationResult } from '../types';

export interface SolarPanelInput {
  dailyEnergyDemandKwh: number;
  peakSunHours?: number;        // e.g., 4.5–6.0 hours in Nigeria
  panelWattage?: number;        // e.g. 550W
  systemLossesFactor?: number;  // e.g. 0.82 (18% losses — dust, wiring, temp)
  targetSolarOffsetPercent?: number; // % of demand to cover via solar (default 100%)
  location?: string;
}

// Nigeria PSH lookup
const NIGERIA_PSH: Record<string, number> = {
  'Lagos': 4.8, 'Abuja': 5.2, 'Kano': 6.0, 'Port Harcourt': 4.5,
  'Ibadan': 4.9, 'Enugu': 4.7, 'Kaduna': 5.4, 'Jos': 5.6, 'Maiduguri': 6.2,
};

export function calculateSolarPanelSizing(input: SolarPanelInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.dailyEnergyDemandKwh) || input.dailyEnergyDemandKwh <= 0) {
    errors.push('Daily energy demand (kWh) must be a positive number.');
  }

  const psh = input.peakSunHours ??
    (input.location ? NIGERIA_PSH[input.location] ?? 4.8 : 4.8);

  if (!Number.isFinite(psh) || psh <= 0 || psh > 12) {
    errors.push('Peak sun hours must be between 0.1 and 12 hours/day.');
  }

  const panelWatt = input.panelWattage ?? 550;
  if (!Number.isFinite(panelWatt) || panelWatt <= 0 || panelWatt > 1000) {
    errors.push('Panel wattage must be between 1W and 1000W.');
  }

  const losses = input.systemLossesFactor ?? 0.82;
  if (!Number.isFinite(losses) || losses <= 0 || losses > 1) {
    errors.push('System losses factor must be between 0.01 and 1.0 (e.g. 0.82 for 18% losses).');
  }

  const offsetFraction = Math.min(1, (input.targetSolarOffsetPercent ?? 100) / 100);

  if (errors.length > 0) {
    return {
      toolId: 'solar-panel-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid energy demand or solar resource inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Effective demand = total demand × solar offset %
  const effectiveDemandKwh = input.dailyEnergyDemandKwh * offsetFraction;

  // Required PV Array Power (kWp) = Effective Daily kWh / (Peak Sun Hours × Losses)
  const requiredKwp = effectiveDemandKwh / (psh * losses);
  const totalWatts = requiredKwp * 1000;
  const panelCount = Math.ceil(totalWatts / panelWatt);
  const actualKwp = Number(((panelCount * panelWatt) / 1000).toFixed(2));
  const estimatedDailyGenerationKwh = Number((actualKwp * psh * losses).toFixed(2));
  const coveragePercent = Number(((estimatedDailyGenerationKwh / input.dailyEnergyDemandKwh) * 100).toFixed(1));

  // Roof area: ~2.3 m² per 550W standard panel (1.764m × 1.048m ≈ 1.85m², +20% spacing)
  const areaPerPanelM2 = panelWatt >= 500 ? 2.3 : panelWatt >= 400 ? 2.0 : 1.7;
  const estimatedAreaM2 = Number((panelCount * areaPerPanelM2).toFixed(1));

  if (!Number.isFinite(actualKwp)) {
    return {
      toolId: 'solar-panel-sizing',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Calculation produced an invalid result. Review PSH and losses factor.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: panel sizing calculation produced an invalid number.'] },
    };
  }

  const warnings = [];
  if (psh < 4.0) {
    warnings.push({
      code: 'LOW_IRRADIANCE',
      message: `Peak sun hours of ${psh} h/day is below the 4.0 h/day West Africa baseline. Array will be oversized seasonally.`,
      severity: 'info' as const,
      suggestion: 'Use the highest irradiance season data for sizing, and incorporate battery backup for overcast days.',
    });
  }
  if (losses < 0.75) {
    warnings.push({
      code: 'HIGH_SYSTEM_LOSSES',
      message: `System loss factor of ${Math.round((1 - losses) * 100)}% is higher than typical. Verify soiling, cable losses, and MPPT efficiency.`,
      severity: 'warning' as const,
      suggestion: 'Clean panels regularly, minimize cable lengths, and use high-efficiency MPPT inverters to reduce system losses.',
    });
  }
  if (panelCount > 50) {
    warnings.push({
      code: 'LARGE_ARRAY',
      message: `Array of ${panelCount} panels requires careful structural and PV string design.`,
      severity: 'info' as const,
      suggestion: 'Use the PV String Layout Configurator to design optimal string configurations for this array size.',
    });
  }

  return {
    toolId: 'solar-panel-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Sized using regional solar irradiance (PSH) and STC panel rating with dust/temperature loss factors per IEC 61215 methodology.',
    engineering_results: {
      dailyDemandKwh: input.dailyEnergyDemandKwh,
      effectiveDemandKwh: Number(effectiveDemandKwh.toFixed(2)),
      peakSunHours: psh,
      systemLossesFactor: losses,
      solarOffsetPercent: Math.round(offsetFraction * 100),
      requiredArrayKwp: Number(requiredKwp.toFixed(2)),
      recommendedPanelWattage: panelWatt,
      recommendedPanelCount: panelCount,
      actualArrayKwp: actualKwp,
      estimatedDailyGenerationKwh,
      coveragePercent,
      estimatedRoofAreaM2: estimatedAreaM2,
    },
    recommended_configuration: {
      systemCapacityKw: actualKwp,
      panelCount,
      panelPowerWatt: panelWatt,
      equipmentList: [
        {
          id: 'pv-mod-550',
          name: `${panelWatt}W Monocrystalline PERC Solar Panel (Tier-1)`,
          category: 'panel',
          specifications: {
            powerWatts: `${panelWatt}W STC`,
            efficiency: `${panelWatt >= 550 ? '21.5' : panelWatt >= 450 ? '20.5' : '19.5'}%`,
            warranty: '25-Year Linear Power Warranty (80.6% at Year 25)',
            dimensions: `~${Math.round(areaPerPanelM2 * 1000) / 1000}m² footprint`,
          },
          recommendedQuantity: panelCount,
          reason: `Provides ${actualKwp} kWp total array capacity, generating approx. ${estimatedDailyGenerationKwh} kWh/day and covering ${coveragePercent}% of ${input.dailyEnergyDemandKwh} kWh/day demand.`,
        },
      ],
    },
    warnings,
    assumptions: {
      peakSunHours: `${psh} hours/day`,
      systemLosses: `${Math.round((1 - losses) * 100)}% (dust, wiring, temperature, MPPT losses)`,
      areaPerPanel: `${areaPerPanelM2} m²/panel (including clearance spacing)`,
      solarOffset: `${Math.round(offsetFraction * 100)}% of daily demand`,
    },
    supporting_notes: [
      `Required array: ${Number(requiredKwp.toFixed(2))} kWp → Installed: ${actualKwp} kWp (${panelCount} × ${panelWatt}W panels).`,
      `Estimated daily generation: ${estimatedDailyGenerationKwh} kWh/day covers ${coveragePercent}% of ${input.dailyEnergyDemandKwh} kWh/day demand.`,
      `Roof area required: approximately ${estimatedAreaM2} m² (${Math.round(estimatedAreaM2 / 0.0929).toLocaleString()} sq ft) including panel spacing.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
