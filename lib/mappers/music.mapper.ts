import type { MusicTrack as PrismaTrack } from "@prisma/client";
import { labelForLanguage, labelForSongGenre } from "@/lib/catalog-enums";
import { roundRating } from "@/lib/format-rating";
import type { ContentItem, MusicTrack } from "@/types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapTrackGenres(row: PrismaTrack) {
  const genres = asStringArray(row.genres).map((id) => ({
    id,
    label: labelForSongGenre(id),
  }));

  if (
    row.language &&
    !genres.some((genre) => genre.id === row.language!.toLowerCase())
  ) {
    genres.push({
      id: row.language.toLowerCase(),
      label: labelForLanguage(row.language),
    });
  }

  if (genres.length === 0 && row.kind === "ost") {
    genres.push({ id: "ost", label: "Anime OST" });
  }

  return genres;
}

export function mapTrackToContentItem(row: PrismaTrack): ContentItem {
  const poster = (slug: string) => `/images/posters/${slug}.jpg`;
  return {
    id: row.slug,
    title: row.title,
    type: row.kind === "album" ? "album" : "song",
    description: row.description ?? undefined,
    imageUrl: row.imageUrl ?? poster(row.slug),
    genres: mapTrackGenres(row),
    rating: roundRating(row.rating) ?? undefined,
    meta: row.kind.toUpperCase(),
    year: row.year ?? undefined,
    accent: (row.accent as ContentItem["accent"]) ?? undefined,
  };
}

export function mapTrackToMusicTrack(row: PrismaTrack): MusicTrack {
  const poster = (slug: string) => `/images/posters/${slug}.jpg`;
  return {
    id: row.slug,
    title: row.title,
    artist: row.artist,
    kind: row.kind as MusicTrack["kind"],
    source: row.source ?? undefined,
    language: row.language ?? undefined,
    rating: roundRating(row.rating) ?? undefined,
    imageUrl: row.imageUrl ?? poster(row.slug),
    accent: (row.accent as MusicTrack["accent"]) ?? undefined,
  };
}
