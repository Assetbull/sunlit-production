import { SharedCalculationResult } from '../types';

export interface CableInput {
  currentAmps: number;
  cableLengthMeters: number;
  systemVoltage: 12 | 24 | 48 | 230 | 400;
  maxVoltageDropPercent?: number;  // default 3% DC, 5% AC
  conductorMaterial?: 'COPPER' | 'ALUMINUM';
  installationMethod?: 'CONDUIT' | 'OPEN_AIR' | 'UNDERGROUND' | 'TRAY'; // affects derating
  continuousCurrentFactor?: number; // NEC 80% rule for continuous loads (default 1.25 on required)
}

export function calculateCableSizing(input: CableInput): SharedCalculationResult {
  const errors: string[] = [];

  if (!Number.isFinite(input.currentAmps) || input.currentAmps <= 0) {
    errors.push('Design current (Amps) must be a positive number.');
  }
  if (!Number.isFinite(input.cableLengthMeters) || input.cableLengthMeters <= 0) {
    errors.push('Cable run length (meters) must be a positive number.');
  }
  if (!Number.isFinite(input.systemVoltage) || input.systemVoltage <= 0) {
    errors.push('System voltage must be a valid positive value.');
  }

  const isAcSystem = input.systemVoltage >= 230;
  const defaultMaxDrop = isAcSystem ? 5.0 : 3.0;
  const maxDropPercent = input.maxVoltageDropPercent ?? defaultMaxDrop;

  if (!Number.isFinite(maxDropPercent) || maxDropPercent <= 0 || maxDropPercent > 10) {
    errors.push('Max voltage drop must be between 0.1% and 10%.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'cable-sizing',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to missing current, length, or voltage inputs.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors },
    };
  }

  const material = input.conductorMaterial ?? 'COPPER';
  // IEC 60228 / BS 6360 resistivity at 70°C operating temperature
  // Copper: 0.01724 Ω·mm²/m at 20°C → ~0.0217 at 70°C
  // Aluminum: 0.02826 Ω·mm²/m at 20°C → ~0.0354 at 70°C
  const resistivity = material === 'COPPER' ? 0.01724 : 0.02826;

  const allowableVoltageDropVolts = (input.systemVoltage * maxDropPercent) / 100;

  // Two-wire DC formula: A (mm²) = (2 × L × I × ρ) / ΔV
  // For AC (single-phase): same formula applies; three-phase: √3 factor
  const circuitFactor = isAcSystem ? 1 : 2; // DC uses 2× for +/– conductors
  const calculatedCrossSectionMm2 = (circuitFactor * input.cableLengthMeters * input.currentAmps * resistivity) / allowableVoltageDropVolts;

  // Ampacity table (90°C XLPE / PVC cable, open air installation, IEC 60364-5-52)
  const ampacityTable: Record<number, number> = {
    1.5: 18,
    2.5: 25,
    4: 34,
    6: 43,
    10: 60,
    16: 80,
    25: 101,
    35: 126,
    50: 153,
    70: 196,
    95: 238,
    120: 276,
    150: 318,
    185: 365,
    240: 427,
    300: 494,
  };

  // Installation method derating factor (IEC 60364-5-52 Table B.52.17)
  const installDerating: Record<string, number> = {
    'OPEN_AIR': 1.00,
    'CONDUIT': 0.80,
    'UNDERGROUND': 0.90,
    'TRAY': 0.85,
  };
  const derating = installDerating[input.installationMethod ?? 'OPEN_AIR'] ?? 1.0;

  // NEC continuous load factor: cable must handle 125% of continuous load
  const continuousLoadFactor = input.continuousCurrentFactor ?? 1.25;
  const requiredAmpacity = (input.currentAmps * continuousLoadFactor) / derating;

  const standardCableSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];

  // Select minimum cable size satisfying BOTH voltage drop AND ampacity
  const recommendedSizeMm2 = standardCableSizes.find(
    s => s >= calculatedCrossSectionMm2 && (ampacityTable[s] ?? 0) >= requiredAmpacity
  ) ?? standardCableSizes[standardCableSizes.length - 1];

  const actualVoltageDropVolts = (circuitFactor * input.cableLengthMeters * input.currentAmps * resistivity) / recommendedSizeMm2;
  const actualDropPercent = (actualVoltageDropVolts / input.systemVoltage) * 100;
  const actualAmpacity = (ampacityTable[recommendedSizeMm2] ?? 0) * derating;

  if (!Number.isFinite(actualDropPercent)) {
    return {
      toolId: 'cable-sizing',
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Voltage drop calculation produced invalid results.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Engine error: voltage drop calculation returned non-finite result.'] },
    };
  }

  // Engineering validation
  const voltageDropOk = actualDropPercent <= maxDropPercent;
  const ampacityOk = actualAmpacity >= input.currentAmps;

  const engineeringStatus = voltageDropOk && ampacityOk ? 'PASS' : 'FAIL';

  const warnings = [];
  if (!voltageDropOk) {
    warnings.push({
      code: 'VOLTAGE_DROP_EXCEEDS_LIMIT',
      message: `Actual voltage drop ${Number(actualDropPercent.toFixed(2))}% exceeds ${maxDropPercent}% limit. Power losses and efficiency degradation expected.`,
      severity: 'warning' as const,
      suggestion: `Increase cable to the next standard size. Alternatively, reduce cable run length or increase system voltage.`,
    });
  }
  if (!ampacityOk) {
    warnings.push({
      code: 'AMPACITY_INSUFFICIENT',
      message: `Selected cable ampacity ${Math.round(actualAmpacity)}A is below required ${Math.round(requiredAmpacity)}A (with ${Math.round((continuousLoadFactor - 1) * 100)}% continuous load factor).`,
      severity: 'critical' as const,
      suggestion: 'Increase cable cross-section. Cable undersizing can cause thermal damage, insulation failure, or fire.',
    });
  }
  if (material === 'ALUMINUM') {
    warnings.push({
      code: 'ALUMINUM_CONDUCTOR',
      message: 'Aluminium conductors require larger cross-sections than copper and must use aluminium-rated terminations.',
      severity: 'info' as const,
      suggestion: 'Use copper conductors for all connections < 16mm². Aluminium is economical only for main feeder cables ≥ 35mm².',
    });
  }

  return {
    toolId: 'cable-sizing',
    calculation_status: 'SUCCESS',
    confidence: engineeringStatus === 'PASS' ? 'HIGH' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: `Sized satisfying BOTH voltage drop (≤${maxDropPercent}%) AND ampacity (≥${Math.round(requiredAmpacity)}A derated) criteria per IEC 60364-5-52.`,
    engineering_results: {
      designCurrentAmps: input.currentAmps,
      cableLengthMeters: input.cableLengthMeters,
      systemVoltage: input.systemVoltage,
      conductorMaterial: material,
      calculatedAreaByVoltageDrop: Number(calculatedCrossSectionMm2.toFixed(2)),
      requiredAmpacity: Number(requiredAmpacity.toFixed(1)),
      recommendedCableSizeMm2: recommendedSizeMm2,
      ratedAmpacityBeforeDerating: ampacityTable[recommendedSizeMm2] ?? 0,
      deratedAmpacity: Number(actualAmpacity.toFixed(1)),
      actualVoltageDropVolts: Number(actualVoltageDropVolts.toFixed(3)),
      actualVoltageDropPercent: Number(actualDropPercent.toFixed(2)),
      // Engineering PASS/FAIL checks
      voltageDropCheck: voltageDropOk ? 'PASS' : 'FAIL',
      ampacityCheck: ampacityOk ? 'PASS' : 'FAIL',
      overallCheck: engineeringStatus,
    },
    recommended_configuration: {
      recommendedCableSizeMm2: recommendedSizeMm2,
      equipmentList: [
        {
          id: `cable-${recommendedSizeMm2}mm`,
          name: `${recommendedSizeMm2}mm² ${isAcSystem ? 'PVC/XLPE AC Cable' : 'Double-Insulated DC Solar Cable'} (${material})`,
          category: 'cable',
          specifications: {
            crossSectionMm2: `${recommendedSizeMm2}mm²`,
            conductor: material,
            voltageRating: isAcSystem ? '600V AC' : '1500V DC PV rated',
            temperatureRating: '90°C (XLPE) or 70°C (PVC)',
            uvResistant: 'Yes (outdoor rated)',
          },
          recommendedQuantity: circuitFactor * input.cableLengthMeters, // total conductor metres
          reason: `${recommendedSizeMm2}mm² ${material} satisfies both voltage drop (${Number(actualDropPercent.toFixed(2))}% ≤ ${maxDropPercent}%) and ampacity (${Math.round(actualAmpacity)}A ≥ ${Math.round(requiredAmpacity)}A) requirements.`,
        },
      ],
    },
    warnings,
    assumptions: {
      conductorResistivity: `${resistivity} Ω·mm²/m at 20°C`,
      maxVoltageDropAllowed: `${maxDropPercent}%`,
      continuousLoadFactor: `${continuousLoadFactor}× (NEC continuous load rule)`,
      installationDerating: `${Math.round(derating * 100)}% (${input.installationMethod ?? 'OPEN_AIR'})`,
      circuitType: isAcSystem ? 'AC (single-phase)' : 'DC (two-wire)',
    },
    supporting_notes: [
      `Two critical checks applied: (1) Voltage Drop ≤ ${maxDropPercent}% → ${voltageDropOk ? 'PASS' : 'FAIL'}, (2) Ampacity ≥ ${Math.round(requiredAmpacity)}A → ${ampacityOk ? 'PASS' : 'FAIL'}.`,
      `${isAcSystem ? 'AC cable uses single-conductor formula (one-way length).' : 'DC solar cable formula uses 2× length for positive and negative conductors.'}`,
      `Actual voltage drop: ${Number(actualVoltageDropVolts.toFixed(3))}V (${Number(actualDropPercent.toFixed(2))}%) across ${input.cableLengthMeters}m run.`,
    ],
    engine_version: '2.0.0',
    validation_status: { isValid: engineeringStatus === 'PASS', errors: engineeringStatus === 'FAIL' ? ['Engineering checks failed — see warnings for details.'] : [] },
  };
}
