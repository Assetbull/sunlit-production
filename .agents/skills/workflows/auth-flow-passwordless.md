# SKILL: Passwordless Auth Workflow

## PURPOSE
To manage secure, frictionless authentication using Clerk and OTP/OAuth patterns.

## WHEN TO USE
- User registration
- User login
- Session restoration

## INPUT
- Email, Phone, or OAuth Provider (Google/Apple)

## OUTPUT
- JWT/Session token
- User profile in DB

## EXECUTION STEPS
1. **Select Method**: Google/Apple OAuth or OTP (Email/Phone - Nigeria focus).
2. **Request Challenge**: Clerk sends 6-digit OTP or redirects to provider.
3. **Verify Challenge**: User enters OTP or provider returns success.
4. **Initialize Profile**: Retrieve email/name. Assign default role (`project_owner`).
5. **Create Session**: Issue JWT and persist in secure storage.

## VALIDATION RULES
- NO password fields allowed in UI.
- Rate limits enforced on OTP requests.

## FAILURE CONDITIONS
- OTP expired.
- Unauthorized domain used for OAuth.

## DEPENDENCIES
- `.agents/skills/auth/passwordless-auth.md`
