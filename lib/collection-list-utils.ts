import type { Collection } from "@/types";

export const COLLECTION_SORT_OPTIONS = [
  "Recently Updated",
  "Alphabetical",
  "Largest",
  "Newest",
] as const;

export type CollectionSortOption = (typeof COLLECTION_SORT_OPTIONS)[number];

export function matchesCollectionGenre(
  collection: Collection,
  genre: string,
): boolean {
  if (genre === "All") return true;

  const normalized = genre.toLowerCase();
  if (collection.category?.toLowerCase() === normalized) return true;
  if (normalized === "music" && collection.collectionKind === "music") {
    return true;
  }

  return (
    collection.genreLabelIds?.some(
      (label) => label.toLowerCase() === normalized,
    ) ?? false
  );
}

export function filterCollectionsByGenre(
  collections: Collection[],
  genre: string,
): Collection[] {
  if (genre === "All") return collections;
  return collections.filter((collection) =>
    matchesCollectionGenre(collection, genre),
  );
}

export function sortCollections(
  collections: Collection[],
  sort: CollectionSortOption,
): Collection[] {
  const copy = [...collections];

  switch (sort) {
    case "Alphabetical":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "Largest":
      return copy.sort((a, b) => b.itemCount - a.itemCount);
    case "Newest":
      return copy.sort(
        (a, b) => (b.createdAtTime ?? 0) - (a.createdAtTime ?? 0),
      );
    case "Recently Updated":
    default:
      return copy.sort(
        (a, b) => (b.updatedAtTime ?? 0) - (a.updatedAtTime ?? 0),
      );
  }
}

export function applyCollectionListFilters(
  collections: Collection[],
  genre: string,
  sort: CollectionSortOption,
): Collection[] {
  return sortCollections(filterCollectionsByGenre(collections, genre), sort);
}
