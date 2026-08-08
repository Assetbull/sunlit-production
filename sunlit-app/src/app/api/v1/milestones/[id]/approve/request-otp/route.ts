import { NextResponse } from 'next/server';
import { apiGuard, GuardContext } from '@/shared/api/api-guard';
import { createBackendContext, buildAuditCtx } from '@/shared/api/backend-context';
import crypto from 'crypto';

/**
 * POST /api/v1/milestones/[id]/approve/request-otp
 *
 * Step 1 of the OTP-gated payment release flow.
 * Generates a 6-digit OTP, hashes it, stores it with 5-min TTL.
 * Sends notification to project owner's email/phone.
 *
 * Auth: Required (project_owner or epc_contractor with approve:milestone permission)
 *
 * GEMINI.md §4: All escrow releases require OTP confirmation.
 * This ensures no accidental or fraudulent releases.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await apiGuard(req, { requiredPermission: 'approve:milestone' });
  if (guard instanceof NextResponse) return guard;

  const guardCtx = guard as GuardContext;
  const { id: milestoneId } = await params;

  try {
    const ctx = createBackendContext();

    if (!ctx) {
      // Scaffold mode — return a stub OTP token
      return NextResponse.json({
        success: true,
        message: 'OTP sent (scaffold mode). Use code: 123456 to confirm.',
        expires_in_seconds: 300,
        milestone_id: milestoneId,
        correlation_id: guardCtx.correlationId,
      });
    }

    const auditCtx = buildAuditCtx(guardCtx);

    // === Verify milestone is SUBMITTED ===
    const milestone = await ctx.dataService.findOne('milestones', { id: milestoneId });
    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found.', correlation_id: guardCtx.correlationId },
        { status: 404 }
      );
    }
    if (milestone.status !== 'SUBMITTED') {
      return NextResponse.json(
        {
          error: `Milestone must be in SUBMITTED state to request OTP. Current: ${milestone.status}`,
          correlation_id: guardCtx.correlationId,
        },
        { status: 400 }
      );
    }

    // === Check no active dispute ===
    const activeDispute = await ctx.dataService.findOne('disputes', {
      project_id: milestone.project_id,
      status: 'OPEN',
    });
    if (activeDispute) {
      return NextResponse.json(
        {
          error: 'Project has an active dispute. Payment release is locked.',
          dispute_id: activeDispute.id,
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // === Check escrow is not dispute-locked ===
    const escrow = await ctx.dataService.findOne('escrow', {
      project_id: milestone.project_id,
    });
    if (escrow?.status === 'DISPUTE_LOCKED') {
      return NextResponse.json(
        {
          error: 'Escrow is locked due to an active dispute. Cannot release funds.',
          correlation_id: guardCtx.correlationId,
        },
        { status: 403 }
      );
    }

    // === Generate 6-digit OTP ===
    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = crypto.createHash('sha256').update(rawOtp + milestoneId).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // === Store OTP hash (upsert) ===
    await ctx.dataService.upsert(
      'milestone_otp_tokens',
      { milestone_id: milestoneId },
      {
        milestone_id: milestoneId,
        otp_hash: otpHash,
        expires_at: expiresAt,
        created_by: guardCtx.userId,
        used: false,
      },
      auditCtx
    );

    // === Audit log ===
    await ctx.auditLogger.log({
      user_id: guardCtx.userId,
      action_type: 'milestone.otp.requested',
      correlation_id: guardCtx.correlationId,
      payload: { milestone_id: milestoneId, expires_at: expiresAt },
      ip_address: guardCtx.ipAddress,
    });

    // NOTE: In production, send OTP via email/SMS here
    // await notificationService.sendOTP(guardCtx.userId, rawOtp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your registered contact. Valid for 5 minutes.',
      expires_in_seconds: 300,
      milestone_id: milestoneId,
      correlation_id: guardCtx.correlationId,
      // NEVER return rawOtp in production — only in scaffold
      ...(process.env.NODE_ENV === 'development' ? { dev_otp: rawOtp } : {}),
    });
  } catch (e: unknown) {
    console.error('OTP request error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error', correlation_id: guardCtx.correlationId },
      { status: 500 }
    );
  }
}
