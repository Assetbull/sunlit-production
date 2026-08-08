import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { FUTURE_DOMAINS_ENABLED } from '@/config/features';

/**
 * GET /api/v1/financing
 * POST /api/v1/financing
 *
 * FUTURE DOMAIN PASSIVE API
 * According to GEMINI.md, this domain (Solar Loans/Financing) is feature-flagged OFF.
 */
export async function GET(req: Request) {
    if (!FUTURE_DOMAINS_ENABLED) {
        return NextResponse.json({ error: 'Financing domain is currently offline.' }, { status: 403 });
    }

    const guard = await apiGuard(req, { requiredPermission: 'view:marketplace' });
    if (guard instanceof NextResponse) return guard;

    return NextResponse.json({ success: true, loans: [], message: 'Passive mode active.' });
}

export async function POST(req: Request) {
    if (!FUTURE_DOMAINS_ENABLED) {
        return NextResponse.json({ error: 'Financing domain is currently offline.' }, { status: 403 });
    }

    const guard = await apiGuard(req); 
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    return NextResponse.json({ success: true, message: 'Loan integration pending.', correlation_id: guardCtx.correlationId });
}
