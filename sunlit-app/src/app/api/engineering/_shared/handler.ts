/**
 * V3 Engineering API Route Handler
 * Sunlit Enterprise Engineering Platform
 *
 * Shared handler used by all /api/engineering/solar/* routes.
 * Applies rate limiting, correlation IDs, safe error responses,
 * and forwards to runEngineeringCalculation.
 *
 * The existing /api/tools/calculate route is fully preserved.
 * These routes are semantic aliases for better API discoverability.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runEngineeringCalculation } from '@/lib/engineering/engine';
import { inMemoryRateLimiter } from '@/lib/engineering/core/rateLimiter';
import { generateCorrelationId, metricsStore } from '@/lib/engineering/core/observability';
import { getErrorDetail } from '@/lib/engineering/core/errorTaxonomy';
import { ENGINE_VERSION } from '@/lib/engineering/core/envelope';

const MAX_PAYLOAD_BYTES = 1024 * 1024; // 1 MB

const safeError = (
  message: string,
  status: number,
  correlationId: string,
  errorCode = 'INVALID_INPUT'
) =>
  NextResponse.json(
    { error: message, code: errorCode, correlation_id: correlationId },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Correlation-Id': correlationId,
        'X-Engine-Version': ENGINE_VERSION,
      },
    }
  );

/**
 * Shared POST handler for all V3 engineering routes.
 * @param req NextRequest
 * @param toolId The hardcoded tool ID for this route
 */
export async function handleEngineeringRoute(
  req: NextRequest,
  toolId: string
): Promise<NextResponse> {
  const correlationId = generateCorrelationId();
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous-client';

  // 1. Rate limiting
  const isAllowed = await inMemoryRateLimiter.check(clientIp, 60, 60);
  if (!isAllowed) {
    metricsStore.recordRateLimited();
    const err = getErrorDetail('RATE_LIMITED');
    return safeError(err.publicMessage, 429, correlationId, err.code);
  }

  // 2. Content-Type check
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return safeError('Content-Type must be application/json', 415, correlationId, 'INVALID_INPUT');
  }

  // 3. Payload size check
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    const err = getErrorDetail('REQUEST_TOO_LARGE');
    return safeError(err.publicMessage, 413, correlationId, err.code);
  }

  let body: unknown;
  try {
    const rawText = await req.text();
    if (rawText.length > MAX_PAYLOAD_BYTES) {
      const err = getErrorDetail('REQUEST_TOO_LARGE');
      return safeError(err.publicMessage, 413, correlationId, err.code);
    }
    body = JSON.parse(rawText);
  } catch {
    return safeError('Invalid JSON in request body', 400, correlationId, 'INVALID_INPUT');
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return safeError('Request body must be a JSON object', 400, correlationId, 'INVALID_INPUT');
  }

  // 4. Run calculation
  try {
    const result = runEngineeringCalculation(
      toolId,
      body as Record<string, unknown>,
      correlationId
    );
    return NextResponse.json(
      { ...result, correlation_id: correlationId },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'X-Correlation-Id': correlationId,
          'X-Engine-Version': ENGINE_VERSION,
        },
      }
    );
  } catch (error: unknown) {
    console.error(`[engineering-api][${toolId}] Calculation error:`, {
      toolId,
      correlationId,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });
    const err = getErrorDetail('INTERNAL_ERROR');
    return safeError(err.publicMessage, 500, correlationId, err.code);
  }
}
