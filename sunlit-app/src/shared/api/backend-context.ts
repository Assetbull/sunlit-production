import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';

/**
 * Shared backend context factory.
 * Eliminates repeated Supabase init boilerplate across all API routes.
 *
 * GEMINI.md: "ALL database access MUST go through DataService"
 * Returns null if Supabase is not configured (scaffold mode).
 */
export interface BackendContext {
    supabase: SupabaseClient;
    dataService: DataService;
    eventBus: EventBus;
    auditLogger: AuditLogger;
}

export function createBackendContext(): BackendContext | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey
        || supabaseUrl.includes('your-project-id')
        || supabaseKey.includes('your-service-role-key')) {
        return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const dataService = new DataService(supabase);
    const eventBus = new EventBus(dataService);
    const auditLogger = new AuditLogger(dataService);

    return { supabase, dataService, eventBus, auditLogger };
}

/**
 * Standard audit context builder from GuardContext.
 */
export function buildAuditCtx(guard: { userId: string; correlationId: string; ipAddress: string }) {
    return {
        user_id: guard.userId,
        correlation_id: guard.correlationId,
        ip_address: guard.ipAddress,
    };
}
