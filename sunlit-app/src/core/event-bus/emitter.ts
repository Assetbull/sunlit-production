import { DataService } from '@/shared/api/data-service';

/**
 * Event types defined by GEMINI.md §5 and Requirements.md §6.
 * H4 fix: Added 'contract_signed' and 'milestone_completed' which
 * were required by GEMINI.md but missing from the original implementation.
 */
export type EventType =
    // === Auth & KYC ===
    | 'user_registered'
    | 'epc_contractor_registered'
    | 'user_login'
    | 'user_logout'
    | 'session_created'
    | 'session_expired'
    | 'kyc_submitted'
    | 'kyc_verified'
    | 'kyc_failed'
    // === RFQ Lifecycle ===
    | 'rfq_created'
    | 'rfq_published'
    | 'rfq_updated'
    | 'rfq_closed'
    | 'rfq_expired'
    // === Projects ===
    | 'external_project_created'
    | 'external_project_funded'
    // === Bidding ===
    | 'bid_submitted'
    | 'bid_updated'
    | 'bid_accepted'
    | 'bid_rejected'
    | 'bid_withdrawn'
    // === Contracts ===
    | 'contract_created'
    | 'contract_signed'
    | 'contract_cancelled'
    // === Payment Control ===
    | 'payment_created'
    | 'payment_funded'
    | 'payment_released'
    | 'payment_refunded'
    | 'payment_disputed'
    // === Escrow & Transfer (GEMINI.md §5 MANDATORY) ===
    | 'escrow_funded'
    | 'final_buffer_reserved'
    | 'payment_partial_released'
    | 'payment_released_final'
    | 'commission_collected'
    | 'transfer_initiated'
    | 'transfer_completed'
    | 'transfer_failed'
    | 'final_buffer_released'
    // === Milestones ===
    | 'milestone_created'
    | 'milestone_updated'
    | 'milestone_submitted'
    | 'milestone_completed'
    | 'milestone_approved'
    | 'milestone_approved_by_epc'
    | 'milestone_approved_payment_pending'
    | 'milestone_rejected'
    // === Projects ===
    | 'project_completed'
    | 'final_buffer_release_pending'
    // === Payments ===
    | 'payment_initialized'
    | 'payment_confirmed'
    | 'payment_released'
    | 'payment_failed'
    // === Disputes ===
    | 'dispute_created'
    | 'dispute_escalated'
    | 'dispute_resolved'
    | 'dispute_closed'
    // === Reviews ===
    | 'rating_submitted'
    | 'review_updated'
    // === CrewLink ===
    | 'crew_job_created'
    | 'crew_job_published'
    | 'crew_application_submitted'
    | 'crew_application_reviewed'
    | 'crew_assigned'
    | 'crew_completed'
    | 'crew_job_closed'
    | 'crew_performance_updated'
    | 'crew_rated'
    | 'milestone_crew_completion_recorded'
    // === Marketplace ===
    | 'marketplace_listing_created'
    | 'marketplace_listing_updated'
    // === Chat ===
    | 'chat_message'
    // === Admin ===
    | 'admin_action';

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
