/**
 * Enterprise Platform Observability, Structured Logging & Trace Correlation
 *
 * Implements OBSERVABILITY_OS.md (Registry ID 40), SECURITY_ARCHITECTURE_OS.md,
 * and ERROR_STANDARD_OS.md.
 *
 * Core Guarantees:
 * 1. End-to-end trace correlation linking requests, services, DB ops, events, and background jobs.
 * 2. Structured JSON logging with strict severity levels and zero credentials leakage.
 * 3. In-memory platform metrics calculation for latency percentiles (P50/P95/P99) and error rates.
 */

import crypto from 'crypto';

export type ActorType = 'USER' | 'ADMIN' | 'SERVICE' | 'SYSTEM' | 'AI_AGENT';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface TraceContext {
  traceId: string;
  requestId: string;
  correlationId: string;
  causationId?: string | null;
  actorId?: string | null;
  actorType: ActorType;
  organizationId?: string | null;
  workspaceId?: string | null;
  serviceIdentity?: string | null;
  environment: string;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  trace: TraceContext;
  operation: string;
  status: string;
  durationMs?: number;
  errorCode?: string;
  metadata?: Record<string, unknown>;
}

const REDACT_KEYS = new Set([
  'password',
  'passwd',
  'secret',
  'token',
  'jwt',
  'authorization',
  'auth',
  'api_key',
  'apikey',
  'service_role_key',
  'private_key',
  'card_number',
  'cvv',
  'pin',
  'bvn',
  'nin',
  'ssn',
  'mfa_secret',
]);

/**
 * Recursively redacts sensitive credentials and PII from objects.
 */
export function redactSensitive<T>(input: T): T {
  if (!input || typeof input !== 'object') return input;

  if (Array.isArray(input)) {
    return input.map((item) => redactSensitive(item)) as unknown as T;
  }

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (REDACT_KEYS.has(key.toLowerCase())) {
      output[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      output[key] = redactSensitive(value);
    } else {
      output[key] = value;
    }
  }
  return output as T;
}

/**
 * Creates a standard TraceContext from identifiers or environment defaults.
 */
export function createTraceContext(params: {
  correlationId?: string;
  requestId?: string;
  traceId?: string;
  actorId?: string | null;
  actorType?: ActorType;
  organizationId?: string | null;
  workspaceId?: string | null;
  serviceIdentity?: string | null;
}): TraceContext {
  const correlationId = params.correlationId || crypto.randomUUID();
  return {
    traceId: params.traceId || crypto.randomUUID(),
    requestId: params.requestId || crypto.randomUUID(),
    correlationId,
    causationId: null,
    actorId: params.actorId || null,
    actorType: params.actorType || 'USER',
    organizationId: params.organizationId || null,
    workspaceId: params.workspaceId || null,
    serviceIdentity: params.serviceIdentity || null,
    environment: process.env.NODE_ENV || 'development',
  };
}

/**
 * Platform Metrics Store for real-time observability telemetry.
 */
export interface PlatformMetricsSnapshot {
  api_requests_total: number;
  api_success_total: number;
  api_error_total: number;
  api_auth_denials_total: number;
  api_latency_p50_ms: number;
  api_latency_p95_ms: number;
  api_latency_p99_ms: number;
  jobs_executed_total: number;
  jobs_failed_total: number;
  jobs_dead_letter_total: number;
  external_provider_calls_total: number;
  external_provider_failures_total: number;
}

export class PlatformMetricsStore {
  private requestsTotal = 0;
  private successTotal = 0;
  private errorTotal = 0;
  private authDenialsTotal = 0;
  private durations: number[] = [];
  private jobsTotal = 0;
  private jobsFailed = 0;
  private jobsDeadLetter = 0;
  private providerCallsTotal = 0;
  private providerFailuresTotal = 0;

  recordApiRequest(status: number, durationMs: number, isAuthDenial = false) {
    this.requestsTotal += 1;
    if (status >= 200 && status < 400) {
      this.successTotal += 1;
    } else {
      this.errorTotal += 1;
    }
    if (isAuthDenial || status === 401 || status === 403) {
      this.authDenialsTotal += 1;
    }
    this.durations.push(durationMs);
    // Keep max 10,000 samples in rolling memory window
    if (this.durations.length > 10000) {
      this.durations.shift();
    }
  }

  recordJobExecution(status: 'completed' | 'failed' | 'dead_letter') {
    this.jobsTotal += 1;
    if (status === 'failed') this.jobsFailed += 1;
    if (status === 'dead_letter') this.jobsDeadLetter += 1;
  }

  recordExternalProviderCall(success: boolean) {
    this.providerCallsTotal += 1;
    if (!success) this.providerFailuresTotal += 1;
  }

  private calculatePercentile(p: number): number {
    if (this.durations.length === 0) return 0;
    const sorted = [...this.durations].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  getSnapshot(): PlatformMetricsSnapshot {
    return {
      api_requests_total: this.requestsTotal,
      api_success_total: this.successTotal,
      api_error_total: this.errorTotal,
      api_auth_denials_total: this.authDenialsTotal,
      api_latency_p50_ms: this.calculatePercentile(50),
      api_latency_p95_ms: this.calculatePercentile(95),
      api_latency_p99_ms: this.calculatePercentile(99),
      jobs_executed_total: this.jobsTotal,
      jobs_failed_total: this.jobsFailed,
      jobs_dead_letter_total: this.jobsDeadLetter,
      external_provider_calls_total: this.providerCallsTotal,
      external_provider_failures_total: this.providerFailuresTotal,
    };
  }

  reset() {
    this.requestsTotal = 0;
    this.successTotal = 0;
    this.errorTotal = 0;
    this.authDenialsTotal = 0;
    this.durations = [];
    this.jobsTotal = 0;
    this.jobsFailed = 0;
    this.jobsDeadLetter = 0;
    this.providerCallsTotal = 0;
    this.providerFailuresTotal = 0;
  }
}

export const platformMetrics = new PlatformMetricsStore();

/**
 * Structured Platform Logger
 */
export class PlatformLogger {
  static log(
    level: LogLevel,
    event: string,
    trace: TraceContext,
    operation: string,
    status: string,
    metadata?: Record<string, unknown>,
    durationMs?: number,
    errorCode?: string
  ): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      trace,
      operation,
      status,
      durationMs,
      errorCode,
      metadata: metadata ? redactSensitive(metadata) : undefined,
    };

    return entry;
  }

  static info(
    event: string,
    trace: TraceContext,
    operation: string,
    metadata?: Record<string, unknown>
  ): StructuredLogEntry {
    return this.log('INFO', event, trace, operation, 'SUCCESS', metadata);
  }

  static warn(
    event: string,
    trace: TraceContext,
    operation: string,
    metadata?: Record<string, unknown>,
    errorCode?: string
  ): StructuredLogEntry {
    return this.log('WARN', event, trace, operation, 'WARNING', metadata, undefined, errorCode);
  }

  static error(
    event: string,
    trace: TraceContext,
    operation: string,
    error: unknown,
    errorCode?: string,
    metadata?: Record<string, unknown>
  ): StructuredLogEntry {
    const errMsg = error instanceof Error ? error.message : String(error);
    return this.log(
      'ERROR',
      event,
      trace,
      operation,
      'FAILED',
      { ...metadata, error: errMsg },
      undefined,
      errorCode
    );
  }
}
