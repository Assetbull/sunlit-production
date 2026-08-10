import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope } from '../core/envelope';
import { calculateFinanceTs } from '../pythonAdapter';

export interface RoiInput {
  systemCapexNaira?: number;
  systemCostNaira?: number;
  solarSystemCapacityKwp?: number;
  currentMonthlyGridBillNaira?: number; // Alias for backward compatibility
  currentMonthlyDieselBillNaira?: number; // Alias for UI compatibility
  annualMaintenanceCostNaira?: number; // Alias for OPEX
  annualSavingsNaira?: number;
  annualOpexNaira?: number;
  discountRatePercent?: number;
  systemLifetimeYears?: number;
  annualDegradationPercent?: number;
}

export function calculateRoi(input: RoiInput): SharedCalculationResult {
  const capex = input.systemCapexNaira ?? input.systemCostNaira ?? 0;
  
  let annualSavings = input.annualSavingsNaira ?? 0;
  if (annualSavings <= 0) {
    const gridBillMonth = input.currentMonthlyGridBillNaira ?? 0;
    const dieselBillMonth = input.currentMonthlyDieselBillNaira ?? 0;
    if (gridBillMonth > 0 || dieselBillMonth > 0) {
      annualSavings = Math.round((gridBillMonth * 0.85 + dieselBillMonth * 0.90) * 12);
    } else if (input.solarSystemCapacityKwp && input.solarSystemCapacityKwp > 0) {
      // Estimate yield savings at Band A tariff ₦225/kWh
      const annualKwh = input.solarSystemCapacityKwp * 4.8 * 0.86 * 365;
      annualSavings = Math.round(annualKwh * 225);
    }
  }

  const errors: string[] = [];
  if (!capex || capex <= 0) {
    errors.push('System CAPEX investment (₦) must be specified and > 0.');
  }
  if (!annualSavings || annualSavings <= 0) {
    errors.push('Annual energy savings (₦/year) must be specified and > 0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'roi-calculator',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing or invalid CAPEX or annual savings inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Enter CAPEX and annual savings.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const opex = input.annualOpexNaira ?? input.annualMaintenanceCostNaira ?? Math.round(capex * 0.01);
  const discountRate = (input.discountRatePercent ?? 12.0) / 100.0;
  const years = input.systemLifetimeYears ?? 25;
  const degradation = (input.annualDegradationPercent ?? 0.5) / 100.0;

  const finRes = calculateFinanceTs({
    capex,
    annual_savings: annualSavings,
    annual_opex: opex,
    discount_rate: discountRate,
    years,
    degradation,
  });

  const engineeringResults = {
    systemCapexNaira: capex,
    annualSavingsNaira: annualSavings,
    annualOpexNaira: opex,
    netAnnualSavingsNaira: annualSavings - opex,
    simplePaybackYears: finRes.simple_payback_years,
    discountedPaybackYears: finRes.discounted_payback_years,
    npvNaira: finRes.npv_naira,
    irrPercent: finRes.irr_percent,
    roiPercent: finRes.roi_percent,
    lifetimeGrossSavingsNaira: finRes.lifetime_gross_savings_naira,
    discountRatePercent: discountRate * 100,
    systemLifetimeYears: years,
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'roi-calculator',
    status: 'ENGINEERING_VALIDATED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'SciPy Discounted Cash Flow & Internal Rate of Return (IRR) Financial Model',
      governingStandards: ['ISO 15686-5 Life Cycle Costing', 'IEEE 1547.6 Financial Metrics'],
      keyEquations: [
        'NPV = Σ [CF_t / (1 + r)^t] - CAPEX',
        'Simple_Payback = CAPEX / Net_Annual_Savings',
        'IRR = Rate r where NPV(r) = 0',
      ],
      deratingFactorsApplied: {
        discountRatePercent: discountRate * 100,
        annualPvDegradationPercent: degradation * 100,
      },
    },
    inputsUsed: input as any,
  });

  return {
    toolId: 'roi-calculator',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Financial ROI, payback, NPV, and IRR calculated using discounted cashflow equations.',
    engineering_results: engineeringResults,
    recommended_configuration: {},
    warnings: finRes.simple_payback_years > 7 ? [{
      code: 'LONGER_PAYBACK',
      message: 'Payback period exceeds 7 years.',
      severity: 'info' as const,
      suggestion: 'Verify generator diesel displacement savings to reflect complete avoided cost.'
    }] : [],
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      `Simple payback achieved in ${finRes.simple_payback_years} years (${finRes.discounted_payback_years} years discounted).`,
      `Net Present Value (NPV) is ₦${finRes.npv_naira.toLocaleString()} with an Internal Rate of Return (IRR) of ${finRes.irr_percent}%.`
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
