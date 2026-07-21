import {
  searchCatalogArtists,
  searchCatalogContent,
  searchCatalogMusic,
} from "@/lib/services/feed.service";
import { prisma } from "@/lib/prisma";
import { mapArtistToContentItem } from "@/lib/mappers/artist.mapper";
import { mapContentToItem } from "@/lib/mappers/content.mapper";
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

/** Resolve a single catalog row by slug for admin form hydration. */
export async function adminCatalogLookup(
  slug: string,
  type: SearchResultType,
): Promise<SearchResult | null> {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;

  if (type === "artist") {
    const row = await prisma.artist.findUnique({ where: { slug: normalized } });
    if (!row) return null;
    const item = mapArtistToContentItem(row);
    return toResult(
      "artist",
      item.id,
      item.title,
      item.meta ?? "Artist",
      item.imageUrl,
      getArtistDetailPath(item.id),
    );
  }

  if (type === "content") {
    const row = await prisma.content.findUnique({
      where: { slug: normalized },
      include: { genres: { include: { genre: true } } },
    });
    if (!row) return null;
    const item = mapContentToItem(row);
    return toResult(
      "content",
      item.id,
      item.title,
      item.type,
      item.imageUrl,
      getContentDetailPath(item.id),
    );
  }

  if (type === "song") {
    const row = await prisma.musicTrack.findUnique({ where: { slug: normalized } });
    if (!row) return null;
    return toResult(
      "song",
      row.slug,
      row.title,
      row.artist,
      row.imageUrl ?? undefined,
      getSongDetailPath(row.slug),
    );
  }

  return null;
}

/** Admin CMS search — DB-backed, no fuzzy score cutoff, higher limits for large catalogs. */
export async function adminCatalogSearch(
  query: string,
  allowedTypes: SearchResultType[] = ["content", "song", "artist"],
  limit = 40,
  browse = false,
): Promise<SearchResult[]> {
  const q = normalizeSearchQuery(query);
  if (q.length < 1 && !browse) return [];

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
              artist.meta ?? "Artist",
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
