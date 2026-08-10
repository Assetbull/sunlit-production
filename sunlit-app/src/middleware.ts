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
 *   1. Authenticated users on auth routes redirect to their role dashboard
 *   2. Unauthenticated users on protected routes are redirected to /auth/login with redirect param
 *   3. Strict cross-role RBAC enforcement
 *   4. URL rewrites for legacy / alias routes
 */
export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // 0. CANONICAL DOMAIN REDIRECT: Redirect old domains or www to https://sunlit.energy
  if (
    host.includes('sunlitenergy.com') ||
    host.startsWith('www.sunlit.energy')
  ) {
    const canonicalUrl = new URL(`https://sunlit.energy${path}${nextUrl.search}`);
    return NextResponse.redirect(canonicalUrl, { status: 301 });
  }

  const session = readSession(request);
  const isAuthenticated = !!session;

  // Identify auth routes (/login, /register, /auth/login, /auth/register, etc.)
  const isAuthRoute = path === '/login' || path === '/register' || path.startsWith('/auth/');
  
  // Public directory routes (no auth required)
  const isPublicDirectoryRoute =
    path.startsWith('/installers') ||
    path.startsWith('/projects') ||
    path.startsWith('/learn') ||
    path.startsWith('/services') ||
    path.startsWith('/request-quote') ||
    path.startsWith('/tools');

  // Protected routes: /dashboard/*, /installer/dashboard/*, /admin/*
  const isProtectedRoute =
    (path.startsWith('/dashboard') ||
     path.startsWith('/installer') ||
     path.startsWith('/technician') ||
     path.startsWith('/admin')) &&
    !isPublicDirectoryRoute;

  // 1. AUTHENTICATED USER ROUTING & RBAC
  if (isAuthenticated && session) {
    const role = session.role as SunlitRole;
    const correctRoute = dashboardPathForRole(role);

    // If authenticated user visits auth routes or root, redirect immediately to their dashboard
    if (isAuthRoute || path === '/') {
      console.log(`[AUTH] ALREADY_AUTHENTICATED: role=${role} redirect_to=${correctRoute}`);
      return NextResponse.redirect(new URL(correctRoute, request.url));
    }

    // Role-based access control for protected routes
    const requiredRole = requiredRoleForDashboardPath(path);
    const isEpcAccessingInstaller = role === 'epc_contractor' && requiredRole === 'installer';

    if (isProtectedRoute && requiredRole && requiredRole !== role && !isEpcAccessingInstaller) {
      console.warn(
        `[AUTH] BLOCKED_CROSS_ROLE: path=${path} role=${role} required=${requiredRole} action=REDIRECT_TO_CORRECT_DASHBOARD`
      );
      return NextResponse.redirect(new URL(correctRoute, request.url));
    }
  }

  // 2. UNAUTHENTICATED USERS ACCESSING PROTECTED ROUTES
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. REWRITES FOR LEGACY & ALIAS ROUTES
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

