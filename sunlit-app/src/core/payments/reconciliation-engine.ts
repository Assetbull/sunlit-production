/**
 * Sunlit Financial Reconciliation Engine
 *
 * Implements PAYMENT_ENGINE_OS.md & OBSERVABILITY_OS.md.
 *
 * Detects discrepancies between:
 * 1. Sunlit Internal Payment State
 * 2. External Provider Settlement Records
 * 3. Immutable Double-Entry Ledger Entries
 */

import { CurrencyCode } from './provider-abstraction';

export type ReconciliationStatus =
  | 'MATCHED'
  | 'AMOUNT_MISMATCH'
  | 'STATUS_MISMATCH'
  | 'CURRENCY_MISMATCH'
  | 'MISSING_PROVIDER_TRANSACTION'
  | 'MISSING_SUNLIT_PAYMENT'
  | 'UNBALANCED_LEDGER';

export interface InternalPaymentRecord {
  paymentId: string;
  providerReference?: string | null;
  amountMinorUnits: number;
  currency: CurrencyCode;
  status: string;
}

export interface ProviderTransactionRecord {
  providerReference: string;
  amountMinorUnits: number;
  currency: CurrencyCode;
  status: string;
}

export interface ReconciliationItem {
  paymentId?: string;
  providerReference?: string;
  status: ReconciliationStatus;
  discrepancyDetails?: string;
  internalAmount?: number;
  providerAmount?: number;
  internalCurrency?: string;
  providerCurrency?: string;
}

export interface ReconciliationReport {
  reconciledAt: string;
  totalRecordsChecked: number;
  matchedCount: number;
  mismatchCount: number;
  items: ReconciliationItem[];
}

export class FinancialReconciliationEngine {
  /**
   * Reconciles internal Sunlit payment records against provider transaction records.
   */
  static reconcilePayments(
    internalPayments: InternalPaymentRecord[],
    providerTransactions: ProviderTransactionRecord[]
  ): ReconciliationReport {
    const items: ReconciliationItem[] = [];
    const providerMap = new Map<string, ProviderTransactionRecord>();

    for (const pTx of providerTransactions) {
      providerMap.set(pTx.providerReference, pTx);
    }

    const processedProviderRefs = new Set<string>();

    for (const internal of internalPayments) {
      if (!internal.providerReference) {
        items.push({
          paymentId: internal.paymentId,
          status: 'MISSING_PROVIDER_TRANSACTION',
          discrepancyDetails: 'Internal payment record has no associated provider reference.',
          internalAmount: internal.amountMinorUnits,
          internalCurrency: internal.currency,
        });
        continue;
      }

      const pTx = providerMap.get(internal.providerReference);
      if (!pTx) {
        items.push({
          paymentId: internal.paymentId,
          providerReference: internal.providerReference,
          status: 'MISSING_PROVIDER_TRANSACTION',
          discrepancyDetails: `Provider reference ${internal.providerReference} not found in provider settlement batch.`,
          internalAmount: internal.amountMinorUnits,
          internalCurrency: internal.currency,
        });
        continue;
      }

      processedProviderRefs.add(internal.providerReference);

      // Check Currency Mismatch
      if (internal.currency !== pTx.currency) {
        items.push({
          paymentId: internal.paymentId,
          providerReference: internal.providerReference,
          status: 'CURRENCY_MISMATCH',
          discrepancyDetails: `Currency mismatch: Internal is ${internal.currency} but Provider is ${pTx.currency}.`,
          internalAmount: internal.amountMinorUnits,
          providerAmount: pTx.amountMinorUnits,
          internalCurrency: internal.currency,
          providerCurrency: pTx.currency,
        });
        continue;
      }

      // Check Amount Mismatch
      if (internal.amountMinorUnits !== pTx.amountMinorUnits) {
        items.push({
          paymentId: internal.paymentId,
          providerReference: internal.providerReference,
          status: 'AMOUNT_MISMATCH',
          discrepancyDetails: `Amount mismatch: Internal is ${internal.amountMinorUnits} minor units but Provider is ${pTx.amountMinorUnits} minor units.`,
          internalAmount: internal.amountMinorUnits,
          providerAmount: pTx.amountMinorUnits,
          internalCurrency: internal.currency,
          providerCurrency: pTx.currency,
        });
        continue;
      }

      // Check Status Equivalence
      const isInternalSuccess = ['AUTHORIZED', 'ESCROW_FUNDED', 'RELEASED', 'funded', 'released'].includes(
        internal.status
      );
      const isProviderSuccess = ['succeeded', 'success', 'paid', 'successful'].includes(
        pTx.status.toLowerCase()
      );


      if (isInternalSuccess !== isProviderSuccess) {
        items.push({
          paymentId: internal.paymentId,
          providerReference: internal.providerReference,
          status: 'STATUS_MISMATCH',
          discrepancyDetails: `Status mismatch: Internal is '${internal.status}' but Provider reported '${pTx.status}'.`,
          internalAmount: internal.amountMinorUnits,
          providerAmount: pTx.amountMinorUnits,
        });
        continue;
      }

      // Exact match
      items.push({
        paymentId: internal.paymentId,
        providerReference: internal.providerReference,
        status: 'MATCHED',
        internalAmount: internal.amountMinorUnits,
        providerAmount: pTx.amountMinorUnits,
        internalCurrency: internal.currency,
        providerCurrency: pTx.currency,
      });
    }

    // Check for orphaned provider transactions
    for (const pTx of providerTransactions) {
      if (!processedProviderRefs.has(pTx.providerReference)) {
        items.push({
          providerReference: pTx.providerReference,
          status: 'MISSING_SUNLIT_PAYMENT',
          discrepancyDetails: `Provider settlement transaction ${pTx.providerReference} has no matching Sunlit internal record.`,
          providerAmount: pTx.amountMinorUnits,
          providerCurrency: pTx.currency,
        });
      }
    }

    const matchedCount = items.filter((i) => i.status === 'MATCHED').length;
    const mismatchCount = items.length - matchedCount;

    return {
      reconciledAt: new Date().toISOString(),
      totalRecordsChecked: items.length,
      matchedCount,
      mismatchCount,
      items,
    };
  }
}
