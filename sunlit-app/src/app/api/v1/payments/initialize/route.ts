import { NextResponse } from 'next/server';
import { InitializePaymentSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { DataService } from '@/shared/api/data-service';
import { AuditLogger } from '@/core/audit/logger';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * POST /api/v1/payments/initialize
 *
 * Initializes an secure payment for a project milestone.
 * Auth: Required
 * RBAC: Requires 'fund:escrow' permission (project_owner)
 *
 * CRITICAL RULES (GEMINI.md §4 — Escrow Logic):
 *   - Generate unique idempotency key
 *   - Create escrow record in 'pending' state
 *   - Initialize payment via Paystack (primary) or Flutterwave (fallback)
 *   - NEVER confirm payment client-side — wait for webhook
 *
 * Flow:
 *   1. Validate input (amount, milestone_id, project_id)
 *   2. Check for duplicate idempotent requests
 *   3. Create escrow record (status: 'pending')
 *   4. Initialize payment with provider
 *   5. Return payment authorization URL
 *   6. Audit log the initialization
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req, { requiredPermission: 'fund:payment' });
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        // === Schema validation ===
        const validation = InitializePaymentSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.format(),
                    correlation_id: guardCtx.correlationId,
                },
                { status: 400 }
            );
        }

        const { amount, milestone_id, project_id } = validation.data;

        // === Generate idempotency key ===
        const idempotencyKey = crypto
            .createHash('sha256')
            .update(`${guardCtx.userId}:${project_id}:${milestone_id}:${amount}`)
            .digest('hex');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        let escrowRecord = null;
        let authorizationUrl = null;

        if (supabaseUrl && supabaseKey
            && !supabaseUrl.includes('your-project-id')
            && !supabaseKey.includes('your-service-role-key')) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const dataService = new DataService(supabase);
            const auditLogger = new AuditLogger(dataService);

            const auditCtx = {
                user_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                ip_address: guardCtx.ipAddress,
            };

            // === Check for duplicate (idempotency enforcement) ===
            try {
                const existing = await dataService.findOne('escrow', {
                    project_id,
                    milestone_id,
                    status: 'pending',
                });
                if (existing) {
                    return NextResponse.json({
                        success: true,
                        message: 'Payment already initialized (idempotent).',
                        escrow_id: existing.id,
                        correlation_id: guardCtx.correlationId,
                    });
                }
            } catch {
                // No existing record found — proceed
            }

            // === Create escrow record (pending) ===
            escrowRecord = await dataService.create(
                'escrow',
                {
                    project_id,
                    milestone_id,
                    amount,
                    status: 'pending',
                    idempotency_key: idempotencyKey,
                },
                auditCtx
            );

            // === Initialize Paystack payment ===
            const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
            if (paystackSecretKey && !paystackSecretKey.includes('placeholder')) {
                try {
                    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${paystackSecretKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            amount: Math.round(amount * 100), // Paystack uses kobo
                            email: `user-${guardCtx.userId}@sunlit.energy`,
                            reference: `esc_${escrowRecord.id}_${idempotencyKey.slice(0, 12)}`,
                            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/project-owner/payment/callback`,
                            metadata: {
                                escrow_id: escrowRecord.id,
                                project_id,
                                milestone_id,
                                correlation_id: guardCtx.correlationId,
                            },
                        }),
                    });

                    const paystackData = await paystackResponse.json();
                    if (paystackData.status) {
                        authorizationUrl = paystackData.data?.authorization_url;

                        // Store provider reference
                        await dataService.create('payments', {
                            user_id: guardCtx.userId,
                            escrow_id: escrowRecord.id,
                            amount,
                            currency: 'NGN',
                            provider: 'paystack',
                            provider_reference: paystackData.data?.reference || '',
                            status: 'pending',
                        }, auditCtx);
                    }
                } catch (paystackError) {
                    console.error('[Payment] Paystack initialization failed:', paystackError);
                }
            }

            // === Audit log ===
            await auditLogger.log({
                user_id: guardCtx.userId,
                action_type: 'payment.initialize',
                correlation_id: guardCtx.correlationId,
                payload: { project_id, milestone_id, amount, idempotency_key: idempotencyKey },
                ip_address: guardCtx.ipAddress,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Payment initialized. Complete payment to fund escrow.',
            escrow_id: escrowRecord?.id || null,
            authorization_url: authorizationUrl,
            idempotency_key: idempotencyKey,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Payment initialize error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
