# SKILL: Global Test Engine Orchestration

## PURPOSE
To enforce a deterministic, 7-step validation protocol for every system feature, ensuring 100% reliability and regulatory compliance.

## WHEN TO USE
- Finishing a code change or feature implementation
- Running pre-deployment checks
- Investigating system regressions

## INPUT
- Feature Codebase
- Targeted User Stories (AC)

## OUTPUT
- Complete Test Report (PASS/FAIL)

## EXECUTION STEPS
1. **Simulate Data**: Generate production-like mock data for the test context.
2. **Simulate User Event**: Trigger the intended action (UI click, API call, Event emission).
3. **Verify UI State**: Check for layout correctness, loading states, and error messages.
4. **Verify DB State**: Assert that records exist and match the expected mutation.
5. **Verify API Response**: Ensure HTTP status and JSON payload match the contract.
6. **Verify Security Rules**: Confirm that unauthorized roles are blocked and RLS is active.
7. **Verify Console Logs**: Ensure zero unhandled exceptions or console errors.

## VALIDATION RULES
- No feature can be marked as "Ready" without passing all 7 steps.
- Failures in step 4 or 6 are critical blockages.

## FAILURE CONDITIONS
- Tests that "pass" on incomplete implementation.
- Manual verification used instead of automated engine steps.

## DEPENDENCIES
- `.agents/skills/testing/scenario-generation.md`
- `.agents/skills/testing/regression-testing.md`
