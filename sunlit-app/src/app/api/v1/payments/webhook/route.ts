import { NextResponse } from 'next/server';
import { verifyPaystackWebhook } from '@/core/payments/webhook-verify';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import { apiError, apiSuccess } from '@/shared/api/api-error';

/**
 * POST /api/v1/payments/webhook
 *
 * Receives and processes Paystack webhook events.
 * Auth: SKIPPED — webhooks come from Paystack, not authenticated users.
 * Security: Webhook HMAC signature verification replaces JWT auth.
 * Idempotency: Enforced via provider_reference deduplication.
 *
 * GEMINI.md §4: "webhook verification REQUIRED"
 * GEMINI.md §4: "idempotency REQUIRED"
 * GEMINI.md §8: "webhook ONLY confirmation"
 */
export async function POST(req: Request) {
    // Use apiGuard with skipAuth since webhooks aren't user-authenticated
    const guard = await apiGuard(req, { skipAuth: true });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const bodyTxt = await req.text();
        const signature = req.headers.get('x-paystack-signature');

        // === STEP 1: Verify webhook signature (CRITICAL — GEMINI.md §4) ===
        if (!signature || !verifyPaystackWebhook(bodyTxt, signature)) {
            console.error('Webhook signature verification failed', {
                correlation_id: guardCtx.correlationId,
            });
            return apiError(guardCtx.correlationId, 401, 'INVALID_SIGNATURE', 'Invalid signature');
        }

        const event = JSON.parse(bodyTxt);

        // === STEP 2: Process via centralized BackendContext ===
        const backendCtx = createBackendContext();
        if (backendCtx) {
            const auditCtx = buildAuditCtx(guardCtx);

            // === Idempotency check: deduplicate by provider_reference ===
            const providerReference = event?.data?.reference;
            if (providerReference) {
                try {
                    const existing = await backendCtx.dataService.findOne('payments', {
                        provider_reference: providerReference,
                        status: 'successful',
                    });
                    if (existing) {
                        // Already processed — return 200 to stop provider retries
                        return apiSuccess(guardCtx.correlationId, {
                            message: 'Already processed (idempotent).',
                        });
                    }
                } catch {
                    // Not found — proceed with processing
                }
            }

            // === STEP 3: Handle charge.success event ===
            if (event.event === 'charge.success' && providerReference) {
                // Update payment status
                await backendCtx.dataService.update(
                    'payments',
                    { provider_reference: providerReference },
                    { status: 'successful' },
                    auditCtx
                );

                // Extract escrow_id from metadata
                const escrowId = event.data?.metadata?.escrow_id;
                if (escrowId) {
                    // Fund escrow — update status to 'funded'
                    await backendCtx.dataService.update(
                        'escrow',
                        { id: escrowId },
                        { status: 'funded' },
                        auditCtx
                    );

                    // Emit escrow_funded event (GEMINI.md §5)
                    await backendCtx.eventBus.emit('escrow_funded', {
                        timestamp: new Date().toISOString(),
                        actor_id: 'system',
                        correlation_id: guardCtx.correlationId,
                        escrow_id: escrowId,
                        project_id: event.data?.metadata?.project_id,
                        milestone_id: event.data?.metadata?.milestone_id,
                        amount: event.data?.amount ? event.data.amount / 100 : null, // Convert kobo to naira
                        provider: 'paystack',
                        provider_reference: providerReference,
                    });
                }

                // Audit log
                await backendCtx.auditLogger.log({
                    user_id: 'system',
                    action_type: 'payment.webhook.charge_success',
                    correlation_id: guardCtx.correlationId,
                    payload: {
                        event: event.event,
                        reference: providerReference,
                        escrow_id: escrowId,
                        amount: event.data?.amount,
                    },
                    ip_address: guardCtx.ipAddress,
                });
            }

            // === Handle charge.failed event ===
            if (event.event === 'charge.failed' && providerReference) {
                await backendCtx.dataService.update(
                    'payments',
                    { provider_reference: providerReference },
                    { status: 'failed' },
                    auditCtx
                );

                await backendCtx.auditLogger.log({
                    user_id: 'system',
                    action_type: 'payment.webhook.charge_failed',
                    correlation_id: guardCtx.correlationId,
                    payload: {
                        event: event.event,
                        reference: providerReference,
                        failure_reason: event.data?.gateway_response,
                    },
                    ip_address: guardCtx.ipAddress,
                });
            }
        }

        return apiSuccess(guardCtx.correlationId, {
            message: 'Webhook processed.',
        });
    } catch (e: unknown) {
        // Return 200 with received envelope to Paystack to stop runaway retries on transient exceptions
        console.error('Webhook processing error:', e);
        return NextResponse.json({ received: true }, { status: 200 });
    }
}

