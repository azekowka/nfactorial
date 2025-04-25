import { clerkMiddleware, ClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const middleware: ClerkMiddleware = (auth, req) => {
  // Публичные маршруты, которые доступны без авторизации
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  
  // Если пользователь вошел в систему и пытается получить доступ к страницам авторизации
  if (auth.userId && (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Если пользователь не авторизован и пытается получить доступ к защищенным маршрутам
  if (!auth.userId && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }
}

export default clerkMiddleware(middleware);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};