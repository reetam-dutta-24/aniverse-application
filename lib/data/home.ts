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

/**
 * Mock data layer — Dashboard home.
 * Aggregates highlights from feature pages for the overview hub.
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

export async function getHomeStats(): Promise<HomeStats> {
  const [tasteScore, watchlist, collections, community, trending] =
    await Promise.all([
      getAiTasteProfileScore(),
      getWatchlistStats(),
      getCollectionStats(),
      getCommunityStats(),
      getTrendingThisWeek(),
    ]);

  return {
    aiTasteScore: tasteScore,
    watchlistSaved: watchlist.savedItems,
    watchlistPending: watchlist.pending,
    collections: collections.collections,
    communitiesJoined: community.joined,
    postsViewed: community.postsViewed,
    newMatches: 12,
    trendingCount: trending.length,
  };
}

export async function getHomeContinueWatching() {
  return getContinueWatching();
}

export async function getHomeRecommended() {
  return getRecommendedForYou();
}

export async function getHomeTrending() {
  return getTrendingThisWeek();
}

export async function getHomeContinueListening() {
  return getContinueListening();
}

export async function getHomeCommunities() {
  return getRecommendedCommunities();
}

export async function getHomeCollections() {
  return getRecentlyUsedCollections();
}
