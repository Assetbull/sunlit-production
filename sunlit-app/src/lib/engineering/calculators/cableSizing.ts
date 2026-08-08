import { SharedCalculationResult } from '../types';

export interface CableInput {
  currentAmps: number;
  cableLengthMeters: number;
  systemVoltage: 12 | 24 | 48 | 230 | 400;
  maxVoltageDropPercent?: number; // default 3%
  conductorMaterial?: 'COPPER' | 'ALUMINUM';
}

export function calculateCableSizing(input: CableInput): SharedCalculationResult {
  const errors: string[] = [];

  if (input.currentAmps <= 0) errors.push('Current (Amps) must be greater than 0.');
  if (input.cableLengthMeters <= 0) errors.push('Cable length (meters) must be greater than 0.');

  const maxDropPercent = input.maxVoltageDropPercent ?? 3.0;
  const material = input.conductorMaterial ?? 'COPPER';
  // Resistivity: Copper = 0.01724 ohm-mm²/m, Aluminum = 0.02826 ohm-mm²/m
  const resistivity = material === 'COPPER' ? 0.01724 : 0.02826;

  if (errors.length > 0) {
    return {
      toolId: 'cable-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to missing current or length inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '1.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const allowableVoltageDrop = (input.systemVoltage * maxDropPercent) / 100;
  // Formula: Area (mm²) = (2 * Length * Current * Resistivity) / Allowable Voltage Drop
  const calculatedCrossSectionMm2 = (2 * input.cableLengthMeters * input.currentAmps * resistivity) / allowableVoltageDrop;

  const standardCableSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  const recommendedSizeMm2 = standardCableSizes.find(s => s >= calculatedCrossSectionMm2) ?? Math.ceil(calculatedCrossSectionMm2);

  const actualVoltageDrop = (2 * input.cableLengthMeters * input.currentAmps * resistivity) / recommendedSizeMm2;
  const actualDropPercent = (actualVoltageDrop / input.systemVoltage) * 100;

  return {
    toolId: 'cable-sizing',
    calculation_status: 'SUCCESS',
    confidence: 'HIGH',
    confidenceReasoning: 'Calculated using standard IEEE/IEC conductor resistivity formula and 3% maximum voltage drop threshold.',
    engineering_results: {
      designCurrentAmps: input.currentAmps,
      cableLengthMeters: input.cableLengthMeters,
      systemVoltage: input.systemVoltage,
      conductorMaterial: material,
      calculatedAreaMm2: Number(calculatedCrossSectionMm2.toFixed(2)),
      recommendedCableSizeMm2: recommendedSizeMm2,
      actualVoltageDropVolts: Number(actualVoltageDrop.toFixed(2)),
      actualVoltageDropPercent: Number(actualDropPercent.toFixed(2)),
    },
    recommended_configuration: {
      recommendedCableSizeMm2: recommendedSizeMm2,
      equipmentList: [
        {
          id: `cable-${recommendedSizeMm2}mm`,
          name: `${recommendedSizeMm2}mm² Double Insulated Solar Cable (${material})`,
          category: 'cable',
          specifications: {
            crossSectionMm2: recommendedSizeMm2,
            material,
            voltageRating: '1000V DC / 600V AC',
          },
          recommendedQuantity: input.cableLengthMeters * 2, // Positive and Negative runs
          reason: `Sized for ${input.currentAmps}A over ${input.cableLengthMeters}m run with voltage drop under ${maxDropPercent}%.`,
        },
      ],
    },
    warnings: actualDropPercent > 3.0 ? [{
      code: 'HIGH_VOLTAGE_DROP',
      message: 'Voltage drop exceeds 3.0% threshold. Power loss across conductor will reduce system yield.',
      severity: 'warning',
      suggestion: 'Increase cable cross-section to the next standard gauge size.'
    }] : [],
    assumptions: {
      conductorResistivity: `${resistivity} Ω·mm²/m`,
      maxVoltageDropAllowed: `${maxDropPercent}%`,
    },
    supporting_notes: [
      'Two-wire DC circuit formula applied (positive and return conductor path).',
      'Solar DC cables should be UV-resistant and rated for 90°C continuous operating temperature.'
    ],
    engine_version: '1.0.0',
    validation_status: { isValid: true, errors: [] },
  };
}
