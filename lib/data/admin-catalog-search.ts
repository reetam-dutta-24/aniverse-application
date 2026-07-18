import {
  searchCatalogArtists,
  searchCatalogContent,
  searchCatalogMusic,
} from "@/lib/services/feed.service";
import { getArtistDetailPath } from "@/lib/artist-routes";
import { getContentDetailPath } from "@/lib/content-routes";
import { getSongDetailPath } from "@/lib/song-routes";
import { normalizeSearchQuery } from "@/lib/search/utils";
import type { SearchResult, SearchResultType } from "@/lib/search/types";

function toResult(
  type: SearchResultType,
  id: string,
  title: string,
  subtitle: string | undefined,
  imageUrl: string | undefined,
  href: string,
): SearchResult {
  return { type, id, title, subtitle, imageUrl, href, score: 100 };
}

/** Admin CMS search — DB-backed, no fuzzy score cutoff, higher limits for large catalogs. */
export async function adminCatalogSearch(
  query: string,
  allowedTypes: SearchResultType[] = ["content", "song", "artist"],
  limit = 40,
): Promise<SearchResult[]> {
  const q = normalizeSearchQuery(query);
  if (q.length < 1) return [];

  const perType = Math.max(8, Math.ceil(limit / allowedTypes.length));
  const results: SearchResult[] = [];

  const tasks: Promise<void>[] = [];

  if (allowedTypes.includes("content")) {
    tasks.push(
      searchCatalogContent(q, perType).then((items) => {
        for (const item of items) {
          results.push(
            toResult(
              "content",
              item.id,
              item.title,
              item.type,
              item.imageUrl,
              getContentDetailPath(item.id),
            ),
          );
        }
      }),
    );
  }

  if (allowedTypes.includes("song")) {
    tasks.push(
      searchCatalogMusic(q, perType).then((tracks) => {
        for (const track of tracks) {
          results.push(
            toResult(
              "song",
              track.id,
              track.title,
              track.artist,
              track.imageUrl,
              getSongDetailPath(track.id),
            ),
          );
        }
      }),
    );
  }

  if (allowedTypes.includes("artist")) {
    tasks.push(
      searchCatalogArtists(q, perType).then((artists) => {
        for (const artist of artists) {
          results.push(
            toResult(
              "artist",
              artist.id,
              artist.title,
              "Artist",
              artist.imageUrl,
              getArtistDetailPath(artist.id),
            ),
          );
        }
      }),
    );
  }

  await Promise.all(tasks);

  const qLower = q.toLowerCase();
  return results
    .sort((a, b) => {
      const aExact = a.title.toLowerCase() === qLower ? 0 : 1;
      const bExact = b.title.toLowerCase() === qLower ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      const aStarts = a.title.toLowerCase().startsWith(qLower) ? 0 : 1;
      const bStarts = b.title.toLowerCase().startsWith(qLower) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}
