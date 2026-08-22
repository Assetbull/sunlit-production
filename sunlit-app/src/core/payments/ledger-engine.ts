/**
 * Sunlit Immutable Double-Entry Ledger Engine
 *
 * Implements PAYMENT_LEDGER_ENGINE_OS.md (Registry ID 34).
 *
 * Core Guarantees:
 * 1. Strict Double-Entry Invariant: Sum of Debits == Sum of Credits for every posted transaction.
 * 2. Immutable & Append-Only: Ledger entries cannot be updated or deleted. Corrections require compensating transactions.
 * 3. Exact Integer Math: All transactions operate in integer minor units (kobo/cents) with explicit currency codes.
 */

import crypto from 'crypto';
import { CurrencyCode } from './provider-abstraction';

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export type EntryType = 'DEBIT' | 'CREDIT';

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountId: string;
  accountType: AccountType;
  entryType: EntryType;
  amountMinorUnits: number;
  currency: CurrencyCode;
  organizationId?: string | null;
  workspaceId?: string | null;
  description: string;
  createdAt: string;
}

export interface LedgerTransaction {
  id: string;
  referenceType: 'PAYMENT' | 'ESCROW_RELEASE' | 'REFUND' | 'COMMISSION' | 'ADJUSTMENT';
  referenceId: string;
  currency: CurrencyCode;
  organizationId?: string | null;
  workspaceId?: string | null;
  correlationId: string;
  entries: LedgerEntry[];
  createdAt: string;
}

export interface PostTransactionParams {
  referenceType: 'PAYMENT' | 'ESCROW_RELEASE' | 'REFUND' | 'COMMISSION' | 'ADJUSTMENT';
  referenceId: string;
  currency: CurrencyCode;
  organizationId?: string | null;
  workspaceId?: string | null;
  correlationId: string;
  entries: Array<{
    accountId: string;
    accountType: AccountType;
    entryType: EntryType;
    amountMinorUnits: number;
    description: string;
  }>;
}

export class DoubleEntryLedgerEngine {
  /**
   * Validates and posts a double-entry financial transaction.
   * Enforces the mathematical balance equation: sum(Debits) === sum(Credits).
   */
  static createTransaction(params: PostTransactionParams): LedgerTransaction {
    if (!params.entries || params.entries.length < 2) {
      throw new Error('Ledger Error: A double-entry transaction must contain at least two balanced entries.');
    }

    const transactionId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    let totalDebits = 0;
    let totalCredits = 0;

    const validatedEntries: LedgerEntry[] = [];

    for (const item of params.entries) {
      if (!Number.isInteger(item.amountMinorUnits) || item.amountMinorUnits <= 0) {
        throw new Error(
          `Ledger Error: Entry amount must be a positive integer in minor units (received ${item.amountMinorUnits}).`
        );
      }

      if (item.entryType === 'DEBIT') {
        totalDebits += item.amountMinorUnits;
      } else if (item.entryType === 'CREDIT') {
        totalCredits += item.amountMinorUnits;
      } else {
        throw new Error(`Ledger Error: Unknown entry type '${item.entryType}'. Must be DEBIT or CREDIT.`);
      }

      validatedEntries.push({
        id: crypto.randomUUID(),
        transactionId,
        accountId: item.accountId,
        accountType: item.accountType,
        entryType: item.entryType,
        amountMinorUnits: item.amountMinorUnits,
        currency: params.currency,
        organizationId: params.organizationId || null,
        workspaceId: params.workspaceId || null,
        description: item.description,
        createdAt,
      });
    }

    // Mathematical Balance Verification
    if (totalDebits !== totalCredits) {
      throw new Error(
        `Ledger Balance Error: Unbalanced transaction! Total Debits (${totalDebits}) must strictly equal Total Credits (${totalCredits}). Discrepancy: ${Math.abs(totalDebits - totalCredits)} minor units.`
      );
    }

    return {
      id: transactionId,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      currency: params.currency,
      organizationId: params.organizationId || null,
      workspaceId: params.workspaceId || null,
      correlationId: params.correlationId,
      entries: validatedEntries,
      createdAt,
    };
  }

  /**
   * Generates a compensating reversal transaction to correct a previously posted transaction.
   * Follows immutable ledger principles: never updates or deletes historical records.
   */
  static createCompensatingTransaction(
    originalTransaction: LedgerTransaction,
    reason: string,
    correlationId: string
  ): LedgerTransaction {
    const compensatingEntries = originalTransaction.entries.map((entry) => ({
      accountId: entry.accountId,
      accountType: entry.accountType,
      // Invert entry type: DEBIT -> CREDIT, CREDIT -> DEBIT
      entryType: (entry.entryType === 'DEBIT' ? 'CREDIT' : 'DEBIT') as EntryType,
      amountMinorUnits: entry.amountMinorUnits,
      description: `Reversal of tx ${originalTransaction.id}: ${reason}`,
    }));

    return this.createTransaction({
      referenceType: 'ADJUSTMENT',
      referenceId: originalTransaction.id,
      currency: originalTransaction.currency,
      organizationId: originalTransaction.organizationId,
      workspaceId: originalTransaction.workspaceId,
      correlationId,
      entries: compensatingEntries,
    });
  }

  /**
   * Computes current account balance from a set of ledger entries.
   */
  static calculateAccountBalance(
    entries: LedgerEntry[],
    accountId: string,
    accountType: AccountType
  ): number {
    let balance = 0;
    for (const entry of entries) {
      if (entry.accountId !== accountId) continue;

      // Normal balance:
      // ASSET / EXPENSE: Normal debit (DEBIT increases, CREDIT decreases)
      // LIABILITY / EQUITY / REVENUE: Normal credit (CREDIT increases, DEBIT decreases)
      if (accountType === 'ASSET' || accountType === 'EXPENSE') {
        balance += entry.entryType === 'DEBIT' ? entry.amountMinorUnits : -entry.amountMinorUnits;
      } else {
        balance += entry.entryType === 'CREDIT' ? entry.amountMinorUnits : -entry.amountMinorUnits;
      }
    }
    return balance;
  }
}
