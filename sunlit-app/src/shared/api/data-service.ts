import { SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * DataService — Centralized Data Access Layer
 *
 * ALL database access MUST go through this class.
 * GEMINI.md §2: "NO direct DB access outside DataService"
 * Requirements.md §2: "ALL DB access MUST go through DataService"
 *
 * H2 fix: Integrated audit logging on write operations.
 * Every create/update/delete automatically logs to audit_logs.
 */
export class DataService {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async findOne(table: string, matchParams: Record<string, unknown>) {
        const { data, error } = await this.supabase
            .from(table)
            .select('*')
            .match(matchParams)
            .single();

        if (error) throw error;
        return data;
    }

    async findMany(table: string, matchParams?: Record<string, unknown>) {
        let query = this.supabase.from(table).select('*');
        if (matchParams) {
            query = query.match(matchParams);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async create(
        table: string,
        payload: Record<string, unknown>,
        auditContext?: { user_id?: string; correlation_id?: string; ip_address?: string }
    ) {
        const { data, error } = await this.supabase
            .from(table)
            .insert(payload)
            .select()
            .single();

        if (error) throw error;

        // H2 fix: Auto-log write operations (skip logging the audit table itself to prevent recursion)
        if (auditContext && table !== 'audit_logs' && table !== 'event_logs') {
            await this._logAudit({
                user_id: auditContext.user_id,
                action_type: `${table}.create`,
                correlation_id: auditContext.correlation_id,
                payload,
                ip_address: auditContext.ip_address,
            });
        }

        return data;
    }

    async update(
        table: string,
        matchParams: Record<string, unknown>,
        payload: Record<string, unknown>,
        auditContext?: { user_id?: string; correlation_id?: string; ip_address?: string }
    ) {
        const { data, error } = await this.supabase
            .from(table)
            .update(payload)
            .match(matchParams)
            .select();

        if (error) throw error;

        if (auditContext && table !== 'audit_logs' && table !== 'event_logs') {
            await this._logAudit({
                user_id: auditContext.user_id,
                action_type: `${table}.update`,
                correlation_id: auditContext.correlation_id,
                payload: { match: matchParams, changes: payload },
                ip_address: auditContext.ip_address,
            });
        }

        return data;
    }

    async delete(
        table: string,
        matchParams: Record<string, unknown>,
        auditContext?: { user_id?: string; correlation_id?: string; ip_address?: string }
    ) {
        const { data, error } = await this.supabase
            .from(table)
            .delete()
            .match(matchParams)
            .select();

        if (error) throw error;

        if (auditContext && table !== 'audit_logs' && table !== 'event_logs') {
            await this._logAudit({
                user_id: auditContext.user_id,
                action_type: `${table}.delete`,
                correlation_id: auditContext.correlation_id,
                payload: matchParams,
                ip_address: auditContext.ip_address,
            });
        }

        return data;
    }

    /**
     * For atomic operations that span multiple tables.
     * Uses Supabase RPC (stored PostgreSQL functions).
     */
    async transaction(rpcName: string, params: Record<string, unknown>) {
        const { data, error } = await this.supabase.rpc(rpcName, params);
        if (error) throw error;
        return data;
    }

    /**
     * Internal: Logs audit entry. Hashes payload for integrity.
     * GEMINI.md §4: Log user_id, timestamp, action_type, correlation_id, payload_hash, IP
     */
    private async _logAudit(entry: {
        user_id?: string;
        action_type: string;
        correlation_id?: string;
        payload: unknown;
        ip_address?: string;
    }) {
        try {
            const payloadHash = crypto
                .createHash('sha256')
                .update(JSON.stringify(entry.payload || {}))
                .digest('hex');

            await this.supabase.from('audit_logs').insert({
                user_id: entry.user_id || null,
                action_type: entry.action_type,
                correlation_id: entry.correlation_id || null,
                payload_hash: payloadHash,
                ip_address: entry.ip_address || null,
            });
        } catch (auditError) {
            // Audit logging failure must not break the primary operation,
            // but MUST be reported for operational monitoring.
            console.error('AUDIT LOG FAILURE (CRITICAL):', auditError);
        }
    }
}
