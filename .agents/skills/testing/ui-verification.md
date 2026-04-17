# SKILL: High-Fidelity UI Verification

## PURPOSE
To ensure visual and interaction logic adheres to Stitch/Pro Max standards and remains functional across devices.

## WHEN TO USE
- Reviewing UI changes
- Running browser-based integration tests
- Validating accessibility

## INPUT
- UI View/Page
- Design Specs (Stitch Tokens, Pro Max Patterns)

## OUTPUT
- Visual Validation Report

## EXECUTION STEPS
1. **Check Component Binding**: Verify that buttons, tables, and forms are recognized Stitch components.
2. **Measure Interaction Latency**: Confirm clicks/hover effects respond in < 100ms.
3. **Test Responsiveness**: View the UI at Mobile (375px), Tablet (768px), and Desktop (1440px) breakpoints.
4. **Validate Loading States**: Confirm skeleton loaders appear during data fetches.
5. **SEO & Accessibility Audit**: Verify presence of Meta tags, unique IDs, and ARIA roles.

## VALIDATION RULES
- 100% adherence to the "Liquid Solar Glass" aesthetic.
- Buttons must show active/loading/disabled states correctly.

## FAILURE CONDITIONS
- Layout breaking on mobile devices.
- Images without descriptive ALT tags.

## DEPENDENCIES
- `.agents/skills/ui-ux/stitch-integration.md`
