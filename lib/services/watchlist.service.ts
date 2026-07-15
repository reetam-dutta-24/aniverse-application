import type { Prisma, WatchlistPriority, WatchlistStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  isHighPriority,
  mapWatchlistItemToContent,
} from "@/lib/mappers/watchlist.mapper";
import type { ContentItem } from "@/types";
import type {
  WatchlistFormInput,
  WatchlistUpdateInput,
} from "@/lib/validators/watchlist";

const contentInclude = {
  genres: { include: { genre: true } },
} satisfies Prisma.ContentInclude;

async function findContentIdBySlug(slug: string) {
  const row = await prisma.content.findUnique({
    where: { slug },
    select: { id: true },
  });
  return row?.id ?? null;
}

export async function listWatchlistForUser(
  userId: string,
  options: {
    priority?: WatchlistPriority;
    status?: WatchlistStatus;
  } = {},
): Promise<ContentItem[]> {
  const rows = await prisma.watchlistItem.findMany({
    where: {
      userId,
      ...(options.priority ? { priority: options.priority } : {}),
      ...(options.status ? { status: options.status } : {}),
    },
    include: { content: { include: contentInclude } },
    orderBy: [{ priority: "desc" }, { addedAt: "desc" }],
  });

  return rows.map((row, index) => mapWatchlistItemToContent(row, index));
}

export async function getWatchlistStatsForUser(userId: string) {
  const [savedItems, pending, highPriority, items] = await Promise.all([
    prisma.watchlistItem.count({ where: { userId } }),
    prisma.watchlistItem.count({ where: { userId, status: "PENDING" } }),
    prisma.watchlistItem.count({ where: { userId, priority: "HIGH" } }),
    listWatchlistForUser(userId),
  ]);

  const scores = items
    .map((item) => item.matchScore)
    .filter((score): score is number => score != null);
  const avgAiMatch =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

  return { savedItems, pending, highPriority, avgAiMatch };
}

export async function addWatchlistItem(userId: string, input: WatchlistFormInput) {
  const contentId = await findContentIdBySlug(input.contentSlug);
  if (!contentId) {
    throw new WatchlistNotFoundError("Content not found.");
  }

  return prisma.watchlistItem.create({
    data: {
      userId,
      contentId,
      priority: input.priority,
      status: input.status,
    },
    include: { content: { include: contentInclude } },
  });
}

export async function updateWatchlistItem(
  userId: string,
  itemId: string,
  input: WatchlistUpdateInput,
) {
  const existing = await prisma.watchlistItem.findFirst({
    where: { id: itemId, userId },
  });
  if (!existing) throw new WatchlistNotFoundError("Watchlist item not found.");

  return prisma.watchlistItem.update({
    where: { id: itemId },
    data: {
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
    include: { content: { include: contentInclude } },
  });
}

export async function removeWatchlistItem(userId: string, itemId: string) {
  const existing = await prisma.watchlistItem.findFirst({
    where: { id: itemId, userId },
  });
  if (!existing) throw new WatchlistNotFoundError("Watchlist item not found.");
  return prisma.watchlistItem.delete({ where: { id: itemId } });
}

export async function getHighPriorityWatchlist(userId: string) {
  return listWatchlistForUser(userId, { priority: "HIGH" });
}

export async function getAllWatchlistItems(userId: string) {
  return listWatchlistForUser(userId);
}

export class WatchlistNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WatchlistNotFoundError";
  }
}

export class WatchlistConflictError extends Error {
  constructor() {
    super("This title is already on your watchlist.");
    this.name = "WatchlistConflictError";
  }
}

export function isWatchlistConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export { isHighPriority };
