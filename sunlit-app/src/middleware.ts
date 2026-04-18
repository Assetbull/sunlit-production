import { NextResponse, type NextRequest } from 'next/server';
import {
  dashboardPathForRole,
  requiredRoleForDashboardPath,
  type SunlitRole,
} from '@/shared/auth/sunlit-roles';
import { parseSessionCookie } from '@/shared/auth/sunlit-session';

function readSession(request: NextRequest) {
  const raw = request.cookies.get('sunlit_session')?.value;
  return parseSessionCookie(raw);
}

function redirectWithClearedSession(url: URL) {
  const res = NextResponse.redirect(url);
  res.cookies.delete('sunlit_session');
  return res;
}

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const path = nextUrl.pathname;

  const rawCookie = cookies.get('sunlit_session')?.value;
  const session = readSession(request);
  const isAuthenticated = !!session;

  const isProtectedRoute = path.startsWith('/dashboard');
  const isAuthRoute = path === '/login' || path === '/register';

  if (rawCookie && !session) {
    const dest = isProtectedRoute
      ? new URL('/login', request.url)
      : nextUrl;
    if (isProtectedRoute) {
      dest.searchParams.set('redirect', path);
    }
    return redirectWithClearedSession(dest);
  }

  if (path === '/' && isAuthenticated && session) {
    return NextResponse.redirect(
      new URL(dashboardPathForRole(session.role), request.url)
    );
  }

  if (isProtectedRoute) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    const required = requiredRoleForDashboardPath(path);
    if (required && session.role !== required) {
      return NextResponse.redirect(
        new URL(dashboardPathForRole(session.role as SunlitRole), request.url)
      );
    }

    return NextResponse.next();
  }

  if (isAuthRoute && isAuthenticated && session) {
    return NextResponse.redirect(
      new URL(dashboardPathForRole(session.role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
