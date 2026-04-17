# SKILL: Mock Event Bus Simulation

## PURPOSE
To test real-time system responses and consumer logic without an active Supabase Realtime connection.

## WHEN TO USE
- Testing real-time UI hydration
- Validating event consumer idempotency
- Simulating push notifications

## INPUT
- Target Event Name (e.g., `bid_submitted`)
- Payload data

## OUTPUT
- Simulated Event broadcast

## EXECUTION STEPS
1. **Prepare Payload**: Construct a valid event object with `correlation_id` and `timestamp`.
2. **Trigger Dispatch**: Manually call the event handler or emit a custom browser event.
3. **Assert Propagation**: Verify that the UI updates (e.g., bid count increases) in response to the mock event.
4. **Simulate Out-of-Order**: Trigger multiple events in non-sequential order to test system resilience.
5. **Log Simulation**: Use a dedicated "Mock Bus" log for debugging event flows.

## VALIDATION RULES
- Simulated events must exactly mirror the JSON structure of production events.

## FAILURE CONDITIONS
- UI failing to react to mock events due to tight coupling with database-only triggers.

## DEPENDENCIES
- `.agents/skills/events/event-publishing.md`
