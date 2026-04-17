# SKILL: Session Management & Security

## PURPOSE
To maintain a safe, persistent user state while preventing hijacking and unauthorized reuse.

## WHEN TO USE
- Initializing post-login sessions
- Validating middleware requests
- Handling logout/session-clearance

## INPUT
- Clerk JWT
- Device metadata

## OUTPUT
- Validated session state or redirect to login

## EXECUTION STEPS
1. **JWT Verification**: Validate the token signature and expiration on EVERY request.
2. **Session Persistence**: Store session identifiers in `httpOnly` cookies or secure `localStorage` (for mocks).
3. **Inactivity TTL**: Implement a sliding window of activity (e.g., auto-logout after 30 mins of idle time).
4. **Multi-Tab Sync**: Ensure status changes (like logout) are reflected across all open browser instances.
5. **Clearance on Logout**: Completely wipe all local session traces and invalidate the server-side token.

## VALIDATION RULES
- Never trust the frontend "isLoggedIn" state for sensitive operations.
- Session tokens must be rotated regularly if supported by the provider.

## FAILURE CONDITIONS
- Session hijacking through unencrypted storage.
- Expired tokens being accepted by the API.

## DEPENDENCIES
- `.agents/skills/api/api-contract-enforcement.md`
