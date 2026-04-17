# SKILL: Webhook Signature Verification

## PURPOSE
To prevent spoofing and ensure that notifications from external providers (Paystack, Clerk, etc.) are authentic.

## WHEN TO USE
- Receiving payment confirmations
- Syncing user role data from Clerk
- Handling Sanity content updates

## INPUT
- Incoming Header (e.g., `x-paystack-signature`)
- Raw Request Body
- Secret Key (from Environment Variables)

## OUTPUT
- Verified Payload or 401 Unauthorized

## EXECUTION STEPS
1. **Extract Signature**: Retrieve the HMAC signature from the specific provider header.
2. **Compute Local Hash**: Hash the raw body using the provider-specific algorithm (e.g., SHA512 for Paystack).
3. **Compare Signatures**: Use constant-time comparison to verify equality.
4. **Authorize Processing**: Proceed only if signatures match.
5. **Log Metadata**: Record the event ID and timestamp for idempotency checks.

## VALIDATION RULES
- Signature verification is MANDATORY for all webhooks.
- Do NOT use the parsed JSON body for hashing.

## FAILURE CONDITIONS
- Processing a payment without a verified webhook signature.
- Storing secrets directly in the source code.

## DEPENDENCIES
- `.agents/skills/api/idempotency-handling.md`
