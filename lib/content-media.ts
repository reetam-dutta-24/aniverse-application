import type { MediaType } from "@/types";

/** Anime, series, and K-drama — episodic catalog entries. */
export function isSerialContentType(type: MediaType): boolean {
  return type === "anime" || type === "show" || type === "kdrama";
}

/** Standalone films — single watch card, no season/episode UI. */
export function isMovieContentType(type: MediaType): boolean {
  return type === "movie" || type === "documentary";
}
