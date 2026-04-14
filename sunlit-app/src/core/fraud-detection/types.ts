/**
 * Fraud Detection — Type Definitions (L1)
 * 
 * GEMINI.md §6: Fraud Detection Engine must detect:
 *   - fake bids
 *   - collusion (cartel behavior)
 *   - abnormal pricing patterns
 * 
 * These interfaces define the hook points. Actual detection logic
 * will be implemented in a Python service or Node.js module.
 * 
 * RULE: Fraud engine MUST NOT override deterministic financial logic (escrow).
 * Fraud flags are advisory — they trigger manual review, not automatic actions.
 */

export type FraudSignalType =
    | 'fake_bid'
    | 'collusion'
    | 'abnormal_pricing'
    | 'suspicious_login'
    | 'rapid_fire_bids'
    | 'geographic_anomaly';

export type FraudSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FraudSignal {
    id: string;
    signal_type: FraudSignalType;
    severity: FraudSeverity;
    user_id: string;
    description: string;
    metadata: Record<string, unknown>;
    created_at: string;
    reviewed: boolean;
    reviewed_by?: string;
    reviewed_at?: string;
}

export interface FraudCheckRequest {
    user_id: string;
    action_type: string;
    payload: Record<string, unknown>;
    ip_address: string;
    correlation_id: string;
}

export interface FraudCheckResult {
    flagged: boolean;
    signals: FraudSignal[];
    should_block: boolean; // Only true for critical severity
}

/**
 * Interface for fraud detection implementations.
 * Will be implemented by a concrete class when the detection engine is built.
 */
export interface IFraudDetector {
    check(request: FraudCheckRequest): Promise<FraudCheckResult>;
    reportSignal(signal: Omit<FraudSignal, 'id' | 'created_at' | 'reviewed'>): Promise<void>;
}
