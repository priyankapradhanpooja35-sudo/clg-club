import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Custom edge-safe JWT parser (signature verification happens in APIs, decoding payload for routing is safe here)
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token
  const token = request.cookies.get('bec_token')?.value;
  const user = token ? parseJwt(token) : null;

  // Protected paths
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (isDashboardRoute) {
    if (!user) {
      // Not logged in -> Redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { role } = user;

    // Admin dashboard protection
    if (pathname.startsWith('/dashboard/admin') && role !== 'Admin') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }

    // Club Head dashboard protection
    if (pathname.startsWith('/dashboard/club-head') && role !== 'ClubHead') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }

    // Faculty dashboard protection
    if (pathname.startsWith('/dashboard/faculty') && role !== 'Faculty') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  // Redirect logged in users away from auth pages
  if (isAuthRoute && user) {
    const role = user.role;
    if (role === 'Admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else if (role === 'ClubHead') {
      return NextResponse.redirect(new URL('/dashboard/club-head', request.url));
    } else if (role === 'Faculty') {
      return NextResponse.redirect(new URL('/dashboard/faculty', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
