/**
 * Standardized Engineering Error Taxonomy
 * Sunlit Enterprise Engineering Platform — Public Hardening
 */

export type EngineeringErrorCode =
  | 'INVALID_INPUT'
  | 'MISSING_INPUT'
  | 'OUT_OF_RANGE'
  | 'NON_FINITE_VALUE'
  | 'CALCULATION_FAILURE'
  | 'ENGINEERING_CONSTRAINT'
  | 'EQUIPMENT_DATA_MISSING'
  | 'DESIGN_REVIEW_REQUIRED'
  | 'RATE_LIMITED'
  | 'REQUEST_TOO_LARGE'
  | 'INTERNAL_ERROR'
  | 'UNRECOGNIZED_TOOL';

export interface EngineeringErrorDetail {
  code: EngineeringErrorCode;
  publicMessage: string;
  severity: 'info' | 'warning' | 'critical';
  retryable: boolean;
  userAction: string;
}

export const ERROR_TAXONOMY: Record<EngineeringErrorCode, EngineeringErrorDetail> = {
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    publicMessage: 'One or more engineering inputs are formatted incorrectly.',
    severity: 'critical',
    retryable: true,
    userAction: 'Review input values and ensure all numbers and parameters conform to specifications.',
  },
  MISSING_INPUT: {
    code: 'MISSING_INPUT',
    publicMessage: 'Required engineering parameters are missing.',
    severity: 'critical',
    retryable: true,
    userAction: 'Provide all required fields to complete the calculation.',
  },
  OUT_OF_RANGE: {
    code: 'OUT_OF_RANGE',
    publicMessage: 'Supplied values are outside acceptable physical engineering limits.',
    severity: 'critical',
    retryable: true,
    userAction: 'Adjust input numbers to fall within realistic engineering thresholds.',
  },
  NON_FINITE_VALUE: {
    code: 'NON_FINITE_VALUE',
    publicMessage: 'Calculation encountered a mathematical anomaly (non-finite result).',
    severity: 'critical',
    retryable: true,
    userAction: 'Check for zero division or extreme input parameters.',
  },
  CALCULATION_FAILURE: {
    code: 'CALCULATION_FAILURE',
    publicMessage: 'The calculation engine could not complete the requested operation.',
    severity: 'critical',
    retryable: true,
    userAction: 'Review inputs and try again, or consult with a Sunlit engineering specialist.',
  },
  ENGINEERING_CONSTRAINT: {
    code: 'ENGINEERING_CONSTRAINT',
    publicMessage: 'The specified equipment configuration violates engineering safety constraints.',
    severity: 'warning',
    retryable: true,
    userAction: 'Review warning items and adjust component ratings or string configurations.',
  },
  EQUIPMENT_DATA_MISSING: {
    code: 'EQUIPMENT_DATA_MISSING',
    publicMessage: 'Requested equipment specifications could not be found in the catalog.',
    severity: 'warning',
    retryable: true,
    userAction: 'Select a standard equipment model from the catalog or input custom ratings.',
  },
  DESIGN_REVIEW_REQUIRED: {
    code: 'DESIGN_REVIEW_REQUIRED',
    publicMessage: 'This preliminary configuration requires professional engineering design review.',
    severity: 'info',
    retryable: false,
    userAction: 'Consult a qualified Sunlit EPC engineer for site verification and sign-off.',
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    publicMessage: 'Too many calculation requests. Please wait a moment before trying again.',
    severity: 'warning',
    retryable: true,
    userAction: 'Pause a few seconds and resubmit your calculation.',
  },
  REQUEST_TOO_LARGE: {
    code: 'REQUEST_TOO_LARGE',
    publicMessage: 'The calculation request exceeds maximum permitted payload size.',
    severity: 'critical',
    retryable: true,
    userAction: 'Reduce the number of items or payload complexity.',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    publicMessage: 'An internal calculation error occurred. Please try again.',
    severity: 'critical',
    retryable: true,
    userAction: 'Refresh the calculation or contact support if the issue persists.',
  },
  UNRECOGNIZED_TOOL: {
    code: 'UNRECOGNIZED_TOOL',
    publicMessage: 'The requested engineering tool module is not recognized.',
    severity: 'critical',
    retryable: false,
    userAction: 'Select an available engineering tool from the Sunlit platform.',
  },
};

export function getErrorDetail(code: EngineeringErrorCode): EngineeringErrorDetail {
  return ERROR_TAXONOMY[code] || ERROR_TAXONOMY.INTERNAL_ERROR;
}
