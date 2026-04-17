import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

/**
 * Sunlit Energy Middleware
 * 
 * Enforces Zero-Trust route protection.
 * Optimized for hosting portability (standard Next.js Edge Runtime).
 */

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/get-started',
];

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const path = nextUrl.pathname;

  // 1. Check for session cookie
  const sessionCookie = cookies.get('sunlit_session');
  const isAuthenticated = !!sessionCookie;

  // 2. Route Protection Logic
  const isProtectedRoute = path.startsWith('/dashboard');
  const isAuthRoute = path === '/login' || path === '/register';

  // Redirect unauthenticated users from dashboards
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // Preserving the attempted destination for post-login redirect
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register to dashboard
  if (isAuthRoute && isAuthenticated) {
    try {
      const session = JSON.parse(sessionCookie.value);
      const role = session.role || 'project_owner';
      
      // Default dashboard routing
      if (role === 'project_owner') {
         return NextResponse.redirect(new URL('/dashboard/project-owner', request.url));
      }
      // Future roles can be added here
      return NextResponse.redirect(new URL('/dashboard/project-owner', request.url));
    } catch {
      // If cookie is malformed, clear and allow login
      const response = NextResponse.next();
      response.cookies.delete('sunlit_session');
      return response;
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
