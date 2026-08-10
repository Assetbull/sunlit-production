import { NextResponse } from 'next/server';
import { CreateRfqSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createRfqViaMcp, sanitizeStringViaMcp } from '@/core/mcp-client';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { apiError, apiSuccess } from '@/shared/api/api-error';
import { executeSolarEngineeringPipeline } from '@/lib/engineering/core/calculationPipeline';
import { buildStructuredSolarAssessmentPayload } from '@/lib/engineering/marketplaceAdapter';

/**
 * POST /api/v1/rfq
 *
 * Creates a new Request for Quotation via the full multi-step wizard flow.
 * Auth: Required
 * RBAC: Requires 'create:rfq' permission (project_owner, epc_contractor)
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'create:rfq' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();

        // === LAYER 1: Local sanitization ===
        const sanitized = sanitizePayload(payload);

        // === LAYER 2: Schema validation ===
        const validation = CreateRfqSchema.safeParse(sanitized);
        if (!validation.success) {
            return apiError(
                guardCtx.correlationId,
                400,
                'VALIDATION_FAILED',
                'Validation failed',
                { details: validation.error.format() }
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
            return apiError(
                guardCtx.correlationId,
                502,
                'DEPENDENCY_FAILURE',
                'RFQ creation failed on backend service.',
                { detail: mcpResult.error }
            );
        }

        // === LAYER 5: Persist via centralized BackendContext ===
        let savedRfq = null;
        try {
            const backendCtx = createBackendContext();
            if (backendCtx) {
                const auditCtx = buildAuditCtx(guardCtx);

                // Persist RFQ record with verified solar intelligence and tenant boundaries
                savedRfq = await backendCtx.dataService.create(
                    'rfq',
                    {
                        owner_id: guardCtx.userId,
                        organization_id: guardCtx.organizationId || null,
                        workspace_id: guardCtx.workspaceId || null,
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
                    auditCtx
                );

                // === LAYER 6: Emit rfq_created event ===
                await backendCtx.eventBus.emit('rfq_created', {
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
                await backendCtx.auditLogger.log({
                    user_id: guardCtx.userId,
                    action_type: 'rfq.create',
                    correlation_id: guardCtx.correlationId,
                    payload: rfqData,
                    ip_address: guardCtx.ipAddress,
                });
            }
        } catch (dbError) {
            console.error('[RFQ] DataService persistence error (non-fatal):', dbError);
        }

        return apiSuccess(
            guardCtx.correlationId,
            {
                message: 'RFQ created successfully.',
                rfq_id: savedRfq?.id || null,
                mcp_result: mcpResult.data,
            },
            201
        );
    } catch (e: unknown) {
        console.error('RFQ create error:', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}

/**
 * GET /api/v1/rfq
 *
 * Lists all RFQs for the authenticated project owner.
 * Auth: Required
 * RBAC: Requires 'view:rfq' permission
 */
export async function GET(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'view:rfq' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const backendCtx = createBackendContext();
        if (!backendCtx) {
            return apiSuccess(guardCtx.correlationId, {
                rfqs: [],
                message: 'Supabase not configured. No RFQs available.',
            });
        }

        const rfqs = await backendCtx.dataService.findMany('rfq', { owner_id: guardCtx.userId });

        return apiSuccess(guardCtx.correlationId, {
            rfqs: rfqs || [],
        });
    } catch (e: unknown) {
        console.error('RFQ list error:', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}

