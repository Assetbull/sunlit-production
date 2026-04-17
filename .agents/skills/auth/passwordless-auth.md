# SKILL: Passwordless Auth Implementation

## PURPOSE
To implement secure, frictionless entry points to the system without traditional passwords.

## WHEN TO USE
- Designing registration/login UI
- Handling authentication API calls
- Configuring Clerk auth settings

## INPUT
- Auth Method (Email OTP, Phone SMS OTP, OAuth)
- User Identifier

## OUTPUT
- Triggered Challenge (Email/SMS)
- Validated Profile

## EXECUTION STEPS
1. **Enforce Passwordless Policy**: Ensure NO password fields exist or are accepted by the API.
2. **Execute OTP Logic**:
   - Length: 6 digits.
   - TTL: 60-120 seconds.
   - Target: Nigeria phone numbers (+234 format) or verified emails.
3. **Handle OAuth Fallback**: Use Redirect/Popup patterns for Google and Apple providers.
4. **Implement Rate Limiting**: Max 5 attempts per session; 1 request per 60s per identifier.
5. **Verify Single-Use**: Ensure OTP is invalidated immediately upon successful or failed verification.

## VALIDATION RULES
- 100% password-free architecture.
- Authentication must include device fingerprinting for security.

## FAILURE CONDITIONS
- OTP delivery delays exceeding TTL.
- Bruteforce attempts not triggering immediate lockout.

## DEPENDENCIES
- `.agents/skills/security/rate-limiting.md`
