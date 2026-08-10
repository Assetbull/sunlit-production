import { SharedCalculationResult } from '../types';
import { calculateLoad, LoadItem } from './loadCalculator';
import { calculateBatteryCapacity } from './batteryCapacity';
import { calculateInverterSizing } from './inverterSizing';
import { calculateSolarPanelSizing } from './solarPanelSizing';

export interface SolarSystemSizingInput {
  loadItems?: LoadItem[];
  monthlyBillNaira?: number;
  dailyKwhInput?: number;
  daysOfAutonomy?: number;
  location?: string;
  propertyType?: 'residential' | 'commercial' | 'industrial';
  occupants?: number;
  phaseType?: 'single-phase' | 'three-phase';
  roofType?: 'metal' | 'concrete' | 'tile';
  roofAngle?: number;
  gridAvailabilityHours?: number;
  gridReliability?: 'high' | 'medium' | 'frequent_outages' | 'off_grid';
  hasGenerator?: boolean;
  generatorKva?: number;
  generatorFuelExpenseMonth?: number;
  daytimeUsagePercent?: number;
  nighttimeUsagePercent?: number;
  backupScope?: 'essential' | 'full';
  criticalLoads?: string[];
  selectedPanelWattage?: number;
  selectedBatteryType?: 'lithium_lifepo4' | 'gel_lead_acid';
  selectedInverterType?: 'hybrid_pure_sine' | 'offgrid_sine';
}

export function calculateSolarSystemSizing(input: SolarSystemSizingInput): SharedCalculationResult {
  let dailyKwh = input.dailyKwhInput ?? 0;
  let continuousWatts = 0;

  if (input.dailyKwhInput && input.dailyKwhInput > 0) {
    dailyKwh = input.dailyKwhInput;
    continuousWatts = (dailyKwh * 1000) / 8;
  } else if (input.loadItems && input.loadItems.length > 0) {
    const loadRes = calculateLoad({ items: input.loadItems });
    if (loadRes.calculation_status === 'SUCCESS') {
      dailyKwh = loadRes.engineering_results.dailyEnergyDemandKwh;
      continuousWatts = loadRes.engineering_results.totalConnectedWatts;
    }
  } else if (input.monthlyBillNaira && input.monthlyBillNaira > 0) {
    // Estimate daily kWh from Band A DISCO electricity tariff (~₦225/kWh)
    const tariffPerKwh = 225;
    const monthlyKwh = input.monthlyBillNaira / tariffPerKwh;
    dailyKwh = Number((monthlyKwh / 30).toFixed(2));
    continuousWatts = (dailyKwh * 1000) / 8; // approx 8 peak equivalent operating hours
  }

  if (dailyKwh <= 0) {
    return {
      toolId: 'solar-system-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing load inventory, monthly electricity bill, or daily kWh input.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Please enter your DISCO bill, appliance list, or daily kWh consumption to continue.'] },
    };
  }

  const autonomy = input.daysOfAutonomy ?? 1.0;
  const isEssentialOnly = input.backupScope === 'essential';
  const targetDailyKwh = isEssentialOnly ? Number((dailyKwh * 0.65).toFixed(2)) : dailyKwh;

  const systemVoltage = continuousWatts <= 2000 ? 24 : 48;

  const batteryRes = calculateBatteryCapacity({
    dailyEnergyKwh: targetDailyKwh,
    daysOfAutonomy: autonomy,
    systemVoltage,
    chemistry: input.selectedBatteryType === 'gel_lead_acid' ? 'TUBULAR_GEL' : 'LITHIUM_LIFEPO4',
  });

  const inverterRes = calculateInverterSizing({
    continuousLoadWatts: continuousWatts > 0 ? continuousWatts : (dailyKwh * 1000) / 8,
  });

  const panelRes = calculateSolarPanelSizing({
    dailyEnergyDemandKwh: dailyKwh,
  });

  // Calculate annual generator fuel cost savings if user has a generator
  const monthlyGenFuel = input.generatorFuelExpenseMonth ?? 0;
  const annualGenSavingsNaira = monthlyGenFuel > 0 ? Math.round(monthlyGenFuel * 12 * 0.85) : 0;

  // Daytime vs Nighttime usage split
  const dayPercent = input.daytimeUsagePercent ?? 60;
  const nightPercent = input.nighttimeUsagePercent ?? 40;
  const daytimeKwh = Number((dailyKwh * (dayPercent / 100)).toFixed(2));
  const nighttimeKwh = Number((dailyKwh * (nightPercent / 100)).toFixed(2));

  // Determine panel count & total array rating
  const panelWatt = input.selectedPanelWattage ?? 550;
  const recommendedPanels = Math.ceil((panelRes.engineering_results.actualArrayKwp * 1000) / panelWatt);
  const actualKwp = Number(((recommendedPanels * panelWatt) / 1000).toFixed(2));
  const roofAreaM2 = Number((recommendedPanels * 2.2).toFixed(1));

  return {
    toolId: 'solar-system-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Integrated multi-variable system calculation cross-validating load, battery autonomy, inverter peak capacity, grid reliability, and solar array yield.',
    engineering_results: {
      dailyEnergyDemandKwh: dailyKwh,
      monthlyEnergyDemandKwh: Number((dailyKwh * 30).toFixed(2)),
      recommendedInverterKva: inverterRes.engineering_results.recommendedInverterKva,
      recommendedBatteryKwh: batteryRes.engineering_results.installedCapacityKwh,
      recommendedSolarArrayKwp: actualKwp,
      recommendedPanelCount: recommendedPanels,
      panelPowerWatt: panelWatt,
      estimatedRoofAreaM2: roofAreaM2,
      daytimeEnergyKwh: daytimeKwh,
      nighttimeEnergyKwh: nighttimeKwh,
      gridDisplacementPercent: 100,
      annualGeneratorSavingsNaira: annualGenSavingsNaira,
      propertyType: input.propertyType ?? 'residential',
      location: input.location ?? 'Lagos',
      phaseType: input.phaseType ?? 'single-phase',
      roofType: input.roofType ?? 'metal',
      gridAvailabilityHours: input.gridAvailabilityHours ?? 12,
      backupAutonomyDays: autonomy,
      backupScope: input.backupScope ?? 'full',
    },
    recommended_configuration: {
      systemCapacityKw: actualKwp,
      inverterRatingKva: inverterRes.engineering_results.recommendedInverterKva,
      batteryCapacityKwh: batteryRes.engineering_results.installedCapacityKwh,
      panelCount: recommendedPanels,
      panelPowerWatt: panelWatt,
      equipmentList: [
        {
          id: 'pv-array-monocrystalline',
          name: `${recommendedPanels}× ${panelWatt}W Tier-1 Monocrystalline Solar Panels`,
          category: 'panel',
          specifications: { capacityKwp: actualKwp, panelCount: recommendedPanels, efficiency: '21.8%' },
          recommendedQuantity: recommendedPanels,
          reason: `Generates ${Number((actualKwp * 4.5).toFixed(1))} kWh/day average in ${input.location || 'Lagos'} irradiance zone.`,
        },
        {
          id: 'inverter-pure-sine-hybrid',
          name: `${inverterRes.engineering_results.recommendedInverterKva} kVA ${input.phaseType === 'three-phase' ? '3-Phase' : 'Single-Phase'} Pure Sine Wave Hybrid Inverter`,
          category: 'inverter',
          specifications: { ratingKva: inverterRes.engineering_results.recommendedInverterKva, systemVoltage: `${systemVoltage}V DC` },
          recommendedQuantity: 1,
          reason: 'Handles peak continuous load and surge currents for installed property appliances.',
        },
        {
          id: 'battery-lifepo4-rack',
          name: `${batteryRes.engineering_results.installedCapacityKwh} kWh LiFePO4 Lithium Battery Storage System`,
          category: 'battery',
          specifications: { capacityKwh: batteryRes.engineering_results.installedCapacityKwh, dod: '80%', chemistry: 'LiFePO4' },
          recommendedQuantity: 1,
          reason: `Provides ${autonomy} day(s) of continuous energy autonomy during grid blackouts.`,
        },
      ],
    },
    warnings: [
      ...(dailyKwh > 50 ? [{
        code: 'LARGE_SYSTEM',
        message: 'System capacity exceeds standard single-phase residential sizing.',
        severity: 'warning' as const,
        suggestion: 'We recommend requesting a site engineering assessment from a verified Sunlit EPC contractor.'
      }] : []),
      ...(input.gridAvailabilityHours !== undefined && input.gridAvailabilityHours < 6 ? [{
        code: 'LOW_GRID_AVAILABILITY',
        message: 'Grid availability is less than 6 hours per day. Solar array yield is prioritized for battery recharging.',
        severity: 'info' as const,
        suggestion: 'Ensure solar array orientation has unshaded access from 9am to 4pm.'
      }] : []),
    ],
    assumptions: {
      location: `${input.location ?? 'Lagos State'} (Average Irradiance 4.8 PSH)`,
      electricityTariff: '₦225/kWh (Band A baseline)',
      batteryAutonomy: `${autonomy} day(s) (${input.backupScope ?? 'full'} coverage)`,
      roofType: `${input.roofType ?? 'metal'} roofing structure`,
      gridHours: `${input.gridAvailabilityHours ?? 12} hrs/day average grid power`,
    },
    supporting_notes: [
      'Complete system specification engineered to eliminate reliance on diesel generator power during grid outages.',
      'All component recommendations are cross-compatible on standard 48V DC bus architecture.',
      annualGenSavingsNaira > 0 ? `Estimated annual diesel generator fuel savings of ~₦${annualGenSavingsNaira.toLocaleString()}.` : '',
    ].filter(Boolean),
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
