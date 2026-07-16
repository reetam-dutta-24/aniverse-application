/** Normalize user IDs to a stable profile detail slug (public handle). */
export function normalizeProfileSlug(id: string): string {
  return id.trim().toLowerCase().replace(/-/g, "_");
}

/** Build the public profile URL from a user's handle. */
export function getProfilePath(handle: string): string {
  return `/profile/${handle}`;
}

/** Friends list for a user profile. */
export function getProfileFriendsPath(handle: string): string {
  return `/profile/${handle}/friends`;
}

export function isProfileId(id: string): boolean {
  return Boolean(id);
}
