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

// Payment Provider Abstraction & Registry
export type {
  PaymentProvider,
  PaymentProviderCapabilities,
  CurrencyCode,
  InitializePaymentParams,
  InitializePaymentResponse,
  VerifyPaymentResponse,
  CreateEscrowParams,
  ReleaseEscrowResponse,
  RefundPaymentParams,
  RefundPaymentResponse,
  WebhookVerificationResult,
} from './provider-abstraction';

export { PaymentProviderRegistry } from './provider-registry';
export { PandascrowPaymentProvider } from './providers/pandascrow-adapter';
export { PaystackPaymentProvider } from './providers/paystack-adapter';

// Payment State Machine & Monetary Math
export type { InternalPaymentStatus } from './payment-state-machine';
export {
  canTransitionPayment,
  enforcePaymentTransition,
  toMinorUnits,
  toMajorUnits,
  formatMonetaryAmount,
} from './payment-state-machine';

// Double-Entry Immutable Ledger Engine
export type {
  AccountType,
  EntryType,
  LedgerEntry,
  LedgerTransaction,
  PostTransactionParams,
} from './ledger-engine';
export { DoubleEntryLedgerEngine } from './ledger-engine';

// Financial Reconciliation Engine
export type {
  ReconciliationStatus,
  InternalPaymentRecord,
  ProviderTransactionRecord,
  ReconciliationItem,
  ReconciliationReport,
} from './reconciliation-engine';
export { FinancialReconciliationEngine } from './reconciliation-engine';

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

