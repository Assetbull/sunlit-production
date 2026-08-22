/**
 * Centralized Engineering Assumption Registry
 * Sunlit Enterprise Engineering Platform
 * Engine Version 2.0.0
 */

export interface EngineeringAssumption {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: 'solar' | 'battery' | 'inverter' | 'cable' | 'tariff' | 'finance' | 'margin';
  source: string;
  description: string;
  applicableTools: string[];
  effectiveVersion: string;
}

export const ENGINEERING_ASSUMPTION_REGISTRY: Record<string, EngineeringAssumption> = {
  pv_system_losses: {
    id: 'pv_system_losses',
    name: 'PV System Loss Factor',
    value: 0.14, // 14% total system losses (soiling, mismatch, wiring, thermal)
    unit: 'ratio',
    category: 'solar',
    source: 'IEC 61724-1 Standard / NREL PVWatts Default',
    description: 'Combined DC array and system losses including soiling (3%), mismatch (2%), wiring (2%), and thermal derating (7%).',
    applicableTools: ['solar-panel-sizing', 'solar-system-sizing', 'energy-yield'],
    effectiveVersion: '2.0.0',
  },
  default_psh_lagos: {
    id: 'default_psh_lagos',
    name: 'Default Peak Sun Hours — Lagos',
    value: 4.8,
    unit: 'kWh/m²/day',
    category: 'solar',
    source: 'NASA POWER Satellite Irradiance Database (10-Yr Mean)',
    description: 'Average daily plane-of-array peak sun hours for Lagos, Nigeria (Lat 6.52°N).',
    applicableTools: ['solar-panel-sizing', 'solar-system-sizing', 'energy-yield', 'solar-savings'],
    effectiveVersion: '2.0.0',
  },
  battery_default_dod_lifepo4: {
    id: 'battery_default_dod_lifepo4',
    name: 'Recommended DoD — LiFePO4 Lithium',
    value: 0.80, // 80% DoD
    unit: 'ratio',
    category: 'battery',
    source: 'Manufacturer Datasheet Specification Standard',
    description: 'Recommended Depth of Discharge for LiFePO4 battery chemistry to achieve 4000+ cycle life.',
    applicableTools: ['battery-capacity', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  battery_default_dod_gel: {
    id: 'battery_default_dod_gel',
    name: 'Recommended DoD — Tubular Gel Lead-Acid',
    value: 0.50, // 50% DoD
    unit: 'ratio',
    category: 'battery',
    source: 'IEEE 1013 Standard for Sizing Lead-Acid Batteries',
    description: 'Maximum recommended Depth of Discharge for Gel Lead-Acid batteries to maintain lifespan.',
    applicableTools: ['battery-capacity', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  battery_roundtrip_efficiency_lifepo4: {
    id: 'battery_roundtrip_efficiency_lifepo4',
    name: 'Round-Trip Efficiency — LiFePO4',
    value: 0.95, // 95%
    unit: 'ratio',
    category: 'battery',
    source: 'Verified Laboratory Testing Data',
    description: 'Electrical charge/discharge energy round-trip efficiency for lithium iron phosphate cells.',
    applicableTools: ['battery-capacity', 'solar-system-sizing', 'energy-yield'],
    effectiveVersion: '2.0.0',
  },
  inverter_efficiency_hybrid: {
    id: 'inverter_efficiency_hybrid',
    name: 'Inverter Conversion Efficiency',
    value: 0.96, // 96% Euro efficiency
    unit: 'ratio',
    category: 'inverter',
    source: 'IEC 61683 Efficiency Standard',
    description: 'DC to AC conversion efficiency under standard operating load conditions (40%-80% load).',
    applicableTools: ['inverter-sizing', 'solar-system-sizing', 'energy-yield'],
    effectiveVersion: '2.0.0',
  },
  inverter_power_factor_default: {
    id: 'inverter_power_factor_default',
    name: 'System Operating Power Factor',
    value: 0.85,
    unit: 'ratio',
    category: 'inverter',
    source: 'Nigerian Residential/Commercial Load Benchmark',
    description: 'Assumed overall power factor for mixed inductive (motors/compressors) and resistive loads.',
    applicableTools: ['inverter-sizing', 'load-calculator', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  max_dc_voltage_drop_percent: {
    id: 'max_dc_voltage_drop_percent',
    name: 'Maximum Allowable DC Cable Voltage Drop',
    value: 1.5, // 1.5%
    unit: '%',
    category: 'cable',
    source: 'NEC Article 690 / BS 7671 Wiring Regulations',
    description: 'Strict engineering upper limit for voltage drop between PV array and charge controller/inverter.',
    applicableTools: ['cable-sizing', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  max_ac_voltage_drop_percent: {
    id: 'max_ac_voltage_drop_percent',
    name: 'Maximum Allowable AC Cable Voltage Drop',
    value: 2.5, // 2.5%
    unit: '%',
    category: 'cable',
    source: 'BS 7671 IET Wiring Regulations 18th Edition',
    description: 'Maximum allowable voltage drop from inverter AC output to main distribution board.',
    applicableTools: ['cable-sizing', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  grid_tariff_band_a_naira: {
    id: 'grid_tariff_band_a_naira',
    name: 'DISCO Band A Electricity Tariff',
    value: 225.0, // ₦225/kWh
    unit: 'NGN/kWh',
    category: 'tariff',
    source: 'NERC Multi-Year Tariff Order (MYTO) 2024',
    description: 'Official Band A electricity tariff for urban grid customers in Nigeria.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  diesel_fuel_price_naira: {
    id: 'diesel_fuel_price_naira',
    name: 'Diesel Fuel Price per Liter',
    value: 1350.0, // ₦1350/Liter
    unit: 'NGN/L',
    category: 'tariff',
    source: 'Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA)',
    description: 'Average market price per liter of automotive gas oil (diesel) in Nigeria.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  generator_fuel_consumption_rate: {
    id: 'generator_fuel_consumption_rate',
    name: 'Diesel Generator Specific Consumption',
    value: 0.30, // 0.30 Liters per kWh generated
    unit: 'L/kWh',
    category: 'tariff',
    source: 'Manufacturer Engine Performance Curves (Perkins/Cummins)',
    description: 'Fuel consumption rate per kWh of electrical energy output for 10–50 kVA diesel generators.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '2.0.0',
  },
  petrol_pms_fuel_price_naira: {
    id: 'petrol_pms_fuel_price_naira',
    name: 'Premium Motor Spirit (Petrol) Price per Liter',
    value: 1050.0,
    unit: 'NGN/L',
    category: 'tariff',
    source: 'NMDPRA National Average Retail Price Index',
    description: 'Average market price per liter of petrol used in residential 1.5–7.5 kVA backup generators.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '3.0.0',
  },
  petrol_generator_consumption_rate: {
    id: 'petrol_generator_consumption_rate',
    name: 'Petrol Generator Specific Consumption',
    value: 0.45, // 0.45 Liters per kWh generated
    unit: 'L/kWh',
    category: 'tariff',
    source: 'Empirical Field Benchmark for Small Single-Cylinder Petrol Generators',
    description: 'Average fuel consumption rate for small air-cooled petrol generators operating at 50%–70% load.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '3.0.0',
  },
  grid_tariff_band_b_naira: {
    id: 'grid_tariff_band_b_naira',
    name: 'DISCO Band B Electricity Tariff (16–20 hrs supply)',
    value: 180.0,
    unit: 'NGN/kWh',
    category: 'tariff',
    source: 'NERC MYTO Schedule 2024',
    description: 'Electricity tariff for Band B grid customers receiving 16–20 hours of daily supply.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '3.0.0',
  },
  grid_tariff_band_c_naira: {
    id: 'grid_tariff_band_c_naira',
    name: 'DISCO Band C Electricity Tariff (12–16 hrs supply)',
    value: 120.0,
    unit: 'NGN/kWh',
    category: 'tariff',
    source: 'NERC MYTO Schedule 2024',
    description: 'Electricity tariff for Band C grid customers receiving 12–16 hours of daily supply.',
    applicableTools: ['solar-savings', 'roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '3.0.0',
  },
  capex_turnkey_kwp_naira: {
    id: 'capex_turnkey_kwp_naira',
    name: 'Installed Solar PV Turnkey Cost per kWp',
    value: 650000.0,
    unit: 'NGN/kWp',
    category: 'finance',
    source: 'Sunlit EPC Partner Verified Market Benchmark 2026',
    description: 'Average turnkey installed cost per peak kilowatt for Tier-1 Tier-2 PV modules, mounting structure, DC protection, and certified installation.',
    applicableTools: ['roi-calculator', 'solar-system-sizing'],
    effectiveVersion: '3.0.0',
  },
  capex_turnkey_kwh_battery_naira: {
    id: 'capex_turnkey_kwh_battery_naira',
    name: 'LiFePO4 Battery Storage Turnkey Cost per kWh',
    value: 280000.0,
    unit: 'NGN/kWh',
    category: 'finance',
    source: 'Sunlit Verified Supplier Price Index 2026',
    description: 'Average installed cost per kilowatt-hour of usable LiFePO4 rack-mount or wall-mount battery storage.',
    applicableTools: ['roi-calculator', 'solar-system-sizing', 'battery-capacity'],
    effectiveVersion: '3.0.0',
  },
  capex_turnkey_kva_inverter_naira: {
    id: 'capex_turnkey_kva_inverter_naira',
    name: 'Hybrid Inverter Turnkey Cost per kVA',
    value: 120000.0,
    unit: 'NGN/kVA',
    category: 'finance',
    source: 'Sunlit Verified Supplier Price Index 2026',
    description: 'Average installed cost per kilovolt-ampere for pure sine wave hybrid solar inverters with integrated MPPT.',
    applicableTools: ['roi-calculator', 'solar-system-sizing', 'inverter-sizing'],
    effectiveVersion: '3.0.0',
  },
  annual_pv_degradation_rate: {
    id: 'annual_pv_degradation_rate',
    name: 'Annual Solar Panel Output Degradation',
    value: 0.005, // 0.5% per year
    unit: 'ratio/year',
    category: 'finance',
    source: 'NREL Photovoltaic Degradation Rates Summary',
    description: 'Annual reduction in PV module power output over 25-year warranty period.',
    applicableTools: ['roi-calculator', 'solar-savings'],
    effectiveVersion: '2.0.0',
  },
  financial_discount_rate: {
    id: 'financial_discount_rate',
    name: 'Discount Rate for Financial Modeling',
    value: 0.12, // 12%
    unit: 'ratio',
    category: 'finance',
    source: 'Central Bank of Nigeria (CBN) Weighted Cost of Capital Baseline',
    description: 'Discount rate used for NPV and discounted payback period calculations in Nigeria.',
    applicableTools: ['roi-calculator'],
    effectiveVersion: '2.0.0',
  },
};

/**
 * Helper to retrieve formatted assumption list for tool output envelopes
 */
export function getAssumptionsForTool(
  toolId: string,
  userOverrides?: Record<string, number>
): Array<{ id: string; name: string; value: number; unit: string; source: string; isOverridden: boolean }> {
  return Object.values(ENGINEERING_ASSUMPTION_REGISTRY)
    .filter((asm) => asm.applicableTools.includes(toolId))
    .map((asm) => {
      const isOverridden = userOverrides && userOverrides[asm.id] !== undefined;
      return {
        id: asm.id,
        name: asm.name,
        value: isOverridden ? userOverrides![asm.id] : asm.value,
        unit: asm.unit,
        source: asm.source,
        isOverridden: Boolean(isOverridden),
      };
    });
}
