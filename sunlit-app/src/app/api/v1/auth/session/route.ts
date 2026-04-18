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
  if (typeof userId !== 'string' || !userId.length || !isSunlitRole(role)) {
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
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('sunlit_session');
  return res;
}
