import { NextResponse } from 'next/server';
import { sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { StateMachineEngine } from '@/core/state-machine/engine';

/**
 * POST /api/v1/contracts/[id]/sign
 *
 * Signs a contract (installer or project owner).
 * Auth: Required
 * RBAC: Requires 'sign:contract'
 *
 * State Machine: CONTRACT_CREATED → CONTRACT_SIGNED
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'sign:contract' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { id: contractId } = await params;

    try {
        // State machine enforcement
        StateMachineEngine.enforceRfqTransition('CONTRACT_CREATED', 'CONTRACT_SIGNED');

        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Contract signed (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        // Fetch contract to verify existence
        const contract = await ctx.dataService.findOne('contracts', { id: contractId });
        if (!contract) {
            return NextResponse.json(
                { error: 'Contract not found.', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        // Verify party ownership (only project owner or installer party can sign)
        if (contract.owner_id && contract.installer_id) {
            const isParty = contract.owner_id === guardCtx.userId || contract.installer_id === guardCtx.userId || guardCtx.userRole === 'admin';
            if (!isParty) {
                return NextResponse.json(
                    { error: 'Forbidden. Only authorized contract signatories can sign this contract.', correlation_id: guardCtx.correlationId },
                    { status: 403 }
                );
            }
        }

        // Update contract status
        await ctx.dataService.update('contracts', { id: contractId }, {
            status: 'signed', signed_at: new Date().toISOString(),
        }, auditCtx);

        // Emit event
        await ctx.eventBus.emit('contract_signed', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, contract_id: contractId,
            project_id: contract.project_id,
        });

        // Audit
        await ctx.auditLogger.log({
            user_id: guardCtx.userId, action_type: 'contract.sign',
            correlation_id: guardCtx.correlationId,
            payload: { contract_id: contractId },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true, message: 'Contract signed.',
            contract_id: contractId, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Contract sign error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
