# SKILL: Deterministic Mock API Design

## PURPOSE
To provide stable, schema-compliant endpoints for frontend development and testing when backend services are offline.

## WHEN TO USE
- Early-stage dashboard development
- UI prototyping for Pro Max patterns
- Isolated frontend testing

## INPUT
- API Endpoint Route
- Success/Error Payload Scenarios

## OUTPUT
- Mock API Handler (Next.js Edge or Route Handler)

## EXECUTION STEPS
1. **Match Production Interface**: Ensure the mock URL and JSON structure exactly match the intended production DataService API.
2. **Implement Scenario Switching**: Use query parameters (e.g., `?mock_state=success`) to toggle between different mock responses.
3. **Simulate Latency**: Add a forced delay (500ms - 2000ms) to verify loading states and skeleton UI.
4. **Log Request**: Log mock interactions to the browser console for debugging.
5. **Standardize HTTP Status**: Return appropriate codes (200, 401, 500) to test frontend error boundaries.

## VALIDATION RULES
- Mock responses must use the same TypeScript interfaces as the production system.
- Mocks should be easily swappable with the real API via feature flags.

## FAILURE CONDITIONS
- Mocks that use "lazy" non-compliant structures.
- Forgetting to disable mocks in production build environments.

## DEPENDENCIES
- `.agents/skills/api/api-contract-enforcement.md`
- `.agents/skills/ui-ux/loading-states.md`
