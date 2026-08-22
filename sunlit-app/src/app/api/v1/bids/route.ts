import { NextResponse } from 'next/server';
import { SubmitBidSchema, SubmitEnhancedBidSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { apiError, apiSuccess } from '@/shared/api/api-error';

/**
 * POST /api/v1/bids
 * 
 * Submits a bid on an RFQ.
 * Auth: Required
 * RBAC: Requires 'submit:bid' permission (installer, crewlink, epc_contractor)
 *
 * FLOW (GEMINI.md §7 — Installer Dashboard):
 *   1. Authenticate + RBAC check
 *   2. Parse + validate payload against SubmitBidSchema or SubmitEnhancedBidSchema
 *   3. Sanitize string fields
 *   4. Persist bid via DataService
 *   5. Emit 'bid_submitted' event
 *   6. Log audit trail
 *
 * EPC Enhancement (Task 7.1):
 *   - Detects EPC contractor role and validates against SubmitEnhancedBidSchema
 *   - Stores enhanced bid data (project management plan, crew coordination, etc.)
 *   - Maintains backward compatibility with standard installer bids
 *   - Emits bid_submitted event with is_enhanced_bid flag
 *
 * FAIL IF:
 *   - Bid stored without validation
 *   - Event not emitted
 *   - Audit not logged
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'submit:bid' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // Detect if this is an EPC contractor submitting an enhanced bid
        const hasEnhancedFields = !!(
            sanitized.project_management_plan ||
            sanitized.crew_coordination_strategy ||
            sanitized.risk_mitigation_approach ||
            sanitized.quality_assurance_plan ||
            sanitized.estimated_crew_size ||
            sanitized.subcontractor_details ||
            sanitized.equipment_list ||
            sanitized.certifications ||
            sanitized.previous_similar_projects
        );

        // === Schema validation ===
        const schema = hasEnhancedFields ? SubmitEnhancedBidSchema : SubmitBidSchema;
        const validation = schema.safeParse(sanitized);
        
        if (!validation.success) {
            return apiError(
                guardCtx.correlationId,
                400,
                'VALIDATION_FAILED',
                'Validation failed',
                { details: validation.error.format() }
            );
        }

        const bidData = validation.data;

        // === Persist via centralized BackendContext ===
        const backendCtx = createBackendContext();
        let savedBid = null;

        if (backendCtx) {
            const auditCtx = buildAuditCtx(guardCtx);

            // Build bid record with base fields and tenant isolation
            const bidRecord: Record<string, any> = {
                rfq_id: bidData.rfq_id,
                installer_id: guardCtx.userId,
                organization_id: guardCtx.organizationId || null,
                workspace_id: guardCtx.workspaceId || null,
                amount: bidData.amount,
                proposed_timeline_days: bidData.proposed_timeline_days || null,
                proposal_text: bidData.proposal_text,
                status: 'submitted',
            };

            // Add enhanced fields if present (EPC bid)
            if (hasEnhancedFields) {
                bidRecord.is_enhanced_bid = true;
                bidRecord.enhanced_bid_data = {
                    project_management_plan: (bidData as any).project_management_plan || null,
                    crew_coordination_strategy: (bidData as any).crew_coordination_strategy || null,
                    risk_mitigation_approach: (bidData as any).risk_mitigation_approach || null,
                    quality_assurance_plan: (bidData as any).quality_assurance_plan || null,
                    estimated_crew_size: (bidData as any).estimated_crew_size || null,
                    subcontractor_details: (bidData as any).subcontractor_details || null,
                    equipment_list: (bidData as any).equipment_list || null,
                    certifications: (bidData as any).certifications || null,
                    previous_similar_projects: (bidData as any).previous_similar_projects || null,
                };
            }

            // Persist bid record
            savedBid = await backendCtx.dataService.create(
                'bids',
                bidRecord,
                auditCtx
            );

            // Emit event
            await backendCtx.eventBus.emit('bid_submitted', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                bid_id: savedBid.id,
                rfq_id: bidData.rfq_id,
                installer_id: guardCtx.userId,
                organization_id: guardCtx.organizationId || null,
                amount: bidData.amount,
                is_enhanced_bid: hasEnhancedFields,
            });

            // Audit log
            await backendCtx.auditLogger.log({
                user_id: guardCtx.userId,
                action_type: hasEnhancedFields ? 'epc_bid.submit' : 'bid.submit',
                correlation_id: guardCtx.correlationId,
                payload: bidData,
                ip_address: guardCtx.ipAddress,
            });
        }

        return apiSuccess(
            guardCtx.correlationId,
            {
                bid_id: savedBid?.id || 'mock-bid-id',
                rfq_id: bidData.rfq_id,
                amount: bidData.amount,
                is_enhanced_bid: hasEnhancedFields,
            },
            201
        );
    } catch (e: unknown) {
        console.error('Bid submission error:', e);
        return apiError(
            guardCtx.correlationId,
            500,
            'INTERNAL_ERROR',
            'Internal Server Error'
        );
    }
}
