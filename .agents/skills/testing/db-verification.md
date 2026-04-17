# SKILL: Database Integrity Verification

## PURPOSE
To assert that backend operations correctly transition system state and adhere to security constraints.

## WHEN TO USE
- Post-API execution checks
- Validating RBAC and RLS
- Reviewing transaction consistency

## INPUT
- Database Tables (`audit_logs`, `projects`, etc.)
- Expected State

## OUTPUT
- Integrity Report (Success/Corruption detected)

## EXECUTION STEPS
1. **Query Mutation**: Fetch records affected by the last automated event.
2. **Assert Data Integrity**: Match results against the defined AC and schema.
3. **Validate Audit Trail**: Confirm a corresponding log entry exists with matching correlation IDs.
4. **Check RLS Compliance**: Attempt to fetch the same data using a non-owner role to verify the query fails.
5. **Verify Event Sink**: Check the `event_logs` to ensure emission was recorded.

## VALIDATION RULES
- No state change allowed without an accompanying audit record.

## FAILURE CONDITIONS
- Successful API response with NO database update.
- Records updated but RLS failing to block unauthorized read attempts.

## DEPENDENCIES
- `.agents/skills/database/rls-policies.md`
- `.agents/skills/database/transaction-handling.md`
