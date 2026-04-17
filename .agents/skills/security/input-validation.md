# SKILL: Server-Side Input Validation

## PURPOSE
To ensure all data entering the system is sanitized, correctly typed, and safe from injection or corruption.

## WHEN TO USE
- Defining API endpoints
- Handling form submissions
- Processing external data streams

## INPUT
- Incoming HTTP request payload
- Target Zod/Yup schema

## OUTPUT
- Validated/Sanitized data object
- 400 Bad Request response on failure

## EXECUTION STEPS
1. **Apply Schema Validation**: Use a strict schema (e.g., Zod) to verify types, lengths, and patterns for all fields.
2. **Rejection of Unknowns**: Discard any fields not explicitly defined in the input schema.
3. **Escaping & Sanitization**: Sanitize string inputs to prevent XSS and SQL injection.
4. **Range & Logic Checks**: Verify numeric ranges (e.g., `quantity > 0`) and business logic constraints.
5. **Standardized Error Messaging**: Return precise, role-appropriate error messages if validation fails.

## VALIDATION RULES
- 100% of API endpoints must have a corresponding validation schema.
- DataService must re-validate before passing to DB (Defense in Depth).

## FAILURE CONDITIONS
- Raw string usage in SQL queries (must use parameterized queries only).
- Bypassing validation for "internal" API calls.

## DEPENDENCIES
- `.agents/skills/api/error-handling.md`
