import type { ContentItem, MusicTrack } from "@/types";
import {
  getContentByGenreSlug,
  getHiddenGemsContent,
  getMusicForTaste,
  getRecommendedContent,
  getRelaxingMusic as getRelaxingMusicFromDb,
  getTrendingContent,
  getTrendingMusic,
} from "@/lib/services/feed.service";
import { getTasteProfileForUser } from "@/lib/services/onboarding.service";
import { getUserById } from "@/lib/services/user.service";

/**
 * For You feeds — personalized slices from the PostgreSQL catalog.
 */

export async function getAiTasteProfileScore(userId?: string): Promise<number> {
  if (userId) {
    const [user, taste] = await Promise.all([
      getUserById(userId),
      getTasteProfileForUser(userId),
    ]);
    if (user?.aiTasteScore != null) return user.aiTasteScore;
    if (taste?.selections && typeof taste.selections === "object") {
      const selection = taste.selections as {
        contentTypes: string[];
        genres: string[];
        musicTastes: string[];
        goals: string[];
      };
      const picks =
        selection.contentTypes.length +
        selection.genres.length +
        selection.musicTastes.length +
        selection.goals.length;
      return Math.min(78 + picks * 2, 97);
    }
  }
  return 91;
}

export async function getForYouRecommended(): Promise<ContentItem[]> {
  return getRecommendedContent(12);
}

export async function getForYouMusic(): Promise<MusicTrack[]> {
  return getMusicForTaste(12);
}

export async function getBecauseYouWatched(): Promise<ContentItem[]> {
  return getTrendingContent(10);
}

export async function getTrendingPsychological(): Promise<ContentItem[]> {
  return getContentByGenreSlug("psychological", 10);
}

export async function getTrendingSports(): Promise<ContentItem[]> {
  return getContentByGenreSlug("sports", 10);
}

export async function getThrillerNight(): Promise<ContentItem[]> {
  return getContentByGenreSlug("thriller", 10);
}

export async function getFeelGood(): Promise<ContentItem[]> {
  const [comedy, slice] = await Promise.all([
    getContentByGenreSlug("comedy", 6),
    getContentByGenreSlug("slice-of-life", 6),
  ]);
  return [...comedy, ...slice].slice(0, 10);
}

export async function getRelaxingMusic(): Promise<MusicTrack[]> {
  return getRelaxingMusicFromDb(10);
}

export async function getHiddenGems(): Promise<ContentItem[]> {
  return getHiddenGemsContent(10);
}
