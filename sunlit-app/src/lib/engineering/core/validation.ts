/**
 * Engineering Validation Layer
 * Sunlit Enterprise Engineering Platform
 */

export type ValidationGateStatus = 'PASS' | 'FAIL' | 'WARNING' | 'INSUFFICIENT_INPUT' | 'DESIGN_REVIEW_REQUIRED' | 'EQUIPMENT_DATA_REQUIRED';

export interface ValidationItem {
  gateId: string;
  name: string;
  status: ValidationGateStatus;
  measuredValue?: number | string;
  limitValue?: number | string;
  unit?: string;
  message: string;
}

export interface ValidationResultSummary {
  overallStatus: 'ENGINEERING_VALIDATED' | 'PRELIMINARY_ESTIMATE' | 'INSUFFICIENT_INPUT' | 'DESIGN_REVIEW_REQUIRED' | 'EQUIPMENT_DATA_REQUIRED';
  isValid: boolean;
  gates: Record<string, ValidationItem>;
  errors: string[];
  warnings: string[];
}

/**
 * Validates PV Array Voltage against Inverter Bounds (Cold Voc & Hot Vmp)
 */
export function validateStringVoltage(params: {
  modulesPerString: number;
  vocStc: number;
  vmpStc: number;
  tempCoeffVocPercentPerC: number; // e.g. -0.26 %/°C
  tempMinC: number; // e.g. 15°C
  tempMaxC: number; // e.g. 65°C module operating temp
  inverterMaxDcVoltage: number;
  inverterMpptMinVoltage: number;
  inverterMpptMaxVoltage: number;
}): ValidationItem[] {
  const gates: ValidationItem[] = [];

  // Cold Weather Voc calculation: Voc_cold = Voc_stc * (1 + coeff * (Tmin - 25))
  const tempDiffCold = params.tempMinC - 25;
  const vocColdPerModule = params.vocStc * (1 + (params.tempCoeffVocPercentPerC / 100) * tempDiffCold);
  const stringVocCold = params.modulesPerString * vocColdPerModule;

  // Gate 1: Maximum DC Voltage Overvoltage Check
  if (stringVocCold > params.inverterMaxDcVoltage) {
    gates.push({
      gateId: 'string_max_voc',
      name: 'Cold-Weather Maximum Voc Gate',
      status: 'FAIL',
      measuredValue: Number(stringVocCold.toFixed(1)),
      limitValue: params.inverterMaxDcVoltage,
      unit: 'V',
      message: `String cold Voc (${stringVocCold.toFixed(1)} V at ${params.tempMinC}°C) EXCEEDS inverter maximum limit (${params.inverterMaxDcVoltage} V). Risk of permanent inverter damage!`,
    });
  } else {
    gates.push({
      gateId: 'string_max_voc',
      name: 'Cold-Weather Maximum Voc Gate',
      status: 'PASS',
      measuredValue: Number(stringVocCold.toFixed(1)),
      limitValue: params.inverterMaxDcVoltage,
      unit: 'V',
      message: `String cold Voc (${stringVocCold.toFixed(1)} V) is safely within inverter maximum (${params.inverterMaxDcVoltage} V).`,
    });
  }

  // Hot Weather Vmp calculation: Vmp_hot = Vmp_stc * (1 + coeff * (Tmax - 25))
  const tempDiffHot = params.tempMaxC - 25;
  const vmpHotPerModule = params.vmpStc * (1 + (params.tempCoeffVocPercentPerC / 100) * tempDiffHot);
  const stringVmpHot = params.modulesPerString * vmpHotPerModule;

  // Gate 2: MPPT Minimum Drop Check
  if (stringVmpHot < params.inverterMpptMinVoltage) {
    gates.push({
      gateId: 'string_mppt_min',
      name: 'Hot-Weather Minimum Vmp MPPT Gate',
      status: 'FAIL',
      measuredValue: Number(stringVmpHot.toFixed(1)),
      limitValue: params.inverterMpptMinVoltage,
      unit: 'V',
      message: `String hot Vmp (${stringVmpHot.toFixed(1)} V at ${params.tempMaxC}°C) drops BELOW inverter minimum MPPT threshold (${params.inverterMpptMinVoltage} V). System will lose MPPT tracking on hot days.`,
    });
  } else {
    gates.push({
      gateId: 'string_mppt_min',
      name: 'Hot-Weather Minimum Vmp MPPT Gate',
      status: 'PASS',
      measuredValue: Number(stringVmpHot.toFixed(1)),
      limitValue: params.inverterMpptMinVoltage,
      unit: 'V',
      message: `String hot Vmp (${stringVmpHot.toFixed(1)} V) satisfies minimum MPPT voltage requirement (${params.inverterMpptMinVoltage} V).`,
    });
  }

  return gates;
}

/**
 * Validates Inverter Continuous and Surge Load Capacity
 */
export function validateInverterCapacity(params: {
  continuousLoadWatts: number;
  peakSurgeWatts: number;
  inverterRatingKva: number;
  inverterSurgeCapacityKva: number;
  powerFactor: number;
}): ValidationItem[] {
  const gates: ValidationItem[] = [];
  const continuousLoadKva = params.continuousLoadWatts / 1000 / params.powerFactor;
  const surgeLoadKva = params.peakSurgeWatts / 1000 / params.powerFactor;

  if (continuousLoadKva > params.inverterRatingKva) {
    gates.push({
      gateId: 'inverter_continuous_load',
      name: 'Inverter Continuous Capacity Gate',
      status: 'FAIL',
      measuredValue: Number(continuousLoadKva.toFixed(2)),
      limitValue: params.inverterRatingKva,
      unit: 'kVA',
      message: `Continuous connected load demand (${continuousLoadKva.toFixed(2)} kVA) exceeds rated inverter continuous capacity (${params.inverterRatingKva} kVA).`,
    });
  } else {
    gates.push({
      gateId: 'inverter_continuous_load',
      name: 'Inverter Continuous Capacity Gate',
      status: 'PASS',
      measuredValue: Number(continuousLoadKva.toFixed(2)),
      limitValue: params.inverterRatingKva,
      unit: 'kVA',
      message: `Continuous load (${continuousLoadKva.toFixed(2)} kVA) is safely supported by inverter rating (${params.inverterRatingKva} kVA).`,
    });
  }

  if (surgeLoadKva > params.inverterSurgeCapacityKva) {
    gates.push({
      gateId: 'inverter_surge_capacity',
      name: 'Inverter Motor Surge Gate',
      status: 'FAIL',
      measuredValue: Number(surgeLoadKva.toFixed(2)),
      limitValue: params.inverterSurgeCapacityKva,
      unit: 'kVA',
      message: `Inductive peak surge demand (${surgeLoadKva.toFixed(2)} kVA) exceeds inverter surge overload rating (${params.inverterSurgeCapacityKva} kVA). Inverter will trip on motor startup.`,
    });
  } else {
    gates.push({
      gateId: 'inverter_surge_capacity',
      name: 'Inverter Motor Surge Gate',
      status: 'PASS',
      measuredValue: Number(surgeLoadKva.toFixed(2)),
      limitValue: params.inverterSurgeCapacityKva,
      unit: 'kVA',
      message: `Inductive motor surge demand (${surgeLoadKva.toFixed(2)} kVA) is within inverter surge threshold (${params.inverterSurgeCapacityKva} kVA).`,
    });
  }

  return gates;
}

/**
 * Validates Cable Voltage Drop & Ampacity
 */
export function validateCable(params: {
  circuitCurrentAmp: number;
  cableAmpacityAmp: number;
  calculatedVoltageDropPercent: number;
  maxAllowableVoltageDropPercent: number;
}): ValidationItem[] {
  const gates: ValidationItem[] = [];

  if (params.circuitCurrentAmp > params.cableAmpacityAmp) {
    gates.push({
      gateId: 'cable_ampacity',
      name: 'Cable Current Thermal Ampacity Gate',
      status: 'FAIL',
      measuredValue: Number(params.circuitCurrentAmp.toFixed(1)),
      limitValue: params.cableAmpacityAmp,
      unit: 'A',
      message: `Operating current (${params.circuitCurrentAmp.toFixed(1)} A) exceeds cable continuous ampacity (${params.cableAmpacityAmp} A). Fire risk!`,
    });
  } else {
    gates.push({
      gateId: 'cable_ampacity',
      name: 'Cable Current Thermal Ampacity Gate',
      status: 'PASS',
      measuredValue: Number(params.circuitCurrentAmp.toFixed(1)),
      limitValue: params.cableAmpacityAmp,
      unit: 'A',
      message: `Circuit current (${params.circuitCurrentAmp.toFixed(1)} A) is safely within cable rating (${params.cableAmpacityAmp} A).`,
    });
  }

  if (params.calculatedVoltageDropPercent > params.maxAllowableVoltageDropPercent) {
    gates.push({
      gateId: 'cable_voltage_drop',
      name: 'Cable Voltage Drop Threshold Gate',
      status: 'FAIL',
      measuredValue: Number(params.calculatedVoltageDropPercent.toFixed(2)),
      limitValue: params.maxAllowableVoltageDropPercent,
      unit: '%',
      message: `Voltage drop (${params.calculatedVoltageDropPercent.toFixed(2)}%) exceeds standard limit (${params.maxAllowableVoltageDropPercent}%).`,
    });
  } else {
    gates.push({
      gateId: 'cable_voltage_drop',
      name: 'Cable Voltage Drop Threshold Gate',
      status: 'PASS',
      measuredValue: Number(params.calculatedVoltageDropPercent.toFixed(2)),
      limitValue: params.maxAllowableVoltageDropPercent,
      unit: '%',
      message: `Voltage drop (${params.calculatedVoltageDropPercent.toFixed(2)}%) satisfies standard limit (${params.maxAllowableVoltageDropPercent}%).`,
    });
  }

  return gates;
}
