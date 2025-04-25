import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from 'next/server';

function addHeaders(req: NextRequest, response: NextResponse) {
  const protocol = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const baseUrl = `${protocol}${protocol.endsWith(':') ? '//' : '://'}${host}`;

  response.headers.set('x-url', req.url);
  response.headers.set('x-host', host);
  response.headers.set('x-protocol', protocol);
  response.headers.set('x-base-url', baseUrl);
}

export default clerkMiddleware((auth, req) => {
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  let response: NextResponse;

  // Redirect logged-in users away from auth pages
  if (auth.userId && (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")) {
    response = NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // Redirect non-logged-in users from protected routes
  else if (!auth.userId && !isPublicRoute) {
    response = NextResponse.redirect(new URL("/sign-in", req.url));
  }
  // Allow public routes and authenticated users to proceed
  else {
    response = NextResponse.next();
  }

  // Add security headers to all responses
  addHeaders(req, response);

  return response;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};