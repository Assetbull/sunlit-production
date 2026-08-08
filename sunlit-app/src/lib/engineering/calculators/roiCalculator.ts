import { SharedCalculationResult } from '../types';
import { calculateSolarSavings } from './solarSavings';

export interface RoiInput {
  systemCostNaira: number;
  solarSystemCapacityKwp: number;
  currentMonthlyGridBillNaira?: number;
  currentMonthlyDieselBillNaira?: number;
  annualMaintenanceCostNaira?: number;
}

export function calculateRoi(input: RoiInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.systemCostNaira <= 0) errors.push('Total system cost (₦) must be greater than 0.');
  if (input.solarSystemCapacityKwp <= 0) errors.push('Solar system capacity (kWp) must be greater than 0.');

  if (errors.length > 0) {
    return {
      toolId: 'roi-calculator',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid system cost or capacity.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const savingsRes = calculateSolarSavings({
    solarSystemCapacityKwp: input.solarSystemCapacityKwp,
    currentMonthlyGridBillNaira: input.currentMonthlyGridBillNaira,
    currentMonthlyDieselBillNaira: input.currentMonthlyDieselBillNaira,
  });

  const annualSavings = savingsRes.engineering_results.totalAnnualSavingsNaira || 0;
  const maintenance = input.annualMaintenanceCostNaira ?? input.systemCostNaira * 0.015; // 1.5% maintenance
  const netAnnualSavings = annualSavings - maintenance;

  const paybackPeriodYears = netAnnualSavings > 0 ? Number((input.systemCostNaira / netAnnualSavings).toFixed(1)) : 99;
  const simpleRoiPercent = netAnnualSavings > 0 ? Number(((netAnnualSavings / input.systemCostNaira) * 100).toFixed(1)) : 0;

  // 25-Year Net Present Value (NPV) & Internal Rate of Return (IRR) approximation
  const discountRate = 0.12; // 12% discount rate in Nigeria
  let npv = -input.systemCostNaira;
  let yearCashFlow = netAnnualSavings;

  for (let yr = 1; yr <= 25; yr++) {
    npv += yearCashFlow / Math.pow(1 + discountRate, yr);
    yearCashFlow *= 1.08; // 8% annual savings inflation
  }

  return {
    toolId: 'roi-calculator',
    calculation_status: 'SUCCESS',
    confidence: paybackPeriodYears <= 10 ? 'HIGH' : 'MODERATE',
    confidenceReasoning: 'Financial ROI modeled with cash flow discounting (NPV) and maintenance O&M deductions.',
    engineering_results: {
      totalInvestmentNaira: input.systemCostNaira,
      netAnnualSavingsNaira: Number(netAnnualSavings.toFixed(0)),
      paybackPeriodYears,
      simpleRoiPercent,
      estimated25YearNpvNaira: Number(npv.toFixed(0)),
      annualMaintenanceCostNaira: Number(maintenance.toFixed(0)),
    },
    recommended_configuration: {
      systemCapacityKw: input.solarSystemCapacityKwp,
    },
    warnings: paybackPeriodYears > 7 ? [{
      code: 'LONGER_PAYBACK',
      message: 'Payback period is greater than 7 years based solely on grid savings.',
      severity: 'info',
      suggestion: 'Factor in indirect diesel generator maintenance and health savings for total value.'
    }] : [],
    assumptions: {
      discountRate: '12%',
      annualMaintenance: '1.5% of total system cost',
      evaluationPeriod: '25 years',
    },
    supporting_notes: [
      `Payback period: ${paybackPeriodYears} years. System generates net positive cash flow for the remaining ${25 - paybackPeriodYears} years of operational lifespan.`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
