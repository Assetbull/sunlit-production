import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { FUTURE_DOMAINS_ENABLED } from '@/config/features';

/**
 * GET /api/v1/suppliers
 * POST /api/v1/suppliers
 *
 * FUTURE DOMAIN PASSIVE API
 * According to GEMINI.md, this domain is explicitly feature-flagged OFF until Sprint 7+.
 */
export async function GET(req: Request) {
    if (!FUTURE_DOMAINS_ENABLED) {
        return NextResponse.json({ error: 'Supply Chain domain is currently offline.' }, { status: 403 });
    }

    const guard = await apiGuard(req, { requiredPermission: 'view:marketplace' });
    if (guard instanceof NextResponse) return guard;

    return NextResponse.json({ success: true, suppliers: [], message: 'Passive mode active.' });
}

export async function POST(req: Request) {
    if (!FUTURE_DOMAINS_ENABLED) {
        return NextResponse.json({ error: 'Supply Chain domain is currently offline.' }, { status: 403 });
    }

    const guard = await apiGuard(req, { requiredPermission: 'create:rfq' }); // Placeholder permission
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    return NextResponse.json({ success: true, message: 'Supplier integration pending.', correlation_id: guardCtx.correlationId });
}
