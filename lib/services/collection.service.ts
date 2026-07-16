import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  mapCollectionItemToContent,
  mapCollectionToCard,
  mapCollectionToDetail,
} from "@/lib/mappers/collection.mapper";
import { formatRelativeTime } from "@/lib/format-dates";
import { slugify } from "@/lib/slugify";
import { mapTrackToMusicTrack } from "@/lib/mappers/music.mapper";
import type { AccentColor, Collection, CollectionDetail, ContentItem } from "@/types";
import type {
  CollectionFormInput,
  CollectionItemFormInput,
  CollectionUpdateInput,
} from "@/lib/validators/collection";

const collectionInclude = {
  user: {
    select: {
      id: true,
      name: true,
      handle: true,
      avatarColor: true,
      avatarUrl: true,
    },
  },
  items: {
    orderBy: { position: "asc" },
    include: {
      content: { include: { genres: { include: { genre: true } } } },
      track: true,
    },
  },
} satisfies Prisma.CollectionInclude;

async function findContentIdBySlug(slug: string) {
  const row = await prisma.content.findUnique({
    where: { slug },
    select: { id: true },
  });
  return row?.id ?? null;
}

async function findTrackIdBySlug(slug: string) {
  const row = await prisma.musicTrack.findUnique({
    where: { slug },
    select: { id: true },
  });
  return row?.id ?? null;
}

async function syncCollectionItemCount(collectionId: string) {
  const itemCount = await prisma.collectionItem.count({
    where: { collectionId },
  });
  await prisma.collection.update({
    where: { id: collectionId },
    data: { itemCount },
  });
  return itemCount;
}

async function getCollectionRecordBySlug(slug: string) {
  return prisma.collection.findUnique({
    where: { slug },
    include: collectionInclude,
  });
}

export async function listCollectionsForUser(userId: string): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapCollectionToCard);
}

export async function listPublicCollections(limit = 24): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: [{ favoriteCount: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map(mapCollectionToCard);
}

export async function listMostLikedCollections(
  userId: string,
  limit = 16,
): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({
    where: { userId },
    orderBy: [{ favoriteCount: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map(mapCollectionToCard);
}

export async function listRecentlyUpdatedCollections(
  userId: string,
  limit = 18,
): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map(mapCollectionToCard);
}

export async function getCollectionStatsForUser(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    select: { itemCount: true, favoriteCount: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const totalItems = collections.reduce((sum, row) => sum + row.itemCount, 0);
  const favourites = collections.reduce((sum, row) => sum + row.favoriteCount, 0);
  const latest = collections[0]?.updatedAt;

  return {
    collections: collections.length,
    totalItems,
    favourites,
    lastUpdated: latest ? formatRelativeTime(latest) : "—",
  };
}

export async function createCollection(userId: string, input: CollectionFormInput) {
  const slug = input.slug?.trim() || slugify(input.name);
  const collection = await prisma.collection.create({
    data: {
      userId,
      slug,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      category: input.category ?? "Mixed",
      genreLabels: input.genreLabels ?? [],
      kind: input.kind ?? "content",
      visibility: input.visibility,
      accent: input.accent ?? "blue",
      imageUrl: input.imageUrl?.trim() || null,
    },
    include: collectionInclude,
  });

  let position = 0;
  for (const contentSlug of input.initialContentSlugs ?? []) {
    const contentId = await findContentIdBySlug(slugify(contentSlug));
    if (!contentId) continue;
    const duplicate = await prisma.collectionItem.findFirst({
      where: { collectionId: collection.id, contentId },
    });
    if (duplicate) continue;
    await prisma.collectionItem.create({
      data: { collectionId: collection.id, contentId, position: position++ },
    });
  }
  for (const trackSlug of input.initialTrackSlugs ?? []) {
    const trackId = await findTrackIdBySlug(slugify(trackSlug));
    if (!trackId) continue;
    const duplicate = await prisma.collectionItem.findFirst({
      where: { collectionId: collection.id, trackId },
    });
    if (duplicate) continue;
    await prisma.collectionItem.create({
      data: { collectionId: collection.id, trackId, position: position++ },
    });
  }

  if (position > 0) {
    await syncCollectionItemCount(collection.id);
    const refreshed = await getCollectionRecordBySlug(slug);
    return refreshed ?? collection;
  }

  return collection;
}

export async function updateCollection(
  userId: string,
  slug: string,
  input: CollectionUpdateInput,
) {
  const existing = await prisma.collection.findFirst({
    where: { slug, userId },
  });
  if (!existing) throw new CollectionNotFoundError("Collection not found.");

  return prisma.collection.update({
    where: { id: existing.id },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.genreLabels !== undefined ? { genreLabels: input.genreLabels } : {}),
      ...(input.kind ? { kind: input.kind } : {}),
      ...(input.visibility ? { visibility: input.visibility } : {}),
      ...(input.accent ? { accent: input.accent } : {}),
      ...(input.imageUrl !== undefined
        ? { imageUrl: input.imageUrl?.trim() || null }
        : {}),
    },
    include: collectionInclude,
  });
}

export async function deleteCollection(userId: string, slug: string) {
  const existing = await prisma.collection.findFirst({
    where: { slug, userId },
  });
  if (!existing) throw new CollectionNotFoundError("Collection not found.");
  return prisma.collection.delete({ where: { id: existing.id } });
}

export async function addCollectionItem(
  userId: string,
  slug: string,
  input: CollectionItemFormInput,
) {
  const collection = await prisma.collection.findFirst({
    where: { slug, userId },
    include: { items: { select: { position: true } } },
  });
  if (!collection) throw new CollectionNotFoundError("Collection not found.");

  const contentId = input.contentSlug
    ? await findContentIdBySlug(input.contentSlug)
    : null;
  const trackId = input.trackSlug ? await findTrackIdBySlug(input.trackSlug) : null;

  if (input.contentSlug && !contentId) {
    throw new CollectionNotFoundError("Content not found.");
  }
  if (input.trackSlug && !trackId) {
    throw new CollectionNotFoundError("Track not found.");
  }

  if (contentId) {
    const duplicate = await prisma.collectionItem.findFirst({
      where: { collectionId: collection.id, contentId },
    });
    if (duplicate) {
      throw new CollectionItemDuplicateError(
        "This title is already in the collection.",
      );
    }
  }

  if (trackId) {
    const duplicate = await prisma.collectionItem.findFirst({
      where: { collectionId: collection.id, trackId },
    });
    if (duplicate) {
      throw new CollectionItemDuplicateError(
        "This song is already in the collection.",
      );
    }
  }

  const nextPosition =
    collection.items.reduce((max, item) => Math.max(max, item.position), -1) + 1;

  const row = await prisma.collectionItem.create({
    data: {
      collectionId: collection.id,
      contentId,
      trackId,
      position: nextPosition,
    },
  });

  await syncCollectionItemCount(collection.id);
  await prisma.collection.update({
    where: { id: collection.id },
    data: { updatedAt: new Date() },
  });

  return row;
}

export async function removeCollectionItem(
  userId: string,
  slug: string,
  itemId: string,
) {
  const collection = await prisma.collection.findFirst({
    where: { slug, userId },
  });
  if (!collection) throw new CollectionNotFoundError("Collection not found.");

  const item = await prisma.collectionItem.findFirst({
    where: { id: itemId, collectionId: collection.id },
  });
  if (!item) throw new CollectionNotFoundError("Collection item not found.");

  await prisma.collectionItem.delete({ where: { id: itemId } });
  await syncCollectionItemCount(collection.id);
}

export async function getCollectionDetailBySlug(
  slug: string,
  viewerUserId?: string,
): Promise<CollectionDetail | null> {
  const row = await getCollectionRecordBySlug(slug);
  if (!row) return null;
  if (row.visibility === "PRIVATE" && row.userId !== viewerUserId) {
    return null;
  }

  const allItems = row.items
    .map((item, index) => mapCollectionItemToContent(item, index))
    .filter((item): item is ContentItem => item != null);

  let continueWatching: ContentItem[] = [];
  if (viewerUserId) {
    const watchlist = await prisma.watchlistItem.findMany({
      where: {
        userId: viewerUserId,
        status: { in: ["WATCHING", "PENDING"] },
        contentId: {
          in: row.items
            .map((item) => item.contentId)
            .filter((id): id is string => id != null),
        },
      },
      include: { content: { include: { genres: { include: { genre: true } } } } },
      orderBy: { addedAt: "desc" },
      take: 6,
    });
    continueWatching = watchlist.map((item, index) =>
      mapCollectionItemToContent(
        {
          ...item,
          track: null,
          content: item.content,
          collectionId: row.id,
          trackId: null,
          position: index,
          addedAt: item.addedAt,
          id: item.id,
        },
        index,
      )!,
    );
  }

  const [similarRows, publicCommunities] = await Promise.all([
    prisma.collection.findMany({
      where: {
        slug: { not: slug },
        OR: [{ visibility: "PUBLIC" }, ...(viewerUserId ? [{ userId: viewerUserId }] : [])],
      },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.community.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { memberCount: "desc" },
      take: 4,
    }),
  ]);

  const allTracks = row.items
    .filter((item) => item.track)
    .map((item) => mapTrackToMusicTrack(item.track!));

  const isMusic = row.kind === "music";
  const featuredTrack = allTracks[0];

  return mapCollectionToDetail(row, {
    similarCollections: similarRows.map(mapCollectionToCard),
    communities: publicCommunities.map((community) => ({
      id: community.slug,
      name: community.name,
      category: community.category,
      memberCount: community.memberCount,
      postCount: community.postCount,
      visibility: community.visibility === "PUBLIC" ? "public" : "private",
      activityLevel:
        community.postCount >= 100
          ? "very-active"
          : community.postCount >= 20
            ? "active"
            : "moderate",
      accent: (community.accent as AccentColor) ?? "cyan",
      imageUrl: community.imageUrl ?? undefined,
      lastActiveAt: undefined,
    })),
    continueWatching: isMusic ? [] : continueWatching,
    watchedMost: isMusic ? [] : allItems.slice(0, 6),
    musicTracks: allTracks,
    currentActivity:
      isMusic && featuredTrack
        ? {
            title: featuredTrack.title,
            statusLabel: `Featured in ${row.name}`,
            progressLabel: featuredTrack.artist,
            imageUrl:
              featuredTrack.imageUrl ??
              `/images/posters/${featuredTrack.id}.jpg`,
            contentId: featuredTrack.id,
          }
        : allItems[0]
          ? {
              title: allItems[0].title,
              statusLabel: `Currently featured in ${row.name}`,
              imageUrl:
                allItems[0].imageUrl ?? `/images/posters/${allItems[0].id}.jpg`,
              contentId: allItems[0].id,
            }
          : row.imageUrl
            ? {
                title: row.name,
                statusLabel: `Currently featured in ${row.name}`,
                imageUrl: row.imageUrl,
                contentId: row.slug,
              }
            : undefined,
  });
}

export async function listAllCollectionSlugs() {
  const rows = await prisma.collection.findMany({
    select: { slug: true },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => row.slug);
}

export class CollectionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CollectionNotFoundError";
  }
}

export class CollectionConflictError extends Error {
  constructor() {
    super("A collection with this slug already exists.");
    this.name = "CollectionConflictError";
  }
}

export class CollectionItemDuplicateError extends Error {
  constructor(message = "This item is already in the collection.") {
    super(message);
    this.name = "CollectionItemDuplicateError";
  }
}

export function isCollectionItemDuplicate(error: unknown) {
  return error instanceof CollectionItemDuplicateError;
}

export function isCollectionConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}
