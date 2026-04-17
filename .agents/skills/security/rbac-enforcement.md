# SKILL: Role-Based Access Control (RBAC) Enforcement

## PURPOSE
To implement "Deny-by-Default" security, ensuring users can only access data and actions permitted by their specific roles.

## WHEN TO USE
- Implementing new API routes
- Defining database RLS policies
- Authorizing dashboard interactions

## INPUT
- User session (JWT)
- Requested resource
- Action type (Read, Create, Update, Delete)

## OUTPUT
- Access Granted or 403 Forbidden

## EXECUTION STEPS
1. **Verify Token**: Authenticate the user via Clerk JWT.
2. **Retrieve Role**: Fetch user role from the `roles` table or sync from Clerk metadata.
3. **Check Middleware**: Apply role-specific middleware on the API route level.
4. **Enforce RLS**: Use Supabase Row-Level Security to ensure the DB query only returns data the user owns or is permitted to see.
5. **Audit Attempt**: Log any rejected access attempts for fraud detection.

## VALIDATION RULES
- 17 role system must be mapped as defined in `requirements.md`.
- Administrative roles must require MFA for sensitive actions.

## FAILURE CONDITIONS
- Hardcoded role names in frontend UI.
- Bypassing RBAC middleware for "public" datasets that contain sensitive user info.

## DEPENDENCIES
- `.agents/skills/database/rls-policies.md`
