import { NextResponse } from 'next/server';
import {
  mockAuthAllowed,
  validateMockOTP,
} from '@/shared/auth/sunlit-session';

export async function POST(req: Request) {
  if (!mockAuthAllowed()) {
    return NextResponse.json(
      { error: 'Mock authentication is disabled when NEXT_PUBLIC_USE_REAL is true.' },
      { status: 403 }
    );
  }

  let body: { email?: string; otp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = body.email ?? '';
  const otp = body.otp ?? '';
  const session = validateMockOTP(email, otp);
  if (!session) {
    return NextResponse.json({ error: 'Invalid email or verification code' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, session });
  res.cookies.set('sunlit_session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 86400,
    sameSite: 'lax',
  });
  return res;
}
