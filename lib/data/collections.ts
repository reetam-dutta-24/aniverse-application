import type { AccentColor, Collection } from "@/types";

/**
 * Mock data layer — Collections page.
 * Async accessors so the UI stays unchanged when the DB is wired up.
 */

export interface CollectionStats {
  collections: number;
  totalItems: number;
  favourites: number;
  lastUpdated: string;
}

const accents: AccentColor[] = [
  "blue",
  "yellow",
  "pink",
  "cyan",
  "green",
  "purple",
];

const posterSlugs = [
  "death-note",
  "frieren",
  "demon-slayer",
  "jujutsu-kaisen",
  "attack-on-titan",
  "spy-x-family",
  "haikyu",
  "your-name",
  "blue-lock",
  "chainsaw-man",
  "vinland-saga",
  "oshi-no-ko",
  "classroom-of-the-elite",
  "naruto-shippuden",
  "suzume",
  "tokyo-ghoul",
  "monster",
  "code-geass",
];

const poster = (slug: string) => `/images/posters/${slug}.jpg`;

function makeCollections(
  count: number,
  idPrefix: string,
  opts: { visibility?: "public" | "private" | "mixed" } = {},
): Collection[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${i + 1}`,
    name: "Anime Masterpieces",
    description: "The greatest anime I've ever watched.",
    itemCount: 42 + (i % 8),
    favoriteCount: 16 + (i % 5),
    visibility:
      opts.visibility === "public"
        ? ("public" as const)
        : opts.visibility === "private"
          ? ("private" as const)
          : i % 4 === 0
            ? ("public" as const)
            : ("private" as const),
    createdAt: "10 Jan, 2026",
    updatedAt: "2 hrs ago",
    accent: accents[i % accents.length],
    imageUrl: poster(posterSlugs[i % posterSlugs.length]),
  }));
}

export async function getCollectionStats(): Promise<CollectionStats> {
  return {
    collections: 32,
    totalItems: 347,
    favourites: 126,
    lastUpdated: "2 hr ago",
  };
}

export async function getGenreFilters(): Promise<string[]> {
  return ["All", "Anime", "Movies", "Shows", "Music", "Mixed"];
}

export async function getSortOptions(): Promise<string[]> {
  return ["Recently Updated", "Alphabetical", "Largest", "Newest"];
}

export async function getMostLikedCollections(): Promise<Collection[]> {
  return makeCollections(16, "liked", { visibility: "mixed" });
}

export async function getRecentlyAddedCollections(): Promise<Collection[]> {
  return makeCollections(18, "added", { visibility: "mixed" });
}

export async function getRecentlyUsedCollections(): Promise<Collection[]> {
  return makeCollections(12, "used", { visibility: "mixed" });
}

export async function getAllCollections(): Promise<Collection[]> {
  return makeCollections(32, "all", { visibility: "mixed" });
}

export async function getGlobalPublicCollections(): Promise<Collection[]> {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `global-${i + 1}`,
    name: "Global Anime Collection",
    description: "Curated public picks from fans around the world.",
    itemCount: 58 + (i % 12),
    favoriteCount: 24 + (i % 9),
    visibility: "public" as const,
    createdAt: "23rd Aug, 2025",
    updatedAt: `${1 + (i % 6)} days ago`,
    accent: accents[i % accents.length],
    imageUrl: poster(posterSlugs[(i + 3) % posterSlugs.length]),
  }));
}
