# SKILL: Interactive Form Validation UI

## PURPOSE
To provide real-time, accessible feedback to users during data entry, preventing submission errors and improving UX.

## WHEN TO USE
- Designing RFQ forms
- Creating login/registration screens
- Mapping inputs to backend validation rules

## INPUT
- Form field requirements
- Zod/Yup validation schema

## OUTPUT
- Interactive form with real-time error/success states

## EXECUTION STEPS
1. **Implement Real-time Feedback**: Show error messages immediately as the user types or leaves a field (blur event).
2. **Standardize Visual Cues**: Use color (red/green), icons (check/cross), and descriptive text for validation states.
3. **Disable Invalid Actions**: Prevent the "Submit" button from being clickable until all mandatory fields are valid.
4. **Accessibility Compliance**: Use appropriate ARIA labels and roles for error messages.
5. **Clear Error Recovery**: Ensure messages disappear as soon as the user corrects the input.

## VALIDATION RULES
- No form submission is possible without client-side validation check.

## FAILURE CONDITIONS
- Returning a generic "Something went wrong" after the user clicks submit.
- Missing validation feedback for critical fields (e.g., Phone number format).

## DEPENDENCIES
- `.agents/skills/security/input-validation.md`
