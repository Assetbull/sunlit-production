# SKILL: Dynamic Role Assignment

## PURPOSE
To assign and synchronize user permissions based on their verified identity and system state.

## WHEN TO USE
- New user registration
- Onboarding status updates
- Role-restricted action verification

## INPUT
- User ID
- Registration context (Selected role during sign-up)

## OUTPUT
- Updated DB record in `users` and `roles` tables

## EXECUTION STEPS
1. **Assign Default Persona**: Map new users to `project_owner` by default unless specified.
2. **Verify Identity Type**: Distinguish between individuals and businesses (EPC/Installer).
3. **Sync with Metadata**: Push the assigned role to Clerk `publicMetadata` for frontend routing.
4. **Enforce Deny-by-Default**: Ensure no permissions are granted until role assignment is fully persisted and verified.
5. **Handle Role Escalation**: Require 2FA or Admin approval for role changes (e.g., from `installer` to `verified_installer`).

## VALIDATION RULES
- Users can ONLY have roles defined in the 17-role system schema.
- Role assignment events MUST be logged in the audit history.

## FAILURE CONDITIONS
- Role "leaks" where a user gains Admin permissions due to incorrect mapping logic.

## DEPENDENCIES
- `.agents/skills/security/rbac-enforcement.md`
