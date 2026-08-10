import { metricsStore } from './core/observability';
import { sanitizeObjectKeys } from './core/inputValidation';

export interface PythonYieldInput {
  kwp: number;
  psh?: number;
  loss_factor?: number;
  temp_coeff?: number;
  temp_ambient_c?: number;
}

export interface PythonYieldResult {
  kwp: number;
  psh: number;
  daily_kwh: number;
  monthly_kwh: number;
  annual_kwh: number;
  specific_yield_kwh_per_kwp: number;
  performance_ratio_percent: number;
  thermal_loss_percent: number;
}

export interface PythonFinanceInput {
  capex: number;
  annual_savings: number;
  annual_opex?: number;
  discount_rate?: number;
  years?: number;
  degradation?: number;
}

export interface PythonFinanceResult {
  capex_naira: number;
  annual_savings_naira: number;
  simple_payback_years: number;
  discounted_payback_years: number;
  npv_naira: number;
  irr_percent: number;
  roi_percent: number;
  lifetime_gross_savings_naira: number;
}

/**
 * Pure TypeScript Closed-Form Fallback for Solar Yield
 */
export function calculateSolarYieldTs(input: PythonYieldInput): PythonYieldResult {
  const kwp = input.kwp;
  const psh = input.psh ?? 4.8;
  const lossFactor = input.loss_factor ?? 0.14;
  const tempCoeff = (input.temp_coeff ?? -0.35) / 100.0;
  const tempAmbientC = input.temp_ambient_c ?? 30.0;

  const tempCellC = tempAmbientC + 25.0;
  const thermalDerating = 1.0 + tempCoeff * (tempCellC - 25.0);

  const dailyKwh = kwp * psh * (1.0 - lossFactor) * thermalDerating;
  const monthlyKwh = dailyKwh * 30.0;
  const annualKwh = dailyKwh * 365.0;
  const specificYield = kwp > 0 ? annualKwh / kwp : 0.0;
  const performanceRatio = (1.0 - lossFactor) * thermalDerating * 100.0;

  return {
    kwp: Number(kwp.toFixed(2)),
    psh: Number(psh.toFixed(2)),
    daily_kwh: Number(dailyKwh.toFixed(2)),
    monthly_kwh: Number(monthlyKwh.toFixed(2)),
    annual_kwh: Number(annualKwh.toFixed(2)),
    specific_yield_kwh_per_kwp: Number(specificYield.toFixed(1)),
    performance_ratio_percent: Number(performanceRatio.toFixed(1)),
    thermal_loss_percent: Number(((1.0 - thermalDerating) * 100.0).toFixed(2)),
  };
}

/**
 * Pure TypeScript Closed-Form Fallback for Financial Modeling
 */
export function calculateFinanceTs(input: PythonFinanceInput): PythonFinanceResult {
  const capex = input.capex;
  const annualSavings = input.annual_savings;
  const annualOpex = input.annual_opex ?? 50000.0;
  const discountRate = input.discount_rate ?? 0.12;
  const years = input.years ?? 25;
  const degradation = input.degradation ?? 0.005;

  const netAnnual = annualSavings - annualOpex;
  const simplePayback = netAnnual > 0 ? capex / netAnnual : 999.0;

  let cumulativeDiscounted = -capex;
  let discountedPayback = 999.0;
  let totalGross = 0;
  const discountedCashflows: number[] = [-capex];
  const cashflows: number[] = [-capex];

  for (let t = 1; t <= years; t++) {
    const yieldMult = Math.pow(1.0 - degradation, t - 1);
    const cf = netAnnual * yieldMult;
    cashflows.push(cf);
    totalGross += cf;

    const dCf = cf / Math.pow(1.0 + discountRate, t);
    discountedCashflows.push(dCf);

    const prevCum = cumulativeDiscounted;
    cumulativeDiscounted += dCf;
    if (prevCum < 0 && cumulativeDiscounted >= 0 && discountedPayback === 999.0) {
      discountedPayback = t - 1 + -prevCum / dCf;
    }
  }

  const npv = discountedCashflows.reduce((a, b) => a + b, 0);

  // IRR Newton-Raphson approximation
  let rate = 0.15;
  for (let i = 0; i < 30; i++) {
    let val = 0;
    let deriv = 0;
    for (let idx = 0; idx < cashflows.length; idx++) {
      val += cashflows[idx] / Math.pow(1.0 + rate, idx);
      deriv += (-idx * cashflows[idx]) / Math.pow(1.0 + rate, idx + 1);
    }
    if (Math.abs(deriv) < 1e-6) break;
    rate = rate - val / deriv;
  }

  const irr = Number((rate * 100.0).toFixed(2));
  const roi = Number((((totalGross - capex) / capex) * 100.0).toFixed(1));

  return {
    capex_naira: Math.round(capex),
    annual_savings_naira: Math.round(annualSavings),
    simple_payback_years: Number(simplePayback.toFixed(1)),
    discounted_payback_years: Number(discountedPayback.toFixed(1)),
    npv_naira: Math.round(npv),
    irr_percent: irr,
    roi_percent: roi,
    lifetime_gross_savings_naira: Math.round(totalGross),
  };
}

/**
 * Executes Python calculations via script invocation with seamless TS fallback
 */
export async function runPythonCalculation<T = any>(action: 'yield' | 'finance', params: any): Promise<T> {
  // Validate action allowlist
  if (action !== 'yield' && action !== 'finance') {
    metricsStore.recordPythonExecution(false);
    return (action === 'yield' ? calculateSolarYieldTs(params) : calculateFinanceTs(params)) as unknown as T;
  }

  // Sanitize input params (strip prototype tampering, sanitize object)
  const safeParams = sanitizeObjectKeys(params || {}) as any;

  if (typeof window !== 'undefined') {
    // Client browser environment: return deterministic TS engine result directly
    if (action === 'yield') return calculateSolarYieldTs(safeParams) as unknown as T;
    return calculateFinanceTs(safeParams) as unknown as T;
  }

  return new Promise((resolve) => {
    try {
      // Dynamic Node.js module import
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const cp = require('child_process');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pathMod = require('path');
      const scriptPath = pathMod.join(process.cwd(), 'src/lib/engineering/python/pv_solar_engine.py');
      const payload = JSON.stringify({ action, params: safeParams });

      cp.execFile(
        'python3',
        [scriptPath, payload],
        { timeout: 3000, maxBuffer: 1024 * 1024 },
        (error: any, stdout: string) => {
          if (error || !stdout) {
            metricsStore.recordPythonExecution(false);
            if (action === 'yield') resolve(calculateSolarYieldTs(safeParams) as unknown as T);
            else resolve(calculateFinanceTs(safeParams) as unknown as T);
            return;
          }

          try {
            const parsed = JSON.parse(stdout);
            if (parsed.error) {
              metricsStore.recordPythonExecution(false);
              if (action === 'yield') resolve(calculateSolarYieldTs(safeParams) as unknown as T);
              else resolve(calculateFinanceTs(safeParams) as unknown as T);
            } else {
              metricsStore.recordPythonExecution(true);
              resolve(parsed as T);
            }
          } catch {
            metricsStore.recordPythonExecution(false);
            if (action === 'yield') resolve(calculateSolarYieldTs(safeParams) as unknown as T);
            else resolve(calculateFinanceTs(safeParams) as unknown as T);
          }
        }
      );
    } catch {
      metricsStore.recordPythonExecution(false);
      if (action === 'yield') resolve(calculateSolarYieldTs(safeParams) as unknown as T);
      else resolve(calculateFinanceTs(safeParams) as unknown as T);
    }
  });
}

