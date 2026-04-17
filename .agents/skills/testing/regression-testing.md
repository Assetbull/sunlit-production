# SKILL: Full-System Regression Testing

## PURPOSE
To maintain overall project stability by verifying that new features do not break existing marketplace workflows.

## WHEN TO USE
- Before any Git push or release
- After major architectural changes
- Regularly scheduled health checks

## INPUT
- Full Project Suite
- Regression Suite (RFQ -> Bid -> Payment -> Milestone -> Review)

## OUTPUT
- Regression Health Report

## EXECUTION STEPS
1. **Initialize Clean Slate**: Reset test environment and seed base data.
2. **Execute Core Loops**: Run end-to-end flows for Project Owner and Installer personas.
3. **Verify Cross-Module Health**: Ensure notifications and events reach EPC and Admin dashboards.
4. **Check Performance SLAs**: Ensure overall system responsiveness hasn't degraded.
5. **Analyze Failures**: If ANY test fails, block deployment and trigger the recovery protocol.

## VALIDATION RULES
- Zero tolerance for regression failures.
- All core marketplace steps (RFQ Create to Review submit) must complete successfullly.

## FAILURE CONDITIONS
- Ignoring "small" failures in non-critical modules.
- Bypassing regression tests to meet a deadline.

## DEPENDENCIES
- `.agents/skills/testing/global-test-engine.md`
