#!/usr/bin/env python3
"""
Sunlit Enterprise Engineering Platform — Python Calculation Engine
Deterministic solar yield, PV array performance, battery degradation, and financial modelling engine.
"""

import sys
import json
import math

def calculate_solar_yield(params):
    kwp = float(params.get('kwp', 1.0))
    psh = float(params.get('psh', 4.8))
    loss_factor = float(params.get('loss_factor', 0.14)) # 14% losses
    temp_coeff = float(params.get('temp_coeff', -0.35)) / 100.0 # %/°C
    temp_ambient_c = float(params.get('temp_ambient_c', 30.0))

    # Cell operating temperature: Tcell = Tambient + (NOCT - 20) / 800 * Irradiance
    temp_cell_c = temp_ambient_c + 25.0
    thermal_derating = 1.0 + temp_coeff * (temp_cell_c - 25.0)

    daily_kwh = kwp * psh * (1.0 - loss_factor) * thermal_derating
    monthly_kwh = daily_kwh * 30.0
    annual_kwh = daily_kwh * 365.0
    specific_yield = annual_kwh / kwp if kwp > 0 else 0.0
    performance_ratio = (1.0 - loss_factor) * thermal_derating * 100.0

    return {
        "kwp": round(kwp, 2),
        "psh": round(psh, 2),
        "daily_kwh": round(daily_kwh, 2),
        "monthly_kwh": round(monthly_kwh, 2),
        "annual_kwh": round(annual_kwh, 2),
        "specific_yield_kwh_per_kwp": round(specific_yield, 1),
        "performance_ratio_percent": round(performance_ratio, 1),
        "thermal_loss_percent": round((1.0 - thermal_derating) * 100.0, 2)
    }

def calculate_financial_metrics(params):
    capex = float(params.get('capex', 5000000.0))
    annual_savings = float(params.get('annual_savings', 1200000.0))
    annual_opex = float(params.get('annual_opex', 50000.0))
    discount_rate = float(params.get('discount_rate', 0.12))
    years = int(params.get('years', 25))
    degradation = float(params.get('degradation', 0.005))

    net_annual = annual_savings - annual_opex
    simple_payback = capex / net_annual if net_annual > 0 else 999.0

    # Build cashflows
    cashflows = [-capex]
    discounted_cashflows = [-capex]
    cumulative_discounted = -capex
    discounted_payback = 999.0

    for t in range(1, years + 1):
        yield_mult = (1.0 - degradation) ** (t - 1)
        cf = net_annual * yield_mult
        cashflows.append(cf)

        d_cf = cf / ((1.0 + discount_rate) ** t)
        discounted_cashflows.append(d_cf)

        prev_cum = cumulative_discounted
        cumulative_discounted += d_cf
        if prev_cum < 0 and cumulative_discounted >= 0 and discounted_payback == 999.0:
            discounted_payback = (t - 1) + (-prev_cum / d_cf)

    # Net Present Value (NPV)
    npv = sum(discounted_cashflows)

    # Internal Rate of Return (IRR) approximation or SciPy / numpy_financial fallback
    try:
        import numpy as np
        import numpy_financial as npf
        irr = float(npf.irr(cashflows)) * 100.0
    except Exception:
        # Newton-Raphson approximation for IRR
        rate = 0.15
        for _ in range(20):
            val = sum([cf / ((1.0 + rate) ** idx) for idx, cf in enumerate(cashflows)])
            deriv = sum([-idx * cf / ((1.0 + rate) ** (idx + 1)) for idx, cf in enumerate(cashflows)])
            if abs(deriv) < 1e-6:
                break
            rate = rate - val / deriv
        irr = round(rate * 100.0, 2)

    roi_percent = (sum(cashflows[1:]) - capex) / capex * 100.0

    return {
        "capex_naira": round(capex),
        "annual_savings_naira": round(annual_savings),
        "simple_payback_years": round(simple_payback, 1),
        "discounted_payback_years": round(discounted_payback, 1),
        "npv_naira": round(npv),
        "irr_percent": round(irr, 2),
        "roi_percent": round(roi_percent, 1),
        "lifetime_gross_savings_naira": round(sum(cashflows[1:]))
    }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No payload provided"}))
        sys.exit(1)

    try:
        payload = json.loads(sys.argv[1])
        action = payload.get("action", "yield")
        params = payload.get("params", {})

        if action == "yield":
            res = calculate_solar_yield(params)
        elif action == "finance":
            res = calculate_financial_metrics(params)
        else:
            res = {"error": f"Unknown action {action}"}

        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
