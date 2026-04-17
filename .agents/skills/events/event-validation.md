# SKILL: Event Schema Validation

## PURPOSE
To ensure that the global event bus remains clean and that all consumers can rely on a consistent data structure.

## WHEN TO USE
- Defining new event types
- Reviewing event-driven code changes
- Debugging subscriber failures

## INPUT
- Event Payload
- Target Schema (from `sunlit.ace.yaml`)

## OUTPUT
- Validated Event or Rejected Payload

## EXECUTION STEPS
1. **Match Event Type**: Cross-reference the payload against the list of mandatory events in `requirements.md`.
2. **Verify Mandatory Fields**: Ensure presence of `correlation_id`, `actor_id`, and `payload`.
3. **Type-Check Payload**: Validate that the nested data object adheres to the specific event's required structure.
4. **Reject Malformed Events**: Block any event that lacks traceability or consistent schemas.
5. **Update Registry**: Ensure any new event types are added to the system's global event registry.

## VALIDATION RULES
- No "generic" events allowed. Every event must have a specific, named type.

## FAILURE CONDITIONS
- Undocumented events entering the bus.
- Schema changes that break existing consumers without versioning.

## DEPENDENCIES
- `.agents/skills/api/api-contract-enforcement.md`
