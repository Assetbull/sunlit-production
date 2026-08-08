import { SharedCalculationResult } from '../types';

export interface SolarSavingsInput {
  currentMonthlyGridBillNaira?: number;
  currentMonthlyDieselBillNaira?: number;
  solarSystemCapacityKwp: number;
  electricityTariffNairaPerKwh?: number; // default 225
  dieselCostPerLiterNaira?: number; // default 1350
  dieselGenKwhPerLiter?: number; // default 3.2 kWh/liter
}

export function calculateSolarSavings(input: SolarSavingsInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.solarSystemCapacityKwp <= 0) errors.push('Solar system capacity (kWp) must be greater than 0.');

  const gridBill = input.currentMonthlyGridBillNaira ?? 0;
  const dieselBill = input.currentMonthlyDieselBillNaira ?? 0;

  if (gridBill <= 0 && dieselBill <= 0) {
    errors.push('Please enter your current monthly grid electricity bill or diesel generator spending.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'solar-savings',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to missing current utility bills.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const psh = 4.8;
  const pr = 0.78;
  const dailySolarKwh = input.solarSystemCapacityKwp * psh * pr;
  const monthlySolarKwh = dailySolarKwh * 30.4;

  const gridTariff = input.electricityTariffNairaPerKwh ?? 225;
  const dieselPerLiter = input.dieselCostPerLiterNaira ?? 1350;
  const kwhPerLiter = input.dieselGenKwhPerLiter ?? 3.2;
  const dieselCostPerKwh = dieselPerLiter / kwhPerLiter; // ~₦421.8/kWh

  // Combined offset calculation
  const monthlyGridSavingsNaira = Math.min(gridBill, monthlySolarKwh * gridTariff);
  const monthlyDieselSavingsNaira = Math.min(dieselBill, monthlySolarKwh * dieselCostPerKwh);
  const totalMonthlySavingsNaira = monthlyGridSavingsNaira + monthlyDieselSavingsNaira;
  const totalAnnualSavingsNaira = totalMonthlySavingsNaira * 12;

  // 10-Year cumulative savings assuming 10% annual energy inflation
  let cumulative10YearSavingsNaira = 0;
  let currentAnnualSavings = totalAnnualSavingsNaira;
  for (let yr = 1; yr <= 10; yr++) {
    cumulative10YearSavingsNaira += currentAnnualSavings;
    currentAnnualSavings *= 1.10; // 10% annual fuel & tariff inflation
  }

  return {
    toolId: 'solar-savings',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Financial savings modeled against Band A utility tariffs and diesel generator fuel displacement rates.',
    engineering_results: {
      monthlySolarGenerationKwh: Number(monthlySolarKwh.toFixed(0)),
      monthlyGridSavingsNaira: Number(monthlyGridSavingsNaira.toFixed(0)),
      monthlyDieselSavingsNaira: Number(monthlyDieselSavingsNaira.toFixed(0)),
      totalMonthlySavingsNaira: Number(totalMonthlySavingsNaira.toFixed(0)),
      totalAnnualSavingsNaira: Number(totalAnnualSavingsNaira.toFixed(0)),
      cumulative10YearSavingsNaira: Number(cumulative10YearSavingsNaira.toFixed(0)),
    },
    recommended_configuration: {
      systemCapacityKw: input.solarSystemCapacityKwp,
    },
    warnings: [],
    assumptions: {
      electricityTariff: `₦${gridTariff}/kWh`,
      dieselFuelCost: `₦${dieselPerLiter}/liter`,
      dieselGeneratorEfficiency: `${kwhPerLiter} kWh/liter`,
      annualEnergyInflationRate: '10%',
    },
    supporting_notes: [
      `Displacing diesel power saves approx ₦${Math.round(dieselCostPerKwh)}/kWh compared to grid tariff of ₦${gridTariff}/kWh.`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
