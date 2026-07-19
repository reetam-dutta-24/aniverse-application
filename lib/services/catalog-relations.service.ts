import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import { mapCommunityToCard } from "@/lib/mappers/community.mapper";
import { mapContentToItem } from "@/lib/mappers/content.mapper";
import { mapArtistToContentItem } from "@/lib/mappers/artist.mapper";
import { mapTrackToMusicTrack } from "@/lib/mappers/music.mapper";
import type { Collection, Community, ContentItem, MusicTrack } from "@/types";

const contentInclude = {
  genres: { include: { genre: true } },
} satisfies Prisma.ContentInclude;

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function trackGenreIds(genres: unknown): string[] {
  return asStringArray(genres);
}

function dedupeCommunities(rows: Community[], limit: number): Community[] {
  const seen = new Set<string>();
  const result: Community[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    result.push(row);
    if (result.length >= limit) break;
  }
  return result;
}

async function mapPublicCollectionsFromItems(
  items: { collection: { visibility: string } & Parameters<typeof mapCollectionToCard>[0] }[],
  limit: number,
): Promise<Collection[]> {
  const collections: Collection[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const col = item.collection;
    if (col.visibility !== "PUBLIC" || seen.has(col.id)) continue;
    seen.add(col.id);
    collections.push(mapCollectionToCard(col));
    if (collections.length >= limit) break;
  }
  return collections;
}

export async function listCollectionsContainingContent(
  contentId: string,
  limit = 8,
): Promise<Collection[]> {
  const items = await prisma.collectionItem.findMany({
    where: { contentId },
    orderBy: { addedAt: "desc" },
    take: limit * 4,
    include: { collection: true },
  });
  return mapPublicCollectionsFromItems(items, limit);
}

export async function listCollectionsContainingTrack(
  trackId: string,
  limit = 8,
): Promise<Collection[]> {
  const items = await prisma.collectionItem.findMany({
    where: { trackId },
    orderBy: { addedAt: "desc" },
    take: limit * 4,
    include: { collection: true },
  });
  return mapPublicCollectionsFromItems(items, limit);
}

export async function listCollectionsContainingArtistTracks(
  artistId: string,
  limit = 8,
): Promise<Collection[]> {
  const items = await prisma.collectionItem.findMany({
    where: { track: { artistId } },
    orderBy: { addedAt: "desc" },
    take: limit * 4,
    include: { collection: true },
  });
  return mapPublicCollectionsFromItems(items, limit);
}

function buildCommunitySearchTerms(options: {
  title?: string;
  artist?: string;
  genreLabels?: string[];
  category?: string;
}): string[] {
  const terms = new Set<string>();
  if (options.category?.trim()) terms.add(options.category.trim());
  for (const label of options.genreLabels ?? []) {
    if (label.trim()) terms.add(label.trim());
  }
  const title = options.title?.trim();
  if (title) {
    terms.add(title);
    for (const word of title.split(/\s+/).filter((w) => w.length > 3)) {
      terms.add(word);
    }
  }
  const artist = options.artist?.trim();
  if (artist) terms.add(artist);
  return [...terms];
}

async function fetchCommunitiesByWatchTargets(options: {
  contentIds?: string[];
  trackIds?: string[];
  excludeSlugs?: string[];
  take: number;
}): Promise<Community[]> {
  const contentIds = [...new Set(options.contentIds?.filter(Boolean) ?? [])];
  const trackIds = [...new Set(options.trackIds?.filter(Boolean) ?? [])];
  if (contentIds.length === 0 && trackIds.length === 0) return [];

  const channels = await prisma.communityWatchChannel.findMany({
    where: {
      OR: [
        contentIds.length > 0 ? { contentId: { in: contentIds } } : undefined,
        trackIds.length > 0 ? { trackId: { in: trackIds } } : undefined,
      ].filter(Boolean) as Prisma.CommunityWatchChannelWhereInput[],
    },
    include: { community: true },
    orderBy: { updatedAt: "desc" },
    take: options.take * 3,
  });

  const exclude = new Set(options.excludeSlugs ?? []);
  const communities: Community[] = [];
  const seen = new Set<string>();
  for (const channel of channels) {
    const community = channel.community;
    if (
      community.visibility !== "PUBLIC" ||
      seen.has(community.slug) ||
      exclude.has(community.slug)
    ) {
      continue;
    }
    seen.add(community.slug);
    communities.push(mapCommunityToCard(community));
    if (communities.length >= options.take) break;
  }
  return communities;
}

async function fetchCommunitiesByReviewTargets(options: {
  contentId?: string;
  trackId?: string;
  artistId?: string;
  excludeSlugs?: string[];
  take: number;
}): Promise<Community[]> {
  const where: Prisma.ReviewWhereInput = {
    communityId: { not: null },
    ...(options.contentId ? { contentId: options.contentId } : {}),
    ...(options.trackId ? { trackId: options.trackId } : {}),
    ...(options.artistId ? { artistId: options.artistId } : {}),
  };

  const reviews = await prisma.review.findMany({
    where,
    include: { community: true },
    orderBy: { createdAt: "desc" },
    take: options.take * 3,
  });

  const exclude = new Set(options.excludeSlugs ?? []);
  const communities: Community[] = [];
  const seen = new Set<string>();
  for (const review of reviews) {
    const community = review.community;
    if (!community || community.visibility !== "PUBLIC") continue;
    if (seen.has(community.slug) || exclude.has(community.slug)) continue;
    seen.add(community.slug);
    communities.push(mapCommunityToCard(community));
    if (communities.length >= options.take) break;
  }
  return communities;
}

async function fetchCommunitiesBySearchTerms(
  terms: string[],
  excludeSlugs: string[],
  take: number,
): Promise<Community[]> {
  if (take <= 0 || terms.length === 0) return [];

  const rows = await prisma.community.findMany({
    where: {
      visibility: "PUBLIC",
      slug: excludeSlugs.length > 0 ? { notIn: excludeSlugs } : undefined,
      OR: terms.flatMap((term) => [
        { name: { contains: term, mode: "insensitive" as const } },
        { category: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
      ]),
    },
    orderBy: [{ memberCount: "desc" }, { postCount: "desc" }],
    take,
  });

  return rows.map(mapCommunityToCard);
}

export async function listCommunitiesForContent(
  contentId: string,
  options: {
    title?: string;
    genreLabels?: string[];
    category?: string;
  } = {},
  limit = 8,
): Promise<Community[]> {
  const fromWatch = await fetchCommunitiesByWatchTargets({
    contentIds: [contentId],
    take: limit,
  });

  const excludeSlugs = fromWatch.map((c) => c.id);
  const fromReviews = await fetchCommunitiesByReviewTargets({
    contentId,
    excludeSlugs,
    take: limit - fromWatch.length,
  });

  const combined = [...fromWatch, ...fromReviews];
  if (combined.length >= limit) return dedupeCommunities(combined, limit);

  const terms = buildCommunitySearchTerms({
    title: options.title,
    genreLabels: options.genreLabels,
    category: options.category ?? "Anime",
  });
  const filler = await fetchCommunitiesBySearchTerms(
    terms,
    [...excludeSlugs, ...combined.map((c) => c.id)],
    limit - combined.length,
  );

  return dedupeCommunities([...combined, ...filler], limit);
}

export async function listCommunitiesForTrack(
  trackId: string,
  options: {
    title?: string;
    artist?: string;
    contentId?: string | null;
    genreLabels?: string[];
  } = {},
  limit = 8,
): Promise<Community[]> {
  const contentIds = options.contentId ? [options.contentId] : [];
  const fromWatch = await fetchCommunitiesByWatchTargets({
    contentIds,
    trackIds: [trackId],
    take: limit,
  });

  const excludeSlugs = fromWatch.map((c) => c.id);
  const fromReviews = await fetchCommunitiesByReviewTargets({
    trackId,
    excludeSlugs,
    take: limit - fromWatch.length,
  });

  const combined = [...fromWatch, ...fromReviews];
  if (combined.length >= limit) return dedupeCommunities(combined, limit);

  const terms = buildCommunitySearchTerms({
    title: options.title,
    artist: options.artist,
    genreLabels: options.genreLabels,
    category: "Music",
  });
  const filler = await fetchCommunitiesBySearchTerms(
    terms,
    [...excludeSlugs, ...combined.map((c) => c.id)],
    limit - combined.length,
  );

  return dedupeCommunities([...combined, ...filler], limit);
}

export async function listCommunitiesForArtist(
  artistId: string,
  options: { title?: string; genreLabels?: string[] } = {},
  limit = 8,
): Promise<Community[]> {
  const trackRows = await prisma.musicTrack.findMany({
    where: { artistId },
    select: { id: true, contentId: true },
    take: 24,
  });
  const trackIds = trackRows.map((row) => row.id);
  const contentIds = [
    ...new Set(
      trackRows
        .map((row) => row.contentId)
        .filter((id): id is string => id != null),
    ),
  ];

  const fromWatch = await fetchCommunitiesByWatchTargets({
    contentIds,
    trackIds,
    take: limit,
  });

  const excludeSlugs = fromWatch.map((c) => c.id);
  const fromReviews = await fetchCommunitiesByReviewTargets({
    artistId,
    excludeSlugs,
    take: limit - fromWatch.length,
  });

  const combined = [...fromWatch, ...fromReviews];
  if (combined.length >= limit) return dedupeCommunities(combined, limit);

  const terms = buildCommunitySearchTerms({
    title: options.title,
    genreLabels: options.genreLabels,
    category: "Music",
  });
  const filler = await fetchCommunitiesBySearchTerms(
    terms,
    [...excludeSlugs, ...combined.map((c) => c.id)],
    limit - combined.length,
  );

  return dedupeCommunities([...combined, ...filler], limit);
}

export async function findSimilarContent(
  excludeSlug: string,
  genreIds: string[],
  limit = 12,
): Promise<ContentItem[]> {
  const rows = await prisma.content.findMany({
    where: {
      slug: { not: excludeSlug },
      ...(genreIds.length > 0
        ? { genres: { some: { genreId: { in: genreIds } } } }
        : {}),
    },
    include: contentInclude,
    orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });

  if (rows.length >= limit || genreIds.length === 0) {
    return rows.map(mapContentToItem);
  }

  const foundSlugs = new Set([excludeSlug, ...rows.map((row) => row.slug)]);
  const filler = await prisma.content.findMany({
    where: { slug: { notIn: [...foundSlugs] } },
    include: contentInclude,
    orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
    take: limit - rows.length,
  });

  return [...rows, ...filler].map(mapContentToItem);
}

type SimilarTrackInput = {
  slug: string;
  artistId?: string | null;
  artist: string;
  contentId?: string | null;
  genres?: unknown;
  language?: string | null;
};

export async function findSimilarTracks(
  track: SimilarTrackInput,
  limit = 12,
): Promise<MusicTrack[]> {
  const excludeSlug = track.slug;
  const usedSlugs = new Set<string>([excludeSlug]);
  let rows: Awaited<ReturnType<typeof prisma.musicTrack.findMany>> = [];

  if (track.artistId) {
    const sameArtist = await prisma.musicTrack.findMany({
      where: { artistId: track.artistId, slug: { not: excludeSlug } },
      orderBy: [{ featuredRank: "asc" }, { rating: "desc" }],
      take: limit,
    });
    rows = sameArtist;
    for (const row of sameArtist) usedSlugs.add(row.slug);
  } else if (track.artist.trim()) {
    const sameArtist = await prisma.musicTrack.findMany({
      where: {
        slug: { not: excludeSlug },
        artist: { equals: track.artist.trim(), mode: "insensitive" },
      },
      orderBy: [{ featuredRank: "asc" }, { rating: "desc" }],
      take: limit,
    });
    rows = sameArtist;
    for (const row of sameArtist) usedSlugs.add(row.slug);
  }

  if (rows.length < limit && track.contentId) {
    const sameSource = await prisma.musicTrack.findMany({
      where: {
        contentId: track.contentId,
        slug: { notIn: [...usedSlugs] },
      },
      orderBy: [{ featuredRank: "asc" }, { rating: "desc" }],
      take: limit - rows.length,
    });
    rows = [...rows, ...sameSource];
    for (const row of sameSource) usedSlugs.add(row.slug);
  }

  const genreIds = trackGenreIds(track.genres);
  const genreSet = new Set(genreIds.map((id) => id.toLowerCase()));
  if (track.language?.trim()) genreSet.add(track.language.trim().toLowerCase());

  if (rows.length < limit && genreSet.size > 0) {
    const genrePool = await prisma.musicTrack.findMany({
      where: { slug: { notIn: [...usedSlugs] } },
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      take: Math.max(limit * 4, 24),
    });

    const genreMatches = genrePool.filter((row) => {
      const ids = trackGenreIds(row.genres);
      return (
        ids.some((id) => genreSet.has(id.toLowerCase())) ||
        (row.language ? genreSet.has(row.language.toLowerCase()) : false)
      );
    });

    rows = [...rows, ...genreMatches.slice(0, limit - rows.length)];
    for (const row of genreMatches) usedSlugs.add(row.slug);
  }

  if (rows.length < limit) {
    const filler = await prisma.musicTrack.findMany({
      where: { slug: { notIn: [...usedSlugs] } },
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      take: limit - rows.length,
    });
    rows = [...rows, ...filler];
  }

  return rows.map(mapTrackToMusicTrack);
}

export async function findSimilarArtists(
  artistId: string,
  genreSlugs: string[],
  excludeSlug: string,
  limit = 8,
): Promise<ContentItem[]> {
  const uniqueGenres = [...new Set(genreSlugs.filter(Boolean))];

  const genreMatches =
    uniqueGenres.length > 0
      ? await prisma.artist.findMany({
          where: {
            id: { not: artistId },
            slug: { not: excludeSlug },
            OR: uniqueGenres.map((genre) => ({
              genres: { array_contains: [genre] },
            })),
          },
          orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
          take: limit,
        })
      : [];

  const usedSlugs = new Set<string>([excludeSlug, ...genreMatches.map((a) => a.slug)]);
  let rows = genreMatches;

  if (rows.length < limit) {
    const filler = await prisma.artist.findMany({
      where: { slug: { notIn: [...usedSlugs] } },
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      take: limit - rows.length,
    });
    rows = [...rows, ...filler];
  }

  return rows.map(mapArtistToContentItem);
}

export function artistGenreSlugsFromRecord(record: {
  genres?: unknown;
  primaryTags?: unknown;
}): string[] {
  const fromGenres = asStringArray(record.genres);
  if (fromGenres.length > 0) return fromGenres;
  return asStringArray(record.primaryTags);
}
