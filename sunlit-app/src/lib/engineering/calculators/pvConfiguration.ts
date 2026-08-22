import { SharedCalculationResult } from '../types';
import { buildEngineeringEnvelope, ENGINE_VERSION } from '../core/envelope';
import { validateStringVoltage } from '../core/validation';
import { PV_MODULE_CATALOG, INVERTER_CATALOG } from '../catalog/equipmentCatalog';

export interface PvConfigurationInput {
  totalModulesCount?: number;
  systemCapacityKwp?: number;
  panelWattage?: number; // Alias for UI modal compatibility
  locationRegion?: string;
  peakSunHours?: number; // Alias for backward compatibility
  tiltAngle?: number; // Alias for UI modal compatibility
  azimuthDeg?: number; // Alias for UI modal compatibility
  soilingLossPercent?: number; // Alias for UI modal compatibility
  inverterEfficiency?: number; // Alias for UI modal compatibility
  modulesPerString?: number;
  parallelStringsCount?: number;
  selectedModuleId?: string;
  selectedInverterId?: string;
  tempMinC?: number;
  tempMaxC?: number;
}

export function calculatePvConfiguration(input: PvConfigurationInput): SharedCalculationResult {
  const moduleSpec = PV_MODULE_CATALOG.find((m) => m.id === input.selectedModuleId) ?? PV_MODULE_CATALOG[0];
  const inverterSpec = INVERTER_CATALOG.find((inv) => inv.id === input.selectedInverterId) ?? INVERTER_CATALOG[0];

  let totalModules = input.totalModulesCount;
  if ((!totalModules || totalModules <= 0) && input.systemCapacityKwp && input.systemCapacityKwp > 0) {
    totalModules = Math.ceil((input.systemCapacityKwp * 1000) / moduleSpec.ratedPowerW);
  }

  const validModulesCount = totalModules && totalModules > 0 ? totalModules : 0;
  const errors: string[] = [];
  if (validModulesCount <= 0) {
    errors.push('Total PV module count must be specified and > 0.');
  }

  if (errors.length > 0) {
    return {
      toolId: 'pv-configuration',
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Missing or invalid module count.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: errors.map((e) => ({ code: 'INVALID_INPUT', message: e, severity: 'critical' as const, suggestion: 'Enter total solar panel count.' })),
      assumptions: {},
      supporting_notes: [],
      engine_version: ENGINE_VERSION,
      validation_status: { isValid: false, errors },
    };
  }

  const tempMin = input.tempMinC ?? 15;
  const tempMax = input.tempMaxC ?? 65;

  const minModulesPerString = Math.ceil(inverterSpec.mpptVoltageRangeV.min / moduleSpec.vmpStcV);

  const tempDiffCold = tempMin - 25;
  const vocColdPerModule = moduleSpec.vocStcV * (1 + (moduleSpec.tempCoeffVocPercentPerC / 100) * tempDiffCold);
  const maxModulesPerString = Math.floor(inverterSpec.maxDcVoltageV / vocColdPerModule);

  const modulesPerString = input.modulesPerString ?? Math.min(Math.max(minModulesPerString, Math.floor((minModulesPerString + maxModulesPerString) / 2)), maxModulesPerString);
  const parallelStrings = input.parallelStringsCount ?? Math.ceil(validModulesCount / modulesPerString);

  const stringVocCold = Number((modulesPerString * vocColdPerModule).toFixed(1));
  const tempDiffHot = tempMax - 25;
  const vmpHotPerModule = moduleSpec.vmpStcV * (1 + (moduleSpec.tempCoeffVocPercentPerC / 100) * tempDiffHot);
  const stringVmpHot = Number((modulesPerString * vmpHotPerModule).toFixed(1));
  const stringVmpStc = Number((modulesPerString * moduleSpec.vmpStcV).toFixed(1));

  const totalArrayKw = Number(((validModulesCount * moduleSpec.ratedPowerW) / 1000).toFixed(2));
  const stringIscAmp = Number((parallelStrings * moduleSpec.iscStcA).toFixed(1));

  const validationGates = validateStringVoltage({
    modulesPerString,
    vocStc: moduleSpec.vocStcV,
    vmpStc: moduleSpec.vmpStcV,
    tempCoeffVocPercentPerC: moduleSpec.tempCoeffVocPercentPerC,
    tempMinC: tempMin,
    tempMaxC: tempMax,
    inverterMaxDcVoltage: inverterSpec.maxDcVoltageV,
    inverterMpptMinVoltage: inverterSpec.mpptVoltageRangeV.min,
    inverterMpptMaxVoltage: inverterSpec.mpptVoltageRangeV.max,
  });

  const isValid = validationGates.every((g) => g.status === 'PASS');
  const stringStatus = isValid ? 'VALID' : 'INVALID';

  const engineeringResults = {
    totalModulesCount: validModulesCount,
    modulesPerString,
    parallelStringsCount: parallelStrings,
    stringLayoutSummary: `${parallelStrings} string(s) of ${modulesPerString} panel(s) in series`,
    stringStatus,
    selectedModule: `${moduleSpec.manufacturer} ${moduleSpec.model} (${moduleSpec.ratedPowerW}W)`,
    selectedInverter: `${inverterSpec.manufacturer} ${inverterSpec.model}`,
    totalArrayKw,
    stringVocColdV: stringVocCold,
    stringVmpStcV: stringVmpStc,
    stringVmpHotV: stringVmpHot,
    stringIscAmp,
    inverterMaxDcVoltageV: inverterSpec.maxDcVoltageV,
    inverterMpptRangeV: `${inverterSpec.mpptVoltageRangeV.min}V – ${inverterSpec.mpptVoltageRangeV.max}V`,
    allowedModulesPerStringRange: `${minModulesPerString} – ${maxModulesPerString} panels/string`,
  };

  const envelope = buildEngineeringEnvelope({
    toolId: 'pv-configuration',
    status: isValid ? 'ENGINEERING_VALIDATED' : 'DESIGN_REVIEW_REQUIRED',
    result: engineeringResults,
    calculationBasis: {
      mathematicalModel: 'IEC 62548 PV Array String Voltage & MPPT Thermal Boundary Model',
      governingStandards: ['IEC 62548', 'NEC 690.7'],
      keyEquations: [
        'Voc_cold = Voc_stc × [1 + α_Voc × (T_min - 25)]',
        'Vmp_hot = Vmp_stc × [1 + α_Voc × (T_max - 25)]',
        'Modules_max = Floor(V_inv_max / Voc_cold)',
      ],
      deratingFactorsApplied: {
        tempMinC: tempMin,
        tempMaxC: tempMax,
      },
    },
    inputsUsed: input as any,
  });

  return {
    toolId: 'pv-configuration',
    calculation_status: isValid ? 'SUCCESS' : 'VALIDATION_ERROR',
    confidence: isValid ? 'HIGH' : 'REVIEW_RECOMMENDED',
    confidenceReasoning: isValid ? 'PV string layout fully verified against inverter MPPT bounds and extreme thermal Voc limits.' : 'Proposed string layout violates inverter maximum DC voltage or MPPT limits.',
    engineering_results: engineeringResults,
    recommended_configuration: {
      panelCount: validModulesCount,
      systemCapacityKw: totalArrayKw,
      equipmentList: [
        {
          id: moduleSpec.id,
          name: `${validModulesCount}× ${moduleSpec.manufacturer} ${moduleSpec.model}`,
          category: 'panel',
          specifications: { stringLayout: `${parallelStrings}S × ${modulesPerString}P` },
          recommendedQuantity: validModulesCount,
          reason: `String Voc (${stringVocCold} V) and Vmp (${stringVmpHot} V) match inverter MPPT specifications.`,
        },
      ],
    },
    warnings: validationGates.filter((g) => g.status === 'FAIL').map((g) => ({
      code: g.gateId.toUpperCase(),
      message: g.message,
      severity: 'critical' as const,
      suggestion: `Adjust modules per string to stay within ${minModulesPerString}–${maxModulesPerString} panels.`,
    })),
    assumptions: envelope.assumptions.reduce((acc, cur) => ({ ...acc, [cur.name]: `${cur.value} ${cur.unit}` }), {}),
    supporting_notes: [
      `Cold-weather Voc evaluated at ${tempMin}°C ambient (${stringVocCold} V vs max ${inverterSpec.maxDcVoltageV} V).`,
      `Hot-weather Vmp evaluated at ${tempMax}°C cell temp (${stringVmpHot} V vs min MPPT ${inverterSpec.mpptVoltageRangeV.min} V).`
    ],
    engine_version: ENGINE_VERSION,
    validation_status: { isValid, errors: validationGates.filter((g) => g.status === 'FAIL').map((g) => g.message) },
  };
}
