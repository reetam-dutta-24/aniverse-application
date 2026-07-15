import type { PlatformRole } from "@prisma/client";

export type AppPlatformRole = Lowercase<PlatformRole>;

const SPECIALIST_ROLES = new Set<PlatformRole>([
  "CONTENT_ADMIN",
  "MUSIC_ADMIN",
  "ARTIST_ADMIN",
]);

export function isSuperAdmin(role: PlatformRole | string | undefined): boolean {
  return role === "SUPER_ADMIN";
}

export function isContentAdmin(role: PlatformRole | string | undefined): boolean {
  return role === "CONTENT_ADMIN" || isSuperAdmin(role);
}

export function isMusicAdmin(role: PlatformRole | string | undefined): boolean {
  return role === "MUSIC_ADMIN" || isSuperAdmin(role);
}

export function isArtistAdmin(role: PlatformRole | string | undefined): boolean {
  return role === "ARTIST_ADMIN" || isSuperAdmin(role);
}

/** Any platform admin role (specialist or super). */
export function isPlatformAdmin(role: PlatformRole | string | undefined): boolean {
  if (!role || role === "USER") return false;
  return isSuperAdmin(role) || SPECIALIST_ROLES.has(role as PlatformRole);
}
