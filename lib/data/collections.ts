import type { Collection } from "@/types";
import {
  getCollectionStatsForUser,
  listCollectionsForUser,
  listMostLikedCollections,
  listPublicCollections,
  listRecentlyUpdatedCollections,
} from "@/lib/services/collection.service";

/**
 * Collections page — backed by PostgreSQL per user.
 */

export interface CollectionStats {
  collections: number;
  totalItems: number;
  favourites: number;
  lastUpdated: string;
}

export async function getCollectionStats(
  userId: string,
): Promise<CollectionStats> {
  return getCollectionStatsForUser(userId);
}

export async function getGenreFilters(): Promise<string[]> {
  return ["All", "Anime", "Movies", "Shows", "Music", "Mixed"];
}

export async function getSortOptions(): Promise<string[]> {
  return ["Recently Updated", "Alphabetical", "Largest", "Newest"];
}

export async function getMostLikedCollections(
  userId: string,
): Promise<Collection[]> {
  return listMostLikedCollections(userId, 16);
}

export async function getRecentlyAddedCollections(
  userId: string,
): Promise<Collection[]> {
  return listRecentlyUpdatedCollections(userId, 18);
}

export async function getRecentlyUsedCollections(
  userId: string,
): Promise<Collection[]> {
  return listRecentlyUpdatedCollections(userId, 12);
}

export async function getAllCollections(userId: string): Promise<Collection[]> {
  return listCollectionsForUser(userId);
}

export async function getGlobalPublicCollections(): Promise<Collection[]> {
  return listPublicCollections(15);
}
