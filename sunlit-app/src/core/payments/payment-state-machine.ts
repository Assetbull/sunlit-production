/**
 * Sunlit Deterministic Payment State Machine & Monetary Math Engine
 *
 * Implements PAYMENT_ENGINE_OS.md (Registry ID 31) & PAYMENT_ORCHESTRATOR_ENGINE_OS.md.
 *
 * Core Guarantees:
 * 1. Strict, non-reversible, and non-cyclical lifecycle transitions.
 * 2. Zero floating-point money representations: all accounting runs on integer minor units.
 * 3. Terminal state protections preventing re-opening closed/refunded/released payments.
 */

export type InternalPaymentStatus =
  | 'CREATED'
  | 'INITIALIZED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'ESCROW_FUNDED'
  | 'RELEASE_PENDING'
  | 'RELEASED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

const ALLOWED_PAYMENT_TRANSITIONS: Record<InternalPaymentStatus, readonly InternalPaymentStatus[]> = {
  CREATED: ['INITIALIZED', 'PENDING', 'FAILED', 'CANCELLED'],
  INITIALIZED: ['PENDING', 'AUTHORIZED', 'FAILED', 'CANCELLED'],
  PENDING: ['AUTHORIZED', 'ESCROW_FUNDED', 'FAILED', 'CANCELLED'],
  AUTHORIZED: ['ESCROW_FUNDED', 'RELEASE_PENDING', 'FAILED', 'CANCELLED'],
  ESCROW_FUNDED: ['RELEASE_PENDING', 'REFUND_PENDING'],
  RELEASE_PENDING: ['RELEASED', 'FAILED'],
  RELEASED: [], // Terminal
  REFUND_PENDING: ['REFUNDED', 'FAILED'],
  REFUNDED: [], // Terminal
  FAILED: [], // Terminal
  CANCELLED: [], // Terminal
};

/**
 * Validates if a proposed payment state transition is strictly legal.
 */
export function canTransitionPayment(
  currentStatus: InternalPaymentStatus,
  targetStatus: InternalPaymentStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_PAYMENT_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(targetStatus) : false;
}

/**
 * Enforces legal state transitions, throwing an explicit error on violation.
 */
export function enforcePaymentTransition(
  currentStatus: InternalPaymentStatus,
  targetStatus: InternalPaymentStatus
): void {
  if (!canTransitionPayment(currentStatus, targetStatus)) {
    throw new Error(
      `Financial State Error: Illegal payment transition from '${currentStatus}' to '${targetStatus}'.`
    );
  }
}

/**
 * Converts a major currency value to integer minor units (e.g. ₦1,500.50 -> 150050 kobo).
 */
export function toMinorUnits(amountMajor: number): number {
  if (typeof amountMajor !== 'number' || isNaN(amountMajor) || !isFinite(amountMajor)) {
    throw new Error('Financial Math Error: Invalid major unit amount.');
  }
  return Math.round(amountMajor * 100);
}

/**
 * Converts integer minor units to major currency decimal (e.g. 150050 kobo -> 1500.50).
 */
export function toMajorUnits(amountMinor: number): number {
  if (!Number.isInteger(amountMinor)) {
    throw new Error('Financial Math Error: Minor units must be a strict integer.');
  }
  return Number((amountMinor / 100).toFixed(2));
}

/**
 * Formats a monetary amount into a clean currency string.
 */
export function formatMonetaryAmount(amountMinor: number, currency = 'NGN'): string {
  const major = toMajorUnits(amountMinor);
  return `${currency} ${major.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
