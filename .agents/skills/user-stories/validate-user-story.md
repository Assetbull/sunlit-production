# SKILL: User Story Validation Logic

## PURPOSE
To ensure implemented features exactly match the requirements and AC defined in the master project documents.

## WHEN TO USE
- Completing a task or feature
- Post-implementation verification
- Code review / Pull Request validation

## INPUT
- Implemented code/UI
- Target User Story AC

## OUTPUT
- Status Report (PASS/FAIL) for every AC item

## EXECUTION STEPS
1. **Load Target Story**: Read the AC and "Enhanced UX Rules" for the specific story ID.
2. **Execute Multi-Factor Verification**:
   - UI Review: Check against Stitch/Pro Max rules.
   - DB Review: Verify schema and RLS.
   - Security Review: Verify RBAC and sanitization.
3. **Check Failure Conditions**: Ensure all "Fail if" rules from `GEMINI.md` or `requirements.md` are avoided.
4. **Final PASS Approval**: Mark story as complete only if 100% of AC are met.

## VALIDATION RULES
- No partial approval. 99% AC met = FAIL.

## FAILURE CONDITIONS
- Implementation deviates from AC without documented approval.

## DEPENDENCIES
- `.agents/skills/testing/global-test-engine.md`
