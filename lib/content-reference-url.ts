import type { MediaType } from "@/types";

/** External plot reference — IMDb for live-action, MyAnimeList for anime. */
export function buildContentReferenceUrl(
  type: MediaType,
  title: string,
  year?: number | null,
): string {
  const query = encodeURIComponent(year ? `${title} ${year}` : title);

  if (type === "anime") {
    return `https://myanimelist.net/search/all?q=${encodeURIComponent(title)}&cat=anime`;
  }

  const imdbType =
    type === "movie" || type === "documentary" ? "ft" : "tv";

  return `https://www.imdb.com/find/?q=${query}&s=tt&ttype=${imdbType}`;
}

/** Artist biography reference — Last.fm artist search. */
export function buildArtistReferenceUrl(title: string): string {
  return `https://www.last.fm/search/artists?q=${encodeURIComponent(title)}`;
}

/** Song lyrics / meaning reference — Genius search. */
export function buildSongReferenceUrl(title: string, artist: string): string {
  return `https://genius.com/search?q=${encodeURIComponent(`${title} ${artist}`)}`;
}
