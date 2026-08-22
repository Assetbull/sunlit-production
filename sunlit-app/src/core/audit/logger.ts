import { DataService } from '@/shared/api/data-service';
import { redactSensitive, ActorType } from '@/core/observability/observability';
import crypto from 'crypto';

export interface AuditLogEntry {
    user_id?: string;
    actor_type?: ActorType;
    action_type: string;
    correlation_id: string;
    organization_id?: string | null;
    workspace_id?: string | null;
    resource_type?: string;
    resource_id?: string;
    payload?: Record<string, unknown>;
    previous_state?: Record<string, unknown>;
    new_state?: Record<string, unknown>;
    status?: 'SUCCESS' | 'FAILURE' | 'DENIED';
    ip_address?: string;
    user_agent?: string;
}

/**
 * Computes safe diff of modified fields between previous and new states.
 */
export function computeStateDiff(
    previousState?: Record<string, unknown>,
    newState?: Record<string, unknown>
): { modifiedFields: string[]; diff: Record<string, { from: unknown; to: unknown }> } | undefined {
    if (!previousState || !newState) return undefined;

    const modifiedFields: string[] = [];
    const diff: Record<string, { from: unknown; to: unknown }> = {};

    const allKeys = new Set([...Object.keys(previousState), ...Object.keys(newState)]);
    for (const key of allKeys) {
        const fromVal = previousState[key];
        const toVal = newState[key];
        if (JSON.stringify(fromVal) !== JSON.stringify(toVal)) {
            modifiedFields.push(key);
            diff[key] = { from: fromVal, to: toVal };
        }
    }

    return { modifiedFields, diff };
}

/**
 * Global Audit Logger
 *
 * Implements AUDIT_OS.md (Registry ID 38).
 * Provides immutable, attributable, and tamper-evident audit logging for critical operations.
 */
export class AuditLogger {
    private dataService: DataService;

    constructor(dataService: DataService) {
        this.dataService = dataService;
    }

    async log(entry: AuditLogEntry) {
        // Redact any sensitive material before hashing & persisting
        const sanitizedPayload = redactSensitive(entry.payload || {});
        const sanitizedPrev = entry.previous_state ? redactSensitive(entry.previous_state) : undefined;
        const sanitizedNext = entry.new_state ? redactSensitive(entry.new_state) : undefined;

        // Hash payload for cryptographic integrity
        const payloadHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(sanitizedPayload))
            .digest('hex');

        // Safe state diff
        const stateDiff = computeStateDiff(sanitizedPrev, sanitizedNext);

        await this.dataService.create('audit_logs', {
            user_id: entry.user_id || null,
            action_type: entry.action_type,
            correlation_id: entry.correlation_id,
            payload_hash: payloadHash,
            organization_id: entry.organization_id || null,
            workspace_id: entry.workspace_id || null,
            ip_address: entry.ip_address || null,
            metadata: {
                actor_type: entry.actor_type || 'USER',
                resource_type: entry.resource_type || null,
                resource_id: entry.resource_id || null,
                status: entry.status || 'SUCCESS',
                user_agent: entry.user_agent || null,
                state_diff: stateDiff,
                payload: sanitizedPayload,
            },
        });
    }
}

