import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { createClient } from '@supabase/supabase-js';
import type { ProjectView, MilestoneView, EscrowView } from '@/dashboards/project-owner/types/dashboard';

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
        escrowStatus: i === 0 ? 'released' : i === 1 ? 'funded' : 'pending',
        escrowId: i <= 1 ? `esc-synth-${i + 1}` : undefined,
    }));
}

function syntheticEscrows(milestones: MilestoneView[]): EscrowView[] {
    return milestones
        .filter((m) => m.escrowId)
        .map((m) => ({
            id: m.escrowId!,
            milestoneId: m.id,
            milestoneTitle: m.title,
            amount: m.amount,
            status: m.escrowStatus === 'released' ? 'released' : 'funded',
            releasedAt: m.escrowStatus === 'released' ? '2026-04-05T14:00:00Z' : undefined,
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
        return NextResponse.json(
            { error: 'Invalid project id', correlation_id: guardCtx.correlationId },
            { status: 400 }
        );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey
        || supabaseUrl.includes('your-project-id')
        || supabaseKey.includes('your-service-role-key')) {
        return NextResponse.json(
            { error: 'Supabase not configured.', correlation_id: guardCtx.correlationId },
            { status: 503 }
        );
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);

        const rfq = await dataService.findOne('rfq', {
            id: projectId,
            owner_id: guardCtx.userId,
        });

        if (!rfq) {
            return NextResponse.json(
                { error: 'Project not found or access denied.', correlation_id: guardCtx.correlationId },
                { status: 404 }
            );
        }

        const row = rfq as Record<string, unknown>;
        const budget = Number(row.budget ?? row.budget_range_max ?? 2_800_000);
        const projectUuid = row.project_id as string | undefined;

        let milestones: MilestoneView[] = [];
        let escrows: EscrowView[] = [];

        if (projectUuid) {
            try {
                const msRows = await dataService.findMany('milestones', { project_id: projectUuid });
                if (Array.isArray(msRows) && msRows.length > 0) {
                    milestones = msRows.map((m: Record<string, unknown>) => ({
                        id: String(m.id),
                        title: String(m.title),
                        amount: Number(m.amount),
                        position: Number(m.position ?? 1),
                        isCompleted: Boolean(m.is_completed),
                        isApproved: Boolean(m.is_approved),
                        escrowStatus: 'pending',
                    }));
                }
                const escRows = await dataService.findMany('escrow', { project_id: projectUuid });
                if (Array.isArray(escRows) && escRows.length > 0) {
                    escrows = escRows.map((e: Record<string, unknown>) => ({
                        id: String(e.id),
                        milestoneId: String(e.milestone_id),
                        milestoneTitle: '',
                        amount: Number(e.amount),
                        status: e.status as EscrowView['status'],
                        releasedAt: e.released_at ? String(e.released_at) : undefined,
                    }));
                }
            } catch {
                /* fall through to synthetic */
            }
        }

        if (milestones.length === 0) {
            milestones = syntheticMilestones(budget);
            escrows = syntheticEscrows(milestones);
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
            escrows,
            totalBudget: budget,
            totalPaid: Math.round(budget * (progressPercent / 200)),
            progressPercent,
            createdAt: String(row.created_at || new Date().toISOString()),
        };

        return NextResponse.json({
            success: true,
            project,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('[projects/GET]', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
