import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import type { AdminCollectionFormInput } from "@/lib/validators/admin/collection";

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
    orderBy: { position: "asc" as const },
    include: {
      content: { select: { slug: true, title: true } },
      track: { select: { slug: true, title: true } },
    },
  },
  _count: { select: { favorites: true } },
} satisfies Prisma.CollectionInclude;

export type AdminCollectionRecord = Prisma.CollectionGetPayload<{
  include: typeof collectionInclude;
}>;

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
  const itemCount = await prisma.collectionItem.count({ where: { collectionId } });
  await prisma.collection.update({
    where: { id: collectionId },
    data: { itemCount },
  });
}

async function syncCollectionItems(
  collectionId: string,
  input: AdminCollectionFormInput,
) {
  await prisma.collectionItem.deleteMany({ where: { collectionId } });

  let position = 0;
  const contentSlugs =
    input.kind === "music" ? [] : input.contentSlugs.map((slug) => slugify(slug));
  const trackSlugs = input.trackSlugs.map((slug) => slugify(slug));

  for (const contentSlug of contentSlugs) {
    const contentId = await findContentIdBySlug(contentSlug);
    if (!contentId) continue;
    await prisma.collectionItem.create({
      data: { collectionId, contentId, position: position++ },
    });
  }

  for (const trackSlug of trackSlugs) {
    const trackId = await findTrackIdBySlug(trackSlug);
    if (!trackId) continue;
    await prisma.collectionItem.create({
      data: { collectionId, trackId, position: position++ },
    });
  }

  await syncCollectionItemCount(collectionId);
}

function toCollectionData(
  ownerUserId: string,
  input: AdminCollectionFormInput,
): Prisma.CollectionCreateInput {
  return {
    user: { connect: { id: ownerUserId } },
    slug: input.slug.trim(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    category: input.category,
    genreLabels: input.genreLabels,
    kind: input.kind,
    visibility: input.visibility,
    accent: input.accent ?? "blue",
    imageUrl: input.imageUrl?.trim() || null,
  };
}

export async function listAdminCollections(options: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 50;
  const where: Prisma.CollectionWhereInput = {};

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { slug: { contains: options.search, mode: "insensitive" } },
      { description: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.collection.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { name: true, handle: true } },
        _count: { select: { favorites: true, items: true } },
      },
    }),
    prisma.collection.count({ where }),
  ]);

  return {
    items: rows.map((row) => ({
      recordId: row.id,
      slug: row.slug,
      name: row.name,
      kind: row.kind,
      visibility: row.visibility.toLowerCase(),
      itemCount: row.itemCount,
      favoriteCount: row._count.favorites,
      ownerName: row.user.name,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAdminCollectionById(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: collectionInclude,
  });
}

export async function createAdminCollection(
  ownerUserId: string,
  input: AdminCollectionFormInput,
) {
  const row = await prisma.collection.create({
    data: toCollectionData(ownerUserId, input),
    include: collectionInclude,
  });
  await syncCollectionItems(row.id, input);
  return getAdminCollectionById(row.id);
}

export async function updateAdminCollection(id: string, input: AdminCollectionFormInput) {
  await prisma.collection.update({
    where: { id },
    data: {
      slug: input.slug.trim(),
      name: input.name.trim(),
      description: input.description?.trim() || null,
      category: input.category,
      genreLabels: input.genreLabels,
      kind: input.kind,
      visibility: input.visibility,
      accent: input.accent ?? "blue",
      imageUrl: input.imageUrl?.trim() || null,
    },
  });
  await syncCollectionItems(id, input);
  return getAdminCollectionById(id);
}

export async function deleteAdminCollection(id: string) {
  return prisma.collection.delete({ where: { id } });
}

export function adminCollectionToFormInput(
  row: AdminCollectionRecord,
): AdminCollectionFormInput {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    category: row.category as AdminCollectionFormInput["category"],
    genreLabels: row.genreLabels ?? [],
    kind: row.kind as AdminCollectionFormInput["kind"],
    visibility: row.visibility,
    accent: (row.accent as AdminCollectionFormInput["accent"]) ?? "blue",
    imageUrl: row.imageUrl ?? "",
    contentSlugs: row.items
      .filter((item) => item.content)
      .map((item) => item.content!.slug),
    trackSlugs: row.items
      .filter((item) => item.track)
      .map((item) => item.track!.slug),
  };
}

export class AdminCollectionConflictError extends Error {
  constructor() {
    super("A collection with this slug already exists.");
    this.name = "AdminCollectionConflictError";
  }
}

export function isUniqueCollectionSlugError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export async function countAdminCollections() {
  return prisma.collection.count();
}
