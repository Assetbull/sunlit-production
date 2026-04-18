import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { createClient } from '@supabase/supabase-js';
import { sanitizePayload } from '@/shared/validators/sanitize';

interface ChatPayload {
    project_id?: string;
    sender_label?: string;
    text?: string;
    is_from_owner?: boolean;
    actor_id?: string;
}

function rowToMessage(row: { id: string; created_at: string; payload: unknown }) {
    const p = (row.payload || {}) as ChatPayload;
    return {
        id: row.id,
        sender: p.is_from_owner ? 'You' : p.sender_label || 'Installer',
        senderId: p.actor_id || 'unknown',
        text: String(p.text || ''),
        timestamp: row.created_at,
        isFromMe: Boolean(p.is_from_owner),
    };
}

/**
 * GET /api/v1/projects/[projectId]/messages
 * POST /api/v1/projects/[projectId]/messages
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'read:projects' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { projectId } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey
        || supabaseUrl.includes('your-project-id')
        || supabaseKey.includes('your-service-role-key')) {
        return NextResponse.json({
            success: true,
            messages: [],
            correlation_id: guardCtx.correlationId,
        });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
            .from('event_logs')
            .select('id, created_at, payload')
            .eq('event_type', 'chat_message')
            .order('created_at', { ascending: true });

        if (error) throw error;

        const rows = (data || []).filter((row) => {
            const p = row.payload as ChatPayload | null;
            return p?.project_id === projectId;
        });

        return NextResponse.json({
            success: true,
            messages: rows.map(rowToMessage),
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('[messages GET]', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const guard = await apiGuard(req, { requiredPermission: 'read:projects' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;
    const { projectId } = await params;

    try {
        const body = await req.json();
        const sanitized = sanitizePayload(body);
        const text = typeof sanitized.text === 'string' ? sanitized.text.trim() : '';
        if (!text || text.length > 4000) {
            return NextResponse.json(
                { error: 'Invalid message text', correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey
            || supabaseUrl.includes('your-project-id')
            || supabaseKey.includes('your-service-role-key')) {
            const message = {
                id: `m-local-${Date.now()}`,
                sender: 'You',
                senderId: guardCtx.userId,
                text,
                timestamp: new Date().toISOString(),
                isFromMe: true,
            };
            return NextResponse.json({
                success: true,
                message,
                correlation_id: guardCtx.correlationId,
            });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const dataService = new DataService(supabase);
        const eventBus = new EventBus(dataService);

        const logId = await eventBus.emit('chat_message', {
            timestamp: new Date().toISOString(),
            actor_id: guardCtx.userId,
            correlation_id: guardCtx.correlationId,
            project_id: projectId,
            sender_label: 'You',
            text,
            is_from_owner: true,
        });

        const ts = new Date().toISOString();
        const message = {
            id: logId || `m-${Date.now()}`,
            sender: 'You',
            senderId: guardCtx.userId,
            text,
            timestamp: ts,
            isFromMe: true,
        };

        return NextResponse.json({
            success: true,
            message,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('[messages POST]', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
