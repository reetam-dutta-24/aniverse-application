import { prisma } from "@/lib/prisma";
import { mapArtistToContentItem } from "@/lib/mappers/artist.mapper";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import { mapCommunityToCard } from "@/lib/mappers/community.mapper";
import { mapContentToItem } from "@/lib/mappers/content.mapper";
import {
  buildProfileDetail,
  mapReviewRow,
} from "@/lib/mappers/user-profile.mapper";
import { mapUserSummary } from "@/lib/mappers/community.mapper";
import { mapTrackToMusicTrack } from "@/lib/mappers/music.mapper";
import {
  getFollowerCount,
  getRecentFollowers,
  isUserFollowing,
} from "@/lib/services/follow.service";
import { getLikedReviewIds } from "@/lib/services/like.service";
import { normalizeProfileSlug } from "@/lib/profile-routes";
import { normalizeHandle } from "@/lib/services/user.service";
import type { ProfileSearchItem } from "@/lib/search/types";
import type { UserProfileDetail } from "@/types";

const contentInclude = {
  genres: { include: { genre: true } },
} as const;

export class UserProfileNotFoundError extends Error {
  constructor() {
    super("User profile not found.");
    this.name = "UserProfileNotFoundError";
  }
}

export class UserProfilePrivateError extends Error {
  constructor() {
    super("This profile is private.");
    this.name = "UserProfilePrivateError";
  }
}

async function findUserRecord(profileSlug: string) {
  const handle = normalizeProfileSlug(profileSlug);

  return prisma.user.findFirst({
    where: {
      OR: [{ handle }, { handle: normalizeHandle(profileSlug) }],
    },
    include: {
      preferences: true,
      tasteProfile: true,
    },
  });
}

function topTracksByPlayCount<
  T extends { track: Parameters<typeof mapTrackToMusicTrack>[0] },
>(rows: T[], limit = 8) {
  const counts = new Map<string, { track: T["track"]; count: number }>();

  for (const row of rows) {
    const existing = counts.get(row.track.id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(row.track.id, { track: row.track, count: 1 });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => mapTrackToMusicTrack(entry.track));
}

function uniqueTracks<
  T extends { track: Parameters<typeof mapTrackToMusicTrack>[0] },
>(rows: T[], limit = 8) {
  const seen = new Set<string>();
  const tracks = [];

  for (const row of rows) {
    if (seen.has(row.track.id)) continue;
    seen.add(row.track.id);
    tracks.push(mapTrackToMusicTrack(row.track));
    if (tracks.length >= limit) break;
  }

  return tracks;
}

function topContentByWatchCount(
  rows: Array<{
    content: Parameters<typeof mapContentToItem>[0];
    minutes: number;
  }>,
  limit = 8,
) {
  const counts = new Map<
    string,
    { content: Parameters<typeof mapContentToItem>[0]; minutes: number }
  >();

  for (const row of rows) {
    const existing = counts.get(row.content.id);
    if (existing) {
      existing.minutes += row.minutes;
    } else {
      counts.set(row.content.id, {
        content: row.content,
        minutes: row.minutes,
      });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit)
    .map((entry) => mapContentToItem(entry.content));
}

export async function getUserProfileDetail(
  profileSlug: string,
  viewerUserId?: string,
): Promise<UserProfileDetail | null> {
  const user = await findUserRecord(profileSlug);
  if (!user) return null;

  const isOwner = viewerUserId === user.id;
  const isPublic = user.preferences?.publicProfile ?? true;
  if (!isPublic && !isOwner) return null;

  const showHistory = isOwner || (user.preferences?.showWatchHistory ?? false);

  const [
    watchlistRows,
    favoriteRows,
    collectionRows,
    communityRows,
    reviewRows,
    listenRows,
    watchRows,
    albumRows,
    artistFollowRows,
    counts,
    watchMinutes,
    followerCount,
    recentFollowers,
    viewerFollows,
  ] = await Promise.all([
    prisma.watchlistItem.findMany({
      where: { userId: user.id },
      include: { content: { include: contentInclude } },
      orderBy: { addedAt: "desc" },
      take: 24,
    }),
    prisma.contentFavorite.findMany({
      where: { userId: user.id },
      include: { content: { include: contentInclude } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.collection.findMany({
      where: {
        userId: user.id,
        ...(isOwner ? {} : { visibility: "PUBLIC" }),
      },
      orderBy: { updatedAt: "desc" },
      take: 12,
    }),
    prisma.communityMember.findMany({
      where: { userId: user.id },
      include: { community: true },
      orderBy: { joinedAt: "desc" },
      take: 8,
    }),
    prisma.review.findMany({
      where: { authorId: user.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatarColor: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.listenEvent.findMany({
      where: { userId: user.id },
      include: { track: true },
      orderBy: { listenedAt: "desc" },
      take: 40,
    }),
    showHistory
      ? prisma.watchEvent.findMany({
          where: { userId: user.id },
          include: { content: { include: contentInclude } },
          orderBy: { watchedAt: "desc" },
          take: 40,
        })
      : Promise.resolve([]),
    prisma.musicTrack.findMany({
      where: {
        kind: "album",
        OR: [
          {
            collectionItems: {
              some: { collection: { userId: user.id } },
            },
          },
          {
            listenEvents: {
              some: { userId: user.id },
            },
          },
        ],
      },
      orderBy: { rating: "desc" },
      take: 8,
    }),
    prisma.artistFollow.findMany({
      where: { userId: user.id },
      include: { artist: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    Promise.all([
      prisma.watchlistItem.count({ where: { userId: user.id } }),
      prisma.collection.count({ where: { userId: user.id } }),
      prisma.review.count({ where: { authorId: user.id } }),
      prisma.communityMember.count({ where: { userId: user.id } }),
      prisma.contentFavorite.count({ where: { userId: user.id } }),
    ]),
    prisma.watchEvent.aggregate({
      where: { userId: user.id },
      _sum: { minutes: true },
    }),
    getFollowerCount(user.id),
    getRecentFollowers(user.id, 3),
    viewerUserId && !isOwner
      ? isUserFollowing(viewerUserId, user.handle)
      : Promise.resolve(false),
  ]);

  const likedReviewIds = await getLikedReviewIds(
    viewerUserId,
    reviewRows.map((row) => row.id),
  );

  const [
    watchlistCount,
    collectionsCount,
    reviewsCount,
    communitiesCount,
    favoritesCount,
  ] = counts;

  const watchingItems = watchlistRows
    .filter((row) => row.status === "WATCHING")
    .map((row) => mapContentToItem(row.content));

  const currentActivity =
    watchingItems.length > 0
      ? watchingItems.slice(0, 6)
      : watchlistRows.slice(0, 6).map((row) => mapContentToItem(row.content));

  const likedContent = favoriteRows
    .slice(0, 8)
    .map((row) => mapContentToItem(row.content));

  const watchedMost = showHistory
    ? topContentByWatchCount(watchRows, 8)
    : watchlistRows
        .filter((row) => row.status === "COMPLETED")
        .slice(0, 8)
        .map((row) => mapContentToItem(row.content));

  const likedSongs = uniqueTracks(listenRows, 8);
  const mostPlayedSongs = topTracksByPlayCount(listenRows, 8);
  const likedAlbums = albumRows.map(mapTrackToMusicTrack);

  const topArtists = artistFollowRows.map((row) => mapArtistToContentItem(row.artist));

  const recentActivity = [
    ...watchlistRows.slice(0, 4).map(
      (row) =>
        ({
          kind: "content" as const,
          item: mapContentToItem(row.content),
        }) satisfies import("@/types").ProfileRecentActivityItem,
    ),
    ...listenRows.slice(0, 4).map(
      (row) =>
        ({
          kind: "music" as const,
          track: mapTrackToMusicTrack(row.track),
        }) satisfies import("@/types").ProfileRecentActivityItem,
    ),
  ].slice(0, 6);

  const activeWatch = watchlistRows.find((row) => row.status === "WATCHING");
  const latestListen = listenRows[0];

  const followerSummary =
    followerCount > recentFollowers.length
      ? `....+${Math.max(0, followerCount - recentFollowers.length)} friends`
      : followerCount === 0
        ? undefined
        : `${followerCount} friends`;

  return buildProfileDetail({
    user,
    tasteProfile: user.tasteProfile,
    counts: {
      watchlist: watchlistCount,
      collections: collectionsCount,
      reviews: reviewsCount,
      communities: communitiesCount,
      favorites: favoritesCount,
      watchMinutes: watchMinutes._sum.minutes ?? 0,
    },
    currentActivity,
    likedContent,
    watchedMost,
    likedSongs,
    mostPlayedSongs,
    likedAlbums,
    topArtists,
    collections: collectionRows.map(mapCollectionToCard),
    communities: communityRows.map((row) => mapCommunityToCard(row.community)),
    reviews: reviewRows.map((row) =>
      mapReviewRow(row, { likedByViewer: likedReviewIds.has(row.id) }),
    ),
    recentActivity,
    nowListening: latestListen
      ? {
          title: latestListen.track.title,
          artist: latestListen.track.artist,
          artistId: latestListen.track.artist
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
          songId: latestListen.track.slug,
        }
      : undefined,
    currentlyWatching: activeWatch
      ? {
          title: activeWatch.content.title,
          episodeLabel: activeWatch.content.meta ?? undefined,
          contentId: activeWatch.content.slug,
        }
      : undefined,
    activitySubtitle: activeWatch
      ? `Currently Watching ${activeWatch.content.title}`
      : latestListen
        ? `Listening to ${latestListen.track.title}`
        : undefined,
    followerCount,
    followers: recentFollowers.map(mapUserSummary),
    followerSummary,
    viewerFollows: isOwner ? undefined : viewerFollows,
  });
}

export async function searchUserProfiles(
  query: string,
  limit = 8,
): Promise<ProfileSearchItem[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const rows = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { handle: { contains: normalizeHandle(q), mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
          ],
        },
        {
          OR: [
            { preferences: { is: null } },
            { preferences: { is: { publicProfile: true } } },
          ],
        },
      ],
    },
    select: {
      id: true,
      handle: true,
      name: true,
      bio: true,
      avatarColor: true,
      avatarUrl: true,
      portraitUrl: true,
      _count: { select: { followers: true } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.handle,
    name: row.name,
    handle: row.handle,
    avatarColor: row.avatarColor,
    portraitUrl: row.portraitUrl ?? row.avatarUrl ?? "/images/hero-1.png",
    followerCount: row._count.followers,
    bio: row.bio || undefined,
  }));
}

export async function listPublicProfileHandles(limit = 50): Promise<string[]> {
  const rows = await prisma.user.findMany({
    where: {
      OR: [
        { preferences: { is: null } },
        { preferences: { is: { publicProfile: true } } },
      ],
    },
    select: { handle: true },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  return rows.map((row) => row.handle);
}

export async function getUserProfileByHandle(
  handle: string,
  viewerUserId?: string,
): Promise<UserProfileDetail> {
  const profile = await getUserProfileDetail(handle, viewerUserId);
  if (!profile) {
    const exists = await prisma.user.findFirst({
      where: { handle: normalizeProfileSlug(handle) },
      select: { id: true, preferences: { select: { publicProfile: true } } },
    });
    if (exists && exists.preferences?.publicProfile === false) {
      throw new UserProfilePrivateError();
    }
    throw new UserProfileNotFoundError();
  }
  return profile;
}
