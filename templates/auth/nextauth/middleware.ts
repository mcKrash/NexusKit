import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware for protecting routes with NextAuth.js
 *
 * This middleware will:
 * 1. Check if the user is authenticated
 * 2. Redirect unauthenticated users to the login page
 * 3. Allow access to authenticated users
 * 4. Support role-based access control
 */

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup") ||
      req.nextUrl.pathname.startsWith("/verify-email") ||
      req.nextUrl.pathname.startsWith("/reset-password");

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is not authenticated and tries to access protected pages, redirect to login
    if (!isAuthPage && !isAuth) {
      const from = req.nextUrl.pathname;
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Check for email verification on protected routes
    if (isAuth && !isAuthPage && !token?.emailVerified) {
      // Allow access to certain pages even without email verification
      const allowedPaths = ["/verify-email", "/dashboard"];
      const currentPath = req.nextUrl.pathname;

      if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
        return NextResponse.redirect(new URL("/verify-email", req.url));
      }
    }

    // Role-based access control
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // This callback is called before the middleware function
        // Return true to allow access, false to redirect to login
        const isAuthPage =
          req.nextUrl.pathname.startsWith("/login") ||
          req.nextUrl.pathname.startsWith("/signup") ||
          req.nextUrl.pathname.startsWith("/verify-email") ||
          req.nextUrl.pathname.startsWith("/reset-password");

        // Allow access to auth pages without authentication
        if (isAuthPage) {
          return true;
        }

        // Require authentication for all other pages
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

/**
 * Configure which routes to protect with authentication
 *
 * Matcher configuration:
 * - Protect all routes except:
 *   - API routes (except /api/auth)
 *   - Static files (_next/static)
 *   - Images (_next/image)
 *   - Favicon
 *   - Public assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - except /api/auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
