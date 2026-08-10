import { SharedCalculationResult } from './types';
import { calculateLoad } from './calculators/loadCalculator';
import { calculateBatteryCapacity } from './calculators/batteryCapacity';
import { calculateInverterSizing } from './calculators/inverterSizing';
import { calculateSolarPanelSizing } from './calculators/solarPanelSizing';
import { calculateSolarSystemSizing } from './calculators/solarSystemSizing';
import { calculateCableSizing } from './calculators/cableSizing';
import { calculatePvConfiguration } from './calculators/pvConfiguration';
import { calculateEnergyYield } from './calculators/energyYield';
import { calculateSolarSavings } from './calculators/solarSavings';
import { calculateRoi } from './calculators/roiCalculator';
import { validateToolInput } from './core/inputValidation';
import { enforceNumericSafety } from './core/numericSafety';
import { metricsStore, logEngineeringEvent, generateCorrelationId } from './core/observability';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyInput = any;

export function runEngineeringCalculation(
  toolId: string,
  inputData: Record<string, unknown>,
  correlationId?: string
): SharedCalculationResult {
  const startTs = Date.now();
  const corrId = correlationId || generateCorrelationId();
  metricsStore.recordRequest(toolId);

  // 1. INPUT VALIDATION GATE
  const validation = validateToolInput(toolId, inputData);
  if (!validation.isValid) {
    const durationMs = Date.now() - startTs;
    metricsStore.recordFailure(true, durationMs);

    logEngineeringEvent({
      requestId: corrId,
      correlationId: corrId,
      toolId,
      operation: 'CALCULATE',
      status: 'VALIDATION_ERROR',
      durationMs,
      errorCode: 'INVALID_INPUT',
      timestamp: new Date().toISOString(),
    });

    return {
      toolId,
      calculation_status: 'VALIDATION_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Validation failed due to invalid or out-of-range input parameters.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: validation.errors.map((e) => ({
        code: 'INVALID_INPUT',
        message: e,
        severity: 'critical' as const,
        suggestion: 'Review input values against physical engineering boundaries.',
      })),
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: validation.errors },
    };
  }

  const input = validation.sanitizedInput as AnyInput;
  let rawResult: SharedCalculationResult;

  try {
    switch (toolId) {
      case 'load-calculator':
      case 'solar-appliance-load':
        rawResult = calculateLoad(input);
        break;
      case 'battery-capacity':
        rawResult = calculateBatteryCapacity(input);
        break;
      case 'inverter-sizing':
        rawResult = calculateInverterSizing(input);
        break;
      case 'solar-panel-sizing':
        rawResult = calculateSolarPanelSizing(input);
        break;
      case 'solar-system-sizing':
        rawResult = calculateSolarSystemSizing(input);
        break;
      case 'cable-sizing':
        rawResult = calculateCableSizing(input);
        break;
      case 'pv-configuration':
        rawResult = calculatePvConfiguration(input);
        break;
      case 'energy-yield':
        rawResult = calculateEnergyYield(input);
        break;
      case 'solar-savings':
        rawResult = calculateSolarSavings(input);
        break;
      case 'roi-calculator':
        rawResult = calculateRoi(input);
        break;
      default:
        metricsStore.recordFailure(false, Date.now() - startTs);
        return {
          toolId,
          calculation_status: 'ENGINE_ERROR',
          confidence: 'REVIEW_RECOMMENDED',
          confidenceReasoning: `Unknown tool engine requested: ${toolId}`,
          engineering_results: {},
          recommended_configuration: {},
          warnings: [
            {
              code: 'UNRECOGNIZED_TOOL',
              message: `Unrecognized tool module ID: ${toolId}`,
              severity: 'critical',
              suggestion: 'Select a valid tool.',
            },
          ],
          assumptions: {},
          supporting_notes: [],
          engine_version: '2.0.0',
          validation_status: { isValid: false, errors: [`Unrecognized tool module ID: ${toolId}`] },
        };
    }
  } catch (err: unknown) {
    const durationMs = Date.now() - startTs;
    metricsStore.recordFailure(false, durationMs);

    logEngineeringEvent({
      requestId: corrId,
      correlationId: corrId,
      toolId,
      operation: 'CALCULATE',
      status: 'ENGINE_ERROR',
      durationMs,
      errorCode: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    });

    return {
      toolId,
      calculation_status: 'ENGINE_ERROR',
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Calculation failed due to an unexpected internal mathematical error.',
      engineering_results: {},
      recommended_configuration: {},
      warnings: [
        {
          code: 'CALCULATION_FAILURE',
          message: 'Calculation could not be completed with the supplied values.',
          severity: 'critical',
          suggestion: 'Check for extreme inputs or missing equipment parameters.',
        },
      ],
      assumptions: {},
      supporting_notes: [],
      engine_version: '2.0.0',
      validation_status: { isValid: false, errors: ['Calculation could not be completed.'] },
    };
  }

  // 2. NUMERIC SAFETY POST-PROCESSING
  const numericSafetyCheck = enforceNumericSafety(rawResult as unknown as Record<string, unknown>);
  let finalResult = rawResult;

  if (!numericSafetyCheck.isClean) {
    finalResult = {
      ...numericSafetyCheck.sanitizedResult,
      confidence: 'REVIEW_RECOMMENDED',
      confidenceReasoning: 'Result contained non-finite values and was sanitized.',
      warnings: [
        ...(rawResult.warnings || []),
        {
          code: 'NON_FINITE_VALUE',
          message: 'Mathematical anomaly detected: non-finite output was safely sanitized.',
          severity: 'critical' as const,
          suggestion: 'Review input constraints for zero division or extreme numbers.',
        },
      ],
    } as unknown as SharedCalculationResult;
  }

  const durationMs = Date.now() - startTs;
  if (finalResult.calculation_status === 'SUCCESS') {
    metricsStore.recordSuccess(durationMs);
  } else {
    metricsStore.recordFailure(true, durationMs);
  }

  logEngineeringEvent({
    requestId: corrId,
    correlationId: corrId,
    toolId,
    operation: 'CALCULATE',
    status: finalResult.calculation_status === 'SUCCESS' ? 'SUCCESS' : 'VALIDATION_ERROR',
    durationMs,
    resultStatus: finalResult.calculation_status,
    timestamp: new Date().toISOString(),
  });

  return finalResult;
}
