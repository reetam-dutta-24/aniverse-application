import type { MediaType } from "@/types";
import { getArtistPlayPath } from "@/lib/artist-routes";
import { getCollectionPlayPath } from "@/lib/collection-routes";
import { getSongDetailPath } from "@/lib/song-routes";

export function isCatalogContentType(type: MediaType): boolean {
  return (
    type === "anime" ||
    type === "show" ||
    type === "movie" ||
    type === "documentary" ||
    type === "kdrama"
  );
}

/** Default play/watch destination from carousel poster cards. */
export function resolvePosterWatchPath(type: MediaType, id: string): string | null {
  if (isCatalogContentType(type)) {
    return getContentWatchPath(id);
  }
  if (type === "song" || type === "album") {
    return `${getSongDetailPath(id)}#player`;
  }
  if (type === "artist") {
    return getArtistPlayPath(id);
  }
  if (type === "playlist") {
    return getCollectionPlayPath(id);
  }
  return null;
}

export function normalizeContentSlug(id: string): string {
  const aliases: Record<string, string> = {
    jjk: "jujutsu-kaisen",
    aot: "attack-on-titan",
    spy: "spy-x-family",
    vinland: "vinland-saga",
    oshio: "oshi-no-ko",
    classroom: "classroom-of-elite",
  };

  const stripped = id
    .replace(/-(t|r|n|cw|cl|m)$/i, "")
    .replace(/-\d+$/, "");

  return aliases[stripped] ?? stripped;
}

export function getContentDetailPath(contentId: string): string {
  return `/content/${normalizeContentSlug(contentId)}`;
}

export function getContentWatchPath(
  contentId: string,
  episodeId?: string,
): string {
  const slug = normalizeContentSlug(contentId);
  if (episodeId) {
    return `/content/${slug}/watch/${encodeURIComponent(episodeId)}`;
  }
  return `/content/${slug}/watch`;
}

/** Watch URL for a queued catalog title — movies and serials open the player directly. */
export function getContentWatchPathForQueueItem(
  contentId: string,
  options?: { episodeId?: string },
): string {
  return getContentWatchPath(contentId, options?.episodeId);
}
