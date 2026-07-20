import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  mapCommunityPost,
  mapCommunityToCard,
  mapCommunityToCardWithMembers,
  mapCommunityToDetail,
  mapUserSummary,
} from "@/lib/mappers/community.mapper";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import { mapContentToItem } from "@/lib/mappers/content.mapper";
import { slugify } from "@/lib/slugify";
import type { Community, CommunityDetail, UserSummary } from "@/types";
import type {
  CommunityFormInput,
  CommunityPostFormInput,
  CommunityPostUpdateInput,
  CommunityUpdateInput,
} from "@/lib/validators/community";
import {
  getContinueWatchingContent,
  getTrendingContent,
  getTrendingMusic,
} from "@/lib/services/feed.service";
import { notifyCommunityPost } from "@/lib/services/notification.service";
import { getLikedPostIds } from "@/lib/services/like.service";
import {
  listCommunityVoiceChannels,
  listCommunityWatchChannels,
} from "@/lib/services/community-channel.service";

const communityInclude = {
  members: {
    take: 12,
    orderBy: { joinedAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarColor: true,
          avatarUrl: true,
          aiTasteScore: true,
        },
      },
    },
  },
} satisfies Prisma.CommunityInclude;

async function getCommunityRecordBySlug(slug: string) {
  return prisma.community.findUnique({
    where: { slug },
    include: communityInclude,
  });
}

async function syncCommunityMemberCount(communityId: string) {
  const memberCount = await prisma.communityMember.count({
    where: { communityId },
  });
  await prisma.community.update({
    where: { id: communityId },
    data: { memberCount },
  });
  return memberCount;
}

async function syncCommunityPostCount(communityId: string) {
  const postCount = await prisma.communityPost.count({
    where: { communityId },
  });
  await prisma.community.update({
    where: { id: communityId },
    data: { postCount, updatedAt: new Date() },
  });
  return postCount;
}

export async function listJoinedCommunities(userId: string): Promise<Community[]> {
  const rows = await prisma.community.findMany({
    where: { members: { some: { userId } } },
    include: communityInclude,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => mapCommunityToCardWithMembers(row, userId));
}

export async function listPublicCommunities(limit = 24): Promise<Community[]> {
  const rows = await prisma.community.findMany({
    where: { visibility: "PUBLIC" },
    include: communityInclude,
    orderBy: [{ memberCount: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map((row) => mapCommunityToCardWithMembers(row));
}

export async function listRecommendedCommunities(
  userId: string,
  limit = 12,
): Promise<Community[]> {
  const rows = await prisma.community.findMany({
    where: {
      visibility: "PUBLIC",
      members: { none: { userId } },
    },
    include: communityInclude,
    orderBy: [{ memberCount: "desc" }, { postCount: "desc" }],
    take: limit,
  });
  return rows.map(mapCommunityToCardWithMembers);
}

export async function listMostActiveCommunities(
  userId: string,
  limit = 12,
): Promise<Community[]> {
  const rows = await prisma.community.findMany({
    where: { members: { some: { userId } } },
    include: communityInclude,
    orderBy: [{ postCount: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map((row) => mapCommunityToCardWithMembers(row, userId));
}

export async function getCommunityStatsForUser(userId: string) {
  const memberships = await prisma.communityMember.findMany({
    where: { userId },
    include: {
      community: { select: { memberCount: true } },
      user: { select: { aiTasteScore: true } },
    },
  });

  const joined = memberships.length;
  const totalMembers = memberships.reduce(
    (sum, membership) => sum + membership.community.memberCount,
    0,
  );
  const postsViewed = await prisma.communityPost.count({
    where: { community: { members: { some: { userId } } } },
  });
  const scores = memberships
    .map((membership) => membership.user.aiTasteScore)
    .filter((score) => score > 0);
  const avgCompatibility =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

  return {
    joined,
    totalMembers:
      totalMembers >= 1000
        ? `${(totalMembers / 1000).toFixed(1)}K`
        : String(totalMembers),
    postsViewed,
    avgCompatibility,
  };
}

export async function createCommunity(userId: string, input: CommunityFormInput) {
  const slug = input.slug?.trim() || slugify(input.name);

  const community = await prisma.community.create({
    data: {
      slug,
      name: input.name.trim(),
      category: input.category,
      description: input.description?.trim() || null,
      visibility: input.visibility,
      activityLevel: input.activityLevel ?? "active",
      accent: input.accent ?? "cyan",
      imageUrl: input.imageUrl?.trim() || null,
      wallpaperUrl: input.wallpaperUrl?.trim() || null,
      memberCount: 1,
    },
  });

  await prisma.communityMember.create({
    data: {
      userId,
      communityId: community.id,
      role: "ADMIN",
    },
  });

  return getCommunityRecordBySlug(community.slug);
}

export async function updateCommunity(
  userId: string,
  slug: string,
  input: CommunityUpdateInput,
) {
  const membership = await prisma.communityMember.findFirst({
    where: {
      userId,
      community: { slug },
      role: { in: ["ADMIN", "MODERATOR"] },
    },
    include: { community: true },
  });
  if (!membership) throw new CommunityNotFoundError("Community not found.");

  return prisma.community.update({
    where: { id: membership.communityId },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
      ...(input.visibility ? { visibility: input.visibility } : {}),
      ...(input.activityLevel ? { activityLevel: input.activityLevel } : {}),
      ...(input.accent ? { accent: input.accent } : {}),
      ...(input.imageUrl !== undefined
        ? { imageUrl: input.imageUrl?.trim() || null }
        : {}),
      ...(input.wallpaperUrl !== undefined
        ? { wallpaperUrl: input.wallpaperUrl?.trim() || null }
        : {}),
    },
    include: communityInclude,
  });
}

export async function deleteCommunity(userId: string, slug: string) {
  const membership = await prisma.communityMember.findFirst({
    where: { userId, community: { slug }, role: "ADMIN" },
    include: { community: true },
  });
  if (!membership) throw new CommunityNotFoundError("Community not found.");
  return prisma.community.delete({ where: { id: membership.communityId } });
}

export async function joinCommunity(userId: string, slug: string) {
  const community = await prisma.community.findUnique({ where: { slug } });
  if (!community) throw new CommunityNotFoundError("Community not found.");
  if (community.visibility === "PRIVATE") {
    throw new CommunityForbiddenError("This community is private.");
  }

  const existing = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId: community.id } },
  });
  if (existing) return existing;

  const membership = await prisma.communityMember.create({
    data: { userId, communityId: community.id, role: "MEMBER" },
  });
  await syncCommunityMemberCount(community.id);
  return membership;
}

export async function leaveCommunity(userId: string, slug: string) {
  const community = await prisma.community.findUnique({ where: { slug } });
  if (!community) throw new CommunityNotFoundError("Community not found.");

  const membership = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId: community.id } },
  });
  if (!membership) throw new CommunityNotFoundError("You are not a member.");

  await prisma.communityMember.delete({
    where: { userId_communityId: { userId, communityId: community.id } },
  });
  await syncCommunityMemberCount(community.id);
}

export async function listCommunityPosts(
  slug: string,
  limit = 20,
  kind?: "POST" | "ANNOUNCEMENT",
) {
  const community = await prisma.community.findUnique({ where: { slug } });
  if (!community) throw new CommunityNotFoundError("Community not found.");

  return prisma.communityPost.findMany({
    where: {
      communityId: community.id,
      ...(kind ? { kind } : {}),
    },
    include: {
      author: {
        select: { id: true, name: true, avatarColor: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function createCommunityPost(
  userId: string,
  slug: string,
  input: CommunityPostFormInput,
) {
  const membership = await prisma.communityMember.findFirst({
    where: { userId, community: { slug } },
    include: { community: true },
  });
  if (!membership) throw new CommunityForbiddenError("Join the community first.");

  const kind = input.kind ?? "POST";
  if (kind === "ANNOUNCEMENT" && !["ADMIN", "MODERATOR"].includes(membership.role)) {
    throw new CommunityForbiddenError("Only admins and moderators can post announcements.");
  }

  const post = await prisma.communityPost.create({
    data: {
      communityId: membership.communityId,
      authorId: userId,
      title: input.title.trim(),
      content: input.content?.trim() || input.title.trim(),
      imageUrl: input.imageUrl?.trim() || null,
      kind,
    },
    include: {
      author: {
        select: { id: true, name: true, avatarColor: true, avatarUrl: true },
      },
      community: {
        select: {
          id: true,
          slug: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  await syncCommunityPostCount(membership.communityId);

  await notifyCommunityPost(post.community, {
    id: post.id,
    title: post.title,
    authorId: post.authorId,
    authorName: post.author.name,
  });

  return post;
}

export async function updateCommunityPost(
  userId: string,
  slug: string,
  postId: string,
  input: CommunityPostUpdateInput,
) {
  const post = await prisma.communityPost.findFirst({
    where: {
      id: postId,
      authorId: userId,
      community: { slug },
    },
  });
  if (!post) throw new CommunityNotFoundError("Post not found.");

  return prisma.communityPost.update({
    where: { id: postId },
    data: {
      ...(input.title ? { title: input.title.trim() } : {}),
      ...(input.content !== undefined
        ? { content: input.content?.trim() || undefined }
        : {}),
      ...(input.imageUrl !== undefined
        ? { imageUrl: input.imageUrl?.trim() || null }
        : {}),
    },
    include: {
      author: {
        select: { id: true, name: true, avatarColor: true, avatarUrl: true },
      },
    },
  });
}

export async function deleteCommunityPost(
  userId: string,
  slug: string,
  postId: string,
) {
  const post = await prisma.communityPost.findFirst({
    where: {
      id: postId,
      community: { slug },
      OR: [
        { authorId: userId },
        {
          community: {
            members: {
              some: {
                userId,
                role: { in: ["ADMIN", "MODERATOR"] },
              },
            },
          },
        },
      ],
    },
  });
  if (!post) throw new CommunityNotFoundError("Post not found.");

  await prisma.communityPost.delete({ where: { id: postId } });
  await syncCommunityPostCount(post.communityId);
}

export async function getCommunityMemberPreview(
  slug: string,
  limit = 6,
): Promise<UserSummary[]> {
  const community = await prisma.community.findUnique({ where: { slug } });
  if (!community) return [];

  const members = await prisma.communityMember.findMany({
    where: { communityId: community.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarColor: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { joinedAt: "asc" },
    take: limit,
  });

  return members.map((member) => mapUserSummary(member.user));
}

const CATEGORY_MEDIA: Record<string, string> = {
  Anime: "ANIME",
  Movies: "MOVIE",
  Shows: "SHOW",
};

async function getCommunityFavoriteContent(
  category: string,
  limit = 8,
) {
  const mediaType = CATEGORY_MEDIA[category];
  const rows = await prisma.content.findMany({
    where: mediaType ? { type: mediaType as "ANIME" | "MOVIE" | "SHOW" } : {},
    include: { genres: { include: { genre: true } } },
    orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return rows.map(mapContentToItem);
}

export async function getCommunityDetailBySlug(
  slug: string,
  viewerUserId?: string,
): Promise<CommunityDetail | null> {
  const row = await getCommunityRecordBySlug(slug);
  if (!row) return null;

  if (row.visibility === "PRIVATE") {
    const isMember = viewerUserId
      ? row.members.some((member) => member.userId === viewerUserId)
      : false;
    if (!isMember) return null;
  }

  const [posts, announcements, voiceChannels, watchChannels, watchedMost, trending, musicTracks, collections, similarRows, categoryContent] =
    await Promise.all([
      listCommunityPosts(slug, 24, "POST"),
      listCommunityPosts(slug, 12, "ANNOUNCEMENT"),
      listCommunityVoiceChannels(slug, viewerUserId),
      listCommunityWatchChannels(slug, viewerUserId),
      viewerUserId
        ? getContinueWatchingContent(viewerUserId, 8)
        : getTrendingContent(8),
      getTrendingContent(8),
      getTrendingMusic(8),
      prisma.collection.findMany({
        where: {
          visibility: "PUBLIC",
          category: row.category,
        },
        orderBy: { favoriteCount: "desc" },
        take: 4,
        include: { _count: { select: { favorites: true } } },
      }),
      prisma.community.findMany({
        where: {
          slug: { not: slug },
          visibility: "PUBLIC",
          ...(viewerUserId
            ? { members: { none: { userId: viewerUserId } } }
            : {}),
        },
        include: communityInclude,
        orderBy: { memberCount: "desc" },
        take: 4,
      }),
      getCommunityFavoriteContent(row.category, 8),
    ]);

  const allPostIds = [...posts, ...announcements].map((post) => post.id);
  const likedPostIds = await getLikedPostIds(viewerUserId, allPostIds);

  return mapCommunityToDetail(row, {
    posts,
    announcements,
    voiceChannels,
    watchChannels,
    viewerUserId,
    likedPostIds,
    memberPreview: row.members.map((member) => mapUserSummary(member.user)),
    onlineMembers: row.members.slice(0, 8).map((member) => ({
      id: member.user.id,
      name: member.user.name,
      avatarColor: member.user.avatarColor,
      avatarUrl: member.user.avatarUrl ?? undefined,
      role:
        member.role === "ADMIN"
          ? "admin"
          : member.role === "MODERATOR"
            ? "moderator"
            : "member",
      online: true,
      joinedAt: undefined,
    })),
    collections: collections.map(mapCollectionToCard),
    similarCommunities: similarRows.map(mapCommunityToCard),
    watchedMost,
    trending,
    musicTracks,
    favoriteItems: categoryContent.slice(0, 6),
  });
}

export async function listAllCommunitySlugs() {
  const rows = await prisma.community.findMany({
    select: { slug: true },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => row.slug);
}

export { mapCommunityPost };

export async function listUserJoinedCommunities(userId: string) {
  const rows = await prisma.communityMember.findMany({
    where: { userId },
    include: { community: true },
    orderBy: { joinedAt: "desc" },
  });
  return rows.map((row) => row.community);
}

export class CommunityNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommunityNotFoundError";
  }
}

export class CommunityForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommunityForbiddenError";
  }
}

export class CommunityConflictError extends Error {
  constructor() {
    super("A community with this slug already exists.");
    this.name = "CommunityConflictError";
  }
}

export function isCommunityConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}
