/**
 * Sunlit Payment Provider Abstraction & Capability Standard
 *
 * Implements PAYMENT_ENGINE_OS.md, PAYMENT_ORCHESTRATOR_ENGINE_OS.md,
 * and SECURE_PAYMENT_ENGINE_OS.md.
 *
 * Fundamental Invariants:
 * 1. Sunlit owns internal payment identity (UUIDs), financial state, and ledger accounting.
 * 2. External providers (Pandascrow, Paystack, Flutterwave) are swappable implementations.
 * 3. All monetary values are represented strictly in integer minor units (e.g. kobo/cents).
 */

export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP';

export interface PaymentProviderCapabilities {
  supportsEscrow: boolean;
  supportsPartialRelease: boolean;
  supportsRefund: boolean;
  supportsSplitSettlement: boolean;
  supportsVirtualAccount: boolean;
  supportsWebhookVerification: boolean;
}

export interface InitializePaymentParams {
  paymentId: string; // Sunlit internal UUID
  amountMinorUnits: number; // Integer minor units (e.g. 100000 kobo = 1000 NGN)
  currency: CurrencyCode;
  customerEmail: string;
  customerName?: string;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}

export interface InitializePaymentResponse {
  providerReference: string;
  authorizationUrl?: string;
  status: 'PENDING' | 'INITIALIZED' | 'FAILED';
  rawResponse?: Record<string, unknown>;
}

export interface VerifyPaymentResponse {
  providerReference: string;
  amountMinorUnits: number;
  currency: CurrencyCode;
  status: 'SUCCEEDED' | 'PENDING' | 'FAILED';
  paidAt?: string;
}

export interface CreateEscrowParams {
  escrowId: string; // Sunlit internal UUID
  projectId: string;
  milestoneId: string;
  amountMinorUnits: number;
  currency: CurrencyCode;
  payerEmail: string;
  payeeEmail: string;
  title: string;
}

export interface ReleaseEscrowResponse {
  providerReference: string;
  amountReleasedMinorUnits: number;
  currency: CurrencyCode;
  status: 'RELEASED' | 'FAILED';
  releasedAt: string;
}

export interface RefundPaymentParams {
  providerReference: string;
  amountMinorUnits: number;
  currency: CurrencyCode;
  reason?: string;
}

export interface RefundPaymentResponse {
  providerReference: string;
  status: 'REFUNDED' | 'PENDING' | 'FAILED';
  refundedAmountMinorUnits: number;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventType?: string;
  providerReference?: string;
  amountMinorUnits?: number;
  currency?: CurrencyCode;
  rawEvent?: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly name: string;
  readonly capabilities: PaymentProviderCapabilities;

  initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResponse>;
  verifyPayment(providerReference: string): Promise<VerifyPaymentResponse>;
  createEscrow(params: CreateEscrowParams): Promise<{ providerReference: string; status: string }>;
  releaseEscrow(providerReference: string, amountMinorUnits: number): Promise<ReleaseEscrowResponse>;
  refundPayment(params: RefundPaymentParams): Promise<RefundPaymentResponse>;
  verifyWebhook(
    rawBody: string | Buffer,
    signatureHeader: string,
    secret?: string
  ): WebhookVerificationResult;
}
