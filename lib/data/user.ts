import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { DashboardUser } from "@/components/dashboard/user-profile-menu";
import { isPlatformAdmin } from "@/lib/platform-roles";
import { getUserById } from "@/lib/services/user.service";
import type { UserSummary } from "@/types";

function toUserSummary(user: {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  avatarUrl: string | null;
}): UserSummary {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl ?? undefined,
  };
}

/**
 * Optional user — for public pages (content detail, search) that show
 * a personalized topbar when logged in, but still work for guests.
 */
export async function getOptionalUser(): Promise<UserSummary | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserById(session.user.id);
  if (!user) return null;

  return toUserSummary(user);
}

/** Full topbar user for consistent navbar across dashboard and content layouts. */
export async function getOptionalTopbarUser(): Promise<DashboardUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserById(session.user.id);
  if (!user) return null;

  return {
    name: user.name,
    handle: user.handle,
    email: user.email,
    avatarColor: user.avatarColor,
    avatarUrl: user.avatarUrl ?? undefined,
    isAdmin: isPlatformAdmin(user.role),
  };
}

/**
 * Required user — for protected dashboard pages.
 * Middleware should already block unauthenticated access; this is a
 * second safety check that loads full profile data from PostgreSQL.
 */
export async function getCurrentUser(): Promise<UserSummary> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  return toUserSummary(user);
}

/** Expose session handle for profile links and settings. */
export async function getCurrentUserSession() {
  return auth();
}
