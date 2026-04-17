# SKILL: Row-Level Security (RLS) Implementation

## PURPOSE
To guarantee tenant isolation and record-level permissions directly within the database engine.

## WHEN TO USE
- Provisioning new tables
- Updating user role permissions
- Resolving data leakage issues

## INPUT
- DB Table Name
- Role mappings from `sunlit.ace.yaml`

## OUTPUT
- Validated RLS Policy (SQL)

## EXECUTION STEPS
1. **Enable RLS**: Execute `ALTER TABLE [name] ENABLE ROW LEVEL SECURITY`.
2. **Define Auth Policy**: Use `auth.uid()` to restrict users to their own records.
3. **Map Roles**: Create policies that allow specific actions based on the user's role metadata (e.g., `installer` can update their own `bids`).
4. **Verify Tenant Isolation**: Ensure Project Owners can only see their own projects and associated bids.
5. **Automated Testing**: Run queries with different user contexts to verify policy enforcement.

## VALIDATION RULES
- Every table MUST have at least one restrictive policy.
- Policies must account for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` separately.

## FAILURE CONDITIONS
- Bypassing RLS via `service_role` keys for client-side operations.
- Using `ALL` permissions on a policy for complex roles.

## DEPENDENCIES
- `.agents/skills/security/rbac-enforcement.md`
