import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isContentAdmin, isMusicAdmin, isArtistAdmin, isPlatformAdmin } from "@/lib/platform-roles";
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

/** Admin CMS — must be logged in with any platform admin role. */
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

/** Resolve admin session for layout/nav — redirects if not a platform admin. */
export async function getAdminSession() {
  return requireAdmin();
}

async function requireSpecialistAdmin(
  check: (role: string | undefined) => boolean,
  callbackPath: string,
) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${callbackPath}`);
  }

  if (check(session.user.role)) {
    return { userId: session.user.id, role: session.user.role };
  }

  const user = await getUserById(session.user.id);
  if (user && check(user.role)) {
    return { userId: user.id, role: user.role };
  }

  redirect("/dashboard");
}

/** Content CMS — CONTENT_ADMIN or SUPER_ADMIN. */
export async function requireContentAdmin() {
  return requireSpecialistAdmin(isContentAdmin, "/admin/content");
}

/** Music CMS — MUSIC_ADMIN or SUPER_ADMIN. */
export async function requireMusicAdmin() {
  return requireSpecialistAdmin(isMusicAdmin, "/admin/music");
}

/** Artist CMS — ARTIST_ADMIN or SUPER_ADMIN. */
export async function requireArtistAdmin() {
  return requireSpecialistAdmin(isArtistAdmin, "/admin/artists");
}
