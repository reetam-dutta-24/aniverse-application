import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/platform-roles";
import { getPostAuthPath } from "@/lib/services/onboarding.service";
import { getUserById } from "@/lib/services/user.service";

/**
 * Server-side auth guards (Node runtime — safe to use Prisma).
 * Middleware only blocks unauthenticated access; these handle the rest.
 */

/** Redirect logged-in users away from landing / auth pages. */
export async function redirectAuthenticatedAway() {
  const session = await auth();
  if (!session?.user?.id) return;

  const destination = await getPostAuthPath(session.user.id);
  redirect(destination);
}

/** Ensure user is logged in; otherwise send to login. */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

/** Onboarding page — must be logged in (first-time setup or retake). */
export async function requireOnboardingAccess() {
  return requireUserId();
}

/** @deprecated Use requireOnboardingAccess — kept for clarity in docs only. */
export async function requireIncompleteOnboarding() {
  return requireOnboardingAccess();
}

/** Dashboard — must be logged in and finished onboarding. */
export async function requireCompletedOnboarding() {
  const userId = await requireUserId();
  const destination = await getPostAuthPath(userId);
  if (destination === "/onboarding") redirect("/onboarding");
  return userId;
}

/** Admin CMS — must be logged in with ADMIN or SUPER_ADMIN role. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  if (isPlatformAdmin(session.user.role)) {
    return {
      userId: session.user.id,
      role: session.user.role,
    };
  }

  const user = await getUserById(session.user.id);
  if (user && isPlatformAdmin(user.role)) {
    return { userId: user.id, role: user.role };
  }

  redirect("/dashboard");
}
