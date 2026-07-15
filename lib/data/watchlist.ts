import type { ContentItem } from "@/types";
import {
  getAllWatchlistItems as getAllWatchlistItemsFromDb,
  getHighPriorityWatchlist as getHighPriorityWatchlistFromDb,
  getWatchlistStatsForUser,
} from "@/lib/services/watchlist.service";

/**
 * Watchlist page — backed by PostgreSQL per user.
 */

export interface WatchlistStats {
  savedItems: number;
  pending: number;
  highPriority: number;
  avgAiMatch: number;
}

export const watchlistGenres = [
  "All",
  "Anime",
  "Movies",
  "Shows",
  "Music",
  "Mixed",
] as const;

export async function getWatchlistStats(userId: string): Promise<WatchlistStats> {
  return getWatchlistStatsForUser(userId);
}

export async function getHighPriorityWatchlist(
  userId: string,
): Promise<ContentItem[]> {
  return getHighPriorityWatchlistFromDb(userId);
}

export async function getAllWatchlistItems(
  userId: string,
): Promise<ContentItem[]> {
  return getAllWatchlistItemsFromDb(userId);
}

export async function getWatchlistGenres(): Promise<readonly string[]> {
  return watchlistGenres;
}
