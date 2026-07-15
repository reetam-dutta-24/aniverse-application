import type { ContentItem, MusicTrack } from "@/types";
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

export interface ActiveFilter {
  id: string;
  label: string;
  tone: "magenta" | "yellow" | "red";
}

export async function getActiveFilters(): Promise<ActiveFilter[]> {
  return [
    { id: "anime", label: "Anime", tone: "magenta" },
    { id: "movie", label: "Movies", tone: "magenta" },
    { id: "kdrama", label: "K-Drama", tone: "yellow" },
    { id: "comedy", label: "Comedy", tone: "yellow" },
    { id: "thriller", label: "Thriller", tone: "red" },
    { id: "rating", label: "8.5+", tone: "magenta" },
  ];
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
