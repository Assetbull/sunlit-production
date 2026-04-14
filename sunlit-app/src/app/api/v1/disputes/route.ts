import { NextResponse } from 'next/server';
import { DisputeSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * POST /api/v1/disputes
 *
 * Raises a dispute on a project/escrow.
 * Auth: Required
 * RBAC: Requires 'raise:dispute' permission
 *
 * CRITICAL: Creating a dispute MUST block escrow release (GEMINI.md §4).
 *   IF dispute == TRUE → BLOCK
 *
 * Flow:
 *   1. Validate dispute payload
 *   2. Generate unique Case ID
 *   3. Create dispute record (links to escrow)
 *   4. Update escrow status to 'disputed' — BLOCKS release
 *   5. Emit dispute_created event
 *   6. Audit log
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'raise:dispute' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = DisputeSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.format(),
                    correlation_id: guardCtx.correlationId,
                },
                { status: 400 }
            );
        }

        const { project_id, escrow_id, reason } = validation.data;

        // === Generate Case ID ===
        const caseId = `DSP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        let disputeRecord = null;

        if (supabaseUrl && supabaseKey
            && !supabaseUrl.includes('your-project-id')
            && !supabaseKey.includes('your-service-role-key')) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const dataService = new DataService(supabase);
            const eventBus = new EventBus(dataService);
            const auditLogger = new AuditLogger(dataService);

            const auditCtx = {
                user_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                ip_address: guardCtx.ipAddress,
            };

            // === Create dispute record ===
            disputeRecord = await dataService.create(
                'disputes',
                {
                    project_id,
                    escrow_id,
                    raised_by: guardCtx.userId,
                    reason,
                    case_id: caseId,
                    is_resolved: false,
                },
                auditCtx
            );

            // === CRITICAL: Block escrow release by setting status to 'disputed' ===
            await dataService.update(
                'escrow',
                { id: escrow_id },
                { status: 'disputed' },
                auditCtx
            );

            // === Emit dispute_created event (GEMINI.md §5) ===
            await eventBus.emit('dispute_created', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                dispute_id: disputeRecord?.id,
                case_id: caseId,
                project_id,
                escrow_id,
            });

            // === Audit log ===
            await auditLogger.log({
                user_id: guardCtx.userId,
                action_type: 'dispute.create',
                correlation_id: guardCtx.correlationId,
                payload: {
                    project_id,
                    escrow_id,
                    case_id: caseId,
                    reason,
                },
                ip_address: guardCtx.ipAddress,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Dispute recorded. Escrow locked.',
            case_id: caseId,
            dispute_id: disputeRecord?.id || null,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Dispute error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
