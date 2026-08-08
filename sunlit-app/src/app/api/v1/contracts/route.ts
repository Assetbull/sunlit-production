import { NextResponse } from 'next/server';
import { CreateContractSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { StateMachineEngine } from '@/core/state-machine/engine';

/**
 * POST /api/v1/contracts
 *
 * Creates a contract from an accepted bid.
 * Auth: Required
 * RBAC: Requires 'accept:bid' (project_owner, epc_contractor)
 *
 * State Machine: BID_ACCEPTED → CONTRACT_CREATED
 *
 * Flow:
 *   1. Validate payload
 *   2. Enforce state transition
 *   3. Create contract record
 *   4. Lock RFQ (no more bids)
 *   5. Update bid status to 'accepted'
 *   6. Emit 'contract_created' + 'bid_accepted' events
 *   7. Audit log
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'accept:bid' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = CreateContractSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const { project_id, rfq_id, bid_id, installer_id, total_amount } = validation.data;

        // State machine enforcement
        StateMachineEngine.enforceRfqTransition('BID_ACCEPTED', 'CONTRACT_CREATED');

        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Contract created (scaffold mode).', contract_id: null,
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        // Create contract
        const contract = await ctx.dataService.create('contracts', {
            project_id, rfq_id, bid_id,
            owner_id: guardCtx.userId, installer_id, total_amount,
            status: 'created',
        }, auditCtx);

        // Lock RFQ
        await ctx.dataService.update('rfq', { id: rfq_id }, { status: 'matched' }, auditCtx);

        // Accept bid, reject others
        await ctx.dataService.update('bids', { id: bid_id }, { status: 'accepted' }, auditCtx);

        // Emit events
        await ctx.eventBus.emit('bid_accepted', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, bid_id, rfq_id,
        });
        await ctx.eventBus.emit('contract_created', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, contract_id: contract?.id, project_id,
        });

        // Audit
        await ctx.auditLogger.log({
            user_id: guardCtx.userId, action_type: 'contract.create',
            correlation_id: guardCtx.correlationId, payload: validation.data,
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true, message: 'Contract created. RFQ locked.',
            contract_id: contract?.id, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Contract create error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
