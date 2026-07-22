import type { MediaType } from "@/types";

/** Anime, series, and K-drama — episodic catalog entries. */
export function isSerialContentType(type: MediaType): boolean {
  return type === "anime" || type === "show" || type === "kdrama";
}

/** Standalone films — single watch card, no season/episode UI. */
export function isMovieContentType(type: MediaType): boolean {
  return type === "movie" || type === "documentary";
}

/** Anime uses voice-credit labeling; live-action show/movie uses actor labeling. */
export function isVoiceCastContentType(type: MediaType): boolean {
  return type === "anime";
}

export function resolveCastCreditLabel(type: MediaType): "Voice Actor" | "Actor" {
  return isVoiceCastContentType(type) ? "Voice Actor" : "Actor";
}
