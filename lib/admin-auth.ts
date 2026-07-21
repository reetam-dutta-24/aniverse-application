import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  isArtistAdmin,
  isContentAdmin,
  isMusicAdmin,
  isPlatformAdmin,
} from "@/lib/platform-roles";
import { getUserById } from "@/lib/services/user.service";

async function resolveSessionRole() {
  const session = await auth();
  if (!session?.user?.id) return null;

  if (isPlatformAdmin(session.user.role)) {
    return { userId: session.user.id, role: session.user.role! };
  }

  const user = await getUserById(session.user.id);
  if (!user) return null;
  return { userId: user.id, role: user.role };
}

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Verify the caller is any platform admin. Returns null when authorized. */
export async function requireAdminApi() {
  const ctx = await resolveSessionRole();
  if (!ctx) return unauthorized();
  if (isPlatformAdmin(ctx.role)) return null;
  return forbidden();
}

/** Content CMS — CONTENT_ADMIN or SUPER_ADMIN. */
export async function requireContentAdminApi() {
  const ctx = await resolveSessionRole();
  if (!ctx) return unauthorized();
  if (isContentAdmin(ctx.role)) return null;
  return forbidden();
}

/** Music CMS — MUSIC_ADMIN or SUPER_ADMIN. */
export async function requireMusicAdminApi() {
  const ctx = await resolveSessionRole();
  if (!ctx) return unauthorized();
  if (isMusicAdmin(ctx.role)) return null;
  return forbidden();
}

/** Artist CMS — ARTIST_ADMIN or SUPER_ADMIN. */
export async function requireArtistAdminApi() {
  const ctx = await resolveSessionRole();
  if (!ctx) return unauthorized();
  if (isArtistAdmin(ctx.role)) return null;
  return forbidden();
}
