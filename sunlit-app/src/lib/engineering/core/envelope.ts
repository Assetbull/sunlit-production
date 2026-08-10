/**
 * Engineering Result Response Envelope
 * Sunlit Enterprise Engineering Platform
 */

import { ValidationItem, ValidationGateStatus } from './validation';
import { getAssumptionsForTool } from './assumptions';

export type CalculationStatus =
  | 'ENGINEERING_VALIDATED'
  | 'PRELIMINARY_ESTIMATE'
  | 'INSUFFICIENT_INPUT'
  | 'DESIGN_REVIEW_REQUIRED'
  | 'EQUIPMENT_DATA_REQUIRED';

export interface EngineeringWarningEnvelope {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  suggestion: string;
}

export interface CalculationBasis {
  mathematicalModel: string;
  governingStandards: string[];
  keyEquations: string[];
  deratingFactorsApplied: Record<string, number | string>;
}

export interface StandardizedEngineeringResponse<TResult = Record<string, any>> {
  status: CalculationStatus;
  result: TResult;
  calculation_basis: CalculationBasis;
  assumptions: Array<{ id: string; name: string; value: number; unit: string; source: string }>;
  warnings: EngineeringWarningEnvelope[];
  validation: {
    overallStatus: ValidationGateStatus;
    isValid: boolean;
    gates: Record<string, ValidationItem>;
  };
  inputs_used: Record<string, any>;
  units: Record<string, string>;
  engine_version: string;
  calculation_id: string;
  timestamp: string;
}

/**
 * Constructs a standardized engineering result envelope conforming strictly to prompt specifications.
 */
export function buildEngineeringEnvelope<TResult = Record<string, any>>(params: {
  toolId: string;
  status: CalculationStatus;
  result: TResult;
  calculationBasis: CalculationBasis;
  warnings?: EngineeringWarningEnvelope[];
  validationGates?: ValidationItem[];
  inputsUsed: Record<string, any>;
  units?: Record<string, string>;
  customAssumptions?: Array<{ id: string; name: string; value: number; unit: string; source: string }>;
}): StandardizedEngineeringResponse<TResult> {
  const calculationId = `calc-${params.toolId}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // Combine registered tool assumptions + explicit custom assumptions
  const toolAssumptions = getAssumptionsForTool(params.toolId);
  const combinedAssumptions = [...toolAssumptions, ...(params.customAssumptions ?? [])];

  // Map validation gates
  const gatesMap: Record<string, ValidationItem> = {};
  let overallValid = true;
  let overallStatus: ValidationGateStatus = 'PASS';

  if (params.validationGates && params.validationGates.length > 0) {
    params.validationGates.forEach((gate) => {
      gatesMap[gate.gateId] = gate;
      if (gate.status === 'FAIL') {
        overallValid = false;
        overallStatus = 'FAIL';
      } else if (gate.status === 'WARNING' && overallStatus !== 'FAIL') {
        overallStatus = 'WARNING';
      }
    });
  }

  return {
    status: params.status,
    result: params.result,
    calculation_basis: params.calculationBasis,
    assumptions: combinedAssumptions,
    warnings: params.warnings ?? [],
    validation: {
      overallStatus,
      isValid: overallValid,
      gates: gatesMap,
    },
    inputs_used: params.inputsUsed,
    units: params.units ?? {
      power: 'W',
      energy: 'kWh',
      voltage: 'V',
      current: 'A',
      apparentPower: 'kVA',
    },
    engine_version: '2.0.0',
    calculation_id: calculationId,
    timestamp,
  };
}
