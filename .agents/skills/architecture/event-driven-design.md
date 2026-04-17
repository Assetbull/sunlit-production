# SKILL: Event-Driven Design Patterns

## PURPOSE
To standardize the implementation of real-time, decoupled communication across the marketplace using an immutable event bus.

## WHEN TO USE
- Implementing state changes that affect multiple modules
- Triggering notifications or background jobs
- Synchronizing real-time UI updates

## INPUT
- State transition triggers
- List of intended subscribers

## OUTPUT
- Defined event schemas
- Functional emitters and listeners
- Auditable event logs

## EXECUTION STEPS
1. **Define Core Event**: Map every critical system action to a core event defined in `requirements.md` (e.g., `rfq_created`, `escrow_funded`).
2. **Ensure Immutability**: Events once emitted must never be modified. All change history is reflected in subsequent events.
3. **Implement Idempotency**: Ensure message consumers can process the same event multiple times without side effects (e.g., duplicate payments).
4. **Global Audit Sync**: Every event MUST be logged in the `event_logs` or `audit_logs` table with a `correlation_id`.
5. **Real-time Hydration**: Use Supabase Realtime to broadcast events from the database to the frontend for <= 100ms interaction latency.

## VALIDATION RULES
- Event payload matches the schema in `sunlit.ace.yaml`.
- All critical state transitions (RFQ status changes, Payment status) reach the event bus.

## FAILURE CONDITIONS
- Direct DB updates that bypass event emission.
- Events missing required metadata (user_id, timestamp, correlation_id).

## DEPENDENCIES
- `.agents/skills/events/event-publishing.md`
- `.agents/skills/database/transaction-handling.md`
