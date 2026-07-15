/** Normalize collection IDs to the stored slug. */
export function normalizeCollectionSlug(id: string): string {
  return id.trim().toLowerCase();
}

export function getCollectionDetailPath(collectionId: string): string {
  return `/collection/${normalizeCollectionSlug(collectionId)}`;
}
