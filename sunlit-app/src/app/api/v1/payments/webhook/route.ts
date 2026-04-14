import { NextResponse } from 'next/server';
import { verifyPaystackWebhook } from '@/core/payments/webhook-verify';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { EventBus } from '@/core/event-bus/emitter';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';

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
 *
 * This is the ONLY trusted path for confirming payments.
 * NO client-side payment confirmation is ever accepted.
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
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event = JSON.parse(bodyTxt);

        // === STEP 2: Process via DataService if Supabase is configured ===
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey
            && !supabaseUrl.includes('your-project-id')
            && !supabaseKey.includes('your-service-role-key')) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const dataService = new DataService(supabase);
            const eventBus = new EventBus(dataService);
            const auditLogger = new AuditLogger(dataService);

            const auditCtx = {
                user_id: 'system',
                correlation_id: guardCtx.correlationId,
                ip_address: guardCtx.ipAddress,
            };

            // === Idempotency check: deduplicate by provider_reference ===
            const providerReference = event?.data?.reference;
            if (providerReference) {
                try {
                    const existing = await dataService.findOne('payments', {
                        provider_reference: providerReference,
                        status: 'successful',
                    });
                    if (existing) {
                        // Already processed — return 200 to stop retries
                        return NextResponse.json({
                            success: true,
                            message: 'Already processed (idempotent).',
                            correlation_id: guardCtx.correlationId,
                        });
                    }
                } catch {
                    // Not found — proceed with processing
                }
            }

            // === STEP 3: Handle charge.success event ===
            if (event.event === 'charge.success' && providerReference) {
                // Update payment status
                await dataService.update(
                    'payments',
                    { provider_reference: providerReference },
                    { status: 'successful' },
                    auditCtx
                );

                // Extract escrow_id from metadata
                const escrowId = event.data?.metadata?.escrow_id;
                if (escrowId) {
                    // Fund escrow — update status to 'funded'
                    await dataService.update(
                        'escrow',
                        { id: escrowId },
                        { status: 'funded' },
                        auditCtx
                    );

                    // Emit escrow_funded event (GEMINI.md §5)
                    await eventBus.emit('escrow_funded', {
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
                await auditLogger.log({
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
                await dataService.update(
                    'payments',
                    { provider_reference: providerReference },
                    { status: 'failed' },
                    auditCtx
                );

                await auditLogger.log({
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

        return NextResponse.json({
            success: true,
            message: 'Webhook processed.',
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        // MUST return 200 to Paystack to stop retry loops, even on internal errors
        console.error('Webhook processing error:', e);
        return NextResponse.json({ received: true }, { status: 200 });
    }
}
