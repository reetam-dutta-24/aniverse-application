import type { PlatformRole } from "@prisma/client";

export type AppPlatformRole = Lowercase<PlatformRole>;

export function isPlatformAdmin(role: PlatformRole | string | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role: PlatformRole | string | undefined): boolean {
  return role === "SUPER_ADMIN";
}
