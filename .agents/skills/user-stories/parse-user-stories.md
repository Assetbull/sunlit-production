# SKILL: User Story Parsing Logic

## PURPOSE
To convert unstructured or semi-structured requirements into the standardized Sunlit Energy user story format for deterministic development.

## WHEN TO USE
- Reviewing requirement documents
- Initializing development on a new feature
- Breaking down Epics into actionable items

## INPUT
- `requirements.md` text
- Feature descriptions

## OUTPUT
- Standardized User Story (ID, Title, Persona, Need, Benefit, AC)

## EXECUTION STEPS
1. **Identify Persona**: Determine if the story belongs to Project Owner, Installer, CrewLink, EPC, or Admin.
2. **Extract Need and Benefit**: Format as "AS A [persona] I WANT [action] SO THAT [value]".
3. **Draft Acceptance Criteria (AC)**: Break down implementation details into a bulleted "PASS/FAIL" list.
4. **Identify Enhanced UX Rules**: Extract constraints related to Stitch, Pro Max, performance, or accessibility.
5. **Associate Test Cases**: Map requirements to specific simulation/validation tests.

## VALIDATION RULES
- Resulting AC must be deterministic (verifiable).
- Story must align with the role-specific boundaries in `GEMINI.md`.

## FAILURE CONDITIONS
- Vague AC (e.g., "The dashboard should look good").
- Persona mismatch.

## DEPENDENCIES
- `.agents/skills/user-stories/validate-user-story.md`
