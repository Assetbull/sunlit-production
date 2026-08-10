import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope } from '../core/envelope';

export interface SolarSavingsInput {
  dailySolarGenKwh?: number;
  solarSystemCapacityKwp?: number; // Alias for backward compatibility
  gridTariffNairaPerKwh?: number;
  tariffBand?: string; // Alias for UI compatibility
  solarOffsetPercent?: number; // Alias for UI compatibility
  monthlyGridBillNaira?: number;
  currentMonthlyGridBillNaira?: number;
  monthlyDieselFuelExpenseNaira?: number;
  currentMonthlyDieselBillNaira?: number;
  generatorKva?: number;
  dieselPriceNairaPerLiter?: number;
  gridDisplacementPercent?: number;
  generatorDisplacementPercent?: number;
  tariffEscalationPercent?: number;
}

export function calculateSolarSavings(input: SolarSavingsInput): SharedCalculationResult {
  let dailySolarKwh = input.dailySolarGenKwh ?? 0;
  if (dailySolarKwh <= 0) {
    if (input.solarSystemCapacityKwp && input.solarSystemCapacityKwp > 0) {
      dailySolarKwh = Number((input.solarSystemCapacityKwp * 4.8 * 0.86).toFixed(2));
    } else {
      const gridBill = input.monthlyGridBillNaira ?? input.currentMonthlyGridBillNaira ?? 0;
      const tariff = input.gridTariffNairaPerKwh ?? 225.0;
      if (gridBill > 0) {
        const offset = (input.solarOffsetPercent ?? 80) / 100.0;
        dailySolarKwh = Number(((gridBill / tariff / 30) * offset).toFixed(2));
      }
    }
  }

  const errors: string[] = [];
  if (dailySolarKwh <= 0) {
    errors.push('Daily solar generation (kWh/day) must be specified and > 0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'solar-savings',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing daily solar generation input.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Enter estimated solar daily kWh generation.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const gridTariff = input.gridTariffNairaPerKwh ?? 225.0;
  const dieselPrice = input.dieselPriceNairaPerLiter ?? 1350.0;
  const gridDisplacement = (input.gridDisplacementPercent ?? 90) / 100.0;
  const genDisplacement = (input.generatorDisplacementPercent ?? 85) / 100.0;

  const monthlySolarKwh = dailySolarKwh * 30.0;
  const annualSolarKwh = dailySolarKwh * 365.0;

  const gridBill = input.monthlyGridBillNaira ?? input.currentMonthlyGridBillNaira;
  const monthlyGridSavingsNaira = gridBill ? Math.round(gridBill * gridDisplacement) : Math.round(monthlySolarKwh * gridDisplacement * gridTariff);
  const annualGridSavingsNaira = monthlyGridSavingsNaira * 12;

  const monthlyGenFuelExpense = input.monthlyDieselFuelExpenseNaira ?? input.currentMonthlyDieselBillNaira ?? 0;
  const monthlyGeneratorSavingsNaira = Math.round(monthlyGenFuelExpense * genDisplacement);
  const annualGeneratorSavingsNaira = monthlyGeneratorSavingsNaira * 12;

  const totalMonthlySavingsNaira = monthlyGridSavingsNaira + monthlyGeneratorSavingsNaira;
  const totalAnnualSavingsNaira = annualGridSavingsNaira + annualGeneratorSavingsNaira;

  const escalation = (input.tariffEscalationPercent ?? 8.0) / 100.0;
  let tenYearSavingsNaira = 0;
  let twentyFiveYearSavingsNaira = 0;

  for (let yr = 1; yr <= 25; yr++) {
    const yrSavings = totalAnnualSavingsNaira * Math.pow(1.0 + escalation, yr - 1);
    if (yr <= 10) tenYearSavingsNaira += yrSavings;
    twentyFiveYearSavingsNaira += yrSavings;
  }

  const engineeringResults = {
    dailySolarGenKwh: dailySolarKwh,
    monthlySolarGenKwh: monthlySolarKwh,
    annualSolarGenKwh: annualSolarKwh,
    gridTariffNairaPerKwh: gridTariff,
    dieselPriceNairaPerLiter: dieselPrice,
    monthlyGridSavingsNaira,
    annualGridSavingsNaira,
    monthlyGeneratorSavingsNaira,
    annualGeneratorSavingsNaira,
    totalMonthlySavingsNaira,
    totalAnnualSavingsNaira,
    tenYearCumulativeSavingsNaira: Math.round(tenYearSavingsNaira),
    twentyFiveYearLifetimeSavingsNaira: Math.round(twentyFiveYearSavingsNaira),
    gridDisplacementPercent: Math.round(gridDisplacement * 100),
    generatorDisplacementPercent: Math.round(genDisplacement * 100),
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'solar-savings',
    status: 'ENGINEERING_VALIDATED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'Deterministic Tariff & Diesel Displacement Cashflow Model',
      governingStandards: ['NERC Band A MYTO', 'NMDPRA Market Benchmark'],
      keyEquations: [
        'Savings_grid = E_solar_kWh × Tariff_kWh × Displacement_grid',
        'Savings_gen = Expense_gen_monthly × Displacement_gen',
        'Savings_lifetime = Σ (Savings_annual × (1 + Inflation)^t)',
      ],
      deratingFactorsApplied: {
        gridDisplacementPercent: Math.round(gridDisplacement * 100),
        generatorDisplacementPercent: Math.round(genDisplacement * 100),
      },
    },
    inputsUsed: input as any,
  });

  return {
    toolId: 'solar-savings',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Savings calculated from DISCO Band A electricity tariffs and diesel fuel displacement rates.',
    engineering_results: engineeringResults,
    recommended_configuration: {},
    warnings: [],
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      `Estimated annual savings of ₦${totalAnnualSavingsNaira.toLocaleString()} based on ₦${gridTariff}/kWh Band A grid tariff.`,
      `Lifetime 25-year financial savings projected at ₦${Math.round(twentyFiveYearSavingsNaira).toLocaleString()} with 8% annual tariff escalation.`
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
