import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  appMediaTypeToPrisma,
  mapContentToItem,
} from "@/lib/mappers/content.mapper";
import type { ContentFormInput } from "@/lib/validators/admin/content";
import type { ContentItem, MediaType } from "@/types";

const contentInclude = {
  genres: { include: { genre: true } },
} satisfies Prisma.ContentInclude;

function emptyToNull(value: string | undefined) {
  if (value == null || value === "") return null;
  return value;
}

async function upsertGenreLabels(labels: string[]) {
  const unique = [...new Set(labels.map((l) => l.trim()).filter(Boolean))];
  const genres = await Promise.all(
    unique.map((label) =>
      prisma.genre.upsert({
        where: { label },
        create: { label },
        update: {},
      }),
    ),
  );
  return genres;
}

function toContentData(input: ContentFormInput): Prisma.ContentCreateInput {
  return {
    title: input.title,
    slug: input.slug,
    type: appMediaTypeToPrisma(input.type),
    description: emptyToNull(input.description),
    synopsis: emptyToNull(input.synopsis),
    imageUrl: emptyToNull(input.imageUrl),
    rating: input.rating ?? null,
    year: input.year ?? null,
    meta: emptyToNull(input.meta),
    accent: input.accent ?? null,
  };
}

export async function listCatalogContent(options: {
  search?: string;
  type?: MediaType;
  page?: number;
  pageSize?: number;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const where: Prisma.ContentWhereInput = {};

  if (options.type) {
    where.type = appMediaTypeToPrisma(options.type);
  }

  if (options.search) {
    where.OR = [
      { title: { contains: options.search, mode: "insensitive" } },
      { slug: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.content.findMany({
      where,
      include: contentInclude,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.content.count({ where }),
  ]);

  return {
    items: rows.map((row) => ({
      recordId: row.id,
      item: mapContentToItem(row),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listAllContentSlugs() {
  const rows = await prisma.content.findMany({
    select: { slug: true },
    orderBy: { title: "asc" },
  });
  return rows.map((row) => row.slug);
}

export async function getContentRecordById(id: string) {
  return prisma.content.findUnique({
    where: { id },
    include: contentInclude,
  });
}

export async function getContentRecordBySlug(slug: string) {
  return prisma.content.findUnique({
    where: { slug },
    include: contentInclude,
  });
}

export async function getContentItemBySlug(slug: string): Promise<ContentItem | null> {
  const row = await getContentRecordBySlug(slug);
  return row ? mapContentToItem(row) : null;
}

export async function createCatalogContent(input: ContentFormInput) {
  const genres = await upsertGenreLabels(input.genreLabels);

  return prisma.content.create({
    data: {
      ...toContentData(input),
      genres: {
        create: genres.map((genre) => ({ genreId: genre.id })),
      },
    },
    include: contentInclude,
  });
}

export async function updateCatalogContent(id: string, input: ContentFormInput) {
  const genres = await upsertGenreLabels(input.genreLabels);

  await prisma.contentGenre.deleteMany({ where: { contentId: id } });

  return prisma.content.update({
    where: { id },
    data: {
      ...toContentData(input),
      genres: {
        create: genres.map((genre) => ({ genreId: genre.id })),
      },
    },
    include: contentInclude,
  });
}

export async function deleteCatalogContent(id: string) {
  return prisma.content.delete({ where: { id } });
}

export async function countCatalogContent() {
  return prisma.content.count();
}

export class ContentConflictError extends Error {
  constructor() {
    super("A content item with this slug already exists.");
    this.name = "ContentConflictError";
  }
}

export function isUniqueSlugError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}
