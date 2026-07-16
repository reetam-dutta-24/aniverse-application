import { prisma } from "@/lib/prisma";

export class FavoriteNotFoundError extends Error {
  constructor(message = "Item not found.") {
    super(message);
    this.name = "FavoriteNotFoundError";
  }
}

export async function isCollectionFavorited(
  userId: string,
  collectionSlug: string,
): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT cf.id
    FROM "CollectionFavorite" cf
    INNER JOIN "Collection" c ON c.id = cf."collectionId"
    WHERE cf."userId" = ${userId} AND c.slug = ${collectionSlug}
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function isContentFavorited(
  userId: string,
  contentSlug: string,
): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT cf.id
    FROM "ContentFavorite" cf
    INNER JOIN "Content" c ON c.id = cf."contentId"
    WHERE cf."userId" = ${userId} AND c.slug = ${contentSlug}
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function toggleCollectionFavorite(userId: string, collectionSlug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug: collectionSlug },
    select: { id: true, favoriteCount: true },
  });
  if (!collection) throw new FavoriteNotFoundError("Collection not found.");

  const existing = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "CollectionFavorite"
    WHERE "userId" = ${userId} AND "collectionId" = ${collection.id}
    LIMIT 1
  `;

  if (existing.length > 0) {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        DELETE FROM "CollectionFavorite" WHERE id = ${existing[0].id}
      `;
      return tx.collection.update({
        where: { id: collection.id },
        data: { favoriteCount: { decrement: 1 } },
        select: { favoriteCount: true },
      });
    });
    return {
      favorited: false,
      favoriteCount: Math.max(0, updated.favoriteCount),
    };
  }

  const favoriteId = crypto.randomUUID();
  const updated = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      INSERT INTO "CollectionFavorite" (id, "userId", "collectionId", "createdAt")
      VALUES (${favoriteId}, ${userId}, ${collection.id}, NOW())
    `;
    return tx.collection.update({
      where: { id: collection.id },
      data: { favoriteCount: { increment: 1 } },
      select: { favoriteCount: true },
    });
  });

  return { favorited: true, favoriteCount: updated.favoriteCount };
}

export async function toggleContentFavorite(userId: string, contentSlug: string) {
  const content = await prisma.content.findUnique({
    where: { slug: contentSlug },
    select: { id: true },
  });
  if (!content) throw new FavoriteNotFoundError("Content not found.");

  const existing = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "ContentFavorite"
    WHERE "userId" = ${userId} AND "contentId" = ${content.id}
    LIMIT 1
  `;

  if (existing.length > 0) {
    await prisma.$executeRaw`
      DELETE FROM "ContentFavorite" WHERE id = ${existing[0].id}
    `;
    return { favorited: false };
  }

  const favoriteId = crypto.randomUUID();
  await prisma.$executeRaw`
    INSERT INTO "ContentFavorite" (id, "userId", "contentId", "createdAt")
    VALUES (${favoriteId}, ${userId}, ${content.id}, NOW())
  `;
  return { favorited: true };
}
