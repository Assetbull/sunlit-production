# SKILL: Event Publishing Mechanism

## PURPOSE
To ensure that all critical state changes are broadcasted to the system's real-time core through a standardized emission pattern.

## WHEN TO USE
- Committing a state change in Database (Post-Transaction)
- Triggering background workflows
- Broadcasting real-time updates to connected clients

## INPUT
- Event Type (from approved list)
- Event Payload
- User Context (user_id, IP)

## OUTPUT
- Successfully emitted event record in `event_logs`

## EXECUTION STEPS
1. **Verify Role Authority**: Ensure the user has permission to trigger the specific event.
2. **Standardize Payload**: Structure data as defined in `sunlit.ace.yaml`.
3. **Attach Metadata**: Include `correlation_id`, `user_id`, and `timestamp`.
4. **Publish to Realtime Hub**: Use Supabase Realtime (Broadcast/Presence) to emit the event.
5. **Sync with Audit Log**: Write a mirrored record to the append-only `audit_logs` table for redundancy.

## VALIDATION RULES
- 0% omission: Every state change defined in `requirements.md` MUST emit an event.
- Events must be published AFTER DB transaction commit.

## FAILURE CONDITIONS
- Silent failures where state changes but NO event is emitted.
- Emitting events for uncommitted/failed DB transactions.

## DEPENDENCIES
- `.agents/skills/database/transaction-handling.md`
