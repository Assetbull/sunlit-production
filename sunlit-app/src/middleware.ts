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




/**
 * Middleware — Zero-Trust Authentication & RBAC Gateway
 *
 * GEMINI.md §4: "Verify JWT on EVERY request"
 * GEMINI.md §4: "deny by default (zero-trust)"
 *
 * Enforces:
 *   1. Unauthenticated users are redirected to /login
 *   2. Data-driven cross-role access blocking (not hardcoded if/else)
 *   3. Authenticated users on auth routes redirect to their dashboard
 */
export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const path = nextUrl.pathname;

  const session = readSession(request);
  const isAuthenticated = !!session;

  // Determine if it is the explicitly mapped auth route or not
  const isAuthRoute = path === '/login' || path === '/register' || path.startsWith('/auth/');

  // Custom rewrites to connect Strict Prompt Paths to existing Next.js logic
  if (path === '/dashboard') {
    return NextResponse.rewrite(new URL('/dashboard/project-owner', request.url));
  } else if (path.startsWith('/installer/dashboard')) {
    return NextResponse.rewrite(new URL(path.replace('/installer/dashboard', '/dashboard/installer'), request.url));
  } else if (path.startsWith('/technician/dashboard') || path.startsWith('/Technician') || path.startsWith('/technician')) {
    return NextResponse.rewrite(new URL('/dashboard/crewlink', request.url));
  } else if (path === '/admin') {
    return NextResponse.rewrite(new URL('/dashboard/admin', request.url));
  } else if (path.startsWith('/auth/login')) {
    return NextResponse.rewrite(new URL(path.replace('/auth/login', '/login'), request.url));
  } else if (path.startsWith('/auth/register')) {
    return NextResponse.rewrite(new URL(path.replace('/auth/register', '/register'), request.url));
  }

  // Use structural path logic to match protection. Both rewritten & direct paths get protected:
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/installer') || path.startsWith('/technician') || path.startsWith('/admin');

  // 1. REDIRECT UNAUTHENTICATED USERS
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. ROLE-BASED ACCESS CONTROL (ZERO TRUST — DATA-DRIVEN)
  if (isAuthenticated && session) {
    const role = session.role as SunlitRole;
    const correctRoute = dashboardPathForRole(role);

    console.log(`[AUTH] middleware_check: path=${path} role=${role} correct_route=${correctRoute}`);

    // CROSS-ROLE ACCESS BLOCKING
    const requiredRole = requiredRoleForDashboardPath(path);
    const isEpcAccessingInstaller = role === 'epc_contractor' && requiredRole === 'installer';

    // Strict RBAC: Any protected route accessed by wrong role yields a redirect to correctRoute
    if (isProtectedRoute && requiredRole && requiredRole !== role && !isEpcAccessingInstaller) {
      console.warn(
        `[AUTH] BLOCKED_CROSS_ROLE: path=${path} role=${role} required=${requiredRole} action=REDIRECT_TO_CORRECT_DASHBOARD`
      );
      return NextResponse.redirect(new URL(correctRoute, request.url));
    }

    // REDIRECT FROM AUTH ROUTES IF ALREADY LOGGED IN
    if (isAuthRoute || path === '/') {
      console.log(`[AUTH] ALREADY_AUTHENTICATED: role=${role} redirect_to=${correctRoute}`);
      return NextResponse.redirect(new URL(correctRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
