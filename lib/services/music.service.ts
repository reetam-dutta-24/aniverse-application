import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapTrackToMusicTrack } from "@/lib/mappers/music.mapper";
import type { MusicFormInput } from "@/lib/validators/admin/music";
import { roundRating } from "@/lib/format-rating";

const trackInclude = {
  artistRef: true,
  sourceContent: true,
  catalogReviews: { orderBy: { position: "asc" as const } },
} satisfies Prisma.MusicTrackInclude;

export type TrackRecordFull = Prisma.MusicTrackGetPayload<{
  include: typeof trackInclude;
}>;

function asGenreArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function emptyToNull(value: string | undefined) {
  if (value == null || value === "") return null;
  return value;
}

async function resolveArtistId(slug?: string) {
  if (!slug) return null;
  const artist = await prisma.artist.findUnique({
    where: { slug },
    select: { id: true },
  });
  return artist?.id ?? null;
}

async function resolveContentId(slug?: string) {
  if (!slug) return null;
  const content = await prisma.content.findUnique({
    where: { slug },
    select: { id: true },
  });
  return content?.id ?? null;
}

async function syncTrackReviews(trackId: string, input: MusicFormInput) {
  await prisma.catalogReview.deleteMany({ where: { trackId } });
  for (const [index, review] of input.catalogReviews.entries()) {
    await prisma.catalogReview.create({
      data: {
        trackId,
        authorName: review.authorName,
        authorAvatarColor: emptyToNull(review.authorAvatarColor) ?? "#ff00cc",
        rating: roundRating(review.rating) ?? 0,
        headline: emptyToNull(review.headline),
        body: review.body,
        accent: review.accent ?? null,
        likeCount: review.likeCount ?? 0,
        position: index,
      },
    });
  }
}

async function toTrackData(input: MusicFormInput): Promise<Prisma.MusicTrackCreateInput> {
  const artistId = await resolveArtistId(input.artistSlug);
  const contentId = await resolveContentId(input.contentSlug);

  return {
    title: input.title,
    slug: input.slug,
    nativeTitle: emptyToNull(input.nativeTitle),
    artist: input.artist,
    kind: input.kind,
    description: emptyToNull(input.description),
    lyrics: emptyToNull(input.lyrics),
    source: emptyToNull(input.source),
    album: emptyToNull(input.album),
    language: emptyToNull(input.language),
    genres: input.genreLabels,
    rating: roundRating(input.rating),
    year: input.year ?? null,
    durationLabel: emptyToNull(input.durationLabel),
    durationSeconds: input.durationSeconds ?? null,
    imageUrl: emptyToNull(input.imageUrl),
    backdropUrl: emptyToNull(input.backdropUrl),
    accent: input.accent ?? null,
    trendingLabel: emptyToNull(input.trendingLabel),
    creditLabel: emptyToNull(input.creditLabel),
    featuredRank: input.featuredRank ?? null,
    artistRef: artistId ? { connect: { id: artistId } } : undefined,
    sourceContent: contentId ? { connect: { id: contentId } } : undefined,
  } as Prisma.MusicTrackCreateInput;
}

export async function listCatalogTracks(options: {
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const where: Prisma.MusicTrackWhereInput = {};

  if (options.search) {
    where.OR = [
      { title: { contains: options.search, mode: "insensitive" } },
      { slug: { contains: options.search, mode: "insensitive" } },
      { artist: { contains: options.search, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.musicTrack.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.musicTrack.count({ where }),
  ]);

  return {
    items: rows.map((row) => ({
      recordId: row.id,
      track: mapTrackToMusicTrack(row),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getTrackRecordById(id: string) {
  return prisma.musicTrack.findUnique({
    where: { id },
    include: trackInclude,
  });
}

export async function getTrackRecordBySlug(slug: string) {
  return prisma.musicTrack.findUnique({
    where: { slug },
    include: trackInclude,
  });
}

export async function listAllTrackSlugs() {
  const rows = await prisma.musicTrack.findMany({
    select: { slug: true },
    orderBy: { title: "asc" },
  });
  return rows.map((r) => r.slug);
}

export async function createCatalogTrack(input: MusicFormInput) {
  const row = await prisma.musicTrack.create({
    data: await toTrackData(input),
    include: trackInclude,
  });
  await syncTrackReviews(row.id, input);
  return getTrackRecordById(row.id);
}

export async function updateCatalogTrack(id: string, input: MusicFormInput) {
  await prisma.musicTrack.update({
    where: { id },
    data: await toTrackData(input),
  });
  await syncTrackReviews(id, input);
  return getTrackRecordById(id);
}

export async function deleteCatalogTrack(id: string) {
  return prisma.musicTrack.delete({ where: { id } });
}

export async function countCatalogTracks() {
  return prisma.musicTrack.count();
}

export async function getTrackEngagementStats(trackId: string) {
  const [reviews, listening, listenEvents, collections] = await Promise.all([
    prisma.catalogReview.count({ where: { trackId } }),
    prisma.listenEvent.count({
      where: {
        trackId,
        listenedAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
      },
    }),
    prisma.listenEvent.count({ where: { trackId } }),
    prisma.collectionItem.count({ where: { trackId } }),
  ]);

  return { reviews, listening, listenEvents, collections };
}

export function trackRecordToFormInput(row: TrackRecordFull): MusicFormInput {
  return {
    title: row.title,
    nativeTitle: row.nativeTitle ?? "",
    slug: row.slug,
    artist: row.artist,
    artistSlug: row.artistRef?.slug ?? "",
    kind: row.kind as MusicFormInput["kind"],
    description: row.description ?? "",
    lyrics: row.lyrics ?? "",
    source: row.source ?? "",
    album: row.album ?? "",
    language: (row.language ?? "") as MusicFormInput["language"],
    genreLabels: asGenreArray((row as { genres?: unknown }).genres) as MusicFormInput["genreLabels"],
    rating: roundRating(row.rating) ?? undefined,
    year: row.year ?? undefined,
    durationLabel: row.durationLabel ?? "",
    durationSeconds: row.durationSeconds ?? undefined,
    imageUrl: row.imageUrl ?? "",
    backdropUrl: row.backdropUrl ?? "",
    accent: (row.accent as MusicFormInput["accent"]) ?? undefined,
    trendingLabel: row.trendingLabel ?? "",
    creditLabel: row.creditLabel ?? "",
    contentSlug: row.sourceContent?.slug ?? "",
    featuredRank: row.featuredRank ?? undefined,
    catalogReviews: row.catalogReviews.map((r) => ({
      authorName: r.authorName,
      authorAvatarColor: r.authorAvatarColor ?? "",
      rating: roundRating(r.rating) ?? 0,
      headline: r.headline ?? "",
      body: r.body,
      accent: (r.accent as MusicFormInput["catalogReviews"][number]["accent"]) ?? undefined,
      likeCount: r.likeCount,
    })),
  };
}

export class MusicConflictError extends Error {
  constructor() {
    super("A track with this slug already exists.");
    this.name = "MusicConflictError";
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
