# SKILL: Idempotency Handling Logic

## PURPOSE
To prevent side effects from duplicate requests, ensuring that performing the same operation multiple times yields the same result without redundant processing.

## WHEN TO USE
- Processing payments
- Submitting RFQs or Bids
- Emitting system events

## INPUT
- `idempotency-key` (Header)
- Request payload

## OUTPUT
- Original response (for duplicates) or primary execution result

## EXECUTION STEPS
1. **Extract Key**: Retrieve the unique idempotency key from the request header.
2. **Check Cache/Store**: Search for the key in the `idempotency_logs` or Redis cache.
3. **Handle Duplicates**: If the key exists, return the cached response immediately without re-executing logic.
4. **Execute & Store**: If the key is new, process the request, store the result alongside the key, and then return.
5. **Enforce TTL**: Set an expiration for idempotency keys (e.g., 24 hours).

## VALIDATION RULES
- Idempotency is MANDATORY for all financial and state-altering (`POST`, `PATCH`) operations.

## FAILURE CONDITIONS
- Duplicate payments generated due to network retry logic.
- Overwriting existing states with stale "duplicate" data.

## DEPENDENCIES
- `.agents/skills/database/transaction-handling.md`
