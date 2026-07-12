/** Normalize list/grid collection IDs to a stable detail slug. */
export function normalizeCollectionSlug(id: string): string {
  const aliases: Record<string, string> = {
    "liked-1": "anime-masterpieces",
    "added-1": "anime-masterpieces",
    "used-1": "anime-masterpieces",
    "all-1": "anime-masterpieces",
    "global-1": "anime-masterpieces",
    "jujutsu-kaisen-col-1": "anime-masterpieces",
    "gurenge-col-1": "anime-masterpieces",
  };

  const stripped = id.replace(/-\d+$/, "");
  return aliases[id] ?? aliases[stripped] ?? id;
}

export function getCollectionDetailPath(collectionId: string): string {
  return `/collection/${normalizeCollectionSlug(collectionId)}`;
}
