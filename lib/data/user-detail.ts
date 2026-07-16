import type { UserProfileDetail } from "@/types";
import { normalizeProfileSlug } from "@/lib/profile-routes";
import {
  getUserProfileDetail,
  listPublicProfileHandles,
} from "@/lib/services/user-profile.service";

/**
 * Data facade for user profile detail (`/profile/[userid]`).
 * Loads real PostgreSQL-backed profile data.
 */

export async function getAllUserIds(): Promise<string[]> {
  return listPublicProfileHandles();
}

export async function getUserDetail(
  userId: string,
  viewerUserId?: string,
): Promise<UserProfileDetail | null> {
  const slug = normalizeProfileSlug(userId);
  return getUserProfileDetail(slug, viewerUserId);
}
