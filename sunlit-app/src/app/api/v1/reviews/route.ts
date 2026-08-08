import { NextResponse } from 'next/server';
import { SubmitReviewSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';

/**
 * POST /api/v1/reviews
 *
 * Submits a review for a completed project.
 * Auth: Required
 * RBAC: Requires 'submit:review'
 *
 * State Machine: COMPLETED → REVIEWED
 *
 * Flow:
 *   1. Validate review payload (rating 1-5, comment optional)
 *   2. Create review record
 *   3. Emit 'rating_submitted' event
 *   4. Audit log
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'submit:review' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = SubmitReviewSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const reviewData = validation.data;
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Review submitted (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        const review = await ctx.dataService.create('reviews', {
            project_id: reviewData.project_id,
            reviewer_id: guardCtx.userId,
            reviewee_id: reviewData.reviewee_id,
            rating: reviewData.rating,
            comment: reviewData.comment || null,
        }, auditCtx);

        await ctx.eventBus.emit('rating_submitted', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, review_id: review?.id,
            project_id: reviewData.project_id, rating: reviewData.rating,
        });

        await ctx.auditLogger.log({
            user_id: guardCtx.userId, action_type: 'review.submit',
            correlation_id: guardCtx.correlationId, payload: reviewData,
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true, message: 'Review submitted.',
            review_id: review?.id, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Review submit error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
