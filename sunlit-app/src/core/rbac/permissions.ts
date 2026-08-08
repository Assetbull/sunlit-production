import { UserRole } from '@/shared/types/database';

/**
 * M5 fix: Expanded permission set to cover all system operations.
 * Original was missing project, milestone, and subscription permissions.
 */
export type Permission =
    // === Projects ===
    | 'create:project'
    | 'read:projects'
    | 'update:project'
    // === RFQ ===
    | 'create:rfq'
    | 'read:rfq'
    | 'view:rfq'
    // === Bids ===
    | 'submit:bid'
    | 'read:bids'
    | 'view:bids'
    | 'accept:bid'
    // === Contracts ===
    | 'read:contract'
    | 'view:contracts'
    | 'sign:contract'
    // === Milestones ===
    | 'read:milestones'
    | 'read:milestone'
    | 'update:milestone'
    | 'submit:milestone'
    | 'approve:milestone'
    // === Projects (actions) ===
    | 'complete:project'
    // === Payment Control ===
    | 'fund:payment'
    | 'read:payments'
    | 'release:payment'
    // === Disputes ===
    | 'raise:dispute'
    | 'resolve:dispute'
    // === Reviews ===
    | 'submit:review'
    | 'view:reviews'
    // === CrewLink ===
    | 'create:crew_job'
    | 'apply:crew_job'
    | 'assign:crew'
    | 'review:crew_application'
    | 'update:crew_job'
    | 'view:crew_jobs'
    | 'manage:crew_jobs'
    | 'publish:crew_job'
    // === Marketplace ===
    | 'view:marketplace'
    // === Chat ===
    | 'send:message'
    | 'read:messages'
    // === Admin ===
    | 'manage:users'
    | 'manage:subscriptions'
    | 'read:subscriptions'
    | 'view:all_projects'
    | 'view:audit_logs'
    // === EPC-Specific ===
    | 'manage:external_projects'
    | 'coordinate:multi_crew';

/**
 * Deny-by-default permission matrix.
 * GEMINI.md §4: "deny by default (zero-trust)"
 * Any permission not listed here is implicitly DENIED.
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
    project_owner: [
        'create:project',
        'read:projects',
        'update:project',
        'create:rfq',
        'read:rfq',
        'view:rfq',
        'read:bids',
        'view:bids',
        'accept:bid',
        'read:contract',
        'view:contracts',
        'sign:contract',
        'read:milestones',
        'read:milestone',
        'approve:milestone',
        'complete:project',
        'fund:payment',
        'release:payment',
        'raise:dispute',
        'submit:review',
        'view:reviews',
        'view:marketplace',
        'send:message',
        'read:messages',
        'view:audit_logs',
    ],
    installer: [
        'read:rfq',
        'view:rfq',
        'submit:bid',
        'read:bids',
        'read:contract',
        'view:contracts',
        'sign:contract',
        'read:milestones',
        'read:milestone',
        'update:milestone',
        'submit:milestone',
        'raise:dispute',
        'submit:review',
        'view:reviews',
        'create:crew_job',
        'update:crew_job',
        'review:crew_application',
        'assign:crew',
        'view:marketplace',
        'send:message',
        'read:messages',
    ],
    crew_member: [
        'read:rfq',
        'apply:crew_job',
        'read:milestones',
        'raise:dispute',
        'submit:review',
        'view:marketplace',
        'send:message',
        'read:messages',
    ],
    epc_contractor: [
        'create:project',
        'read:projects',
        'update:project',
        'create:rfq',
        'read:rfq',
        'view:rfq',
        'submit:bid',
        'read:bids',
        'view:bids',
        'accept:bid',
        'read:contract',
        'view:contracts',
        'sign:contract',
        'read:milestones',
        'read:milestone',
        'update:milestone',
        'submit:milestone',
        'approve:milestone',
        'complete:project',
        'fund:payment',
        'read:payments',
        'release:payment',
        'raise:dispute',
        'submit:review',
        'view:reviews',
        'create:crew_job',
        'update:crew_job',
        'review:crew_application',
        'assign:crew',
        'view:crew_jobs',
        'manage:crew_jobs',
        'publish:crew_job',
        'view:marketplace',
        'send:message',
        'read:messages',
        'view:audit_logs',
        'manage:external_projects',
        'coordinate:multi_crew',
    ],
    admin: [
        'read:rfq',
        'view:rfq',
        'read:bids',
        'view:bids',
        'read:contract',
        'view:contracts',
        'read:milestones',
        'approve:milestone',
        'raise:dispute',
        'resolve:dispute',
        'submit:review',
        'view:reviews',
        'view:marketplace',
        'read:messages',
        'manage:users',
        'manage:subscriptions',
        'read:subscriptions',
        'view:all_projects',
        'view:audit_logs',
    ],
};
