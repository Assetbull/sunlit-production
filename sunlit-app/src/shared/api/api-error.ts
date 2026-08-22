import { NextResponse } from 'next/server';

/**
 * Standardized API Error Response
 *
 * Implements ERROR_STANDARD_OS.md — all API errors follow a consistent,
 * machine-readable, client-safe format.
 *
 * Errors MUST:
 * - Be predictable and machine-readable
 * - Be safe for clients (no internal details leaked)
 * - Contain correlation identifiers for tracing
 * - Distinguish validation from authorization from server failure
 *
 * Errors MUST NOT:
 * - Expose internal database errors
 * - Expose stack traces
 * - Expose secrets or internal service topology
 */

export type ApiErrorCode =
  // Authentication
  | 'AUTH_REQUIRED'
  | 'SESSION_EXPIRED'
  | 'SESSION_INVALID'
  // Authorization
  | 'PERMISSION_DENIED'
  | 'ROLE_MISSING'
  | 'ROLE_UNAUTHORIZED'
  // Validation
  | 'VALIDATION_FAILED'
  | 'INVALID_INPUT'
  | 'MISSING_FIELD'
  // Resource
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'ALREADY_EXISTS'
  // State
  | 'INVALID_STATE_TRANSITION'
  | 'RESOURCE_LOCKED'
  // Rate Limiting
  | 'RATE_LIMITED'
  // Financial
  | 'PAYMENT_FAILED'
  | 'INSUFFICIENT_FUNDS'
  | 'AMOUNT_MISMATCH'
  // Security & Webhooks
  | 'INVALID_SIGNATURE'
  | 'IDEMPOTENCY_CONFLICT'
  // Server
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'DEPENDENCY_UNAVAILABLE'
  | 'DEPENDENCY_FAILURE';

export interface ApiErrorResponse {
  error: string;
  code: ApiErrorCode;
  correlation_id: string;
  details?: Record<string, unknown>;
}

/**
 * Creates a standardized error NextResponse.
 *
 * Usage:
 * ```ts
 * return apiError(correlationId, 401, 'AUTH_REQUIRED', 'Authentication is required.');
 * ```
 */
export function apiError(
  correlationId: string,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>,
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    error: message,
    code,
    correlation_id: correlationId,
  };
  if (details) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

/**
 * Creates a standardized success NextResponse.
 *
 * Usage:
 * ```ts
 * return apiSuccess(correlationId, { bid_id: '...' });
 * ```
 */
export function apiSuccess<T extends Record<string, unknown>>(
  correlationId: string,
  data: T,
  status: number = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      correlation_id: correlationId,
      ...data,
    },
    { status },
  );
}

/**
 * Safely wraps an API handler with standardized error handling.
 * Catches all unhandled exceptions and returns a safe error response.
 *
 * SECURITY: Never exposes internal error details, stack traces, or
 * database error messages to clients.
 */
export function safeApiHandler(
  correlationId: string,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  return handler().catch((e: unknown) => {
    // Log the full error for operational debugging
    console.error(`[API] Unhandled error [${correlationId}]:`, e);

    // Return safe error to client — no internal details
    return apiError(
      correlationId,
      500,
      'INTERNAL_ERROR',
      'An unexpected error occurred. Please try again.',
    );
  });
}
