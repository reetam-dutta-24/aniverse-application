/** Normalize user IDs to a stable profile detail slug (public handle). */
export function normalizeProfileSlug(id: string): string {
  return id.trim().toLowerCase().replace(/-/g, "_");
}

/** Build the public profile URL from a user's handle. */
export function getProfilePath(handle: string): string {
  return `/profile/${handle}`;
}

export function isProfileId(id: string): boolean {
  return Boolean(id);
}
