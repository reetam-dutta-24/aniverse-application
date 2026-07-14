import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/services/onboarding.service";

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

/** Onboarding page — must be logged in and not yet finished. */
export async function requireIncompleteOnboarding() {
  const userId = await requireUserId();
  const destination = await getPostAuthPath(userId);
  if (destination === "/dashboard") redirect("/dashboard");
  return userId;
}

/** Dashboard — must be logged in and finished onboarding. */
export async function requireCompletedOnboarding() {
  const userId = await requireUserId();
  const destination = await getPostAuthPath(userId);
  if (destination === "/onboarding") redirect("/onboarding");
  return userId;
}
