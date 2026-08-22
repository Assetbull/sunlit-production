import { NextRequest } from 'next/server';
import { handleEngineeringRoute } from '@/app/api/engineering/_shared/handler';

/**
 * V3 Engineering API — energy-yield
 * POST /api/engineering/solar/yield
 * Semantic route alias forwarding to the shared calculation engine.
 * Rate-limited: 60 req/min per IP. Safe error responses — no stack traces.
 * Equivalent to: POST /api/tools/calculate { toolId: "energy-yield", inputData: {...} }
 */
export async function POST(req: NextRequest) {
  return handleEngineeringRoute(req, 'energy-yield');
}
