/**
 * Sunlit Security — Events, Jobs & Webhook Hardening Test Suite
 *
 * Tests standard event envelopes, secrets scrubbing, outbox dispatching,
 * background job error classification, dead-letter capture, and webhook HMAC integrity per:
 * - EVENT_STANDARD_OS.md (Registry ID 37)
 * - BACKGROUND_JOB_OS.md (Registry ID 39)
 * - ERROR_STANDARD_OS.md (Registry ID 36)
 * - OBSERVABILITY_OS.md (Registry ID 40)
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  createDomainEvent,
  scrubPayload,
  TransactionalOutbox,
} from '../../core/events/outbox';

import {
  classifyJobError,
  calculateBackoffMs,
  executeJob,
  deadLetterRegistry,
  JobDefinition,
} from '../../core/jobs/job-runner';

import { verifyPaystackWebhook } from '../../core/payments/webhook-verify';
import crypto from 'crypto';

describe('Event Architecture — Domain Event Envelope & Scrubbing', () => {
  test('createDomainEvent generates fully qualified compliant envelope', () => {
    const event = createDomainEvent({
      eventType: 'rfq.created',
      eventVersion: '1.0',
      actorId: 'usr_owner_101',
      organizationId: 'org_sunlit_01',
      workspaceId: 'ws_alpha_01',
      correlationId: 'corr_req_999',
      causationId: 'cmd_rfq_create_001',
      resourceType: 'rfq',
      resourceId: 'rfq_uuid_123',
      payload: {
        budget: 5000000,
        project_type: 'commercial',
      },
    });

    assert.equal(typeof event.eventId, 'string');
    assert.equal(event.eventType, 'rfq.created');
    assert.equal(event.eventVersion, '1.0');
    assert.equal(event.actorId, 'usr_owner_101');
    assert.equal(event.organizationId, 'org_sunlit_01');
    assert.equal(event.workspaceId, 'ws_alpha_01');
    assert.equal(event.correlationId, 'corr_req_999');
    assert.equal(event.causationId, 'cmd_rfq_create_001');
    assert.equal(event.resourceType, 'rfq');
    assert.equal(event.resourceId, 'rfq_uuid_123');
    assert.equal(event.payload.budget, 5000000);
    assert.ok(new Date(event.occurredAt).getTime() > 0, 'OccurredAt must be valid ISO timestamp');
  });

  test('scrubPayload recursively redacts sensitive secrets in event payloads', () => {
    const dirtyPayload = {
      user_id: 'usr_123',
      email: 'user@sunlit.energy',
      password: 'SuperSecretPassword123!',
      nested: {
        api_key: 'sk_live_999999999999',
        token: 'jwt.header.payload.signature',
        card_number: '4111222233334444',
        safeField: 'commercial_solar_50kw',
      },
      list: [
        { secret: 'very_sensitive_key', note: 'safe_note' }
      ]
    };

    const cleaned = scrubPayload(dirtyPayload);

    assert.equal(cleaned.user_id, 'usr_123');
    assert.equal(cleaned.email, 'user@sunlit.energy');
    assert.equal(cleaned.password, '[REDACTED]');
    assert.equal(cleaned.nested.api_key, '[REDACTED]');
    assert.equal(cleaned.nested.token, '[REDACTED]');
    assert.equal(cleaned.nested.card_number, '[REDACTED]');
    assert.equal(cleaned.nested.safeField, 'commercial_solar_50kw');
    assert.equal(cleaned.list[0].secret, '[REDACTED]');
    assert.equal(cleaned.list[0].note, 'safe_note');
  });

  test('TransactionalOutbox dispatchEvent handles subscribers with error isolation', async () => {
    const mockDataService = {
      create: async () => ({ id: 'evt_logged_100' }),
    } as any;

    const outbox = new TransactionalOutbox(mockDataService);
    const event = createDomainEvent({
      eventType: 'payment.released',
      correlationId: 'corr_test_01',
      resourceType: 'escrow',
      resourceId: 'esc_100',
      payload: { amount: 250000 },
    });

    let receivedBySubscriber = false;
    const subscriberA = async (ev: typeof event) => {
      receivedBySubscriber = true;
      assert.equal(ev.resourceId, 'esc_100');
    };

    const subscriberB = async () => {
      throw new Error('Downstream webhook subscriber timeout');
    };

    const result = await outbox.dispatchEvent(event, [subscriberA, subscriberB]);

    assert.equal(receivedBySubscriber, true);
    assert.equal(result.success, false);
    assert.equal(result.errors.length, 1);
    assert.match(result.errors[0].message, /Downstream webhook subscriber timeout/);
  });
});

describe('Background Job Engine — Execution, Classification & Dead-Letter', () => {
  test('classifyJobError accurately distinguishes error categories', () => {
    // Transient errors
    assert.equal(classifyJobError(new Error('Connection timed out')), 'TRANSIENT');
    assert.equal(classifyJobError(new Error('ECONNREFUSED 127.0.0.1:5432')), 'TRANSIENT');
    assert.equal(classifyJobError(new Error('Rate limit exceeded: 429 Too Many Requests')), 'TRANSIENT');

    // Business failures
    assert.equal(classifyJobError(new Error('Invalid state transition: milestone already completed')), 'BUSINESS_FAILURE');
    assert.equal(classifyJobError(new Error('Dispute active on project')), 'BUSINESS_FAILURE');
    assert.equal(classifyJobError(new Error('KYC required before release')), 'BUSINESS_FAILURE');

    // Permanent errors
    assert.equal(classifyJobError(new Error('SyntaxError: Unexpected token in JSON')), 'PERMANENT');
    assert.equal(classifyJobError(new Error('Permission denied: invalid role')), 'PERMANENT');
    assert.equal(classifyJobError(null), 'PERMANENT');
  });

  test('calculateBackoffMs produces increasing exponential delays with jitter', () => {
    const delay1 = calculateBackoffMs(1, 1000);
    const delay2 = calculateBackoffMs(2, 1000);
    const delay3 = calculateBackoffMs(3, 1000);

    assert.ok(delay1 >= 1000 && delay1 <= 1600, 'Attempt 1 backoff');
    assert.ok(delay2 >= 2000 && delay2 <= 2600, 'Attempt 2 backoff');
    assert.ok(delay3 >= 4000 && delay3 <= 4600, 'Attempt 3 backoff');
    assert.ok(delay3 > delay2 && delay2 > delay1, 'Backoff must scale exponentially');
  });

  test('executeJob retries on transient errors within maxAttempts', async () => {
    const job: JobDefinition<{ count: number }> = {
      jobId: 'job_transient_01',
      name: 'send_email_notification',
      queue: 'notifications',
      payload: { count: 1 },
      correlationId: 'corr_job_01',
      attempts: 0,
      maxAttempts: 3,
      backoffBaseMs: 500,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const transientHandler = async () => {
      throw new Error('ETIMEDOUT: SMTP server unavailable');
    };

    const result = await executeJob(job, transientHandler);

    assert.equal(result.status, 'pending');
    assert.equal(result.errorClassification, 'TRANSIENT');
    assert.ok((result.nextRetryMs || 0) > 0);
    assert.equal(job.attempts, 1);
  });

  test('executeJob moves to dead-letter queue when permanent error occurs', async () => {
    const job: JobDefinition<{ badField: string }> = {
      jobId: 'job_perm_01',
      name: 'process_contract_activation',
      queue: 'contracts',
      payload: { badField: 'invalid' },
      correlationId: 'corr_perm_01',
      organizationId: 'org_99',
      attempts: 0,
      maxAttempts: 3,
      backoffBaseMs: 500,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const permHandler = async () => {
      throw new Error('Permission denied: caller lacks required tenant role');
    };

    const initialDeadLetters = deadLetterRegistry.length;
    const result = await executeJob(job, permHandler);

    assert.equal(result.status, 'dead_letter');
    assert.equal(result.errorClassification, 'PERMANENT');
    assert.equal(deadLetterRegistry.length, initialDeadLetters + 1);

    const latestDeadLetter = deadLetterRegistry[deadLetterRegistry.length - 1];
    assert.equal(latestDeadLetter.originalJob.jobId, 'job_perm_01');
    assert.equal(latestDeadLetter.errorClassification, 'PERMANENT');
    assert.match(latestDeadLetter.errorMessage, /Permission denied/);
  });
});

describe('Webhook Security — Signature Verification & Replay Protection', () => {
  const secret = 'test_secret_key_mock_123456';

  test('verifyPaystackWebhook validates authentic HMAC signatures', () => {
    process.env.PAYSTACK_SECRET_KEY = secret;
    const payload = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'trx_paystack_valid_100', amount: 50000000 },
    });

    const validSignature = crypto
      .createHmac('sha512', secret)
      .update(payload)
      .digest('hex');

    const isValid = verifyPaystackWebhook(payload, validSignature);
    assert.equal(isValid, true, 'Authentic HMAC signature must verify');
  });

  test('verifyPaystackWebhook rejects tampered or forged payloads', () => {
    process.env.PAYSTACK_SECRET_KEY = secret;
    const payload = JSON.stringify({ event: 'charge.success', data: { reference: 'trx_001' } });
    const forgedSignature = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';

    assert.equal(verifyPaystackWebhook(payload, forgedSignature), false, 'Forged signature must fail');
    assert.equal(verifyPaystackWebhook(payload, ''), false, 'Empty signature must fail');
  });
});
