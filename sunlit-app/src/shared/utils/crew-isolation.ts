/**
 * CREW ISOLATION LAYER
 * =====================
 * HARD SYSTEM RULE: Project Owners MUST NEVER see crew data.
 * This module is the single enforcement point for sanitizing
 * any data payload before it reaches a Project Owner UI.
 *
 * REMOVE: crew_id, crew_name, crew_role, crew_contact, crew_assignments,
 *         gps, gps_logs, internal_logs, installer_notes, execution_logs,
 *         crew_performance, crew_chat, crew_location, assigned_crew
 *
 * ALLOW:  milestone_status, proof_urls, progress, timeline, payment_stage,
 *         contract_state, funding_state, deliverables, submitted_at
 */

/**
 * Fields that are STRICTLY FORBIDDEN from reaching Project Owner views.
 */
const CREW_FORBIDDEN_FIELDS = new Set([
  'crew_id',
  'crew_name',
  'crew_role',
  'crew_roles',
  'crew_contact',
  'crew_phone',
  'crew_email',
  'crew_assignments',
  'assigned_crew',
  'crew_members',
  'crew_performance',
  'crew_metrics',
  'crew_chat',
  'crew_location',
  'crew_gps',
  'gps',
  'gps_logs',
  'gps_coordinates',
  'location_history',
  'internal_logs',
  'execution_logs',
  'installer_notes',
  'internal_notes',
  'crew_job_state',
  'crew_status',
  'crew_availability',
  'labor_cost_breakdown',
  'crew_payslip',
]);

export type SanitizedMilestone = {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED';
  amount: number;
  sequence_order: number;
  submitted_at?: string;
  approved_at?: string;
  paid_at?: string;
  proof_urls?: string[];
  deliverables?: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
  proof_notes?: string;
  due_date?: string;
  project_id: string;
};

export type SanitizedProject = {
  id: string;
  title: string;
  status: string;
  total_amount: number;
  funded_amount?: number;
  released_amount?: number;
  escrow_balance?: number;
  system_size_kwp?: number;
  storage_kwh?: number;
  installer_name?: string;
  installer_company?: string;
  installer_verified?: boolean;
  start_date?: string;
  estimated_completion?: string;
  overall_progress?: number;
  active_milestone_index?: number;
  milestones?: SanitizedMilestone[];
};

/**
 * Sanitize a raw milestone object from the backend.
 * Removes all crew-related fields before exposing to Project Owner.
 */
export function sanitizeMilestone(raw: Record<string, unknown>): SanitizedMilestone {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (!CREW_FORBIDDEN_FIELDS.has(key)) {
      // Recursively sanitize nested objects/arrays
      if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'object' && item !== null
            ? sanitizeCrewData(item as Record<string, unknown>)
            : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeCrewData(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized as unknown as SanitizedMilestone;
}

/**
 * Generic deep sanitizer — strips all crew-forbidden fields recursively.
 * Use this at every API boundary before returning data to Project Owner.
 */
export function sanitizeCrewData<T extends Record<string, unknown>>(raw: T): Partial<T> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (CREW_FORBIDDEN_FIELDS.has(key)) {
      continue; // Hard drop — no trace of crew data
    }

    if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? sanitizeCrewData(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeCrewData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as Partial<T>;
}

/**
 * Sanitize an array of milestones.
 */
export function sanitizeMilestones(raws: Record<string, unknown>[]): SanitizedMilestone[] {
  return raws.map(sanitizeMilestone);
}

/**
 * Sanitize a full project payload.
 * Ensures nested milestones and any crew fields are stripped.
 */
export function sanitizeProjectForOwner(raw: Record<string, unknown>): SanitizedProject {
  const base = sanitizeCrewData(raw);

  if (Array.isArray(base.milestones)) {
    base.milestones = sanitizeMilestones(
      base.milestones as Record<string, unknown>[]
    ) as unknown as SanitizedMilestone[];
  }

  return base as unknown as SanitizedProject;
}

/**
 * Apply crew isolation to an API response before sending to client.
 * Use this in Next.js API route handlers.
 *
 * @example
 * const data = await fetchProjectFromDB(id);
 * return NextResponse.json(applyCrewIsolation(data));
 */
export function applyCrewIsolation<T extends Record<string, unknown>>(data: T): Partial<T> {
  return sanitizeCrewData(data);
}

/**
 * Apply crew isolation to an array of items.
 */
export function applyCrewIsolationToList<T extends Record<string, unknown>>(
  items: T[]
): Partial<T>[] {
  return items.map(sanitizeCrewData);
}
