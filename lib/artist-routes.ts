/** Normalize carousel pool IDs to a stable artist detail slug. */
export function normalizeArtistSlug(id: string): string {
  return id.replace(/-(t|m|cl|a)$/i, "");
}

const ARTIST_ALIASES: Record<string, string> = {
  "twice-fanverse": "twice",
};

export function getArtistDetailPath(artistId: string): string {
  const slug = normalizeArtistSlug(artistId);
  return `/artist/${ARTIST_ALIASES[slug] ?? slug}`;
}

export function getArtistPlayPath(artistId: string): string {
  const slug = normalizeArtistSlug(artistId);
  return `/artist/${ARTIST_ALIASES[slug] ?? slug}/play`;
}
