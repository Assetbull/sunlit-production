import { NextRequest, NextResponse } from 'next/server';
import { runEngineeringCalculation } from '@/lib/engineering/engine';
import { inMemoryRateLimiter } from '@/lib/engineering/core/rateLimiter';
import { generateCorrelationId, metricsStore } from '@/lib/engineering/core/observability';
import { getErrorDetail } from '@/lib/engineering/core/errorTaxonomy';

// Strict allowlist of valid tool identifiers
const VALID_TOOL_IDS = new Set([
  'battery-capacity',
  'inverter-sizing',
  'solar-panel-sizing',
  'solar-system-sizing',
  'load-calculator',
  'solar-appliance-load',
  'cable-sizing',
  'pv-configuration',
  'energy-yield',
  'solar-savings',
  'roi-calculator',
]);

const MAX_PAYLOAD_BYTES = 1024 * 1024; // 1 MB limit

// Safe error response — never leaks internal details, paths, or stack traces
const safeError = (
  message: string,
  status: number,
  correlationId: string,
  errorCode = 'INVALID_INPUT'
) =>
  NextResponse.json(
    {
      error: message,
      code: errorCode,
      correlation_id: correlationId,
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Correlation-Id': correlationId,
      },
    }
  );

export async function POST(req: NextRequest) {
  const correlationId = generateCorrelationId();
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous-client';

  // 1. Rate Limiting Check (in-memory sliding window, 60 req/min per IP)
  const isAllowed = await inMemoryRateLimiter.check(clientIp, 60, 60);
  if (!isAllowed) {
    metricsStore.recordRateLimited();
    const err = getErrorDetail('RATE_LIMITED');
    return safeError(err.publicMessage, 429, correlationId, err.code);
  }

  // 2. Reject non-JSON content types immediately
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

  // 4. Type guards
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return safeError('Request body must be a JSON object', 400, correlationId, 'INVALID_INPUT');
  }

  const { toolId, inputData } = body as Record<string, unknown>;

  // 5. Validate toolId
  if (typeof toolId !== 'string' || toolId.trim().length === 0) {
    return safeError('Missing or invalid field: toolId must be a non-empty string', 400, correlationId, 'MISSING_INPUT');
  }
  if (!VALID_TOOL_IDS.has(toolId)) {
    return safeError(`Unknown tool: "${toolId}". Valid tools: ${[...VALID_TOOL_IDS].join(', ')}`, 400, correlationId, 'UNRECOGNIZED_TOOL');
  }

  // 6. inputData must be an object
  if (typeof inputData !== 'object' || inputData === null || Array.isArray(inputData)) {
    return safeError('Missing or invalid field: inputData must be a JSON object', 400, correlationId, 'MISSING_INPUT');
  }

  try {
    const result = runEngineeringCalculation(toolId, inputData as Record<string, unknown>, correlationId);
    return NextResponse.json(
      {
        ...result,
        correlation_id: correlationId,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
          'X-Correlation-Id': correlationId,
        },
      }
    );
  } catch (error: unknown) {
    // Log internally without leaking sensitive details
    console.error('[engineering-api] Calculation error:', {
      toolId,
      correlationId,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });
    const err = getErrorDetail('INTERNAL_ERROR');
    return safeError(err.publicMessage, 500, correlationId, err.code);
  }
}
