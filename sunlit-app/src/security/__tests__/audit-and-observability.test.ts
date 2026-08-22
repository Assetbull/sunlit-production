/**
 * Sunlit Security — Audit & Observability Hardening Test Suite
 *
 * Tests TraceContext propagation, structured logging, sensitive data redaction,
 * AuditLogger before/after state diffing, platform metrics percentiles, and health signals per:
 * - AUDIT_OS.md (Registry ID 38)
 * - OBSERVABILITY_OS.md (Registry ID 40)
 * - SECURITY_ARCHITECTURE_OS.md (Registry ID 35)
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  createTraceContext,
  redactSensitive,
  PlatformLogger,
  PlatformMetricsStore,
} from '../../core/observability/observability';

import {
  AuditLogger,
  computeStateDiff,
} from '../../core/audit/logger';

import {
  checkLiveness,
  checkReadiness,
  generateHealthReport,
} from '../../core/observability/health';

describe('Observability — TraceContext & Correlation', () => {
  test('createTraceContext generates standard correlation and trace IDs', () => {
    const trace = createTraceContext({
      actorId: 'usr_installer_007',
      actorType: 'USER',
      organizationId: 'org_epc_global',
      workspaceId: 'ws_kano_site',
      serviceIdentity: 'sunlit-installer-portal',
    });

    assert.equal(typeof trace.traceId, 'string');
    assert.equal(typeof trace.requestId, 'string');
    assert.equal(typeof trace.correlationId, 'string');
    assert.equal(trace.actorId, 'usr_installer_007');
    assert.equal(trace.actorType, 'USER');
    assert.equal(trace.organizationId, 'org_epc_global');
    assert.equal(trace.workspaceId, 'ws_kano_site');
    assert.equal(trace.serviceIdentity, 'sunlit-installer-portal');
  });

  test('TraceContext preserves existing correlationId when provided', () => {
    const customCorrelation = 'corr_inbound_upstream_12345';
    const trace = createTraceContext({ correlationId: customCorrelation });

    assert.equal(trace.correlationId, customCorrelation);
  });
});

describe('Observability — Structured Logging & Privacy Redaction', () => {
  test('redactSensitive recursively scrubs sensitive credentials', () => {
    const sensitivePayload = {
      action: 'kyc_verification_step',
      token: 'jwt.token.secret',
      nested: {
        password: 'PlainTextPassword!',
        api_key: 'sk_live_12345',
        card_number: '5399837492837482',
        bvn: '22223333444',
        safeProperty: 'solar_panel_450w',
      },
      tags: [{ secret: 'classified_key', visible: 'safe' }],
    };

    const redacted = redactSensitive(sensitivePayload);

    assert.equal(redacted.token, '[REDACTED]');
    assert.equal(redacted.nested.password, '[REDACTED]');
    assert.equal(redacted.nested.api_key, '[REDACTED]');
    assert.equal(redacted.nested.card_number, '[REDACTED]');
    assert.equal(redacted.nested.bvn, '[REDACTED]');
    assert.equal(redacted.nested.safeProperty, 'solar_panel_450w');
    assert.equal(redacted.tags[0].secret, '[REDACTED]');
    assert.equal(redacted.tags[0].visible, 'safe');
  });

  test('PlatformLogger generates structured JSON log entry without credentials', () => {
    const trace = createTraceContext({ actorId: 'usr_admin_1' });
    const logEntry = PlatformLogger.info('api.request.completed', trace, 'calculate_pv_sizing', {
      systemSizeKw: 25,
      token: 'secret_jwt_leaked_attempt',
    });

    assert.equal(logEntry.level, 'INFO');
    assert.equal(logEntry.event, 'api.request.completed');
    assert.equal(logEntry.operation, 'calculate_pv_sizing');
    assert.equal(logEntry.metadata?.systemSizeKw, 25);
    assert.equal(logEntry.metadata?.token, '[REDACTED]', 'Sensitive token must be redacted');
  });
});

describe('Observability — Platform Metrics Store', () => {
  test('PlatformMetricsStore accurately computes P50, P95, and P99 percentiles', () => {
    const metrics = new PlatformMetricsStore();

    // Record sample latencies: 10ms to 100ms
    for (let i = 1; i <= 100; i++) {
      metrics.recordApiRequest(200, i);
    }

    const snapshot = metrics.getSnapshot();
    assert.equal(snapshot.api_requests_total, 100);
    assert.equal(snapshot.api_success_total, 100);
    assert.equal(snapshot.api_error_total, 0);
    assert.equal(snapshot.api_latency_p50_ms, 50);
    assert.equal(snapshot.api_latency_p95_ms, 95);
    assert.equal(snapshot.api_latency_p99_ms, 99);
  });

  test('PlatformMetricsStore records error rates and security denials', () => {
    const metrics = new PlatformMetricsStore();
    metrics.recordApiRequest(200, 25);
    metrics.recordApiRequest(401, 15, true); // Auth denial
    metrics.recordApiRequest(500, 45); // Server error
    metrics.recordJobExecution('dead_letter');
    metrics.recordExternalProviderCall(false);

    const snapshot = metrics.getSnapshot();
    assert.equal(snapshot.api_requests_total, 3);
    assert.equal(snapshot.api_success_total, 1);
    assert.equal(snapshot.api_error_total, 2);
    assert.equal(snapshot.api_auth_denials_total, 1);
    assert.equal(snapshot.jobs_dead_letter_total, 1);
    assert.equal(snapshot.external_provider_failures_total, 1);
  });
});

describe('Audit Engine — State Diffing & Immutability', () => {
  test('computeStateDiff captures modified fields and values', () => {
    const prev = { status: 'draft', total_amount: 1500000, unChanged: 'const' };
    const next = { status: 'signed', total_amount: 1800000, unChanged: 'const' };

    const diff = computeStateDiff(prev, next);
    assert.ok(diff);
    assert.deepEqual(diff.modifiedFields, ['status', 'total_amount']);
    assert.deepEqual(diff.diff.status, { from: 'draft', to: 'signed' });
    assert.deepEqual(diff.diff.total_amount, { from: 1500000, to: 1800000 });
  });

  test('AuditLogger constructs cryptographic payload hash and redacts secrets', async () => {
    let capturedRow: any = null;
    const mockDataService = {
      create: async (_table: string, row: any) => {
        capturedRow = row;
        return { id: 'audit_row_123' };
      },
    } as any;

    const auditLogger = new AuditLogger(mockDataService);
    await auditLogger.log({
      user_id: 'usr_admin_99',
      actor_type: 'ADMIN',
      action_type: 'user.role_change',
      correlation_id: 'corr_role_update',
      organization_id: 'org_main',
      resource_type: 'user',
      resource_id: 'usr_target_01',
      previous_state: { role: 'installer', password: 'old_secret_pwd' },
      new_state: { role: 'admin', password: 'new_secret_pwd' },
      payload: { reason: 'promoted to system administrator', token: 'secret_jwt' },
    });

    assert.ok(capturedRow);
    assert.equal(capturedRow.user_id, 'usr_admin_99');
    assert.equal(capturedRow.action_type, 'user.role_change');
    assert.equal(typeof capturedRow.payload_hash, 'string');
    assert.equal(capturedRow.payload_hash.length, 64, 'SHA-256 length must be 64');
    assert.equal(capturedRow.metadata.actor_type, 'ADMIN');
    assert.equal(capturedRow.metadata.payload.token, '[REDACTED]');
    assert.deepEqual(capturedRow.metadata.state_diff.modifiedFields, ['role']);
  });
});

describe('Health & Diagnostic Signals — Liveness & Readiness', () => {
  test('checkLiveness returns healthy process memory status', () => {
    const liveness = checkLiveness();
    assert.ok(liveness.status === 'HEALTHY' || liveness.status === 'DEGRADED');
    assert.ok(liveness.memoryUsageMb > 0);
  });

  test('checkReadiness returns healthy readiness status', () => {
    const readiness = checkReadiness();
    assert.equal(readiness.status, 'HEALTHY');
    assert.equal(readiness.isReady, true);
  });

  test('generateHealthReport builds comprehensive safe report without secret leakage', async () => {
    const report = await generateHealthReport('23.0.0');

    assert.ok(report.status === 'HEALTHY' || report.status === 'DEGRADED');
    assert.equal(report.version, '23.0.0');
    assert.ok(typeof report.uptimeSeconds === 'number');
    assert.ok(report.checks.dependencies.service_registry);
    assert.ok(report.checks.dependencies.supabase);

    // Verify zero leaked secrets in serialized report
    const serialized = JSON.stringify(report);
    assert.equal(serialized.includes('service_role_key'), false);
    assert.equal(serialized.includes('postgres://'), false);
  });
});
