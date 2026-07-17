import type { Artist } from "@prisma/client";
import { labelForArtistGenre } from "@/lib/catalog-enums";
import { roundRating } from "@/lib/format-rating";
import type { ContentItem, Genre } from "@/types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapArtistGenres(row: Artist): Genre[] {
  const genreSlugs = asStringArray(row.genres);
  if (genreSlugs.length > 0) {
    return genreSlugs.map((id) => ({
      id,
      label: labelForArtistGenre(id),
    }));
  }
  return asStringArray(row.primaryTags).map((label, index) => ({
    id: `tag-${index}`,
    label,
  }));
}

export function mapArtistToContentItem(row: Artist): ContentItem {
  return {
    id: row.slug,
    title: row.title,
    type: "artist",
    imageUrl: row.imageUrl ?? undefined,
    genres: mapArtistGenres(row),
    rating: roundRating(row.rating) ?? undefined,
    year: row.debutYear ?? undefined,
    meta: row.isGroup ? "Group" : "Solo Artist",
    matchScore: row.rating ? Math.round((roundRating(row.rating) ?? 0) * 10) : undefined,
    accent: (row.accent as ContentItem["accent"]) ?? undefined,
  };
}
