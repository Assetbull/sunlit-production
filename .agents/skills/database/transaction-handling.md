# SKILL: Atomic Transaction Management

## PURPOSE
To maintain data integrity during complex multi-step updates (e.g., payment release + status update).

## WHEN TO USE
- Initializing Escrow funding
- Completing Milestone approvals
- Handling Disputes

## INPUT
- List of dependent database operations

## OUTPUT
- Atomic update (Success: Commit, Failure: Rollback)

## EXECUTION STEPS
1. **Initialize Transaction**: use `DataService.transaction()` wrapper.
2. **Perform Dependent Updates**: Execute all related writes (e.g., update project status AND log audit record).
3. **Handle Errors**: Catch any failure in the sequence.
4. **Trigger Rollback**: ensure all changes are undone if any single step fails.
5. **Commit & Emit**: Only emit system events AFTER the transaction is successfully committed to the DB.

## VALIDATION RULES
- Critical مالی (financial) operations MUST be wrapped in transactions.
- Audit logs MUST be part of the transaction for state changes.

## FAILURE CONDITIONS
- Emitting an `escrow_funded` event before the DB record is persisted.
- Orphaned records caused by partial failures.

## DEPENDENCIES
- `.agents/skills/events/event-publishing.md`
- `.agents/skills/security/escrow-rules.md`
