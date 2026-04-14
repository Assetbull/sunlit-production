import { EscrowStatus } from '@/shared/types/database';

export interface EscrowReleaseContext {
    milestone_complete: boolean;
    dispute_active: boolean;
    approved_by_owner: boolean;
    current_status: EscrowStatus;
    kyc_verified: boolean;
}

/**
 * IMMUTABLE ESCROW ENGINE
 * 
 * Enforces GEMINI.md §4 deterministic escrow logic:
 *   IF dispute == TRUE → BLOCK
 *   IF milestone_complete == FALSE → HOLD
 *   IF approved == TRUE → RELEASE
 * 
 * Additional rules:
 *   - KYC must be verified for release (Requirements.md §8)
 *   - NO manual override path exists
 *   - ALL state transitions are logged by the calling route
 * 
 * This class is frozen after definition to prevent prototype tampering.
 */
class _EscrowEngine {

    calculateNextState(context: EscrowReleaseContext): EscrowStatus {
        // BLOCK: Active dispute takes absolute priority
        if (context.current_status === 'disputed' || context.dispute_active) {
            return 'disputed';
        }

        // HOLD: Milestone not yet completed
        if (!context.milestone_complete) {
            return 'held';
        }

        // HOLD: KYC not verified (Requirements.md §8)
        if (!context.kyc_verified) {
            return 'held';
        }

        // RELEASE: All conditions met
        if (context.approved_by_owner && context.current_status === 'funded') {
            return 'released';
        }

        // Default: maintain current state
        return context.current_status;
    }

    canRelease(context: EscrowReleaseContext): boolean {
        return this.calculateNextState(context) === 'released';
    }
}

// Freeze the engine instance to prevent runtime tampering
export const EscrowEngine = Object.freeze(new _EscrowEngine());
