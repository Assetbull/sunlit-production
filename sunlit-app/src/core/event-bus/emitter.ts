import { DataService } from '@/shared/api/data-service';

/**
 * Event types defined by GEMINI.md §5 and Requirements.md §6.
 * H4 fix: Added 'contract_signed' and 'milestone_completed' which
 * were required by GEMINI.md but missing from the original implementation.
 */
export type EventType =
    | 'user_registered'
    | 'kyc_verified'
    | 'rfq_created'
    | 'bid_submitted'
    | 'contract_signed'
    | 'escrow_funded'
    | 'milestone_completed'
    | 'payment_released'
    | 'dispute_created'
    | 'rating_submitted'
    | 'chat_message';

export interface BaseEventPayload {
    timestamp: string;
    actor_id?: string;
    correlation_id: string;
    [key: string]: unknown;
}

/**
 * Event Bus — Real-time Event-Driven Architecture Core
 * 
 * Enforces GEMINI.md §5:
 *   - ALL critical actions MUST emit events
 *   - Events MUST be immutable (logged to append-only event_logs table)
 *   - Consumers MUST be idempotent
 * 
 * Events are persisted to the `event_logs` table via DataService,
 * and can be broadcast via Supabase Realtime channels for live updates.
 */
export class EventBus {
    private dataService: DataService;

    constructor(dataService: DataService) {
        this.dataService = dataService;
    }

    async emit(eventType: EventType, payload: BaseEventPayload): Promise<string | undefined> {
        // Ensure timestamp is always set
        const enrichedPayload: BaseEventPayload = {
            ...payload,
            timestamp: payload.timestamp || new Date().toISOString(),
        };

        const actor = enrichedPayload.actor_id;
        const emittedBy =
            typeof actor === 'string' &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(actor)
                ? actor
                : null;

        const row = await this.dataService.create('event_logs', {
            event_type: eventType,
            payload: enrichedPayload,
            emitted_by: emittedBy,
        });

        const id = row && typeof row === 'object' && 'id' in row ? String((row as { id: string }).id) : undefined;

        // TODO: Broadcast via Supabase Realtime channel for live dashboard updates
        return id;
    }
}
