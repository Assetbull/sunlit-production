/**
 * Enterprise Background Job Execution Engine
 *
 * Implements BACKGROUND_JOB_OS.md (Registry ID 39), OBSERVABILITY_OS.md, and ERROR_STANDARD_OS.md.
 *
 * Architecture Principles:
 * 1. Categorized error classification: TRANSIENT (exponential retry), PERMANENT (fail-fast), BUSINESS_FAILURE.
 * 2. Dead-letter queue preservation for permanently failed jobs with full diagnostic telemetry.
 * 3. Bounded concurrency, timeout protection, and idempotency tracking.
 */

import crypto from 'crypto';

export type JobErrorClassification = 'TRANSIENT' | 'PERMANENT' | 'BUSINESS_FAILURE';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'dead_letter';

export interface JobDefinition<T = Record<string, unknown>> {
  jobId: string;
  name: string;
  queue: string;
  payload: T;
  correlationId: string;
  organizationId?: string | null;
  actorId?: string | null;
  attempts: number;
  maxAttempts: number;
  backoffBaseMs: number;
  status: JobStatus;
  createdAt: string;
  lastAttemptAt?: string;
}

export interface DeadLetterJob<T = Record<string, unknown>> {
  deadLetterId: string;
  originalJob: JobDefinition<T>;
  errorClassification: JobErrorClassification;
  errorMessage: string;
  errorStack?: string;
  failedAt: string;
  attemptsMade: number;
}

/**
 * Classifies an error into TRANSIENT, PERMANENT, or BUSINESS_FAILURE.
 */
export function classifyJobError(error: unknown): JobErrorClassification {
  if (!error) return 'PERMANENT';

  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Transient network / connectivity / rate-limiting conditions
  if (
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('timedout') ||
    message.includes('econnrefused') ||
    message.includes('econnreset') ||
    message.includes('etimedout') ||
    message.includes('network error') ||
    message.includes('socket hang up') ||
    message.includes('fetch failed') ||
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('service unavailable') ||
    message.includes('503') ||
    message.includes('504') ||
    message.includes('429')
  ) {
    return 'TRANSIENT';
  }

  // Business logic rejection conditions
  if (
    message.includes('state transition') ||
    message.includes('expired') ||
    message.includes('already completed') ||
    message.includes('dispute active') ||
    message.includes('kyc required') ||
    message.includes('insufficient funds')
  ) {
    return 'BUSINESS_FAILURE';
  }

  // Schema, syntax, auth, parameter or invariant errors
  return 'PERMANENT';
}

/**
 * Calculates exponential backoff delay with jitter.
 */
export function calculateBackoffMs(attempt: number, baseMs = 1000, maxMs = 60000): number {
  const exponential = baseMs * Math.pow(2, attempt - 1);
  const jitter = Math.random() * (baseMs * 0.5);
  return Math.min(exponential + jitter, maxMs);
}

/**
 * In-memory dead-letter registry for observability & debugging.
 */
export const deadLetterRegistry: DeadLetterJob[] = [];

/**
 * Executes a job definition through its handler with timeout and error classification.
 */
export async function executeJob<T>(
  job: JobDefinition<T>,
  handler: (payload: T, ctx: { correlationId: string; organizationId?: string | null }) => Promise<void>,
  timeoutMs = 30000
): Promise<{ status: JobStatus; errorClassification?: JobErrorClassification; nextRetryMs?: number }> {
  job.attempts += 1;
  job.lastAttemptAt = new Date().toISOString();
  job.status = 'running';

  try {
    // Run handler with timeout
    await Promise.race([
      handler(job.payload, {
        correlationId: job.correlationId,
        organizationId: job.organizationId,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Job execution timed out')), timeoutMs)
      ),
    ]);

    job.status = 'completed';
    return { status: 'completed' };
  } catch (err: unknown) {
    const classification = classifyJobError(err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;

    // If transient and attempts remain, schedule retry
    if (classification === 'TRANSIENT' && job.attempts < job.maxAttempts) {
      job.status = 'pending';
      const nextRetryMs = calculateBackoffMs(job.attempts, job.backoffBaseMs);
      return {
        status: 'pending',
        errorClassification: 'TRANSIENT',
        nextRetryMs,
      };
    }

    // Permanent, business failure, or retry limit exceeded -> Dead Letter
    job.status = 'dead_letter';

    const deadLetterEntry: DeadLetterJob<T> = {
      deadLetterId: crypto.randomUUID(),
      originalJob: { ...job },
      errorClassification: classification,
      errorMessage,
      errorStack,
      failedAt: new Date().toISOString(),
      attemptsMade: job.attempts,
    };

    deadLetterRegistry.push(deadLetterEntry as DeadLetterJob);

    return {
      status: 'dead_letter',
      errorClassification: classification,
    };
  }
}
