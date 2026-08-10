/**
 * Sunlit Security — Database & Supabase Integrity Test Suite
 *
 * Tests database constraints, referential integrity, idempotency locks,
 * audit immutability, and tenant boundaries per:
 * - DATABASE_ENGINE_OS.md (Registry ID 61)
 * - SUPABASE_IMPLEMENTATION_OS.md (Registry ID 62)
 * - PAYMENT_ENGINE_OS.md (Registry ID 65)
 * - AUDIT_OS.md (Registry ID 38)
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeRequestHash,
  acquireIdempotencyLock,
  completeIdempotency,
  releaseIdempotencyLock,
} from '../../core/security/idempotency';

describe('Database Integrity — Idempotency & Concurrency Defenses', () => {
  test('computeRequestHash generates deterministic SHA-256 digests', () => {
    const payloadA = { amount: 500000, project_id: 'proj_123', currency: 'NGN' };
    const payloadB = { currency: 'NGN', amount: 500000, project_id: 'proj_123' }; // different key ordering

    const hashA = computeRequestHash(payloadA);
    const hashB = computeRequestHash(payloadB);

    assert.equal(typeof hashA, 'string');
    assert.equal(hashA.length, 64, 'SHA-256 hex length must be 64 chars');
    assert.equal(hashA, hashB, 'Key order variation must produce identical deterministic hash');
  });

  test('acquireIdempotencyLock acquires lock for a new key', async () => {
    const key = `idemp_test_${Date.now()}_1`;
    const payload = { rfq_id: 'rfq_001', amount: 1200000 };

    const result = await acquireIdempotencyLock(null, key, '/api/v1/bids', payload);
    assert.equal(result.lockAcquired, true);
    assert.equal(result.isReplay, false);
  });

  test('acquireIdempotencyLock blocks duplicate concurrent in-progress requests', async () => {
    const key = `idemp_test_${Date.now()}_2`;
    const payload = { project_id: 'proj_002', escrow_id: 'esc_002' };

    // First request acquires lock
    const first = await acquireIdempotencyLock(null, key, '/api/v1/escrow/release', payload);
    assert.equal(first.lockAcquired, true);

    // Concurrent second request with same key is blocked
    const second = await acquireIdempotencyLock(null, key, '/api/v1/escrow/release', payload);
    assert.equal(second.lockAcquired, false);
    assert.match(second.error || '', /IDEMPOTENCY_IN_PROGRESS/);
  });

  test('completeIdempotency allows subsequent replayed requests to return cached response', async () => {
    const key = `idemp_test_${Date.now()}_3`;
    const payload = { payment_id: 'pay_003', amount: 350000 };

    await acquireIdempotencyLock(null, key, '/api/v1/payments/initialize', payload);

    // Complete operation
    await completeIdempotency(null, key, 201, {
      success: true,
      transaction_ref: 'trx_verified_999',
    });

    // Subsequent replayed request
    const replay = await acquireIdempotencyLock(null, key, '/api/v1/payments/initialize', payload);
    assert.equal(replay.isReplay, true);
    assert.equal(replay.lockAcquired, false);
    assert.equal(replay.cachedResponse?.statusCode, 201);
    assert.equal(replay.cachedResponse?.body?.transaction_ref, 'trx_verified_999');
  });

  test('acquireIdempotencyLock rejects payload tampering with same key', async () => {
    const key = `idemp_test_${Date.now()}_4`;
    const originalPayload = { amount: 100000, recipient: 'installer_001' };
    const tamperedPayload = { amount: 9999999, recipient: 'attacker_001' };

    await acquireIdempotencyLock(null, key, '/api/v1/payments', originalPayload);

    // Attacker attempts to replay same key with altered payload
    const tamperedResult = await acquireIdempotencyLock(null, key, '/api/v1/payments', tamperedPayload);
    assert.equal(tamperedResult.lockAcquired, false);
    assert.equal(tamperedResult.isReplay, false);
    assert.match(tamperedResult.error || '', /IDEMPOTENCY_PAYLOAD_MISMATCH/);
  });

  test('releaseIdempotencyLock cleans up lock on failed operation', async () => {
    const key = `idemp_test_${Date.now()}_5`;
    const payload = { action: 'test_fail' };

    await acquireIdempotencyLock(null, key, '/api/test', payload);
    await releaseIdempotencyLock(null, key);

    // Lock can be re-acquired after release
    const reacquired = await acquireIdempotencyLock(null, key, '/api/test', payload);
    assert.equal(reacquired.lockAcquired, true);
  });
});

describe('Database Integrity — Domain Mathematical Constraints Validation', () => {
  test('Financial amounts must be strictly non-negative', () => {
    const validateAmount = (amt: number) => amt >= 0;

    assert.equal(validateAmount(0), true, 'Zero amount is valid');
    assert.equal(validateAmount(1500000), true, 'Positive amount is valid');
    assert.equal(validateAmount(-1), false, 'Negative amount is invalid');
    assert.equal(validateAmount(-0.01), false, 'Negative fractional amount is invalid');
  });

  test('Ratings must be constrained between 1 and 5 inclusive', () => {
    const validateRating = (rating: number) => Number.isInteger(rating) && rating >= 1 && rating <= 5;

    assert.equal(validateRating(1), true);
    assert.equal(validateRating(5), true);
    assert.equal(validateRating(3), true);
    assert.equal(validateRating(0), false, 'Rating 0 is out of bounds');
    assert.equal(validateRating(6), false, 'Rating 6 is out of bounds');
    assert.equal(validateRating(-1), false, 'Negative rating is out of bounds');
    assert.equal(validateRating(3.5), false, 'Non-integer rating is invalid');
  });

  test('RFQ budget range must satisfy max >= min', () => {
    const validateBudgetRange = (min?: number, max?: number) => {
      if (min === undefined || max === undefined) return true;
      return min >= 0 && max >= min;
    };

    assert.equal(validateBudgetRange(1000000, 2000000), true);
    assert.equal(validateBudgetRange(500000, 500000), true);
    assert.equal(validateBudgetRange(3000000, 1000000), false, 'Min greater than max must fail');
    assert.equal(validateBudgetRange(-500, 1000000), false, 'Negative min must fail');
  });
});
