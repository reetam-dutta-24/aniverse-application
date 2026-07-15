import { getAiTasteProfileScore } from "@/lib/data/for-you";
import {
  getContinueListening,
  getContinueWatching,
  getRecommendedForYou,
  getTrendingThisWeek,
} from "@/lib/data/discover";
import { getWatchlistStats } from "@/lib/data/watchlist";
import {
  getCollectionStats,
  getRecentlyUsedCollections,
} from "@/lib/data/collections";
import { getCommunityStats, getRecommendedCommunities } from "@/lib/data/community";
import { countCatalogContent } from "@/lib/services/feed.service";

/**
 * Dashboard home — catalog carousels from PostgreSQL; user stats still mock until watchlist/collections ship.
 */

export interface HomeStats {
  aiTasteScore: number;
  watchlistSaved: number;
  watchlistPending: number;
  collections: number;
  communitiesJoined: number;
  postsViewed: number;
  newMatches: number;
  trendingCount: number;
}

export async function getHomeStats(userId?: string): Promise<HomeStats> {
  const [tasteScore, watchlist, collections, community, catalogCount] =
    await Promise.all([
      getAiTasteProfileScore(userId),
      getWatchlistStats(),
      getCollectionStats(),
      getCommunityStats(),
      countCatalogContent(),
    ]);

  return {
    aiTasteScore: tasteScore,
    watchlistSaved: watchlist.savedItems,
    watchlistPending: watchlist.pending,
    collections: collections.collections,
    communitiesJoined: community.joined,
    postsViewed: community.postsViewed,
    newMatches: Math.min(catalogCount, 24),
    trendingCount: catalogCount,
  };
}

export async function getHomeContinueWatching(userId?: string) {
  return getContinueWatching(userId);
}

export async function getHomeRecommended() {
  return getRecommendedForYou();
}

export async function getHomeTrending() {
  return getTrendingThisWeek();
}

export async function getHomeContinueListening(userId?: string) {
  return getContinueListening(userId);
}

export async function getHomeCommunities() {
  return getRecommendedCommunities();
}

export async function getHomeCollections() {
  return getRecentlyUsedCollections();
}
