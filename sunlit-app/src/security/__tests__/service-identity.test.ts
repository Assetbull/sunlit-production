/**
 * Sunlit Security — Service Identity Registry Test Suite
 *
 * Tests machine-to-machine identity, Allowed Operations Manifest enforcement,
 * and zero-trust service boundaries per SERVICE_IDENTITY_REGISTRY_OS.md (Registry ID 63).
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getRegisteredServiceIdentity,
  isServiceOperationAllowed,
  enforceServiceOperation,
  CANONICAL_SERVICE_IDENTITIES,
} from '../../core/identity/service-identity';

describe('Service Identity Registry — Lookup & Validation', () => {
  test('Registered canonical service identities resolve successfully', () => {
    const webhookService = getRegisteredServiceIdentity('system:payment_webhook');
    assert.ok(webhookService, 'system:payment_webhook must be registered');
    assert.equal(webhookService?.isActive, true);
    assert.equal(webhookService?.classification, 'SHARED');

    const cronService = getRegisteredServiceIdentity('system:cron_job');
    assert.ok(cronService, 'system:cron_job must be registered');
    assert.equal(cronService?.isActive, true);

    const archiverService = getRegisteredServiceIdentity('system:audit_archiver');
    assert.ok(archiverService, 'system:audit_archiver must be registered');
    assert.equal(archiverService?.classification, 'TIER_0');
  });

  test('Unregistered service identity returns null', () => {
    assert.equal(getRegisteredServiceIdentity('unregistered_rogue_worker'), null);
    assert.equal(getRegisteredServiceIdentity(''), null);
    assert.equal(getRegisteredServiceIdentity('system:fake_service'), null);
  });
});

describe('Service Identity Registry — Allowed Operations Manifest Enforcement', () => {
  test('Payment webhook service is allowed its registered operations', () => {
    assert.equal(
      isServiceOperationAllowed('system:payment_webhook', 'payments:update_status'),
      true
    );
    assert.equal(
      isServiceOperationAllowed('system:payment_webhook', 'escrow:fund'),
      true
    );
    assert.equal(
      isServiceOperationAllowed('system:payment_webhook', 'audit:log'),
      true
    );
  });

  test('Payment webhook service is DENIED operations outside its manifest', () => {
    assert.equal(
      isServiceOperationAllowed('system:payment_webhook', 'rfq:expire_stale'),
      false,
      'Payment webhook must not execute cron jobs'
    );
    assert.equal(
      isServiceOperationAllowed('system:payment_webhook', 'admin:delete_user'),
      false,
      'Payment webhook must not delete users'
    );
  });

  test('Cron job worker is constrained to scheduled tasks', () => {
    assert.equal(
      isServiceOperationAllowed('system:cron_job', 'rfq:expire_stale'),
      true
    );
    assert.equal(
      isServiceOperationAllowed('system:cron_job', 'escrow:fund'),
      false,
      'Cron job must not directly fund escrow'
    );
  });

  test('enforceServiceOperation throws on unauthorized machine action', () => {
    assert.throws(
      () => enforceServiceOperation('system:cron_job', 'escrow:fund'),
      /Service Authorization Denied/,
      'enforceServiceOperation must throw when action is outside manifest'
    );
  });

  test('enforceServiceOperation does NOT throw on permitted machine action', () => {
    assert.doesNotThrow(
      () => enforceServiceOperation('system:payment_webhook', 'payments:update_status'),
      'enforceServiceOperation must pass for allowed operations'
    );
  });
});

describe('Service Identity Registry — Registry Integrity', () => {
  test('All canonical service identities have non-empty allowed operations', () => {
    for (const [id, identity] of Object.entries(CANONICAL_SERVICE_IDENTITIES)) {
      assert.ok(identity.serviceId, `Service '${id}' must have serviceId`);
      assert.ok(identity.serviceName, `Service '${id}' must have serviceName`);
      assert.ok(Array.isArray(identity.allowedOperations), `Service '${id}' must have array of allowed operations`);
      assert.ok(identity.allowedOperations.length > 0, `Service '${id}' must have at least one allowed operation`);
    }
  });
});
