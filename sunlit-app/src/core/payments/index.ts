/**
 * Payments Module Exports
 * 
 * Central export point for all payment-related services and utilities.
 * 
 * Architecture Compliance:
 * - Follows modular export pattern
 * - Maintains clear module boundaries
 * - Enables clean imports across the codebase
 */

// Webhook verification utilities
export { verifyPaystackWebhook, verifyFlutterwaveWebhook } from './webhook-verify';

// EPC Funding Service
export {
  EPCFundingService,
  determinePaymentMode,
  EPCFundingValidationError,
  EscrowIntegrationError,
  PaymentModeError,
  InsufficientPermissionsError,
} from './epc-funding-service';

// EPC Funding Types
export type {
  FundExternalProjectParams,
  FundingResult,
  EscrowRecord,
  EPCFundingStatus,
  PaymentVisibility,
  ProjectPaymentFlow,
  CommissionCalculation,
  CommissionSummary,
  RevenueTracking,
  EscrowStatusSummary,
} from './epc-funding-service';
