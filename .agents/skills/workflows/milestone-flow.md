# SKILL: Milestone Tracking Workflow

## PURPOSE
To manage project progression through defined execution stages.

## WHEN TO USE
- Installer updates project status
- Project Owner approves completion
- Releasing payments based on progress

## INPUT
- Project ID
- Milestone type (Post-Installation, Completion, etc.)

## OUTPUT
- Updated milestone record
- `milestone_completed` event

## EXECUTION STEPS
1. **Define Milestones**: Load standard set (Design, Procurement, Installation, Testing, Completion).
2. **Update Status**: Installer marks milestone as `COMPLETED` and uploads evidence.
3. **Request Approval**: Project Owner reviews evidence and approves.
4. **Trigger Release**: Upon approval, notify the Escrow engine to release associated funds.
5. **Log History**: Persist timestamp and user activity for the milestone transition.

## VALIDATION RULES
- Milestones must be completed in order (Testing before Completion).
- Evidence (Photos/Files) required for Installation/Completion milestones.

## FAILURE CONDITIONS
- Payment release triggered before Approval.
- Skipping milestone stages.

## DEPENDENCIES
- `.agents/skills/workflows/payment-flow.md`
