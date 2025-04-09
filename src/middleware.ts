import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';

// 1. Specify protected and public routes
const protectedRoutes = ['ui/navegation', 'ui/navegation/product-management'];
// const publicRoutes = [ '/login', '/signup', '/'];

// Middleware function
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  // const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the session cookie from the request
  const cookie = req.cookies.get('session')?.value; // ✅ Use req.cookies instead of cookies()
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 5. Redirect to /navigation if the user is authenticated and tries to access a public route
  /* if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('ui/navegation')
  ) {
    return NextResponse.redirect(new URL('ui/navegation', req.nextUrl));
  }
  */

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
