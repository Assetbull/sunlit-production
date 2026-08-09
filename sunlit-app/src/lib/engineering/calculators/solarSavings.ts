import { SharedCalculationResult } from '../types';

// Current NERC tariff bands (₦/kWh) — 2024/2025 Band A rates
export const NERC_TARIFF_BANDS: Record<string, number> = {
  'BAND_A': 225,   // min 20hr supply/day
  'BAND_B': 63,    // min 16hr supply/day
  'BAND_C': 50,    // min 12hr supply/day
  'BAND_D': 45,    // min 8hr supply/day
  'BAND_E': 40,    // less than 8hr supply/day (prepaid default)
};

export interface SolarSavingsInput {
  currentMonthlyGridBillNaira?: number;
  currentMonthlyDieselBillNaira?: number;
  solarSystemCapacityKwp: number;
  tariffBand?: keyof typeof NERC_TARIFF_BANDS;
  electricityTariffNairaPerKwh?: number; // override tariff band if specified
  dieselCostPerLiterNaira?: number;      // default ₦1,400/liter
  dieselGenKwhPerLiter?: number;         // default 3.2 kWh/liter
  solarOffsetPercent?: number;           // % of demand met by solar (default 85%)
  annualEscalationPercent?: number;      // annual energy price inflation (default 12%)
  locationPeakSunHours?: number;         // PSH for location (default 4.8)
}

export function calculateSolarSavings(input: SolarSavingsInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.solarSystemCapacityKwp) || input.solarSystemCapacityKwp <= 0) {
    errors.push('Solar system capacity (kWp) must be a positive number.');
  }

  const gridBill = input.currentMonthlyGridBillNaira ?? 0;
  const dieselBill = input.currentMonthlyDieselBillNaira ?? 0;

  if (gridBill < 0 || dieselBill < 0) {
    errors.push('Monthly bills cannot be negative.');
  }

  if (gridBill <= 0 && dieselBill <= 0) {
    errors.push('Please enter your current monthly grid electricity bill and/or diesel generator spending.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'solar-savings',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to missing or invalid utility bills.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const psh = input.locationPeakSunHours ?? 4.8;
  const pr = 0.78; // standard PR for Nigerian climate
  const dailySolarKwh = input.solarSystemCapacityKwp * psh * pr;
  const monthlySolarKwh = dailySolarKwh * 30.4167;

  // Determine electricity tariff
  const tariffBandKey = input.tariffBand ?? 'BAND_A';
  const gridTariff = input.electricityTariffNairaPerKwh ?? NERC_TARIFF_BANDS[tariffBandKey] ?? 225;

  // Diesel cost per kWh generated
  const dieselPerLiter = input.dieselCostPerLiterNaira ?? 1400;
  const kwhPerLiter = input.dieselGenKwhPerLiter ?? 3.2;
  const dieselCostPerKwh = dieselPerLiter / kwhPerLiter;

  // Solar offset: how much of demand does solar cover (0–100%)
  const solarOffsetFraction = Math.min(1, (input.solarOffsetPercent ?? 85) / 100);

  // Monthly savings: solar generation displaces grid and diesel consumption proportionally
  // Cap savings at actual bill — can't save more than what was spent
  const monthlyGridSavingsNaira = Math.min(gridBill * solarOffsetFraction, monthlySolarKwh * gridTariff);
  const monthlyDieselSavingsNaira = Math.min(dieselBill * solarOffsetFraction, monthlySolarKwh * dieselCostPerKwh);
  const totalMonthlySavingsNaira = monthlyGridSavingsNaira + monthlyDieselSavingsNaira;
  const totalAnnualSavingsNaira = totalMonthlySavingsNaira * 12;
  const totalBaselineMonthlyNaira = gridBill + dieselBill;
  const savingsPercent = totalBaselineMonthlyNaira > 0
    ? Number(((totalMonthlySavingsNaira / totalBaselineMonthlyNaira) * 100).toFixed(1))
    : 0;

  // N-Year cumulative savings with escalation
  const escalationRate = (input.annualEscalationPercent ?? 12) / 100;
  let cumulative10YearSavingsNaira = 0;
  let cumulative25YearSavingsNaira = 0;
  let currentAnnualSavings = totalAnnualSavingsNaira;

  for (let yr = 1; yr <= 25; yr++) {
    if (yr <= 10) cumulative10YearSavingsNaira += currentAnnualSavings;
    cumulative25YearSavingsNaira += currentAnnualSavings;
    currentAnnualSavings *= (1 + escalationRate);
  }

  if (!Number.isFinite(totalMonthlySavingsNaira)) {
    return {
      toolId: 'solar-savings',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Calculation produced invalid results. Review input values.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: savings calculation produced an invalid number.'] },
    };
  }

  const warnings = [];
  if (savingsPercent < 50) {
    warnings.push({
      code: 'LOW_SAVINGS_PERCENTAGE',
      message: `Solar covers only ${savingsPercent}% of current energy spend. System may be undersized for the stated energy cost.`,
      severity: 'info' as const,
      suggestion: 'Consider increasing system capacity to capture more savings, especially if diesel generator costs are high.',
    });
  }

  return {
    toolId: 'solar-savings',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: `Financial savings modelled against NERC ${tariffBandKey} tariff (₦${gridTariff}/kWh) and diesel generator fuel displacement rates at ₦${Math.round(dieselCostPerKwh)}/kWh effective cost.`,
    engineering_results: {
      monthlySolarGenerationKwh: Math.round(monthlySolarKwh),
      solarOffsetPercent: Math.round(solarOffsetFraction * 100),
      monthlyGridSavingsNaira: Math.round(monthlyGridSavingsNaira),
      monthlyDieselSavingsNaira: Math.round(monthlyDieselSavingsNaira),
      totalMonthlySavingsNaira: Math.round(totalMonthlySavingsNaira),
      totalAnnualSavingsNaira: Math.round(totalAnnualSavingsNaira),
      cumulative10YearSavingsNaira: Math.round(cumulative10YearSavingsNaira),
      cumulative25YearSavingsNaira: Math.round(cumulative25YearSavingsNaira),
      savingsAsPercentOfBaseline: savingsPercent,
      tariffBand: tariffBandKey,
      gridTariffNairaPerKwh: gridTariff,
      dieselCostPerKwhNaira: Math.round(dieselCostPerKwh),
    },
    recommended_configuration: {
      systemCapacityKw: input.solarSystemCapacityKwp,
    },
    warnings,
    assumptions: {
      electricityTariff: `₦${gridTariff}/kWh (NERC ${tariffBandKey})`,
      dieselFuelCost: `₦${dieselPerLiter}/liter`,
      dieselGeneratorEfficiency: `${kwhPerLiter} kWh/liter`,
      solarOffsetPercent: `${Math.round(solarOffsetFraction * 100)}%`,
      annualEscalationRate: `${((escalationRate) * 100).toFixed(0)}%`,
      performanceRatio: '78% (Nigeria tropical PR)',
      peakSunHours: `${psh} h/day`,
    },
    supporting_notes: [
      `Solar system generates approximately ${Math.round(monthlySolarKwh)} kWh/month, displacing ${Math.round(solarOffsetFraction * 100)}% of current energy consumption.`,
      `Diesel power costs ≈₦${Math.round(dieselCostPerKwh)}/kWh — ${Math.round(dieselCostPerKwh / gridTariff)}× more expensive than NERC grid tariff.`,
      `10-year cumulative savings of ₦${(Math.round(cumulative10YearSavingsNaira) / 1000000).toFixed(1)}M assumes ${((escalationRate) * 100).toFixed(0)}% annual tariff escalation.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
