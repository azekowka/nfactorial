import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Set up security headers for your application
function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  return response;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect logged-in users away from auth pages
  if (userId && (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is not logged in and trying to access a protected route
  if (!userId && 
    req.nextUrl.pathname !== "/" && 
    req.nextUrl.pathname !== "/sign-in" && 
    req.nextUrl.pathname !== "/sign-up" && 
    !req.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response);
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};