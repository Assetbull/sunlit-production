import { SharedCalculationResult } from '../types';
import { calculateSolarSavings } from './solarSavings';

export interface RoiInput {
  systemCostNaira: number;
  solarSystemCapacityKwp: number;
  currentMonthlyGridBillNaira?: number;
  currentMonthlyDieselBillNaira?: number;
  annualMaintenanceCostNaira?: number;
  annualSavingsOverrideNaira?: number; // explicit annual savings (skips internal derivation)
  annualEscalationPercent?: number;   // energy price escalation %, default 10%
  discountRatePercent?: number;        // hurdle rate / discount rate, default 12%
  projectLifeYears?: number;           // evaluation period, default 25
}

export function calculateRoi(input: RoiInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.systemCostNaira) || input.systemCostNaira <= 0) {
    errors.push('Total system cost (₦) must be a positive number.');
  }
  if (!Number.isFinite(input.solarSystemCapacityKwp) || input.solarSystemCapacityKwp <= 0) {
    errors.push('Solar system capacity (kWp) must be a positive number.');
  }

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
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Determine annual savings — use override if provided, otherwise derive from savings calculator
  let annualSavings: number;
  let savingsSource: string;

  if (input.annualSavingsOverrideNaira !== undefined && input.annualSavingsOverrideNaira > 0) {
    annualSavings = input.annualSavingsOverrideNaira;
    savingsSource = 'user-specified annual savings';
  } else {
    const savingsRes = calculateSolarSavings({
      solarSystemCapacityKwp: input.solarSystemCapacityKwp,
      currentMonthlyGridBillNaira: input.currentMonthlyGridBillNaira,
      currentMonthlyDieselBillNaira: input.currentMonthlyDieselBillNaira,
    });

    if (savingsRes.calculation_status !== 'SUCCESS') {
      // Can't derive savings — use capacity-based estimate
      const estimatedMonthlySavings = input.solarSystemCapacityKwp * 4.8 * 0.78 * 30.4 * 225;
      annualSavings = estimatedMonthlySavings * 12;
      savingsSource = 'estimated from system capacity and NERC Band A tariff';
    } else {
      annualSavings = savingsRes.engineering_results.totalAnnualSavingsNaira ?? 0;
      savingsSource = 'derived from monthly grid and diesel bill inputs';
    }
  }

  const maintenance = input.annualMaintenanceCostNaira ?? input.systemCostNaira * 0.015; // 1.5% O&M
  const netAnnualSavings = annualSavings - maintenance;
  const escalationRate = (input.annualEscalationPercent ?? 10) / 100;
  const discountRate = (input.discountRatePercent ?? 12) / 100;
  const projectLife = input.projectLifeYears ?? 25;

  // Payback period calculation (accounts for escalation)
  let paybackPeriodYears: number;
  let cumulativeCashFlow = -input.systemCostNaira;
  let paybackFound = false;

  if (netAnnualSavings <= 0) {
    paybackPeriodYears = 99; // Never pays back with current assumptions
  } else {
    // Simple payback (no escalation)
    paybackPeriodYears = Number((input.systemCostNaira / netAnnualSavings).toFixed(1));
    paybackFound = true;
  }

  // Cash flow model — escalated annual savings
  const cashFlows: number[] = [-input.systemCostNaira];
  let npv = -input.systemCostNaira;
  let cumulativeNominal = -input.systemCostNaira;
  let escalatedCashFlow = netAnnualSavings;
  let paybackYearEscalated = 99;

  for (let yr = 1; yr <= projectLife; yr++) {
    const yearCashFlow = escalatedCashFlow;
    cashFlows.push(Number(yearCashFlow.toFixed(0)));
    npv += yearCashFlow / Math.pow(1 + discountRate, yr);
    cumulativeNominal += yearCashFlow;
    if (cumulativeNominal >= 0 && paybackYearEscalated === 99) {
      paybackYearEscalated = yr;
    }
    escalatedCashFlow *= (1 + escalationRate);
  }

  // Simple ROI (Year 1 return on investment)
  const simpleRoiPercent = input.systemCostNaira > 0
    ? Number(((netAnnualSavings / input.systemCostNaira) * 100).toFixed(1))
    : 0;

  // Internal Rate of Return (approximation via bisection)
  let irr = 0;
  try {
    let low = -0.99, high = 5.0;
    for (let i = 0; i < 100; i++) {
      const mid = (low + high) / 2;
      let npvTest = -input.systemCostNaira;
      let cf = netAnnualSavings;
      for (let yr = 1; yr <= projectLife; yr++) {
        npvTest += cf / Math.pow(1 + mid, yr);
        cf *= (1 + escalationRate);
      }
      if (Math.abs(npvTest) < 1) break;
      if (npvTest > 0) low = mid;
      else high = mid;
    }
    irr = Number(((low + high) / 2 * 100).toFixed(1));
  } catch {
    irr = 0;
  }

  if (!Number.isFinite(npv)) {
    return {
      toolId: 'roi-calculator',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'NPV calculation produced an invalid result. Check discount rate and project life inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: financial model produced an invalid number.'] },
    };
  }

  const warnings = [];
  if (paybackPeriodYears > 8) {
    warnings.push({
      code: 'LONGER_PAYBACK_PERIOD',
      message: `Payback period of ${paybackPeriodYears} years is longer than the 8-year benchmark for Nigerian solar projects.`,
      severity: 'info' as const,
      suggestion: 'Factor in diesel generator fuel, maintenance, and health savings for a comprehensive total value analysis. Consider solar financing options.',
    });
  }
  if (npv < 0) {
    warnings.push({
      code: 'NEGATIVE_NPV',
      message: `Net Present Value is negative at ${discountRate * 100}% discount rate. Project does not meet the stated hurdle rate.`,
      severity: 'warning' as const,
      suggestion: 'Consider a lower hurdle rate, longer project life, or additional revenue streams from the solar asset.',
    });
  }
  if (netAnnualSavings <= 0) {
    warnings.push({
      code: 'NEGATIVE_NET_SAVINGS',
      message: 'Annual O&M costs exceed annual savings. Review maintenance cost assumptions.',
      severity: 'critical' as const,
      suggestion: 'Annual maintenance should not exceed 2% of system cost. Verify the annual savings figure is correct.',
    });
  }

  return {
    toolId: 'roi-calculator',
    calculation_status: 'SUCCESS',
    confidence: paybackPeriodYears <= 8 && npv > 0 ? 'HIGH' : paybackPeriodYears <= 12 ? 'MODERATE' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: `Financial ROI modelled with ${discountRate * 100}% discount rate, ${escalationRate * 100}% annual escalation, and 1.5% O&M over ${projectLife} years.`,
    engineering_results: {
      totalInvestmentNaira: input.systemCostNaira,
      grossAnnualSavingsNaira: Math.round(annualSavings),
      annualMaintenanceCostNaira: Math.round(maintenance),
      netAnnualSavingsNaira: Math.round(netAnnualSavings),
      simplePaybackYears: paybackFound ? paybackPeriodYears : 99,
      escalatedPaybackYears: paybackYearEscalated,
      simpleRoiPercent,
      irrPercent: irr,
      npv25YearNaira: Math.round(npv),
      savingsSource,
      projectLifeYears: projectLife,
      discountRatePercent: discountRate * 100,
    },
    recommended_configuration: {
      systemCapacityKw: input.solarSystemCapacityKwp,
    },
    warnings,
    assumptions: {
      discountRate: `${discountRate * 100}%`,
      annualEscalation: `${escalationRate * 100}%`,
      annualMaintenance: `1.5% of total system cost (₦${Math.round(maintenance).toLocaleString()}/yr)`,
      evaluationPeriod: `${projectLife} years`,
      savingsSource,
    },
    supporting_notes: [
      `Simple payback: ${paybackFound ? paybackPeriodYears : '>25'} years | Escalated payback: ${paybackYearEscalated <= 25 ? paybackYearEscalated : '>25'} years.`,
      `25-year NPV: ₦${Math.round(npv).toLocaleString()} at ${discountRate * 100}% discount rate.`,
      `IRR ≈ ${irr}% — compare to cost of capital / alternative investment returns.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
