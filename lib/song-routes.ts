/** Normalize carousel pool IDs to a stable song detail slug. */
export function normalizeSongSlug(id: string): string {
  return id.replace(/-(t|m|cl)$/i, "");
}

export function getSongDetailPath(songId: string): string {
  return `/song/${normalizeSongSlug(songId)}`;
}
