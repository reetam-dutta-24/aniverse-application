import { prisma } from "@/lib/prisma";

export class LikeNotFoundError extends Error {
  constructor(message = "Item not found.") {
    super(message);
    this.name = "LikeNotFoundError";
  }
}

export function isLikeNotFound(error: unknown): error is LikeNotFoundError {
  return error instanceof LikeNotFoundError;
}

export async function getLikedPostIds(
  userId: string | undefined,
  postIds: string[],
): Promise<Set<string>> {
  if (!userId || postIds.length === 0) return new Set();
  const rows = await prisma.communityPostLike.findMany({
    where: { userId, postId: { in: postIds } },
    select: { postId: true },
  });
  return new Set(rows.map((row) => row.postId));
}

export async function getLikedReviewIds(
  userId: string | undefined,
  reviewIds: string[],
): Promise<Set<string>> {
  if (!userId || reviewIds.length === 0) return new Set();
  const rows = await prisma.reviewLike.findMany({
    where: { userId, reviewId: { in: reviewIds } },
    select: { reviewId: true },
  });
  return new Set(rows.map((row) => row.reviewId));
}

export async function toggleCommunityPostLike(
  userId: string,
  communitySlug: string,
  postId: string,
) {
  const community = await prisma.community.findUnique({
    where: { slug: communitySlug },
    select: { id: true },
  });
  if (!community) throw new LikeNotFoundError("Community not found.");

  const post = await prisma.communityPost.findFirst({
    where: { id: postId, communityId: community.id },
    select: { id: true, likeCount: true },
  });
  if (!post) throw new LikeNotFoundError("Post not found.");

  const existing = await prisma.communityPostLike.findUnique({
    where: { userId_postId: { userId, postId: post.id } },
  });

  if (existing) {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.communityPostLike.delete({ where: { id: existing.id } });
      return tx.communityPost.update({
        where: { id: post.id },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
    });
    return {
      liked: false,
      likeCount: Math.max(0, updated.likeCount),
    };
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.communityPostLike.create({
      data: { userId, postId: post.id },
    });
    return tx.communityPost.update({
      where: { id: post.id },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });
  });

  return { liked: true, likeCount: updated.likeCount };
}

export async function toggleReviewLike(userId: string, reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, likeCount: true, authorId: true },
  });
  if (!review) throw new LikeNotFoundError("Review not found.");

  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });

  if (existing) {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.reviewLike.delete({ where: { id: existing.id } });
      return tx.review.update({
        where: { id: reviewId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
    });
    return {
      liked: false,
      likeCount: Math.max(0, updated.likeCount),
    };
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.reviewLike.create({
      data: { userId, reviewId },
    });
    return tx.review.update({
      where: { id: reviewId },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });
  });

  return { liked: true, likeCount: updated.likeCount };
}
