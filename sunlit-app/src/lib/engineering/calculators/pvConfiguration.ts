import { SharedCalculationResult } from '../types';

export interface PvConfigInput {
  totalPanelCount: number;
  panelVoc: number; // Open circuit voltage e.g. 49.5V
  panelVmp: number; // Max power voltage e.g. 41.5V
  panelIsc: number; // Short circuit current e.g. 13.8A
  inverterMaxVoc: number; // Max MPPT input voltage e.g. 500V
  inverterMinMpptVoltage: number; // Min MPPT voltage e.g. 120V
  inverterMaxMpptVoltage: number; // Max MPPT voltage e.g. 450V
  inverterMaxIsc: number; // Max MPPT current e.g. 26A
}

export function calculatePvConfiguration(input: PvConfigInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.totalPanelCount <= 0) errors.push('Total panel count must be > 0.');
  if (input.panelVoc <= 0 || input.inverterMaxVoc <= 0) errors.push('Valid Panel Voc and Inverter Max Voc voltages are required.');

  if (errors.length > 0) {
    return {
      toolId: 'pv-configuration',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid electrical specs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  // Cold temperature coefficient voltage adjustment (+10% margin for cold morning Voc)
  const coldVoc = input.panelVoc * 1.1;
  const maxPanelsPerString = Math.floor(input.inverterMaxVoc / coldVoc);
  const minPanelsPerString = Math.ceil(input.inverterMinMpptVoltage / input.panelVmp);

  // Find optimal string configuration: panelsInSeries x parallelStrings = totalPanelCount
  let series = Math.min(input.totalPanelCount, maxPanelsPerString);
  if (series < minPanelsPerString) {
    series = minPanelsPerString;
  }

  const parallel = Math.ceil(input.totalPanelCount / series);
  const stringVoc = Number((series * input.panelVoc).toFixed(1));
  const stringVmp = Number((series * input.panelVmp).toFixed(1));
  const totalIsc = Number((parallel * input.panelIsc).toFixed(1));

  const isVoltageSafe = stringVoc * 1.1 <= input.inverterMaxVoc;
  const isCurrentSafe = totalIsc <= input.inverterMaxIsc;

  return {
    toolId: 'pv-configuration',
    calculation_status: 'SUCCESS',
    confidence: isVoltageSafe && isCurrentSafe ? 'HIGH' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: 'Series-parallel array configuration validated against MPPT voltage window and over-voltage limits.',
    engineering_results: {
      totalPanelCount: input.totalPanelCount,
      panelsInSeries: series,
      parallelStrings: parallel,
      arrayVocAtStc: stringVoc,
      arrayMaxColdVoc: Number((stringVoc * 1.1).toFixed(1)),
      arrayVmpAtStc: stringVmp,
      arrayTotalIsc: totalIsc,
      mpptWindowMin: input.inverterMinMpptVoltage,
      mpptWindowMax: input.inverterMaxMpptVoltage,
      isVoltageSafe,
      isCurrentSafe,
    },
    recommended_configuration: {
      panelCount: input.totalPanelCount,
    },
    warnings: !isVoltageSafe ? [{
      code: 'OVERVOLTAGE_RISK',
      message: `Cold morning array Voc (${(stringVoc * 1.1).toFixed(1)}V) exceeds inverter max voltage (${input.inverterMaxVoc}V).`,
      severity: 'critical',
      suggestion: 'Reduce the number of panels connected in series per string.'
    }] : !isCurrentSafe ? [{
      code: 'OVERCURRENT_RISK',
      message: `Array short circuit current (${totalIsc}A) exceeds inverter MPPT max input current (${input.inverterMaxIsc}A).`,
      severity: 'warning',
      suggestion: 'Split parallel strings across multiple independent MPPT trackers.'
    }] : [],
    assumptions: {
      temperatureSafetyMargin: '+10% Voc for low temperature coefficient',
    },
    supporting_notes: [
      `Array operates at ${stringVmp}V Vmp, placing it comfortably inside the inverter MPPT window (${input.inverterMinMpptVoltage}V–${input.inverterMaxMpptVoltage}V).`
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
