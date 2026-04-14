import { DataService } from '@/shared/api/data-service';
import crypto from 'crypto';

export interface AuditLogEntry {
    user_id?: string;
    action_type: string;
    correlation_id: string;
    payload: any;
    ip_address?: string;
}

/**
 * Global Audit Logger
 * Log all critical actions. Immutable via DB policy.
 */
export class AuditLogger {
    private dataService: DataService;

    constructor(dataService: DataService) {
        this.dataService = dataService;
    }

    async log(entry: AuditLogEntry) {
        
        // Hash payload for integrity
        const payloadHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(entry.payload || {}))
            .digest('hex');

        await this.dataService.create('audit_logs', {
            user_id: entry.user_id || null,
            action_type: entry.action_type,
            correlation_id: entry.correlation_id,
            payload_hash: payloadHash,
            ip_address: entry.ip_address || null,
        });
    }
}
