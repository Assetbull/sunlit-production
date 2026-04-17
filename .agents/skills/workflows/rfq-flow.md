# SKILL: RFQ Workflow Execution

## PURPOSE
To guide the deterministic creation, broadcasting, and management of Request for Quotations (RFQs).

## WHEN TO USE
- A Project Owner initiates a new project
- Managing existing RFQ states
- Reviewing RFQ matching logic

## INPUT
- Project details (Type, Solution Path, Assets)
- Location data

## OUTPUT
- RFQ record in DB
- `rfq_created` event
- Notifications to matching installers

## EXECUTION STEPS
1. **Initiate Stepper**: Trigger the sequential UI stepper (Initiate -> Type -> Solution -> Input -> Discovery -> Submission).
2. **Collect Input**:
   - System Installation: Inverter, Battery, Panel, Accessories.
   - Appliance Path: Load calc based on AC, Fans, Fridge, Bulbs, Pump. Rejects Iron, Kettle, Cooker.
3. **Geo-Discovery**: Perform geo-query to find nearest installers.
4. **Finalize Submission**: Save RFQ to DB and generate unique RFQ ID.
5. **Emit Event**: Broadcast `rfq_created` to the event bus.

## VALIDATION RULES
- RFQ ID must be unique.
- Budget and timeline must be logical (non-negative, sequential tags).

## FAILURE CONDITIONS
- RFQ created without geo-discovery.
- Critical asset fields missing.

## DEPENDENCIES
- `.agents/skills/events/event-publishing.md`
- `.agents/skills/ui-ux/stitch-integration.md`
