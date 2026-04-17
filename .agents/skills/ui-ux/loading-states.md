# SKILL: Intelligent Loading States

## PURPOSE
To manage user perception of speed and system responsiveness during data fetching or processing.

## WHEN TO USE
- Navigating between dashboard pages
- Waiting for API responses (e.g., submitting a bid)
- Initializing the application

## INPUT
- Data fetching lifecycle (Loading, Success, Error)

## OUTPUT
- Skeleton UI or animated loading transition

## EXECUTION STEPS
1. **Enforce Skeleton Loaders**: Display light grey placeholders for text, cards, and tables before data hydrates.
2. **Apply Progressive Hydration**: Allow UI shells to render immediately (<= 2s) while individual data points load.
3. **Use Micro-animations**: Add subtle pulsing or shimmering effects to skeleton components.
4. **Handle Interaction Blocking**: Use "Optimistic UI" for fast actions (like rating) or clear loading overlays for heavy actions (like payments).
5. **Error Boundaries**: Provide clear fallback UI if the data fails to load after a timeout.

## VALIDATION RULES
- Initial page paint < 2s.
- No "blank screen" states allowed during navigation.

## FAILURE CONDITIONS
- Layout shifts caused by components resizing after data loads.
- UI locking for > 500ms without a visual loading indicator.

## DEPENDENCIES
- `.agents/skills/ui-ux/stitch-integration.md`
