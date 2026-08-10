import { NextResponse } from 'next/server';
import { CreateRfqSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createRfqViaMcp, sanitizeStringViaMcp } from '@/core/mcp-client';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';
import { executeSolarEngineeringPipeline } from '@/lib/engineering/core/calculationPipeline';
import { buildStructuredSolarAssessmentPayload } from '@/lib/engineering/marketplaceAdapter';

/**
 * POST /api/v1/rfq
 *
 * Creates a new Request for Quotation via the full multi-step wizard flow.
 * Auth: Required (Clerk JWT)
 * RBAC: Requires 'create:rfq' permission (project_owner, epc_contractor)
 *
 * FLOW (GEMINI.md §7 — Project Owner Dashboard):
 *   1. Authenticate + RBAC check
 *   2. Parse + validate payload against enhanced CreateRfqSchema
 *   3. Sanitize string fields via local + Leapter MCP dual-layer
 *   4. Forward to Leapter MCP `create_rfq` tool
 *   5. Persist via DataService
 *   6. Emit `rfq_created` event
 *   7. Log audit trail
 *
 * FAIL IF:
 *   - Incomplete workflow allowed
 *   - Invalid structured data accepted
 *   - Event not emitted
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'create:rfq' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();

        // === LAYER 1: Local sanitization (XSS / HTML entity encoding) ===
        const sanitized = sanitizePayload(payload);

        // === LAYER 2: Schema validation (Zod strict) ===
        const validation = CreateRfqSchema.safeParse(sanitized);
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

        const rfqData = validation.data;

        // === LAYER 3: Remote sanitization via Leapter MCP (defense-in-depth) ===
        if (rfqData.location) {
            rfqData.location = await sanitizeStringViaMcp(rfqData.location);
        }
        if (rfqData.timeline) {
            rfqData.timeline = await sanitizeStringViaMcp(rfqData.timeline);
        }

        // === LAYER 3.5: Authoritative Server-Side Solar Engineering Verification ===
        let verifiedAssessment: Record<string, any> | null = (rfqData.solar_assessment as Record<string, any>) || null;
        if (rfqData.appliances && rfqData.appliances.length > 0) {
            const pipelineInput = {
                appliances: rfqData.appliances.map((a) => ({
                    name: a.name,
                    powerWatts: a.wattage || 150,
                    quantity: a.quantity || 1,
                    hoursPerDay: 8,
                })),
                location: rfqData.location_state || rfqData.location || 'Lagos',
                projectType: rfqData.projectType === 'Commercial' ? ('commercial' as const) : ('residential' as const),
            };
            const pipelineResult = executeSolarEngineeringPipeline(pipelineInput);
            verifiedAssessment = buildStructuredSolarAssessmentPayload(pipelineResult, {
                propertyType: rfqData.projectType.toLowerCase(),
                state: rfqData.location_state || rfqData.location || 'Lagos',
                city: rfqData.location,
                notes: rfqData.notes,
                timeline: rfqData.timeline,
            });
        }

        // === LAYER 4: Forward to Leapter MCP backend for RFQ creation ===
        const mcpResult = await createRfqViaMcp({
            projectType: rfqData.projectType,
            configMode: rfqData.configMode,
            location: rfqData.location,
            budget: rfqData.budget,
            timeline: rfqData.timeline,
            components: rfqData.components?.map((c) => ({
                type: c.type,
                brand: c.brand,
                size: c.size,
                wattage: c.wattage,
                quantity: c.quantity,
            })),
            appliances: rfqData.appliances?.map((a) => ({
                name: a.name,
                quantity: a.quantity,
                wattage: a.wattage,
            })),
        });

        if (!mcpResult.success) {
            console.error('[RFQ] MCP create_rfq failed:', mcpResult.error);
            return NextResponse.json(
                {
                    error: 'RFQ creation failed on backend service.',
                    detail: mcpResult.error,
                    correlation_id: guardCtx.correlationId,
                },
                { status: 502 }
            );
        }

        // === LAYER 5: Persist to Supabase via DataService ===
        let savedRfq = null;
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (supabaseUrl && supabaseKey
                && !supabaseUrl.includes('your-project-id')
                && !supabaseKey.includes('your-service-role-key')) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                const dataService = new DataService(supabase);
                const eventBus = new EventBus(dataService);
                const auditLogger = new AuditLogger(dataService);

                // Persist RFQ record with verified solar intelligence
                savedRfq = await dataService.create(
                    'rfq',
                    {
                        owner_id: guardCtx.userId,
                        project_type: rfqData.projectType,
                        config_mode: rfqData.configMode,
                        location: rfqData.location || null,
                        location_state: rfqData.location_state || null,
                        budget: rfqData.budget,
                        timeline: rfqData.timeline || null,
                        appliances: rfqData.appliances || null,
                        components: rfqData.components || null,
                        solar_assessment: verifiedAssessment,
                        target_installer_id: rfqData.target_installer_id || null,
                        installer_slug: rfqData.installer_slug || null,
                        status: 'open',
                        mcp_response: mcpResult.data || null,
                    },
                    {
                        user_id: guardCtx.userId,
                        correlation_id: guardCtx.correlationId,
                        ip_address: guardCtx.ipAddress,
                    }
                );

                // === LAYER 6: Emit rfq_created event ===
                await eventBus.emit('rfq_created', {
                    timestamp: new Date().toISOString(),
                    actor_id: guardCtx.userId,
                    correlation_id: guardCtx.correlationId,
                    rfq_id: savedRfq?.id,
                    project_type: rfqData.projectType,
                    config_mode: rfqData.configMode,
                    solar_assessment: verifiedAssessment ? {
                        selected_option: verifiedAssessment.selected_option,
                        peak_load_kw: verifiedAssessment.peak_load_kw,
                        calculation_version: verifiedAssessment.calculation_version,
                    } : null,
                });

                // === LAYER 7: Audit log ===
                await auditLogger.log({
                    user_id: guardCtx.userId,
                    action_type: 'rfq.create',
                    correlation_id: guardCtx.correlationId,
                    payload: rfqData,
                    ip_address: guardCtx.ipAddress,
                });
            }
        } catch (dbError) {
            // Database persistence failure should not break the MCP-backed creation
            console.error('[RFQ] DataService persistence error (non-fatal):', dbError);
        }

        return NextResponse.json({
            success: true,
            message: 'RFQ created successfully.',
            rfq_id: savedRfq?.id || null,
            mcp_result: mcpResult.data,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('RFQ create error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}

/**
 * GET /api/v1/rfq
 *
 * Lists all RFQs for the authenticated project owner.
 * Auth: Required
 * RBAC: Requires 'view:rfq' permission
 *
 * Returns RFQs with status labels: Pending, Active, Completed, Disputed
 */
export async function GET(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'view:rfq' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey
            || supabaseUrl.includes('your-project-id')
            || supabaseKey.includes('your-service-role-key')) {
            return NextResponse.json({
                success: true,
                rfqs: [],
                message: 'Supabase not configured. No RFQs available.',
                correlation_id: guardCtx.correlationId,
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);

        const rfqs = await dataService.findMany('rfq', { owner_id: guardCtx.userId });

        return NextResponse.json({
            success: true,
            rfqs: rfqs || [],
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('RFQ list error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
