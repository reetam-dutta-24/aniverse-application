import { prisma } from "@/lib/prisma";
import { notifyUserFollow } from "@/lib/services/notification.service";

export class FollowNotFoundError extends Error {
  constructor(message = "User not found.") {
    super(message);
    this.name = "FollowNotFoundError";
  }
}

export class FollowForbiddenError extends Error {
  constructor(message = "You cannot follow yourself.") {
    super(message);
    this.name = "FollowForbiddenError";
  }
}

export function isFollowNotFound(error: unknown): error is FollowNotFoundError {
  return error instanceof FollowNotFoundError;
}

export function isFollowForbidden(error: unknown): error is FollowForbiddenError {
  return error instanceof FollowForbiddenError;
}

export async function isUserFollowing(
  followerId: string,
  followingHandle: string,
): Promise<boolean> {
  const target = await prisma.user.findUnique({
    where: { handle: followingHandle },
    select: { id: true },
  });
  if (!target) return false;

  const row = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: target.id,
      },
    },
  });
  return Boolean(row);
}

export async function toggleUserFollow(followerId: string, followingHandle: string) {
  const target = await prisma.user.findUnique({
    where: { handle: followingHandle },
    select: { id: true, handle: true, name: true },
  });
  if (!target) throw new FollowNotFoundError();

  if (target.id === followerId) throw new FollowForbiddenError();

  const existing = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: target.id,
      },
    },
  });

  if (existing) {
    await prisma.userFollow.delete({ where: { id: existing.id } });
    const followerCount = await prisma.userFollow.count({
      where: { followingId: target.id },
    });
    return { following: false, friendCount: followerCount, followerCount, handle: target.handle };
  }

  await prisma.userFollow.create({
    data: { followerId, followingId: target.id },
  });

  const follower = await prisma.user.findUnique({
    where: { id: followerId },
    select: { name: true },
  });

  await notifyUserFollow({
    followerId,
    followerName: follower?.name ?? "Someone",
    followingId: target.id,
    followingHandle: target.handle,
  });

  const followerCount = await prisma.userFollow.count({
    where: { followingId: target.id },
  });

  return { following: true, friendCount: followerCount, followerCount, handle: target.handle };
}

export async function getFollowerCount(userId: string): Promise<number> {
  return prisma.userFollow.count({ where: { followingId: userId } });
}

export async function getFriendCount(userId: string): Promise<number> {
  return getFollowerCount(userId);
}

export async function getRecentFollowers(userId: string, limit = 3) {
  const rows = await prisma.userFollow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
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
    take: limit,
  });
  return rows.map((row) => row.follower);
}

export async function listUserFriends(userId: string, limit = 50) {
  const rows = await prisma.userFollow.findMany({
    where: { followerId: userId },
    include: {
      following: {
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
    take: limit,
  });
  return rows.map((row) => row.following);
}

export async function areUsersFriends(
  userAId: string,
  userBId: string,
): Promise<boolean> {
  const row = await prisma.userFollow.findFirst({
    where: {
      OR: [
        { followerId: userAId, followingId: userBId },
        { followerId: userBId, followingId: userAId },
      ],
    },
  });
  return Boolean(row);
}
