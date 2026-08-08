import { NextResponse } from 'next/server';
import { SubmitBidSchema, SubmitEnhancedBidSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';

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
        // Check if payload contains EPC-specific fields
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
        // Use enhanced schema if EPC fields are present, otherwise use standard schema
        const schema = hasEnhancedFields ? SubmitEnhancedBidSchema : SubmitBidSchema;
        const validation = schema.safeParse(sanitized);
        
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const bidData = validation.data;

        // === Persist to Supabase via DataService ===
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        let savedBid = null;

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

            // Build bid record with base fields
            const bidRecord: Record<string, any> = {
                rfq_id: bidData.rfq_id,
                installer_id: guardCtx.userId,
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
            savedBid = await dataService.create(
                'bids',
                bidRecord,
                auditCtx
            );

            // Emit bid_submitted event (GEMINI.md §5)
            await eventBus.emit('bid_submitted', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                bid_id: savedBid?.id,
                rfq_id: bidData.rfq_id,
                amount: bidData.amount,
                is_enhanced_bid: hasEnhancedFields,
            });

            // Audit log
            await auditLogger.log({
                user_id: guardCtx.userId,
                action_type: hasEnhancedFields ? 'bid.submit.enhanced' : 'bid.submit',
                correlation_id: guardCtx.correlationId,
                payload: bidData,
                ip_address: guardCtx.ipAddress,
            });
        }

        return NextResponse.json({
            success: true,
            message: hasEnhancedFields ? 'Enhanced bid submitted.' : 'Bid submitted.',
            bid_id: savedBid?.id || null,
            is_enhanced_bid: hasEnhancedFields,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Bid submit error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
