# SKILL: Review & Rating Workflow

## PURPOSE
To capture and persist qualitative feedback on project execution.

## WHEN TO USE
- Project reaches COMPLETION status
- User submits a rating for an installer/service

## INPUT
- Rating (1-5)
- Written review text

## OUTPUT
- Review record in DB
- Updated entity reputation score

## EXECUTION STEPS
1. **Verify Completion**: Ensure project status is `COMPLETED`.
2. **Collect Feedback**: Capture star rating and comment.
3. **Persist Review**: Save record to `reviews` table with links to project and user.
4. **Recalculate Rating**: Update the target's aggregate rating in the system.
5. **Emit Event**: Broadcast `rating_submitted`.

## VALIDATION RULES
- Ratings must be between 1 and 5.
- Reviews cannot be edited after initial submission (append-only logic).

## FAILURE CONDITIONS
- Submitting reviews for non-existent or ongoing projects.

## DEPENDENCIES
- `.agents/skills/events/event-publishing.md`
