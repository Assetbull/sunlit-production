/**
 * Sunlit Financial Integrity & Payment Hardening Test Suite
 *
 * Tests:
 * 1. Provider Abstraction & Dynamic Registry (Pandascrow, Paystack, Mock)
 * 2. Deterministic State Machines for Payments & Escrows
 * 3. Immutable Double-Entry Ledger Engine & Balance Equations
 * 4. Exact Integer Minor Unit Math & Zero-Float Invariants
 * 5. Provider Reconciliation & Discrepancy Detection
 * 6. Webhook Authenticity & Timing-Safe Verification
 *
 * Implements:
 * - PAYMENT_ENGINE_OS.md (Registry ID 31)
 * - PAYMENT_ORCHESTRATOR_ENGINE_OS.md (Registry ID 32)
 * - PAYMENT_LEDGER_ENGINE_OS.md (Registry ID 34)
 * - SECURE_PAYMENT_ENGINE_OS.md (Registry ID 33)
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import {
  PaymentProviderRegistry,
  PandascrowPaymentProvider,
  PaystackPaymentProvider,
  canTransitionPayment,
  enforcePaymentTransition,
  toMinorUnits,
  toMajorUnits,
  formatMonetaryAmount,
  DoubleEntryLedgerEngine,
  FinancialReconciliationEngine,
} from '../../core/payments';

import { EscrowEngine } from '../../core/escrow/engine';

describe('Financial Architecture — Provider Abstraction & Registry', () => {
  test('PaymentProviderRegistry resolves registered providers dynamically', () => {
    const pandascrow = PaymentProviderRegistry.getProvider('PANDASCROW');
    assert.equal(pandascrow.name, 'PANDASCROW');
    assert.equal(pandascrow.capabilities.supportsEscrow, true);

    const paystack = PaymentProviderRegistry.getProvider('PAYSTACK');
    assert.equal(paystack.name, 'PAYSTACK');
    assert.equal(paystack.capabilities.supportsEscrow, false);
  });

  test('PaymentProviderRegistry throws on unregistered provider', () => {
    assert.throws(
      () => PaymentProviderRegistry.getProvider('UNREGISTERED_CRYPTO_GATEWAY'),
      /not registered in PaymentProviderRegistry/
    );
  });

  test('Pandascrow adapter initializes payment with external reference without mutating internal ID', async () => {
    const adapter = new PandascrowPaymentProvider();
    const result = await adapter.initializePayment({
      paymentId: 'sunlit_pay_uuid_1001',
      amountMinorUnits: 5000000,
      currency: 'NGN',
      customerEmail: 'owner@sunlit.africa',
    });

    assert.equal(result.status, 'INITIALIZED');
    assert.ok(result.providerReference.startsWith('ps_tx_sunlit_pay_uuid_1001'));
    assert.ok(result.authorizationUrl?.includes('checkout.pandascrow.com'));
  });
});

describe('Financial Integrity — Deterministic State Machines & Integer Math', () => {
  test('Payment state machine allows valid progression', () => {
    assert.equal(canTransitionPayment('CREATED', 'INITIALIZED'), true);
    assert.equal(canTransitionPayment('INITIALIZED', 'AUTHORIZED'), true);
    assert.equal(canTransitionPayment('AUTHORIZED', 'ESCROW_FUNDED'), true);
    assert.equal(canTransitionPayment('ESCROW_FUNDED', 'RELEASE_PENDING'), true);
    assert.equal(canTransitionPayment('RELEASE_PENDING', 'RELEASED'), true);
  });

  test('Payment state machine strictly blocks illegal transitions', () => {
    // Cannot release a refunded payment
    assert.equal(canTransitionPayment('REFUNDED', 'RELEASED'), false);
    assert.throws(
      () => enforcePaymentTransition('REFUNDED', 'RELEASED'),
      /Illegal payment transition/
    );

    // Cannot jump from CREATED directly to RELEASED
    assert.equal(canTransitionPayment('CREATED', 'RELEASED'), false);
    assert.throws(
      () => enforcePaymentTransition('CREATED', 'RELEASED'),
      /Illegal payment transition/
    );
  });

  test('EscrowEngine prevents illegal transitions from terminal states', () => {
    assert.equal(EscrowEngine.canTransition('pending', 'funded'), true);
    assert.equal(EscrowEngine.canTransition('funded', 'released'), true);

    // Released cannot go back to funded
    assert.equal(EscrowEngine.canTransition('released', 'funded'), false);
    assert.throws(
      () => EscrowEngine.enforceTransition('released', 'funded'),
      /Illegal escrow transition/
    );
  });

  test('Integer minor unit math operates with exact zero-drift precision', () => {
    // NGN 15,000.50 -> 1500050 kobo
    const minor = toMinorUnits(15000.50);
    assert.equal(minor, 1500050);
    assert.equal(Number.isInteger(minor), true);

    // 1500050 kobo -> NGN 15000.50
    const major = toMajorUnits(1500050);
    assert.equal(major, 15000.50);

    const formatted = formatMonetaryAmount(1500050, 'NGN');
    assert.ok(formatted.includes('15,000.50'));
  });
});

describe('Financial Integrity — Immutable Double-Entry Ledger', () => {
  test('DoubleEntryLedgerEngine validates and posts balanced transactions', () => {
    const tx = DoubleEntryLedgerEngine.createTransaction({
      referenceType: 'PAYMENT',
      referenceId: 'pay_order_777',
      currency: 'NGN',
      correlationId: 'corr_ledger_tx_1',
      entries: [
        {
          accountId: 'acc_escrow_holding',
          accountType: 'LIABILITY',
          entryType: 'CREDIT',
          amountMinorUnits: 2000000, // 20,000 NGN
          description: 'Escrow funding for milestone 1',
        },
        {
          accountId: 'acc_customer_cash',
          accountType: 'ASSET',
          entryType: 'DEBIT',
          amountMinorUnits: 2000000,
          description: 'Cash received from project owner',
        },
      ],
    });

    assert.ok(tx.id);
    assert.equal(tx.entries.length, 2);
    assert.equal(tx.entries[0].amountMinorUnits, 2000000);
    assert.equal(tx.entries[1].amountMinorUnits, 2000000);
  });

  test('DoubleEntryLedgerEngine rejects unbalanced transactions', () => {
    assert.throws(
      () =>
        DoubleEntryLedgerEngine.createTransaction({
          referenceType: 'PAYMENT',
          referenceId: 'pay_unbalanced',
          currency: 'NGN',
          correlationId: 'corr_fail_tx',
          entries: [
            {
              accountId: 'acc_escrow_holding',
              accountType: 'LIABILITY',
              entryType: 'CREDIT',
              amountMinorUnits: 2000000, // 20,000 NGN
              description: 'Credit entry',
            },
            {
              accountId: 'acc_customer_cash',
              accountType: 'ASSET',
              entryType: 'DEBIT',
              amountMinorUnits: 1950000, // 19,500 NGN (Unbalanced by 500 NGN)
              description: 'Debit entry with typo',
            },
          ],
        }),
      /Unbalanced transaction! Total Debits \(1950000\) must strictly equal Total Credits \(2000000\)/
    );
  });

  test('DoubleEntryLedgerEngine generates compensating reversal for ledger corrections', () => {
    const originalTx = DoubleEntryLedgerEngine.createTransaction({
      referenceType: 'PAYMENT',
      referenceId: 'pay_tx_orig',
      currency: 'NGN',
      correlationId: 'corr_orig',
      entries: [
        {
          accountId: 'acc_escrow',
          accountType: 'LIABILITY',
          entryType: 'CREDIT',
          amountMinorUnits: 1000000,
          description: 'Original credit',
        },
        {
          accountId: 'acc_cash',
          accountType: 'ASSET',
          entryType: 'DEBIT',
          amountMinorUnits: 1000000,
          description: 'Original debit',
        },
      ],
    });

    const reversalTx = DoubleEntryLedgerEngine.createCompensatingTransaction(
      originalTx,
      'Customer chargeback',
      'corr_rev'
    );

    assert.equal(reversalTx.referenceType, 'ADJUSTMENT');
    assert.equal(reversalTx.entries.length, 2);

    // Reversal inverts entry types
    const revEscrow = reversalTx.entries.find((e) => e.accountId === 'acc_escrow');
    const revCash = reversalTx.entries.find((e) => e.accountId === 'acc_cash');

    assert.equal(revEscrow?.entryType, 'DEBIT');
    assert.equal(revCash?.entryType, 'CREDIT');
  });

  test('DoubleEntryLedgerEngine computes accurate account balances', () => {
    const entries = [
      {
        id: '1',
        transactionId: 't1',
        accountId: 'acc_escrow_holding',
        accountType: 'LIABILITY' as const,
        entryType: 'CREDIT' as const,
        amountMinorUnits: 5000000,
        currency: 'NGN' as const,
        description: 'Fund milestone',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        transactionId: 't2',
        accountId: 'acc_escrow_holding',
        accountType: 'LIABILITY' as const,
        entryType: 'DEBIT' as const,
        amountMinorUnits: 2000000,
        currency: 'NGN' as const,
        description: 'Release milestone 1',
        createdAt: new Date().toISOString(),
      },
    ];

    const balance = DoubleEntryLedgerEngine.calculateAccountBalance(
      entries,
      'acc_escrow_holding',
      'LIABILITY'
    );
    assert.equal(balance, 3000000, 'Liability balance should be 5,000,000 - 2,000,000 = 3,000,000 minor units');
  });
});

describe('Financial Reconciliation — Mismatch Detection', () => {
  test('FinancialReconciliationEngine detects matched payments', () => {
    const internal = [
      {
        paymentId: 'pay_1',
        providerReference: 'ref_1',
        amountMinorUnits: 5000000,
        currency: 'NGN' as const,
        status: 'ESCROW_FUNDED',
      },
    ];

    const provider = [
      {
        providerReference: 'ref_1',
        amountMinorUnits: 5000000,
        currency: 'NGN' as const,
        status: 'SUCCEEDED',
      },
    ];

    const report = FinancialReconciliationEngine.reconcilePayments(internal, provider);
    assert.equal(report.matchedCount, 1);
    assert.equal(report.mismatchCount, 0);
    assert.equal(report.items[0].status, 'MATCHED');
  });

  test('FinancialReconciliationEngine detects amount and currency discrepancies', () => {
    const internal = [
      {
        paymentId: 'pay_amount_diff',
        providerReference: 'ref_amount_diff',
        amountMinorUnits: 5000000,
        currency: 'NGN' as const,
        status: 'ESCROW_FUNDED',
      },
      {
        paymentId: 'pay_curr_diff',
        providerReference: 'ref_curr_diff',
        amountMinorUnits: 100000,
        currency: 'NGN' as const,
        status: 'ESCROW_FUNDED',
      },
    ];

    const provider = [
      {
        providerReference: 'ref_amount_diff',
        amountMinorUnits: 4500000, // Discrepancy of 500,000 minor units
        currency: 'NGN' as const,
        status: 'SUCCEEDED',
      },
      {
        providerReference: 'ref_curr_diff',
        amountMinorUnits: 100000,
        currency: 'USD' as const, // Currency discrepancy
        status: 'SUCCEEDED',
      },
    ];

    const report = FinancialReconciliationEngine.reconcilePayments(internal, provider);
    assert.equal(report.mismatchCount, 2);

    const amountMismatch = report.items.find((i) => i.status === 'AMOUNT_MISMATCH');
    assert.ok(amountMismatch);

    const currencyMismatch = report.items.find((i) => i.status === 'CURRENCY_MISMATCH');
    assert.ok(currencyMismatch);
  });
});

describe('Webhook Security — Timing-Safe HMAC Verification', () => {
  test('Pandascrow adapter accepts authentic HMAC signature', () => {
    const adapter = new PandascrowPaymentProvider(undefined, 'secret_webhook_key_123');
    const payload = JSON.stringify({
      event: 'payment.success',
      data: { reference: 'ps_tx_12345', amount: 2500000, currency: 'NGN' },
    });

    const validSignature = crypto
      .createHmac('sha512', 'secret_webhook_key_123')
      .update(payload)
      .digest('hex');

    const result = adapter.verifyWebhook(payload, validSignature, 'secret_webhook_key_123');
    assert.equal(result.isValid, true);
    assert.equal(result.providerReference, 'ps_tx_12345');
    assert.equal(result.amountMinorUnits, 2500000);
  });

  test('Pandascrow adapter rejects forged signature', () => {
    const adapter = new PandascrowPaymentProvider(undefined, 'secret_webhook_key_123');
    const payload = JSON.stringify({
      event: 'payment.success',
      data: { reference: 'ps_tx_forged', amount: 99999999 },
    });

    const forgedSignature = crypto
      .createHmac('sha512', 'wrong_attacker_secret')
      .update(payload)
      .digest('hex');

    const result = adapter.verifyWebhook(payload, forgedSignature, 'secret_webhook_key_123');
    assert.equal(result.isValid, false);
  });
});
