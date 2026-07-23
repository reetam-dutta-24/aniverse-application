import type { ContentItem, MusicTrack } from "@/types";
import { tasteProfileToActiveFilters } from "@/lib/mappers/active-taste.mapper";
import { getTasteProfileForUser } from "@/lib/services/onboarding.service";
import { prisma } from "@/lib/prisma";
import {
  getContinueListening as getContinueListeningFromDb,
  getContinueWatchingContent,
  getMusicForTaste,
  getNewReleasesContent,
  getRecommendedContent,
  getTrendingContent,
  getTrendingMusic as getTrendingMusicFromDb,
} from "@/lib/services/feed.service";

/**
 * Discover feeds — backed by PostgreSQL catalog.
 * Async accessors keep the same shape for dashboard UI components.
 */

export type { ActiveTasteFilter as ActiveFilter } from "@/lib/mappers/active-taste.mapper";

export async function getActiveFilters(userId: string) {
  const [tasteProfile, user] = await Promise.all([
    getTasteProfileForUser(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { aiTasteScore: true },
    }),
  ]);

  if (!tasteProfile?.selections) return [];

  const tasteScore = user?.aiTasteScore ?? tasteProfile.tasteScore;
  return tasteProfileToActiveFilters(tasteProfile.selections, tasteScore);
}

export async function getTrendingThisWeek(): Promise<ContentItem[]> {
  return getTrendingContent(18);
}

export async function getRecommendedForYou(): Promise<ContentItem[]> {
  return getRecommendedContent(18);
}

export async function getNewReleases(): Promise<ContentItem[]> {
  return getNewReleasesContent(18);
}

export async function getContinueWatching(userId?: string): Promise<ContentItem[]> {
  return getContinueWatchingContent(userId, 8);
}

export async function getMusicForYourTaste(): Promise<MusicTrack[]> {
  return getMusicForTaste(18);
}

export async function getTrendingMusic(): Promise<MusicTrack[]> {
  return getTrendingMusicFromDb(18);
}

export async function getContinueListening(userId?: string): Promise<MusicTrack[]> {
  return getContinueListeningFromDb(userId, 8);
}
