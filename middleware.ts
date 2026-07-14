import { auth } from "@/lib/auth";

/**
 * Minimal middleware — Edge-safe, no Prisma, no redirect loops.
 *
 * Only job: block guests from /dashboard and /onboarding.
 * All other redirects (landing → app, login → dashboard, etc.)
 * happen in server pages via lib/auth-guards.ts (reads DB reliably).
 */
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  if (req.auth) return;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/admin")
  ) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/admin/:path*"],
};
