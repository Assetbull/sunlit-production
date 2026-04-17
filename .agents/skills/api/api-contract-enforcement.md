# SKILL: API Contract Enforcement

## PURPOSE
To ensure that all data exchanged between the frontend, backend, and external services adheres to strict, predefined interfaces.

## WHEN TO USE
- Designing new API endpoints
- Integrating with external providers (Paystack, Clerk)
- Validating service-to-service communication

## INPUT
- Request/Response data
- API Schema definition from `sunlit.ace.yaml`

## OUTPUT
- Validated payload or rejection trigger

## EXECUTION STEPS
1. **Load Contract Schema**: Reference the API contracts defined in the project configuration.
2. **Validate Request Body**: Ensure the incoming payload matches the required types and mandatory fields.
3. **Validate Response Structure**: Ensure the backend returns data in the standardized JSON format.
4. **Reject Deviations**: Trigger the `OUTPUT_VALIDATION_PIPELINE` to block any response that leaks sensitive data or lacks required headers.
5. **Version Check**: Ensure the request uses the correct API version (e.g., `/v1/`).

## VALIDATION RULES
- 0% tolerance for schema mismatches in production.
- All responses must include a `correlation_id` for tracing.

## FAILURE CONDITIONS
- Returning raw database objects directly to the client.
- Modifying API contracts without updating documentation.

## DEPENDENCIES
- `.agents/skills/security/input-validation.md`
