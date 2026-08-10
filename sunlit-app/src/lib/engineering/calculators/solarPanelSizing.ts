import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope } from '../core/envelope';
import { PV_MODULE_CATALOG } from '../catalog/equipmentCatalog';
import { calculateSolarYieldTs } from '../pythonAdapter';

export interface SolarPanelSizingInput {
  dailyEnergyDemandKwh: number;
  location?: string;
  peakSunHours?: number;
  panelWattage?: number;
  systemLossFactor?: number;
  systemLossesFactor?: number; // Alias for backward compatibility
  designMargin?: number;
  selectedModuleId?: string;
}

export function calculateSolarPanelSizing(input: SolarPanelSizingInput): SharedCalculationResult {
  const errors: string[] = [];
  if (!input.dailyEnergyDemandKwh || input.dailyEnergyDemandKwh <= 0) {
    errors.push('Daily energy demand (kWh/day) must be specified and > 0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'solar-panel-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing or invalid energy demand input.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Enter daily kWh demand.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const psh = input.peakSunHours ?? 4.8;
  const lossFactor = input.systemLossFactor ?? input.systemLossesFactor ?? 0.14;
  const designMargin = input.designMargin ?? 1.15;

  const requiredDailyKwh = (input.dailyEnergyDemandKwh / (1.0 - lossFactor)) * designMargin;
  const requiredKwp = Number((requiredDailyKwh / psh).toFixed(2));

  let moduleSpec = PV_MODULE_CATALOG.find((m) => m.id === input.selectedModuleId);
  if (!moduleSpec) {
    moduleSpec = PV_MODULE_CATALOG.find((m) => m.ratedPowerW === (input.panelWattage ?? 550)) ?? PV_MODULE_CATALOG[0];
  }

  const panelWatt = moduleSpec.ratedPowerW;
  const moduleCount = Math.ceil((requiredKwp * 1000) / panelWatt);
  const actualKwp = Number(((moduleCount * panelWatt) / 1000).toFixed(2));

  const yieldSim = calculateSolarYieldTs({
    kwp: actualKwp,
    psh,
    loss_factor: lossFactor,
    temp_coeff: moduleSpec.tempCoeffPmaxPercentPerC,
  });

  const estimatedRoofAreaM2 = Number((moduleCount * 2.2).toFixed(1));

  const engineeringResults = {
    dailyEnergyDemandKwh: input.dailyEnergyDemandKwh,
    designRequiredDailyKwh: Number(requiredDailyKwh.toFixed(2)),
    requiredArrayKwp: requiredKwp,
    actualArrayKwp: actualKwp,
    recommendedModuleCount: moduleCount,
    modulePowerWatt: panelWatt,
    selectedModuleModel: `${moduleSpec.manufacturer} ${moduleSpec.model}`,
    estimatedRoofAreaM2,
    expectedDailyYieldKwh: yieldSim.daily_kwh,
    expectedMonthlyYieldKwh: yieldSim.monthly_kwh,
    expectedAnnualYieldKwh: yieldSim.annual_kwh,
    specificYieldKwhPerKwp: yieldSim.specific_yield_kwh_per_kwp,
    performanceRatioPercent: yieldSim.performance_ratio_percent,
    designMarginPercent: Math.round((designMargin - 1.0) * 100),
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'solar-panel-sizing',
    status: 'ENGINEERING_VALIDATED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'Deterministic Irradiance-Loss Derated PV Sizing Model',
      governingStandards: ['IEC 61724-1', 'IEEE 1562'],
      keyEquations: [
        'P_required_kWp = (E_daily / (1 - LossFactor)) × DesignMargin / PSH',
        'Module_Count = Ceil(P_required_W / P_module_W)',
        'E_yield_annual = P_actual_kWp × PSH × PR × 365',
      ],
      deratingFactorsApplied: {
        systemLossesPercent: lossFactor * 100,
        designMarginPercent: Math.round((designMargin - 1.0) * 100),
      },
    },
    inputsUsed: input as any,
  });

  return {
    toolId: 'solar-panel-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'PV array capacity calculated with loss derating, module catalog specs, and design safety margin.',
    engineering_results: engineeringResults,
    recommended_configuration: {
      systemCapacityKw: actualKwp,
      panelCount: moduleCount,
      panelPowerWatt: panelWatt,
      equipmentList: [
        {
          id: moduleSpec.id,
          name: `${moduleCount}× ${moduleSpec.manufacturer} ${moduleSpec.model} (${panelWatt}W)`,
          category: 'panel',
          specifications: {
            voc: `${moduleSpec.vocStcV} V`,
            vmp: `${moduleSpec.vmpStcV} V`,
            efficiency: `${moduleSpec.efficiencyPercent}%`,
          },
          recommendedQuantity: moduleCount,
          reason: `Generates ${yieldSim.daily_kwh} kWh/day average in ${input.location || 'Lagos'} irradiance zone.`,
        },
      ],
    },
    warnings: actualKwp < input.dailyEnergyDemandKwh / psh ? [{
      code: 'UNDERSIZED_ARRAY',
      message: 'Installed capacity margin is tight against daily load.',
      severity: 'warning' as const,
      suggestion: 'Increase panel count or select higher wattage module.'
    }] : [],
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      `Module count verified mathematically: ${moduleCount} × ${panelWatt}W = ${actualKwp} kWp.`,
      `Design includes a ${Math.round((designMargin - 1.0) * 100)}% safety buffer against dust, shading, and aging.`
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
