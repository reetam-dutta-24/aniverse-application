import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  appMediaTypeToPrisma,
  mapContentToItem,
} from "@/lib/mappers/content.mapper";
import {
  mapTrackToContentItem,
  mapTrackToMusicTrack,
} from "@/lib/mappers/music.mapper";
import { mapArtistToContentItem } from "@/lib/mappers/artist.mapper";
import { roundRating } from "@/lib/format-rating";
import type { ContentItem, MediaType, MusicTrack } from "@/types";

const contentInclude = {
  genres: { include: { genre: true } },
} satisfies Prisma.ContentInclude;

function withMatchScores(items: ContentItem[], seed = 0): ContentItem[] {
  return items.map((item, index) => ({
    ...item,
    matchScore:
      item.matchScore ?? 72 + ((index + seed) * 11) % 27,
  }));
}

async function fetchContentItems(options: {
  where?: Prisma.ContentWhereInput;
  orderBy?: Prisma.ContentOrderByWithRelationInput | Prisma.ContentOrderByWithRelationInput[];
  take?: number;
  skip?: number;
}): Promise<ContentItem[]> {
  const rows = await prisma.content.findMany({
    where: options.where,
    include: contentInclude,
    orderBy: options.orderBy ?? [{ rating: "desc" }, { updatedAt: "desc" }],
    take: options.take ?? 18,
    skip: options.skip ?? 0,
  });
  return rows.map(mapContentToItem);
}

export async function getTrendingContent(limit = 18): Promise<ContentItem[]> {
  return withMatchScores(
    await fetchContentItems({
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      take: limit,
    }),
  );
}

export async function getRecommendedContent(limit = 18): Promise<ContentItem[]> {
  return withMatchScores(
    await fetchContentItems({
      orderBy: [{ malScore: "desc" }, { rating: "desc" }],
      take: limit,
      skip: 2,
    }),
    4,
  );
}

export async function getNewReleasesContent(limit = 18): Promise<ContentItem[]> {
  return withMatchScores(
    await fetchContentItems({
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      take: limit,
    }),
    2,
  );
}

export async function getContentByType(
  type: MediaType,
  limit = 12,
): Promise<ContentItem[]> {
  return fetchContentItems({
    where: { type: appMediaTypeToPrisma(type) },
    orderBy: { rating: "desc" },
    take: limit,
  });
}

export async function getContentByGenreSlug(
  genreSlug: string,
  limit = 12,
): Promise<ContentItem[]> {
  return withMatchScores(
    await fetchContentItems({
      where: {
        genres: { some: { genre: { label: genreSlug } } },
      },
      orderBy: { rating: "desc" },
      take: limit,
    }),
  );
}

export async function getHiddenGemsContent(limit = 12): Promise<ContentItem[]> {
  return withMatchScores(
    await fetchContentItems({
      where: { rating: { gte: 8, lte: 8.6 } },
      orderBy: [{ malScore: "desc" }, { year: "asc" }],
      take: limit,
    }),
    7,
  );
}

export async function getContinueWatchingContent(
  userId?: string,
  limit = 8,
): Promise<ContentItem[]> {
  if (userId) {
    const rows = await prisma.watchlistItem.findMany({
      where: {
        userId,
        status: { in: ["WATCHING", "PENDING"] },
      },
      include: { content: { include: contentInclude } },
      orderBy: { addedAt: "desc" },
      take: limit,
    });
    const items = rows
      .filter((row) => row.content)
      .map((row) => mapContentToItem(row.content!));
    if (items.length > 0) return withMatchScores(items);
  }

  return withMatchScores(
    await fetchContentItems({
      orderBy: { rating: "desc" },
      take: limit,
      skip: 4,
    }),
    1,
  );
}

export async function getTrendingMusic(limit = 18): Promise<MusicTrack[]> {
  const rows = await prisma.musicTrack.findMany({
    orderBy: [{ featuredRank: "asc" }, { rating: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map((row, index) => ({
    ...mapTrackToMusicTrack(row),
    matchScore: 78 + (index % 18),
  }));
}

export async function getMusicForTaste(limit = 18): Promise<MusicTrack[]> {
  const rows = await prisma.musicTrack.findMany({
    where: { kind: { in: ["ost", "album"] } },
    orderBy: [{ rating: "desc" }, { featuredRank: "asc" }],
    take: limit,
  });
  return rows.map((row, index) => ({
    ...mapTrackToMusicTrack(row),
    matchScore: 75 + (index % 20),
  }));
}

export async function getRelaxingMusic(limit = 12): Promise<MusicTrack[]> {
  const rows = await prisma.musicTrack.findMany({
    where: { kind: { in: ["ost", "album"] } },
    orderBy: [{ rating: "desc" }, { durationSeconds: "desc" }],
    take: limit,
  });
  return rows.map(mapTrackToMusicTrack);
}

export async function getContinueListening(
  userId?: string,
  limit = 8,
): Promise<MusicTrack[]> {
  if (userId) {
    const events = await prisma.listenEvent.findMany({
      where: { userId },
      include: { track: true },
      orderBy: { listenedAt: "desc" },
      take: limit * 2,
    });
    const seen = new Set<string>();
    const tracks: MusicTrack[] = [];
    for (const event of events) {
      if (!event.track || seen.has(event.track.slug)) continue;
      seen.add(event.track.slug);
      tracks.push(mapTrackToMusicTrack(event.track));
      if (tracks.length >= limit) break;
    }
    if (tracks.length > 0) return tracks;
  }

  const rows = await prisma.musicTrack.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map(mapTrackToMusicTrack);
}

export async function listAllCatalogContentItems(
  limit = 100,
): Promise<ContentItem[]> {
  return fetchContentItems({ take: limit });
}

export async function listAllCatalogMusicTracks(
  limit = 100,
): Promise<MusicTrack[]> {
  const rows = await prisma.musicTrack.findMany({
    orderBy: { title: "asc" },
    take: limit,
  });
  return rows.map(mapTrackToMusicTrack);
}

export async function listArtistSearchItems(limit = 50): Promise<ContentItem[]> {
  const rows = await prisma.artist.findMany({
    orderBy: [{ rating: "desc" }, { title: "asc" }],
    take: limit,
  });
  return rows.map(mapArtistToContentItem);
}

export async function searchCatalogContent(
  query: string,
  limit = 24,
): Promise<ContentItem[]> {
  return fetchContentItems({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
        { nativeTitle: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
  });
}

export async function searchCatalogMusic(
  query: string,
  limit = 24,
): Promise<MusicTrack[]> {
  const rows = await prisma.musicTrack.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
        { artist: { contains: query, mode: "insensitive" } },
        { source: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    orderBy: { rating: "desc" },
  });
  return rows.map(mapTrackToMusicTrack);
}

export async function searchCatalogArtists(
  query: string,
  limit = 12,
): Promise<ContentItem[]> {
  const rows = await prisma.artist.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
        { nativeTitle: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    orderBy: { rating: "desc" },
  });
  return rows.map(mapArtistToContentItem);
}

export async function getSpotlightFromCatalog(): Promise<{
  content: ContentItem | null;
  music: ContentItem | null;
}> {
  const [topContent, topTrack] = await Promise.all([
    fetchContentItems({ orderBy: { rating: "desc" }, take: 1 }),
    prisma.musicTrack.findFirst({
      orderBy: [{ featuredRank: "asc" }, { rating: "desc" }],
    }),
  ]);

  const music = topTrack ? mapTrackToContentItem(topTrack) : null;

  return {
    content: topContent[0] ?? null,
    music,
  };
}

export async function getFeaturedCatalogReviews(limit = 6) {
  const rows = await prisma.catalogReview.findMany({
    where: {
      OR: [
        { contentId: { not: null } },
        { trackId: { not: null } },
        { artistId: { not: null } },
      ],
    },
    orderBy: [{ likeCount: "desc" }, { rating: "desc" }],
    take: limit,
    include: {
      content: { select: { slug: true, title: true } },
      track: { select: { slug: true, title: true } },
      artist: { select: { slug: true, title: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    author: {
      id: `catalog-${row.id}`,
      name: row.authorName,
      avatarColor: row.authorAvatarColor ?? "#ff00cc",
    },
    rating: roundRating(row.rating) ?? 0,
    headline: row.headline ?? undefined,
    content: row.body,
    likeCount: row.likeCount,
    createdAt: row.createdAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    accent: (row.accent as ContentItem["accent"]) ?? undefined,
  }));
}

export async function countCatalogContent(): Promise<number> {
  return prisma.content.count();
}
