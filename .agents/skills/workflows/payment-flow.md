# SKILL: Payment & Escrow Workflow

## PURPOSE
To handle secure financial transactions using external providers and internal escrow logic.

## WHEN TO USE
- Funding a project
- Releasing milestone payments
- Handling payment confirmation webhooks

## INPUT
- Bid Amount
- Project ID
- Provider payload (Paystack)

## OUTPUT
- Escrow record updated
- `escrow_funded` or `payment_released` event
- Transaction record in audit logs

## EXECUTION STEPS
1. **Generate Virtual Account**: Use provider API to create a unique funding target.
2. **Monitor Webhook**: Verify incoming Paystack signature and correlate with Project ID.
3. **Fund Escrow**: Upon verification, update `escrow` table status to `FUNDED`.
4. **Enforce releasing rules**: Release funds ONLY if (Milestone == Complete && Approved == True).
5. **Log Transaction**: Write append-only record with `correlation_id`.

## VALIDATION RULES
- No fund release if a Dispute is open.
- Webhook HMAC signature MUST be verified.

## FAILURE CONDITIONS
- Partial payments marking full funding without manual verification.
- Double-spend detected.

## DEPENDENCIES
- `.agents/skills/security/webhook-verification.md`
- `.agents/skills/security/escrow-rules.md`
