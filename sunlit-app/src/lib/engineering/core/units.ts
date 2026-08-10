/**
 * Dimensional Units Safety and Conversion Utility
 * Sunlit Enterprise Engineering Platform
 */

export type PowerUnit = 'W' | 'kW' | 'MW';
export type EnergyUnit = 'Wh' | 'kWh' | 'MWh';
export type VoltageUnit = 'V' | 'kV';
export type CurrentUnit = 'A' | 'mA';
export type ApparentPowerUnit = 'VA' | 'kVA' | 'MVA';
export type LengthUnit = 'm' | 'cm' | 'mm' | 'km';
export type CableAreaUnit = 'mm²';
export type TempUnit = '°C' | 'K' | '°F';
export type IrradianceUnit = 'W/m²';
export type SolarResourceUnit = 'kWh/m²/day' | 'PSH';
export type CurrencyUnit = 'NGN' | 'USD' | 'EUR' | 'GBP';

export class UnitConversionError extends Error {
  constructor(message: string) {
    super(`[UnitConversionError] ${message}`);
    this.name = 'UnitConversionError';
  }
}

/**
 * Standardize Power to Watts (W)
 */
export function toWatts(value: number, unit: PowerUnit): number {
  switch (unit) {
    case 'W':
      return value;
    case 'kW':
      return value * 1000;
    case 'MW':
      return value * 1_000_000;
    default:
      throw new UnitConversionError(`Unsupported power unit: ${unit}`);
  }
}

/**
 * Convert Watts to target Power Unit
 */
export function fromWatts(watts: number, targetUnit: PowerUnit): number {
  switch (targetUnit) {
    case 'W':
      return watts;
    case 'kW':
      return watts / 1000;
    case 'MW':
      return watts / 1_000_000;
    default:
      throw new UnitConversionError(`Unsupported target power unit: ${targetUnit}`);
  }
}

/**
 * Standardize Energy to Watt-hours (Wh)
 */
export function toWh(value: number, unit: EnergyUnit): number {
  switch (unit) {
    case 'Wh':
      return value;
    case 'kWh':
      return value * 1000;
    case 'MWh':
      return value * 1_000_000;
    default:
      throw new UnitConversionError(`Unsupported energy unit: ${unit}`);
  }
}

/**
 * Convert Wh to target Energy Unit
 */
export function fromWh(wh: number, targetUnit: EnergyUnit): number {
  switch (targetUnit) {
    case 'Wh':
      return wh;
    case 'kWh':
      return wh / 1000;
    case 'MWh':
      return wh / 1_000_000;
    default:
      throw new UnitConversionError(`Unsupported target energy unit: ${targetUnit}`);
  }
}

/**
 * Standardize Apparent Power to Volt-Amperes (VA)
 */
export function toVA(value: number, unit: ApparentPowerUnit): number {
  switch (unit) {
    case 'VA':
      return value;
    case 'kVA':
      return value * 1000;
    case 'MVA':
      return value * 1_000_000;
    default:
      throw new UnitConversionError(`Unsupported apparent power unit: ${unit}`);
  }
}

/**
 * Convert VA to target Apparent Power Unit
 */
export function fromVA(va: number, targetUnit: ApparentPowerUnit): number {
  switch (targetUnit) {
    case 'VA':
      return va;
    case 'kVA':
      return va / 1000;
    case 'MVA':
      return va / 1_000_000;
    default:
      throw new UnitConversionError(`Unsupported target apparent power unit: ${targetUnit}`);
  }
}

/**
 * Convert Celsius to Kelvin for thermal calculations
 */
export function celsiusToKelvin(tempC: number): number {
  return tempC + 273.15;
}

/**
 * Convert Kelvin to Celsius
 */
export function kelvinToCelsius(tempK: number): number {
  return tempK - 273.15;
}

/**
 * Format currency with international locale formatting
 */
export function formatCurrency(amount: number, currency: CurrencyUnit = 'NGN'): string {
  if (currency === 'NGN') {
    return `₦${Math.round(amount).toLocaleString('en-NG')}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
