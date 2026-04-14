/**
 * Matching Engine — Type Definitions (L2)
 * 
 * GEMINI.md §6: Installer Ranking Engine (SunlitScore)
 *   Inputs: performance, proximity, response time, subscription tier
 *   Executed via Python service.
 * 
 * These interfaces define the contract between the Node.js API layer
 * and the Python matching/ranking service.
 */

export interface MatchRequest {
    rfq_id: string;
    project_location_state: string;
    project_location_city: string;
    system_size_kw?: number;
    budget_range_min?: number;
    budget_range_max?: number;
    /** Maximum number of matches to return */
    max_results?: number;
}

export interface MatchedInstaller {
    installer_id: string;
    sunlit_score: number; // 0-100
    distance_km?: number;
    avg_response_time_hours?: number;
    subscription_tier: 'free' | 'pro' | 'premium';
    completed_projects: number;
    avg_rating?: number;
}

export interface MatchResult {
    rfq_id: string;
    matches: MatchedInstaller[];
    computed_at: string;
    algorithm_version: string;
}

/**
 * Interface for the matching engine service.
 * The actual implementation calls a Python microservice.
 */
export interface IMatchingEngine {
    findMatches(request: MatchRequest): Promise<MatchResult>;
}
