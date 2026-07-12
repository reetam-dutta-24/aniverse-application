/** Normalize list/grid music-collection IDs to a stable detail slug. */
export function normalizeMusicCollectionSlug(id: string): string {
  const aliases: Record<string, string> = {
    "music-playlist": "kpop-essentials",
    "liked-music-1": "kpop-essentials",
    "added-music-1": "kpop-essentials",
    "twice-col-1": "kpop-essentials",
  };

  const stripped = id.replace(/-\d+$/, "");
  return aliases[id] ?? aliases[stripped] ?? id;
}

const MUSIC_COLLECTION_SLUGS = new Set(["kpop-essentials"]);

export function isMusicCollectionId(id: string): boolean {
  return MUSIC_COLLECTION_SLUGS.has(normalizeMusicCollectionSlug(id));
}

export function getMusicCollectionDetailPath(collectionId: string): string {
  return `/music-collection/${normalizeMusicCollectionSlug(collectionId)}`;
}
