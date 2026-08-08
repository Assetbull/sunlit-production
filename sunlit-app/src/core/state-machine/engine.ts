/**
 * State Machine Enforcement Engine
 *
 * Implements Requirements.md §6 (ESS) — canTransition() function.
 * All flows MUST validate state transitions through this engine.
 *
 * GEMINI.md: NO step may be skipped or reordered.
 * ESS §6.5: strict mapping, reject invalid transitions, log all transitions, block during dispute.
 *
 * This class is frozen after definition to prevent runtime tampering.
 */

// =============================================
// RFQ-Project Lifecycle States
// =============================================
export type RfqLifecycleState =
    | 'RFQ_CREATED'
    | 'RFQ_VISIBLE'
    | 'BID_SUBMITTED'
    | 'BID_ACCEPTED'
    | 'CONTRACT_CREATED'
    | 'CONTRACT_SIGNED'
    | 'PAYMENT_FUNDED'
    | 'EXECUTING'
    | 'MILESTONE_UPDATED'
    | 'MILESTONE_APPROVED'
    | 'PAYMENT_RELEASED'
    | 'COMPLETED'
    | 'REVIEWED'
    | 'CLOSED'
    | 'DISPUTED';

// =============================================
// CrewLink Lifecycle States
// =============================================
export type CrewLinkState =
    | 'JOB_CREATED'
    | 'JOB_PUBLISHED'
    | 'APPLICATION_RECEIVED'
    | 'APPLICATION_REVIEWED'
    | 'CREW_ASSIGNED'
    | 'CREW_EXECUTING'
    | 'CREW_COMPLETED'
    | 'JOB_CLOSED'
    | 'CREW_DISPUTED';

// =============================================
// Valid Transitions Map
// =============================================
const RFQ_TRANSITIONS: Record<RfqLifecycleState, RfqLifecycleState[]> = {
    RFQ_CREATED:       ['RFQ_VISIBLE'],
    RFQ_VISIBLE:       ['BID_SUBMITTED', 'CLOSED'],
    BID_SUBMITTED:     ['BID_ACCEPTED', 'BID_SUBMITTED'],  // Multiple bids allowed before acceptance
    BID_ACCEPTED:      ['CONTRACT_CREATED'],
    CONTRACT_CREATED:  ['CONTRACT_SIGNED', 'CLOSED'],
    CONTRACT_SIGNED:   ['PAYMENT_FUNDED', 'DISPUTED'],
    PAYMENT_FUNDED:     ['EXECUTING', 'DISPUTED'],
    EXECUTING:         ['MILESTONE_UPDATED', 'DISPUTED'],
    MILESTONE_UPDATED: ['MILESTONE_APPROVED', 'MILESTONE_UPDATED', 'DISPUTED'],
    MILESTONE_APPROVED:['PAYMENT_RELEASED', 'DISPUTED'],
    PAYMENT_RELEASED:  ['COMPLETED', 'MILESTONE_UPDATED'],  // More milestones possible
    COMPLETED:         ['REVIEWED'],
    REVIEWED:          ['CLOSED'],
    CLOSED:            [],
    DISPUTED:          ['EXECUTING', 'PAYMENT_RELEASED', 'CLOSED'],  // After resolution
};

const CREWLINK_TRANSITIONS: Record<CrewLinkState, CrewLinkState[]> = {
    JOB_CREATED:         ['JOB_PUBLISHED'],
    JOB_PUBLISHED:       ['APPLICATION_RECEIVED', 'JOB_CLOSED'],
    APPLICATION_RECEIVED:['APPLICATION_REVIEWED', 'APPLICATION_RECEIVED'],
    APPLICATION_REVIEWED:['CREW_ASSIGNED', 'APPLICATION_REVIEWED'],
    CREW_ASSIGNED:       ['CREW_EXECUTING', 'CREW_DISPUTED'],
    CREW_EXECUTING:      ['CREW_COMPLETED', 'CREW_DISPUTED'],
    CREW_COMPLETED:      ['JOB_CLOSED'],
    JOB_CLOSED:          [],
    CREW_DISPUTED:       ['CREW_EXECUTING', 'JOB_CLOSED'],
};

// =============================================
// State Machine Engine
// =============================================
class _StateMachineEngine {

    /**
     * Validates if a state transition is allowed.
     * BR-001: NO step may be skipped or reordered.
     */
    canTransitionRfq(current: RfqLifecycleState, next: RfqLifecycleState): boolean {
        const allowed = RFQ_TRANSITIONS[current];
        if (!allowed) return false;
        return allowed.includes(next);
    }

    canTransitionCrewLink(current: CrewLinkState, next: CrewLinkState): boolean {
        const allowed = CREWLINK_TRANSITIONS[current];
        if (!allowed) return false;
        return allowed.includes(next);
    }

    /**
     * Enforces transition — throws if invalid.
     * Used in API routes before state updates.
     */
    enforceRfqTransition(current: RfqLifecycleState, next: RfqLifecycleState): void {
        if (!this.canTransitionRfq(current, next)) {
            throw new Error(
                `INVALID_STATE_TRANSITION: Cannot transition from '${current}' to '${next}'. ` +
                `Allowed: [${(RFQ_TRANSITIONS[current] || []).join(', ')}]`
            );
        }
    }

    enforceCrewLinkTransition(current: CrewLinkState, next: CrewLinkState): void {
        if (!this.canTransitionCrewLink(current, next)) {
            throw new Error(
                `INVALID_STATE_TRANSITION: Cannot transition from '${current}' to '${next}'. ` +
                `Allowed: [${(CREWLINK_TRANSITIONS[current] || []).join(', ')}]`
            );
        }
    }

    /**
     * Returns all valid next states from the current state.
     * Used by UI to show available actions.
     */
    getNextStatesRfq(current: RfqLifecycleState): RfqLifecycleState[] {
        return RFQ_TRANSITIONS[current] || [];
    }

    getNextStatesCrewLink(current: CrewLinkState): CrewLinkState[] {
        return CREWLINK_TRANSITIONS[current] || [];
    }

    /**
     * Checks if a dispute interrupt is valid from the current state.
     * ESS §6.1: DISPUTE_OPENED can interrupt CONTRACT_SIGNED through MILESTONE_APPROVED.
     */
    canDisputeInterruptRfq(current: RfqLifecycleState): boolean {
        const disputeAllowedFrom: RfqLifecycleState[] = [
            'CONTRACT_SIGNED', 'PAYMENT_FUNDED', 'EXECUTING',
            'MILESTONE_UPDATED', 'MILESTONE_APPROVED',
        ];
        return disputeAllowedFrom.includes(current);
    }
}

// Freeze the engine instance to prevent runtime tampering (matches PaymentEngine pattern)
export const StateMachineEngine = Object.freeze(new _StateMachineEngine());
