/**
 * Centralized Idempotency Engine
 *
 * Implements PAYMENT_ENGINE_OS.md, SUNLIT_KERNEL.md, and EVENT_STANDARD_OS.md.
 * Provides database-backed mutation locking, deduplication, and deterministic response replay.
 *
 * Security Properties:
 * 1. Double-execution prevention for payments, bids, contracts, and state transitions.
 * 2. SHA-256 request payload hashing to detect payload tampering on replayed keys.
 * 3. Lock acquisition with configurable TTL expiration.
 */

import crypto from 'crypto';
import { DataService } from '@/shared/api/data-service';

export interface IdempotencyResult {
  isReplay: boolean;
  cachedResponse?: {
    statusCode: number;
    body: Record<string, unknown>;
  };
  lockAcquired: boolean;
  error?: string;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Computes deterministic SHA-256 hash of a request payload.
 */
export function computeRequestHash(payload: unknown): string {
  const serialized = JSON.stringify(payload || {}, Object.keys(payload || {}).sort());
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * In-memory fallback store for development/testing when live database is unavailable.
 */
const inMemoryStore = new Map<string, {
  requestHash: string;
  statusCode?: number;
  responseBody?: Record<string, unknown>;
  status: 'in_progress' | 'completed' | 'failed';
  expiresAt: number;
}>();

/**
 * Checks an idempotency key before performing a state mutation.
 * If key already completed with same hash, returns the cached response.
 * If key is in progress, blocks concurrent execution.
 * Otherwise, acquires the lock for execution.
 */
export async function acquireIdempotencyLock(
  dataService: DataService | null,
  key: string,
  endpoint: string,
  payload: unknown,
  userId?: string,
  organizationId?: string,
  ttlMs = DEFAULT_TTL_MS
): Promise<IdempotencyResult> {
  if (!key || key.trim() === '') {
    // If no idempotency key was supplied, allow execution without caching
    return { isReplay: false, lockAcquired: true };
  }

  const requestHash = computeRequestHash(payload);
  const now = Date.now();
  const expiresAt = new Date(now + ttlMs).toISOString();

  // If live database is available
  if (dataService) {
    try {
      const existing = await dataService.findOne('idempotency_keys', { key });

      if (existing) {
        // Verify expiration
        const recordExpiry = new Date(existing.expires_at).getTime();
        if (recordExpiry > now) {
          // Payload mismatch check (tampering defense)
          if (existing.request_hash !== requestHash) {
            return {
              isReplay: false,
              lockAcquired: false,
              error: 'IDEMPOTENCY_PAYLOAD_MISMATCH: Key already used with different request payload.',
            };
          }

          if (existing.status === 'completed') {
            return {
              isReplay: true,
              lockAcquired: false,
              cachedResponse: {
                statusCode: existing.response_code || 200,
                body: (existing.response_body as Record<string, unknown>) || {},
              },
            };
          }

          if (existing.status === 'in_progress') {
            return {
              isReplay: false,
              lockAcquired: false,
              error: 'IDEMPOTENCY_IN_PROGRESS: Operation currently processing. Please retry shortly.',
            };
          }
        }
      }

      // Insert new lock
      await dataService.create('idempotency_keys', {
        key,
        user_id: userId || null,
        organization_id: organizationId || null,
        endpoint,
        request_hash: requestHash,
        status: 'in_progress',
        expires_at: expiresAt,
      });

      return { isReplay: false, lockAcquired: true };
    } catch (err: any) {
      if (err?.message?.includes('duplicate key') || err?.code === '23505' || err?.message?.includes('unique constraint')) {
        return {
          isReplay: false,
          lockAcquired: false,
          error: 'IDEMPOTENCY_IN_PROGRESS: Operation currently processing. Please retry shortly.',
        };
      }
      // Fallback to in-memory store if DB query fails or mock mode
    }
  }

  // === In-Memory Fallback ===
  const memExisting = inMemoryStore.get(key);
  if (memExisting && memExisting.expiresAt > now) {
    if (memExisting.requestHash !== requestHash) {
      return {
        isReplay: false,
        lockAcquired: false,
        error: 'IDEMPOTENCY_PAYLOAD_MISMATCH: Key already used with different request payload.',
      };
    }

    if (memExisting.status === 'completed') {
      return {
        isReplay: true,
        lockAcquired: false,
        cachedResponse: {
          statusCode: memExisting.statusCode || 200,
          body: memExisting.responseBody || {},
        },
      };
    }

    if (memExisting.status === 'in_progress') {
      return {
        isReplay: false,
        lockAcquired: false,
        error: 'IDEMPOTENCY_IN_PROGRESS: Operation currently processing.',
      };
    }
  }

  inMemoryStore.set(key, {
    requestHash,
    status: 'in_progress',
    expiresAt: now + ttlMs,
  });

  return { isReplay: false, lockAcquired: true };
}

/**
 * Commits completed response to the idempotency key record.
 */
export async function completeIdempotency(
  dataService: DataService | null,
  key: string,
  statusCode: number,
  responseBody: Record<string, unknown>
): Promise<void> {
  if (!key) return;

  if (dataService) {
    try {
      await dataService.update(
        'idempotency_keys',
        { key },
        {
          status: 'completed',
          response_code: statusCode,
          response_body: responseBody,
        }
      );
    } catch {
      // Ignore fallback
    }
  }

  const mem = inMemoryStore.get(key);
  if (mem) {
    mem.status = 'completed';
    mem.statusCode = statusCode;
    mem.responseBody = responseBody;
  }
}

/**
 * Releases or marks an idempotency lock as failed on exception.
 */
export async function releaseIdempotencyLock(
  dataService: DataService | null,
  key: string
): Promise<void> {
  if (!key) return;

  if (dataService) {
    try {
      await dataService.delete('idempotency_keys', { key });
    } catch {
      // Ignore fallback
    }
  }

  inMemoryStore.delete(key);
}
