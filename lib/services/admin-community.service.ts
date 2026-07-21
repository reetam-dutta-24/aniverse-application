import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AdminCommunityFormInput } from "@/lib/validators/admin/community";

const communityInclude = {
  members: {
    take: 8,
    orderBy: { joinedAt: "asc" as const },
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
  },
} satisfies Prisma.CommunityInclude;

export type AdminCommunityRecord = Prisma.CommunityGetPayload<{
  include: typeof communityInclude;
}>;

function toCommunityData(input: AdminCommunityFormInput): Prisma.CommunityCreateInput {
  return {
    slug: input.slug.trim(),
    name: input.name.trim(),
    category: input.category,
    description: input.description?.trim() || null,
    visibility: input.visibility,
    activityLevel: input.activityLevel ?? "active",
    accent: input.accent ?? "cyan",
    imageUrl: input.imageUrl?.trim() || null,
    wallpaperUrl: input.wallpaperUrl?.trim() || null,
    memberCount: 1,
  };
}

export async function listAdminCommunities(options: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 50;
  const where: Prisma.CommunityWhereInput = {};

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { slug: { contains: options.search, mode: "insensitive" } },
      { category: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.community.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.community.count({ where }),
  ]);

  return {
    items: rows.map((row) => ({
      recordId: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      visibility: row.visibility.toLowerCase(),
      memberCount: row.memberCount,
      postCount: row.postCount,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAdminCommunityById(id: string) {
  return prisma.community.findUnique({
    where: { id },
    include: communityInclude,
  });
}

export async function createAdminCommunity(
  ownerUserId: string,
  input: AdminCommunityFormInput,
) {
  const community = await prisma.community.create({
    data: toCommunityData(input),
  });

  await prisma.communityMember.create({
    data: {
      userId: ownerUserId,
      communityId: community.id,
      role: "ADMIN",
    },
  });

  return getAdminCommunityById(community.id);
}

export async function updateAdminCommunity(id: string, input: AdminCommunityFormInput) {
  return prisma.community.update({
    where: { id },
    data: {
      slug: input.slug.trim(),
      name: input.name.trim(),
      category: input.category,
      description: input.description?.trim() || null,
      visibility: input.visibility,
      activityLevel: input.activityLevel ?? "active",
      accent: input.accent ?? "cyan",
      imageUrl: input.imageUrl?.trim() || null,
      wallpaperUrl: input.wallpaperUrl?.trim() || null,
    },
    include: communityInclude,
  });
}

export async function deleteAdminCommunity(id: string) {
  return prisma.community.delete({ where: { id } });
}

export function adminCommunityToFormInput(
  row: AdminCommunityRecord,
): AdminCommunityFormInput {
  return {
    name: row.name,
    slug: row.slug,
    category: row.category as AdminCommunityFormInput["category"],
    description: row.description ?? "",
    visibility: row.visibility,
    activityLevel:
      (row.activityLevel as AdminCommunityFormInput["activityLevel"]) ?? "active",
    accent: (row.accent as AdminCommunityFormInput["accent"]) ?? "cyan",
    imageUrl: row.imageUrl ?? "",
    wallpaperUrl: row.wallpaperUrl ?? "",
  };
}

export class AdminCommunityConflictError extends Error {
  constructor() {
    super("A community with this slug already exists.");
    this.name = "AdminCommunityConflictError";
  }
}

export function isUniqueCommunitySlugError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export async function countAdminCommunities() {
  return prisma.community.count();
}
