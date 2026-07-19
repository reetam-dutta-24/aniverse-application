import { z } from "zod";
import {
  ACCENT_OPTIONS,
  ARTIST_GENRE_OPTIONS,
  CONTENT_GENRE_OPTIONS,
  LANGUAGE_OPTIONS,
  SONG_GENRE_OPTIONS,
} from "@/lib/catalog-enums";

const accentValues = ACCENT_OPTIONS.map((o) => o.value) as [string, ...string[]];
const contentGenreValues = CONTENT_GENRE_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];
const languageValues = LANGUAGE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const songGenreValues = SONG_GENRE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const artistGenreValues = ARTIST_GENRE_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];

export const accentEnum = z.enum(accentValues);
export const contentGenreEnum = z.enum(contentGenreValues);
export const languageEnum = z.enum(languageValues);
export const songGenreEnum = z.enum(songGenreValues);
export const artistGenreEnum = z.enum(artistGenreValues);

const optionalString = z.string().trim().max(500).optional().or(z.literal(""));

export const catalogReviewInputSchema = z.object({
  authorName: z.string().trim().min(1).max(120),
  authorAvatarColor: z.string().trim().max(20).optional().or(z.literal("")),
  rating: z.coerce.number().min(0).max(10),
  headline: optionalString,
  body: z.string().trim().min(1).max(5000),
  accent: accentEnum.optional(),
  likeCount: z.coerce.number().int().min(0).optional(),
});

export const contentSeasonInputSchema = z.object({
  label: z.string().trim().min(1).max(120),
  episodeCount: z.coerce.number().int().min(0).optional(),
});

export const contentEpisodeInputSchema = z.object({
  seasonNumber: z.coerce.number().int().min(1).default(1),
  number: z.coerce.number().int().min(1),
  title: z.string().trim().min(1).max(200),
  duration: optionalString,
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  thumbnailUrl: optionalString,
  videoUrl: optionalString,
  releaseDate: optionalString,
  language: languageEnum.optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
});

export const contentCharacterInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: optionalString,
  voiceActor: optionalString,
  imageUrl: optionalString,
  accent: accentEnum.optional(),
});

export type CatalogReviewInput = z.infer<typeof catalogReviewInputSchema>;
export type ContentSeasonInput = z.infer<typeof contentSeasonInputSchema>;
export type ContentEpisodeInput = z.infer<typeof contentEpisodeInputSchema>;
export type ContentCharacterInput = z.infer<typeof contentCharacterInputSchema>;
