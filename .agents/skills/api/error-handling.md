# SKILL: Standardized Error Handling

## PURPOSE
To provide consistent, safe, and helpful feedback to the client while protecting internal system details.

## WHEN TO USE
- API logic failures
- Validation rejections
- Database or provider timeouts

## INPUT
- Triggering exception or error state

## OUTPUT
- Standardized Error Response (JSON)

## EXECUTION STEPS
1. **Categorize Error**: Map the error to a standard HTTP status code (400, 401, 403, 404, 500).
2. **Abstract Details**: Remove stack traces and raw DB errors from the response payload for security.
3. **Assign Error Code**: Use internal error codes (e.g., `AUTH_001`, `PAY_002`) for precise frontend handling.
4. **Log Internally**: Record the full error details and correlation ID in the `audit_logs`.
5. **User Feedback**: Return a human-readable message that aligns with the user's role and context.

## VALIDATION RULES
- No raw error objects allowed in production responses.
- All internal errors (500) must trigger an administrative alert.

## FAILURE CONDITIONS
- Leaking table names or file paths in error messages.
- Returning 200 OK for requests that actually failed.

## DEPENDENCIES
- `.agents/skills/security/input-validation.md`
