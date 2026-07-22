import { prisma } from "@/lib/prisma";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import type { Collection } from "@/types";

export class CollectionFollowNotFoundError extends Error {
  constructor(message = "Collection not found.") {
    super(message);
    this.name = "CollectionFollowNotFoundError";
  }
}

export class CollectionFollowForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CollectionFollowForbiddenError";
  }
}

const collectionCardInclude = {
  _count: { select: { favorites: true, follows: true } },
} as const;

export async function isCollectionFollowed(
  userId: string,
  collectionSlug: string,
): Promise<boolean> {
  const row = await prisma.collectionFollow.findFirst({
    where: {
      userId,
      collection: { slug: collectionSlug },
    },
    select: { id: true },
  });
  return row != null;
}

export async function toggleCollectionFollow(userId: string, collectionSlug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug: collectionSlug },
    select: { id: true, userId: true, visibility: true, followerCount: true },
  });

  if (!collection) throw new CollectionFollowNotFoundError();
  if (collection.visibility !== "PUBLIC") {
    throw new CollectionFollowForbiddenError(
      "Only public collections can be followed.",
    );
  }
  if (collection.userId === userId) {
    throw new CollectionFollowForbiddenError(
      "You cannot follow a collection you created.",
    );
  }

  const existing = await prisma.collectionFollow.findUnique({
    where: {
      userId_collectionId: { userId, collectionId: collection.id },
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.collectionFollow.delete({ where: { id: existing.id } }),
      prisma.collection.update({
        where: { id: collection.id },
        data: { followerCount: { decrement: 1 } },
      }),
    ]);
    const updated = await prisma.collection.findUnique({
      where: { id: collection.id },
      select: { followerCount: true },
    });
    return {
      following: false,
      followerCount: Math.max(0, updated?.followerCount ?? 0),
    };
  }

  await prisma.$transaction([
    prisma.collectionFollow.create({
      data: { userId, collectionId: collection.id },
    }),
    prisma.collection.update({
      where: { id: collection.id },
      data: { followerCount: { increment: 1 } },
    }),
  ]);

  const updated = await prisma.collection.findUnique({
    where: { id: collection.id },
    select: { followerCount: true },
  });

  return {
    following: true,
    followerCount: updated?.followerCount ?? collection.followerCount + 1,
  };
}

export async function listFollowedPublicCollections(
  userId: string,
): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({
    where: {
      visibility: "PUBLIC",
      follows: { some: { userId } },
    },
    orderBy: { updatedAt: "desc" },
    include: collectionCardInclude,
  });
  return rows.map(mapCollectionToCard);
}
