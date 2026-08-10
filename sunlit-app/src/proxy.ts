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
 * Proxy / Middleware — Zero-Trust Authentication & RBAC Gateway
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
export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // 0. CANONICAL DOMAIN REDIRECT: Redirect old domains or www to canonical domain
  if (
    host.includes('sunlitenergy.com') ||
    host.startsWith('www.sunlit.energy')
  ) {
    const targetOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunlit.energy';
    const canonicalUrl = new URL(`${targetOrigin}${path}${nextUrl.search}`);
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

  // 1. AUTH ROUTE GUARD: If authenticated user visits login/register, redirect to dashboard
  if (isAuthRoute && isAuthenticated && session) {
    const targetDashboard = dashboardPathForRole(session.role as SunlitRole);
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 2. PROTECTED ROUTE GUARD: Zero-trust enforcement
  if (isProtectedRoute) {
    if (!isAuthenticated || !session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control (RBAC) check
    const requiredRole = requiredRoleForDashboardPath(path);
    if (requiredRole && session.role !== requiredRole && session.role !== 'admin') {
      // Authenticated but wrong role -> redirect to their authorized dashboard
      const authorizedDashboard = dashboardPathForRole(session.role as SunlitRole);
      return NextResponse.redirect(new URL(authorizedDashboard, request.url));
    }
  }

  // Fallback for direct /dashboard root access without a subpath
  if (path === '/dashboard' && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
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

// Backward compatibility alias for Next.js middleware
export const middleware = proxy;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
