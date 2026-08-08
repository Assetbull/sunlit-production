import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  buildSessionPayload,
  mockAuthAllowed,
  parseSessionCookie,
} from '@/shared/auth/sunlit-session';
import { isSunlitRole } from '@/shared/auth/sunlit-roles';
import type { SunlitSessionPayload } from '@/shared/auth/sunlit-session';

function setSessionCookie(res: NextResponse, session: SunlitSessionPayload) {
  res.cookies.set('sunlit_session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 86400,
    sameSite: 'lax',
  });
}

export async function GET() {
  const jar = await cookies();
  const raw = jar.get('sunlit_session')?.value;
  const session = parseSessionCookie(raw);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, session });
}

export async function POST(req: Request) {
  if (!mockAuthAllowed()) {
    return NextResponse.json({ error: 'Mock session bootstrap disabled.' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const userId = body.user_id;
  const role = body.role;
  if (!role || !isSunlitRole(role)) {
    console.error("[AUTH] FAIL: ROLE_REQUIRED. Invalid or missing role.");
    return NextResponse.json({ error: 'ROLE_REQUIRED' }, { status: 400 });
  }

  if (typeof userId !== 'string' || !userId.length) {
    return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name : undefined;
  const token = typeof body.token === 'string' ? body.token : undefined;

  const session = buildSessionPayload({
    user_id: userId,
    name,
    role,
    token,
  });

  const res = NextResponse.json({ ok: true, session });
  setSessionCookie(res, session);
  
  // STEP 8: AUDIT LOGGING
  console.log(`[AUTH] login_success role=${role} user=${userId}`);
  
  return res;
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete('sunlit_session');
  return NextResponse.json({ ok: true });
}
