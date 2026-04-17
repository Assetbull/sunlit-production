# SKILL: User Story Generation Standard

## PURPOSE
To create high-fidelity, production-ready user stories that serve as the single source of truth for implementation.

## WHEN TO USE
- Drafting new features for dashboards
- Expanding existing system capabilities
- Creating documentation for future modules

## INPUT
- Feature concept or business logic
- Compliance requirements

## OUTPUT
- Complete Markdown User Story block

## EXECUTION STEPS
1. **Assign Unique ID**: Use format [ROLE]-[SEQ] (e.g., PO-024).
2. **Standardize Header**: Include Role, Title, and Persona mapping.
3. **Define AC precisely**: Ensure every UI element and state transition is captured.
4. **Map to Tech Stack**: Specify which services (Supabase, Clerk, Sanity) are impacted.
5. **Add Security Rules**: Include specific RBAC or encryption needs as AC.

## VALIDATION RULES
- AC must cover: Success state, Failure state, Edge cases, Security, and UI.

## FAILURE CONDITIONS
- Missing Persona or ID.
- AC that cannot be unit tested or visually verified.

## DEPENDENCIES
- `.agents/skills/user-stories/parse-user-stories.md`
