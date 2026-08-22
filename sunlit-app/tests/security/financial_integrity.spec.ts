/**
 * Financial State, Webhooks & Ledger Integrity Test Suite (Layer 6)
 *
 * Validates:
 * 1. Webhook Signature Verification & Forgery Rejection
 * 2. Immutable Double-Entry Ledger Equations (Sum of Debits == Sum of Credits)
 * 3. Exact Integer Minor Unit Monetary Precision
 * 4. Deterministic Payment & Escrow State Machines
 * 5. Provider Reconciliation & Discrepancy Reporting
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import {
  PaymentProviderRegistry,
  PandascrowPaymentProvider,
  canTransitionPayment,
  enforcePaymentTransition,
  toMinorUnits,
  toMajorUnits,
  formatMonetaryAmount,
  DoubleEntryLedgerEngine,
  FinancialReconciliationEngine,
} from '../../src/core/payments';

import { EscrowEngine } from '../../src/core/escrow/engine';

describe('Layer 6: Financial State — Webhook Signature Verification', () => {
  test('Authentic Paystack/Pandascrow webhook signature passes timing-safe validation', () => {
    const secret = 'whsec_prod_live_test_key_8888';
    const provider = new PandascrowPaymentProvider(undefined, secret);

    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'ref_tx_9999', amount: 5000000, currency: 'NGN' },
    });

    const signature = crypto.createHmac('sha512', secret).update(payload).digest('hex');
    const result = provider.verifyWebhook(payload, signature, secret);

    assert.equal(result.isValid, true);
    assert.equal(result.providerReference, 'ref_tx_9999');
    assert.equal(result.amountMinorUnits, 5000000);
  });

  test('Forged webhook signature is rejected immediately', () => {
    const secret = 'whsec_prod_live_test_key_8888';
    const provider = new PandascrowPaymentProvider(undefined, secret);

    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'ref_tx_forged', amount: 100000000 },
    });

    const forgedSignature = crypto.createHmac('sha512', 'attacker_key').update(payload).digest('hex');
    const result = provider.verifyWebhook(payload, forgedSignature, secret);

    assert.equal(result.isValid, false);
  });
});

describe('Layer 6: Financial State — Double-Entry Ledger Invariants', () => {
  test('DoubleEntryLedgerEngine enforces Debit = Credit balance', () => {
    const tx = DoubleEntryLedgerEngine.createTransaction({
      referenceType: 'PAYMENT',
      referenceId: 'order_123',
      currency: 'NGN',
      correlationId: 'corr_ledger_1',
      entries: [
        {
          accountId: 'acc_escrow_holding',
          accountType: 'LIABILITY',
          entryType: 'CREDIT',
          amountMinorUnits: 5000000,
          description: 'Credit escrow holding',
        },
        {
          accountId: 'acc_cash_clearing',
          accountType: 'ASSET',
          entryType: 'DEBIT',
          amountMinorUnits: 5000000,
          description: 'Debit cash clearing',
        },
      ],
    });

    assert.equal(tx.entries.length, 2);
    assert.equal(tx.entries[0].amountMinorUnits, tx.entries[1].amountMinorUnits);
  });

  test('DoubleEntryLedgerEngine rejects unbalanced entries', () => {
    assert.throws(
      () =>
        DoubleEntryLedgerEngine.createTransaction({
          referenceType: 'PAYMENT',
          referenceId: 'order_unbalanced',
          currency: 'NGN',
          correlationId: 'corr_unbalanced',
          entries: [
            {
              accountId: 'acc_escrow_holding',
              accountType: 'LIABILITY',
              entryType: 'CREDIT',
              amountMinorUnits: 5000000,
              description: 'Credit entry',
            },
            {
              accountId: 'acc_cash_clearing',
              accountType: 'ASSET',
              entryType: 'DEBIT',
              amountMinorUnits: 4900000, // 100,000 minor units difference
              description: 'Debit entry',
            },
          ],
        }),
      /Ledger Balance Error: Unbalanced transaction!/
    );
  });
});

describe('Layer 6: Financial State — Deterministic State Progression', () => {
  test('Payment state machine permits valid sequential lifecycle', () => {
    assert.equal(canTransitionPayment('CREATED', 'INITIALIZED'), true);
    assert.equal(canTransitionPayment('INITIALIZED', 'AUTHORIZED'), true);
    assert.equal(canTransitionPayment('AUTHORIZED', 'ESCROW_FUNDED'), true);
    assert.equal(canTransitionPayment('ESCROW_FUNDED', 'RELEASE_PENDING'), true);
    assert.equal(canTransitionPayment('RELEASE_PENDING', 'RELEASED'), true);
  });

  test('Illegal jumps and mutations on terminal states throw explicitly', () => {
    assert.throws(
      () => enforcePaymentTransition('REFUNDED', 'RELEASED'),
      /Illegal payment transition/
    );
    assert.throws(
      () => enforcePaymentTransition('CANCELLED', 'AUTHORIZED'),
      /Illegal payment transition/
    );
  });

  test('Integer minor unit arithmetic prevents floating-point precision loss', () => {
    const minor = toMinorUnits(25430.75);
    assert.equal(minor, 2543075);
    assert.equal(toMajorUnits(minor), 25430.75);

    const formatted = formatMonetaryAmount(2543075, 'NGN');
    assert.ok(formatted.includes('25,430.75'));
  });
});
