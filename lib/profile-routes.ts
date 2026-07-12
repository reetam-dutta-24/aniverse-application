const PROFILE_ALIASES: Record<string, string> = {
  "user-1": "reetam-dutta",
};

/** Normalize session/user IDs to a stable profile detail slug. */
export function normalizeProfileSlug(id: string): string {
  return PROFILE_ALIASES[id] ?? id;
}

export function getProfilePath(userId: string): string {
  return `/profile/${normalizeProfileSlug(userId)}`;
}

export function isProfileId(id: string): boolean {
  const slug = normalizeProfileSlug(id);
  return slug === "reetam-dutta";
}
