import { NextResponse } from 'next/server';
import { RegisterUserSchema, sanitizePayload } from '@/shared/validators/schemas';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import type { UserRole } from '@/shared/types/database';

/**
 * POST /api/v1/auth/register
 * 
 * Registers a new user account internally after Clerk signup.
 * Auth: Required (user must have a valid Clerk session)
 * RBAC: No specific permission required (self-registration)
 * 
 * EPC Enhancement: When role is 'epc_contractor', assigns enhanced permissions
 * and emits epc_contractor_registered event for audit trail.
 */
export async function POST(req: Request) {
    const guard = await apiGuard(req);
    if (guard instanceof NextResponse) return guard;

    const guardCtx = guard as GuardContext;

    try {
        const payload = await req.json();
        const sanitized = sanitizePayload(payload);

        const validation = RegisterUserSchema.safeParse(sanitized);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format(), correlation_id: guardCtx.correlationId },
                { status: 400 }
            );
        }

        const userData = validation.data;
        const ctx = createBackendContext();
        
        // Scaffold mode: return success without database operations
        if (!ctx) {
            return NextResponse.json({
                success: true,
                message: 'User registered (scaffold mode).',
                correlation_id: guardCtx.correlationId,
            });
        }

        const auditCtx = buildAuditCtx(guardCtx);

        // 1. Create user record
        const user = await ctx.dataService.create('users', {
            clerk_id: guardCtx.userId,
            email: userData.email,
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            phone_number: userData.phone_number || null,
        }, auditCtx);

        // 2. Determine enhanced permissions for EPC contractors
        const isEpcContractor = userData.role === 'epc_contractor';
        const enhancedPermissions = isEpcContractor ? {
            'create:project': true,
            'approve:milestone': true,
            'fund:payment': true,
            'view:audit_logs': true,
            'manage:external_projects': true,
            'coordinate:multi_crew': true,
        } : {};

        // 3. Create role record with enhanced permissions
        await ctx.dataService.create('roles', {
            user_id: user?.id,
            role_name: userData.role as UserRole,
            enhanced_permissions: enhancedPermissions,
        }, auditCtx);

        // 4. Emit appropriate registration event
        if (isEpcContractor) {
            await ctx.eventBus.emit('epc_contractor_registered', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                user_id: user?.id,
                email: userData.email,
                enhanced_permissions: enhancedPermissions,
            });
        } else {
            await ctx.eventBus.emit('user_registered', {
                timestamp: new Date().toISOString(),
                actor_id: guardCtx.userId,
                correlation_id: guardCtx.correlationId,
                user_id: user?.id,
                email: userData.email,
                role: userData.role,
            });
        }

        // 5. Audit log the registration
        await ctx.auditLogger.log({
            user_id: guardCtx.userId,
            action_type: isEpcContractor ? 'user.register.epc_contractor' : 'user.register',
            correlation_id: guardCtx.correlationId,
            payload: {
                email: userData.email,
                role: userData.role,
                has_enhanced_permissions: isEpcContractor,
            },
            ip_address: guardCtx.ipAddress,
        });

        return NextResponse.json({
            success: true,
            message: 'User registered successfully.',
            user_id: user?.id,
            role: userData.role,
            correlation_id: guardCtx.correlationId,
        });
    } catch (e: unknown) {
        console.error('Register error:', e);
        return NextResponse.json(
            { error: 'Internal Server Error', correlation_id: guardCtx.correlationId },
            { status: 500 }
        );
    }
}
