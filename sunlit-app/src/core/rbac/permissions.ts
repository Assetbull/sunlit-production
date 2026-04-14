import { UserRole } from '@/shared/types/database';

/**
 * M5 fix: Expanded permission set to cover all system operations.
 * Original was missing project, milestone, and subscription permissions.
 */
export type Permission =
    | 'create:project'
    | 'read:projects'
    | 'update:project'
    | 'create:rfq'
    | 'read:rfq'
    | 'view:rfq'
    | 'submit:bid'
    | 'read:bids'
    | 'view:bids'
    | 'accept:bid'
    | 'read:milestones'
    | 'update:milestone'
    | 'fund:escrow'
    | 'release:escrow'
    | 'raise:dispute'
    | 'resolve:dispute'
    | 'manage:users'
    | 'manage:subscriptions'
    | 'read:subscriptions'
    | 'view:all_projects'
    | 'view:audit_logs';

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
        'read:milestones',
        'fund:escrow',
        'release:escrow',
        'raise:dispute',
    ],
    installer: [
        'read:rfq',
        'submit:bid',
        'read:milestones',
        'raise:dispute',
    ],
    crewlink: [
        'read:rfq',
        'submit:bid',
        'read:milestones',
        'raise:dispute',
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
        'read:milestones',
        'update:milestone',
        'fund:escrow',
        'release:escrow',
        'raise:dispute',
    ],
    admin: [
        'read:rfq',
        'view:rfq',
        'read:bids',
        'view:bids',
        'read:milestones',
        'raise:dispute',
        'resolve:dispute',
        'manage:users',
        'manage:subscriptions',
        'read:subscriptions',
        'view:all_projects',
        'view:audit_logs',
    ],
};
