import type { MediaType as PrismaMediaType, Content, Genre } from "@prisma/client";
import { labelForContentGenre } from "@/lib/catalog-enums";
import type { ContentItem, Genre as AppGenre, MediaType } from "@/types";

type ContentWithGenres = Content & {
  genres: { genre: Genre }[];
};

const PRISMA_TO_APP: Record<PrismaMediaType, MediaType> = {
  ANIME: "anime",
  SHOW: "show",
  MOVIE: "movie",
  DOCUMENTARY: "documentary",
  KDRAMA: "kdrama",
  SONG: "song",
  ALBUM: "album",
  ARTIST: "artist",
  PLAYLIST: "playlist",
};

const APP_TO_PRISMA: Record<MediaType, PrismaMediaType> = {
  anime: "ANIME",
  show: "SHOW",
  movie: "MOVIE",
  documentary: "DOCUMENTARY",
  kdrama: "KDRAMA",
  song: "SONG",
  album: "ALBUM",
  artist: "ARTIST",
  playlist: "PLAYLIST",
};

export function prismaMediaTypeToApp(type: PrismaMediaType): MediaType {
  return PRISMA_TO_APP[type];
}

export function appMediaTypeToPrisma(type: MediaType): PrismaMediaType {
  return APP_TO_PRISMA[type];
}

export function mapGenre(genre: Genre): AppGenre {
  const slug = genre.label.toLowerCase();
  return {
    id: slug,
    label: labelForContentGenre(slug) !== slug ? labelForContentGenre(slug) : genre.label,
  };
}

export function mapContentToItem(row: ContentWithGenres): ContentItem {
  return {
    id: row.slug,
    title: row.title,
    type: prismaMediaTypeToApp(row.type),
    description: row.description ?? undefined,
    imageUrl: row.imageUrl ?? `/images/posters/${row.slug}.jpg`,
    genres: (row.genres ?? []).map((g) => mapGenre(g.genre)),
    rating: row.rating ?? undefined,
    meta: row.meta ?? undefined,
    year: row.year ?? undefined,
    accent: (row.accent as ContentItem["accent"]) ?? undefined,
  };
}
