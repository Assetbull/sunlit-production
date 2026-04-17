# SKILL: Escrow Logic Enforcement

## PURPOSE
To manage the immutable state machine governing the safety and release of project funds.

## WHEN TO USE
- Initializing project funding
- Processing milestone approvals
- Handling disputes

## INPUT
- Project State
- Milestone Completion Status
- Dispute Flag

## OUTPUT
- Payment Release Trigger or Fund Lock

## EXECUTION STEPS
1. **Derive State**: Lock funds upon `escrow_funded` event.
2. **Apply Blocking Rule**: IF `dispute == TRUE`, then BLOCK all releases regardless of milestone status.
3. **Apply Hold Rule**: IF `milestone_complete == FALSE`, then HOLD funds.
4. **Apply Release Rule**: IF `approved == TRUE`, then trigger RELEASE via payment provider API.
5. **Log Immutably**: Every transition must be written to `escrow` and `audit_logs` tables.

## VALIDATION RULES
- No manual override of escrow rules allowed in code.
- Rule priority: Dispute > Approval > Milestone Completion.

## FAILURE CONDITIONS
- Funding release to an unverified (KYC) installer.
- Dispute status being bypassed by admin override.

## DEPENDENCIES
- `.agents/skills/workflows/payment-flow.md`
- `.agents/skills/security/rbac-enforcement.md`
