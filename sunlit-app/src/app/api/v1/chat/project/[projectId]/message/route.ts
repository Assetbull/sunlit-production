import { NextResponse } from 'next/server';
import { SendMessageSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';

/**
 * POST /api/v1/chat/project/[projectId]/message — Send a message
 * GET  /api/v1/chat/project/[projectId]/message — Get message history
 *
 * Auth: Required
 * RBAC: POST requires 'send:message', GET requires 'read:messages'
 *
 * Requirements.md PO-020: Real-time messaging, file uploads, history persisted.
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'send:message' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { projectId } = await params;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = SendMessageSchema.safeParse({ ...sanitized, project_id: projectId });
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, message: 'Message sent (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        const msg = await ctx.dataService.create('messages', {
            project_id: projectId,
            sender_id: guardCtx.userId,
            content: validation.data.content,
            attachment_url: validation.data.attachment_url || null,
        }, auditCtx);

        await ctx.eventBus.emit('chat_message', {
            timestamp: new Date().toISOString(), actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId, message_id: msg?.id,
            project_id: projectId,
        });

        return NextResponse.json({
            success: true, message: 'Message sent.',
            message_id: msg?.id, correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Chat send error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'read:messages' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { projectId } = await params;

    try {
        const ctx = createBackendContext();
        if (!ctx) {
            return NextResponse.json({
                success: true, messages: [],
                correlation_id: guardCtx.correlationId,
            });
        }

        const messages = await ctx.dataService.findMany('messages', { project_id: projectId });

        return NextResponse.json({
            success: true, messages: messages || [],
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Chat list error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
