# SKILL: CI/CD Build Pipeline Standards

## PURPOSE
To ensure that all code pushed to production is validated, optimized, and verified against the global test engine.

## WHEN TO USE
- Configuring GitHub Actions or CI runners
- Merging code to `main` or `staging`
- Manually triggering a production build

## INPUT
- New code push (Branch)
- Regression test suite

## OUTPUT
- Validated Build Artifacts or Deployment Block

## EXECUTION STEPS
1. **Enforce Linting & Types**: Run `eslint` and `tsc` to ensure zero type errors or styling violations.
2. **Execute Global Test Engine**: Run the full 7-step protocol on all new and modified features.
3. **Run Regression Suite**: Perform a full-loop marketplace test (RFQ -> Review).
4. **Audit Security**: Check for exposed secrets or vulnerable dependencies using `npm audit`.
5. **Final Sign-off**: Proceed ONLY if 100% of checklists (from `Checklist.yaml`) pass.

## VALIDATION RULES
- No "force-push" or bypass allowed for production branches.
- Build must fail if interaction SLAs (interactions > 100ms) are significantly degraded.

## FAILURE CONDITIONS
- Deploying a build that has failed API contract or RLS verification tests.
- Missing deployment logs or correlation IDs in the CI history.

## DEPENDENCIES
- `.agents/skills/testing/global-test-engine.md`
- `.agents/skills/deployment/performance-optimization.md`
