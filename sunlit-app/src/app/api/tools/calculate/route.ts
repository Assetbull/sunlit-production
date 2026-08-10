import { NextRequest, NextResponse } from 'next/server';
import { runEngineeringCalculation } from '@/lib/engineering/engine';

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

// Safe error response — never leaks internal details to clients
const safeError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: NextRequest) {
  // Reject non-JSON content types immediately
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return safeError('Content-Type must be application/json', 415);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return safeError('Invalid JSON in request body', 400);
  }

  // Type guard
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return safeError('Request body must be a JSON object', 400);
  }

  const { toolId, inputData } = body as Record<string, unknown>;

  // Validate toolId
  if (typeof toolId !== 'string' || toolId.trim().length === 0) {
    return safeError('Missing or invalid field: toolId must be a non-empty string', 400);
  }
  if (!VALID_TOOL_IDS.has(toolId)) {
    return safeError(`Unknown tool: "${toolId}". Valid tools: ${[...VALID_TOOL_IDS].join(', ')}`, 400);
  }

  // inputData must be an object (not array, not primitive)
  if (typeof inputData !== 'object' || inputData === null || Array.isArray(inputData)) {
    return safeError('Missing or invalid field: inputData must be a JSON object', 400);
  }

  try {
    const result = runEngineeringCalculation(toolId, inputData as Record<string, unknown>);
    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error: unknown) {
    // Log internally — never expose message to client
    console.error('[engineering-api] Calculation engine error:', {
      toolId,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      // Do NOT log error.message here if it might contain user-input data
    });
    return safeError('An internal calculation error occurred. Please review your inputs and try again.', 500);
  }
}
