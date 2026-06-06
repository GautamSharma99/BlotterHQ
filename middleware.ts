import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/review', '/blotter', '/log', '/settings', '/onboarding'];
// Routes that are always public
const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes, static files, and public routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // In mock mode, we check for a cookie-based session
  // In production, this would verify the Supabase session
  const session = request.cookies.get('blotterhq_session');

  // For the mock demo, we allow all routes without auth
  // TODO: In production, uncomment the redirect below
  // if (!session && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
