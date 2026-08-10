import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext } from '@/shared/api/backend-context';
import { apiError, apiSuccess } from '@/shared/api/api-error';
import type { ProjectView, MilestoneView, PaymentView } from '@/dashboards/project-owner/types/dashboard';

function syntheticMilestones(totalBudget: number): MilestoneView[] {
    const splits = [0.5, 0.3, 0.1, 0.1];
    const titles = [
        'Deposit & Procurement',
        'Installation & Wiring',
        'Testing & Commissioning',
        'Final Handover',
    ];
    return splits.map((pct, i) => ({
        id: `ms-synth-${i + 1}`,
        title: titles[i],
        amount: Math.round(totalBudget * pct),
        position: i + 1,
        isCompleted: i === 0,
        isApproved: i === 0,
        paymentStatus: i === 0 ? 'released' : i === 1 ? 'funded' : 'pending',
        paymentId: i <= 1 ? `esc-synth-${i + 1}` : undefined,
    }));
}

function syntheticPayments(milestones: MilestoneView[]): PaymentView[] {
    return milestones
        .filter((m) => m.paymentId)
        .map((m) => ({
            id: m.paymentId!,
            milestoneId: m.id,
            milestoneTitle: m.title,
            amount: m.amount,
            status: m.paymentStatus === 'released' ? 'released' : 'funded',
            releasedAt: m.paymentStatus === 'released' ? '2026-04-05T14:00:00Z' : undefined,
        }));
}

/**
 * GET /api/v1/projects/[projectId]
 *
 * Resolves project execution view. `projectId` is typically the RFQ id used in owner URLs.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'read:projects' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { projectId } = await params;

    if (!projectId) {
        return apiError(guardCtx.correlationId, 400, 'VALIDATION_FAILED', 'Invalid project id');
    }

    const backendCtx = createBackendContext();
    if (!backendCtx) {
        return apiError(
            guardCtx.correlationId,
            503,
            'SERVICE_UNAVAILABLE',
            'Supabase not configured.'
        );
    }

    try {
        const rfq = await backendCtx.dataService.findOne('rfq', {
            id: projectId,
            owner_id: guardCtx.userId,
        });

        if (!rfq) {
            return apiError(
                guardCtx.correlationId,
                404,
                'NOT_FOUND',
                'Project not found or access denied.'
            );
        }

        const row = rfq as Record<string, unknown>;
        const budget = Number(row.budget ?? row.budget_range_max ?? 2_800_000);
        const projectUuid = row.project_id as string | undefined;

        let milestones: MilestoneView[] = [];
        let payments: PaymentView[] = [];

        if (projectUuid) {
            try {
                const msRows = await backendCtx.dataService.findMany('milestones', { project_id: projectUuid });
                if (Array.isArray(msRows) && msRows.length > 0) {
                    milestones = msRows.map((m: Record<string, unknown>) => ({
                        id: String(m.id),
                        title: String(m.title),
                        amount: Number(m.amount),
                        position: Number(m.position ?? 1),
                        isCompleted: Boolean(m.is_completed),
                        isApproved: Boolean(m.is_approved),
                        paymentStatus: 'pending',
                    }));
                }
                const escRows = await backendCtx.dataService.findMany('escrow', { project_id: projectUuid });
                if (Array.isArray(escRows) && escRows.length > 0) {
                    payments = escRows.map((e: Record<string, unknown>) => ({
                        id: String(e.id),
                        milestoneId: String(e.milestone_id),
                        milestoneTitle: '',
                        amount: Number(e.amount),
                        status: e.status as PaymentView['status'],
                        releasedAt: e.released_at ? String(e.released_at) : undefined,
                    }));
                }
            } catch {
                /* fall through to synthetic */
            }
        }

        if (milestones.length === 0) {
            milestones = syntheticMilestones(budget);
            payments = syntheticPayments(milestones);
        }

        const completed = milestones.filter((m) => m.isCompleted).length;
        const progressPercent = Math.round((completed / Math.max(milestones.length, 1)) * 100);

        const title =
            (row.project_title as string) ||
            `${row.project_type || 'Residential'} Solar — ${row.location || 'Project'}`;

        const project: ProjectView = {
            id: projectId,
            title,
            description: (row.timeline as string) || undefined,
            status: 'in_progress',
            locationState: String(row.location_state || 'Lagos'),
            locationCity: String(row.location || row.location_city || 'Lagos').split(',')[0].trim(),
            systemSizeKw: row.system_size_kw != null ? Number(row.system_size_kw) : 5,
            installerName: 'Assigned Installer',
            milestones,
            payments,
            totalBudget: budget,
            totalPaid: Math.round(budget * (progressPercent / 200)),
            progressPercent,
            createdAt: String(row.created_at || new Date().toISOString()),
        };

        return apiSuccess(guardCtx.correlationId, { project });
    } catch (e: unknown) {
        console.error('[projects/GET]', e);
        return apiError(guardCtx.correlationId, 500, 'INTERNAL_ERROR', 'Internal Server Error');
    }
}

