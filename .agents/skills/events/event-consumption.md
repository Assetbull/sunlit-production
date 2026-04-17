# SKILL: Idempotent Event Consumption

## PURPOSE
To handle incoming system events reliably, ensuring that subscribers can process messages without creating duplicate side-effects.

## WHEN TO USE
- Implementing listeners for background jobs
- Updating UI state via Realtime subscriptions
- Triggering cross-module logic

## INPUT
- Event Message
- Callback logic/Service handler

## OUTPUT
- Successfully processed action or 100% ignored duplicate

## EXECUTION STEPS
1. **Identify Event ID**: Retrieve the unique ID associated with the incoming event.
2. **Verify Idempotency**: Check if this specific Event ID has already been processed by the consumer.
3. **Execute Handler**: Run the intended business logic (e.g., send an SMS on `escrow_funded`).
4. **Mark as Complete**: Persist the event processing status in a local consumer-tracking table.
5. **Handle Failures**: Implement a "Dead Letter Queue" or retry logic for events that fail to process.

## VALIDATION RULES
- Subscribers must never assume they are receiving an event only once.
- Processing must be atomic with the consumer state update.

## FAILURE CONDITIONS
- Infinite loops caused by a consumer emitting an event that triggers itself.
- Double-processing of critical financial events (e.g., double-crediting an account).

## DEPENDENCIES
- `.agents/skills/api/idempotency-handling.md`
