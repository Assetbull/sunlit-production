import { NextResponse } from 'next/server';
import { RegisterUserSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard } from '@/shared/api/api-guard';

/**
 * POST /api/v1/auth/register
 * 
 * Registers a new user account internally after Clerk signup.
 * Auth: Required (user must have a valid Clerk session)
 * RBAC: No specific permission required (self-registration)
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req);
    if (guard instanceof NextResponse) return guard;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = RegisterUserSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guard.correlationId },
                { status: 400 }
            );
        }

        // TODO: Wire to DataService + EventBus
        // 1. dataService.create('users', { clerk_id: guard.userId, ...validation.data })
        // 2. eventBus.emit('user_registered', { actor_id: guard.userId, correlation_id: guard.correlationId, ... })
        // 3. auditLogger.log({ user_id: guard.userId, action_type: 'user.register', correlation_id: guard.correlationId, payload: validation.data, ip_address: guard.ipAddress })

        return NextResponse.json(
            { success: true, message: 'User registered.', correlation_id: guard.correlationId }
        );
    } catch (e: unknown) {
        console.error('Register error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guard.correlationId },
            { status: 500 }
        );
    }
}
