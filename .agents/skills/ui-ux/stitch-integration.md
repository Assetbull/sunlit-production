# SKILL: Stitch Design System Integration

## PURPOSE
To ensure any UI generated or modified for Sunlit Energy Marketplace aligns with the foundational layout and tokens of the approved Stitch design project.

## WHEN TO USE
- Creating new dashboard pages
- Adding components (buttons, cards, menus)
- Mapping API data to UI structures

## INPUT
- UI Requirement (e.g., "Bids Table")
- Stitch Project ID: `10188232242382894236`

## OUTPUT
- Compliant UI code (Next.js/Stitch components)

## EXECUTION STEPS
1. **Connect to Stitch MCP**: Always use the Stitch MCP tools for generating or editing screens.
2. **Apply Design Tokens**: Ensure colors, typography, and spacing are derived from the Stitch design system.
3. **Bind Components**: Use predefined Stitch components for forms, tables, and navigation.
4. **Maintain Layout Consistency**: Adhere to the sidebar/topbar shell structure defined in the master project.
5. **Verify Project ID**: Never generate UI for Sunlit Energy without targeting Project ID `10188232242382894236`.

## VALIDATION RULES
- 100% of UI must be traceable to the Stitch MCP project.
- No external UI libraries allowed unless explicitly approved.

## FAILURE CONDITIONS
- UI generation that bypasses the Stitch design bridge.
- Inconsistent layout between different dashboard modules.

## DEPENDENCIES
- `.agents/skills/ui-ux/pro-max-patterns.md`
