import { SharedCalculationResult } from '../types';

export interface SolarPanelInput {
  dailyEnergyDemandKwh: number;
  peakSunHours?: number; // e.g., 4.5 to 5.5 hours in Nigeria
  panelWattage?: number; // e.g. 550W
  systemLossesFactor?: number; // e.g. 0.82 (18% losses)
}

export function calculateSolarPanelSizing(input: SolarPanelInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.dailyEnergyDemandKwh <= 0) errors.push('Daily energy demand (kWh) must be greater than 0.');

  const psh = input.peakSunHours ?? 4.8; // Nigeria average
  const panelWatt = input.panelWattage ?? 550;
  const losses = input.systemLossesFactor ?? 0.82;

  if (errors.length > 0) {
    return {
      toolId: 'solar-panel-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid daily energy demand.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Required PV Array Power (kWp) = Daily kWh / (Peak Sun Hours * Losses)
  const requiredKwp = input.dailyEnergyDemandKwh / (psh * losses);
  const totalWatts = requiredKwp * 1000;
  const panelCount = Math.ceil(totalWatts / panelWatt);
  const actualKwp = Number(((panelCount * panelWatt) / 1000).toFixed(2));
  const estimatedDailyGenerationKwh = Number((actualKwp * psh * losses).toFixed(2));

  // Area requirement approx 2.5 m² per 550W panel
  const estimatedAreaM2 = Number((panelCount * 2.5).toFixed(1));

  return {
    toolId: 'solar-panel-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Sized based on regional solar irradiance (PSH) and STC panel rating with dust/temperature loss factors.',
    engineering_results: {
      dailyDemandKwh: input.dailyEnergyDemandKwh,
      peakSunHours: psh,
      requiredArrayKwp: Number(requiredKwp.toFixed(2)),
      recommendedPanelWattage: panelWatt,
      recommendedPanelCount: panelCount,
      actualArrayKwp: actualKwp,
      estimatedDailyGenerationKwh,
      estimatedRoofAreaM2: estimatedAreaM2,
    },
    recommended_configuration: {
      systemCapacityKw: actualKwp,
      panelCount,
      panelPowerWatt: panelWatt,
      equipmentList: [
        {
          id: 'pv-mod-550',
          name: `${panelWatt}W Monocrystalline PERC Solar Panel`,
          category: 'panel',
          specifications: {
            powerWatts: panelWatt,
            efficiency: '21.5%',
            warranty: '25-Year Linear Power Warranty',
          },
          recommendedQuantity: panelCount,
          reason: `Provides ${actualKwp} kWp total array capacity to generate approx ${estimatedDailyGenerationKwh} kWh/day.`,
        },
      ],
    },
    warnings: psh < 4.0 ? [{
      code: 'LOW_IRRADIANCE',
      message: 'Peak sun hours below 4.0 h/day. Larger panel array required for winter/cloudy days.',
      severity: 'info',
      suggestion: 'Incorporate backup generator or increase battery capacity.'
    }] : [],
    assumptions: {
      peakSunHours: `${psh} hours/day`,
      systemLosses: `${Math.round((1 - losses) * 100)}% (dust, wiring, temperature derating)`,
      areaPerPanel: '2.5 m²/panel',
    },
    supporting_notes: [
      `Calculated for average solar irradiance of ${psh} peak sun hours in West Africa region.`,
      `Includes 18% derating for thermal loss, dust accumulation, and cable resistance.`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
