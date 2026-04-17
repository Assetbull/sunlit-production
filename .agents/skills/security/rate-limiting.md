# SKILL: API Rate Limiting Logic

## PURPOSE
To protect the system from brute-force attacks, DDoS, and API abuse.

## WHEN TO USE
- Defining public endpoints
- Authorizing OTP requests
- Managing login flows

## INPUT
- Request IP
- User ID (if authenticated)
- Route Target

## OUTPUT
- Request allowed or 429 Too Many Requests

## EXECUTION STEPS
1. **Identify Sensitivity**: Apply stricter limits to Auth (`login`, `otp_verify`) and Payments (`release`).
2. **Assign Quotas**: Define calls-per-minute limits based on role and endpoint.
3. **Enable Redis Cache**: Track request counts in Redis for low-latency verification.
4. **Enforce Delay**: Apply exponential backoff after multiple failed OTP attempts.
5. **Monitor Violations**: Log IPs reaching limits for potential blacklisting.

## VALIDATION RULES
- OTP requests limited to 1 per 60 seconds per user.
- Max 5 failed logins before temporary lockout.

## FAILURE CONDITIONS
- Unlimited retries on sensitive endpoints.
- Rate limiting that blocks legitimate high-frequency events (e.g., telemetry).

## DEPENDENCIES
- `.agents/skills/api/idempotency-handling.md`
