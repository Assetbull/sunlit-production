import { SharedCalculationResult } from '../types';

export interface PvConfigInput {
  totalPanelCount: number;
  panelVoc: number;           // Open circuit voltage e.g. 49.8V STC
  panelVmp: number;           // Max power voltage e.g. 41.5V STC
  panelIsc: number;           // Short circuit current e.g. 13.8A STC
  panelWatts?: number;        // Panel rated power e.g. 550W
  inverterMaxVoc: number;     // Max DC input voltage e.g. 500V
  inverterMinMpptVoltage: number; // Min MPPT voltage e.g. 120V
  inverterMaxMpptVoltage: number; // Max MPPT voltage e.g. 450V
  inverterMaxIsc?: number;    // Max MPPT input current e.g. 26A
  coldTempC?: number;         // Minimum ambient temperature (for Voc correction)
  hotTempC?: number;          // Maximum cell temperature (for Vmp correction)
  panelVocTempCoeff?: number; // Voc temperature coefficient %/°C (default -0.29%/°C)
  panelVmpTempCoeff?: number; // Vmp temperature coefficient %/°C (default -0.37%/°C)
}

export function calculatePvConfiguration(input: PvConfigInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.totalPanelCount) || input.totalPanelCount <= 0 || !Number.isInteger(input.totalPanelCount)) {
    errors.push('Total panel count must be a positive integer.');
  }
  if (!Number.isFinite(input.panelVoc) || input.panelVoc <= 0) {
    errors.push('Panel Voc must be a positive voltage (e.g. 49.8V).');
  }
  if (!Number.isFinite(input.panelVmp) || input.panelVmp <= 0 || input.panelVmp >= input.panelVoc) {
    errors.push('Panel Vmp must be positive and less than Voc.');
  }
  if (!Number.isFinite(input.inverterMaxVoc) || input.inverterMaxVoc <= 0) {
    errors.push('Inverter maximum Voc must be a positive voltage.');
  }
  if (!Number.isFinite(input.inverterMinMpptVoltage) || !Number.isFinite(input.inverterMaxMpptVoltage) ||
    input.inverterMinMpptVoltage >= input.inverterMaxMpptVoltage) {
    errors.push('Inverter MPPT window: Min voltage must be less than Max voltage.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'pv-configuration',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid electrical parameters.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Temperature coefficient defaults (standard monocrystalline PERC values)
  const vocTempCoeff = input.panelVocTempCoeff ?? -0.0029; // -0.29%/°C
  const vmpTempCoeff = input.panelVmpTempCoeff ?? -0.0037; // -0.37%/°C

  // Temperature correction:
  // Cold Voc scenario: ambient at minimum temperature → highest Voc
  // Cold assumes -10°C correction from STC (25°C)
  const coldTempOffset = (input.coldTempC ?? 15) - 25; // e.g., 15°C → -10°C offset from STC
  const coldVocFactor = 1 + (vocTempCoeff * coldTempOffset); // at cold temp, Voc increases

  // Hot Vmp scenario: cell at maximum operating temperature
  const hotTempOffset = (input.hotTempC ?? 65) - 25; // e.g., 65°C → +40°C offset from STC
  const hotVmpFactor = 1 + (vmpTempCoeff * hotTempOffset); // at hot temp, Vmp decreases

  // Max panels in series (constrained by cold morning Voc limit)
  const maxSeriesVoltageLimited = Math.floor(input.inverterMaxVoc / (input.panelVoc * coldVocFactor));

  // Min panels in series (to hit MPPT minimum at hot operating Vmp)
  const minSeriesMpptLimited = Math.ceil(input.inverterMinMpptVoltage / (input.panelVmp * hotVmpFactor));

  // Find optimal series count: highest series count within safe window
  let series = Math.min(input.totalPanelCount, maxSeriesVoltageLimited);
  if (series < minSeriesMpptLimited) {
    series = minSeriesMpptLimited; // might breach voltage limit — will flag as warning
  }
  if (series < 1) series = 1;

  const parallel = Math.max(1, Math.ceil(input.totalPanelCount / series));

  // Calculate key voltages
  const stringVocAtStc = Number((series * input.panelVoc).toFixed(1));
  const stringVmpAtStc = Number((series * input.panelVmp).toFixed(1));
  const stringColdVoc = Number((series * input.panelVoc * coldVocFactor).toFixed(1));
  const stringHotVmp = Number((series * input.panelVmp * hotVmpFactor).toFixed(1));
  const totalIsc = Number((parallel * input.panelIsc).toFixed(2));
  const inverterMaxIsc = input.inverterMaxIsc ?? 99; // if not specified, no current limit

  // Engineering safety checks
  const coldVocSafe = stringColdVoc <= input.inverterMaxVoc;
  const mpptMinOk = stringHotVmp >= input.inverterMinMpptVoltage;
  const mpptMaxOk = stringHotVmp <= input.inverterMaxMpptVoltage;
  const currentSafe = totalIsc <= inverterMaxIsc;
  const overallStatus = coldVocSafe && mpptMinOk && mpptMaxOk && currentSafe ? 'PASS' : 'FAIL';

  const arrayKwp = input.panelWatts
    ? Number(((series * parallel * input.panelWatts) / 1000).toFixed(2))
    : undefined;

  if (!Number.isFinite(stringColdVoc) || !Number.isFinite(stringHotVmp)) {
    return {
      toolId: 'pv-configuration',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Temperature correction calculation produced invalid voltage values.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: temperature-corrected voltages are invalid.'] },
    };
  }

  const warnings = [];
  if (!coldVocSafe) {
    warnings.push({
      code: 'OVERVOLTAGE_RISK',
      message: `Cold temperature string Voc of ${stringColdVoc}V exceeds inverter maximum input of ${input.inverterMaxVoc}V DC. Risk of inverter damage.`,
      severity: 'critical' as const,
      suggestion: `Reduce to max ${maxSeriesVoltageLimited} panels per string. Current configuration is ${series} panels in series.`,
    });
  }
  if (!mpptMinOk) {
    warnings.push({
      code: 'MPPT_MIN_BREACH',
      message: `Hot operating Vmp of ${stringHotVmp}V is below inverter MPPT minimum of ${input.inverterMinMpptVoltage}V. Inverter may not track at peak temperature.`,
      severity: 'warning' as const,
      suggestion: `Add more panels in series or choose an inverter with a lower MPPT minimum voltage.`,
    });
  }
  if (!mpptMaxOk) {
    warnings.push({
      code: 'MPPT_MAX_BREACH',
      message: `Hot operating Vmp of ${stringHotVmp}V exceeds inverter MPPT maximum of ${input.inverterMaxMpptVoltage}V.`,
      severity: 'warning' as const,
      suggestion: `Reduce number of panels per string to keep hot Vmp below ${input.inverterMaxMpptVoltage}V.`,
    });
  }
  if (!currentSafe) {
    warnings.push({
      code: 'OVERCURRENT_RISK',
      message: `Array Isc of ${totalIsc}A from ${parallel} parallel strings exceeds inverter MPPT max current of ${inverterMaxIsc}A.`,
      severity: 'warning' as const,
      suggestion: 'Split parallel strings across multiple MPPT inputs or select an inverter with higher current rating.',
    });
  }

  return {
    toolId: 'pv-configuration',
    calculation_status: 'SUCCESS',
    confidence: overallStatus === 'PASS' ? 'HIGH' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: 'IEC 62548 methodology: temperature-corrected Voc (cold morning) and Vmp (hot operating) validated against inverter MPPT window and DC input limits.',
    engineering_results: {
      totalPanelCount: series * parallel,
      panelsInSeries: series,
      parallelStrings: parallel,
      stringVocAtStc,
      stringVmpAtStc,
      stringColdVoc,    // highest risk voltage — must be < inverterMaxVoc
      stringHotVmp,     // lowest operating Vmp — must be inside MPPT window
      totalArrayIsc: totalIsc,
      ...(arrayKwp !== undefined ? { arrayKwp } : {}),
      coldVocCheck: coldVocSafe ? 'PASS' : 'FAIL',
      mpptMinCheck: mpptMinOk ? 'PASS' : 'FAIL',
      mpptMaxCheck: mpptMaxOk ? 'PASS' : 'FAIL',
      currentCheck: currentSafe ? 'PASS' : 'FAIL',
      overallCheck: overallStatus,
      inverterMaxVoc: input.inverterMaxVoc,
      inverterMinMpptVoltage: input.inverterMinMpptVoltage,
      inverterMaxMpptVoltage: input.inverterMaxMpptVoltage,
      coldVocMarginVolts: Number((input.inverterMaxVoc - stringColdVoc).toFixed(1)),
    },
    recommended_configuration: {
      panelCount: series * parallel,
    },
    warnings,
    assumptions: {
      vocTemperatureCoefficient: `${(vocTempCoeff * 100).toFixed(2)}%/°C`,
      vmpTemperatureCoefficient: `${(vmpTempCoeff * 100).toFixed(2)}%/°C`,
      coldMorningTemp: `${input.coldTempC ?? 15}°C (Voc correction: ×${coldVocFactor.toFixed(3)})`,
      hotCellTemp: `${input.hotTempC ?? 65}°C (Vmp correction: ×${hotVmpFactor.toFixed(3)})`,
      methodology: 'IEC 62548 temperature-corrected voltage sizing',
    },
    supporting_notes: [
      `Cold Voc safety check: String Voc @ ${input.coldTempC ?? 15}°C = ${stringColdVoc}V — must be ≤ ${input.inverterMaxVoc}V (${coldVocSafe ? 'PASS ✓' : 'FAIL ✗'}).`,
      `Hot Vmp MPPT check: String Vmp @ ${input.hotTempC ?? 65}°C = ${stringHotVmp}V — must be within ${input.inverterMinMpptVoltage}V–${input.inverterMaxMpptVoltage}V (${mpptMinOk && mpptMaxOk ? 'PASS ✓' : 'FAIL ✗'}).`,
      `Array Isc check: ${parallel} strings × ${input.panelIsc}A = ${totalIsc}A total (${currentSafe ? 'within inverter limit' : 'EXCEEDS inverter limit'}).`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: overallStatus === 'PASS', errors: overallStatus === 'PASS' ? [] : ['PV configuration has engineering check failures. See warnings.'] },
  };
}
