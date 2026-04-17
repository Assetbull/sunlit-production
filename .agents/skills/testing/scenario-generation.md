# SKILL: Scenario and Mock Data Generation

## PURPOSE
To create robust, edge-case-heavy data environments for testing system limits and complex business logic.

## WHEN TO USE
- Initializing the Test Engine
- Debugging dispute or escrow failures
- Benchmarking system performance

## INPUT
- Entity Model (e.g., Project, Bid)
- Target state (e.g., "Disputed Project", "Unverified Installer")

## OUTPUT
- Mock Data JSON / Seed Script

## EXECUTION STEPS
1. **Model Baseline**: Load the standardized schema for the target entity.
2. **Inject Edge Cases**: Add invalid characters, extreme numeric values, and out-of-order timestamps.
3. **Simulate Relationships**: Ensure the mock project has a linked RFQ, multiple bids, and an escrow record.
4. **Contextualize Data**: Use Nigeria-specific context (e.g., +234 phone numbers, Lagos addresses).
5. **Seed Test Environment**: Inject generated data into the test database (using `DataService.create`).

## VALIDATION RULES
- Generated data must NOT conflict with existing RLS or constraint rules unless intended.

## FAILURE CONDITIONS
- Testing with "perfect" data that doesn't account for user error.
- Mock data leaking into production environments.

## DEPENDENCIES
- `.agents/skills/database/schema-design.md`
