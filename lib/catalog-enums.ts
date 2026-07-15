/** Canonical catalog enums — used in admin forms, validators, and chip styling. */

export const ACCENT_OPTIONS = [
  { value: "pink", label: "Pink" },
  { value: "purple", label: "Purple" },
  { value: "cyan", label: "Cyan" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "teal", label: "Teal" },
  { value: "indigo", label: "Indigo" },
  { value: "rose", label: "Rose" },
  { value: "lime", label: "Lime" },
  { value: "amber", label: "Amber" },
  { value: "violet", label: "Violet" },
  { value: "fuchsia", label: "Fuchsia" },
  { value: "sky", label: "Sky" },
  { value: "emerald", label: "Emerald" },
] as const;

export type AccentColor = (typeof ACCENT_OPTIONS)[number]["value"];

export const CONTENT_GENRE_OPTIONS = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "comedy", label: "Comedy" },
  { value: "crime", label: "Crime" },
  { value: "drama", label: "Drama" },
  { value: "fantasy", label: "Fantasy" },
  { value: "horror", label: "Horror" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "thriller", label: "Thriller" },
  { value: "sports", label: "Sports" },
  { value: "supernatural", label: "Supernatural" },
  { value: "slice-of-life", label: "Slice of Life" },
  { value: "psychological", label: "Psychological" },
] as const;

export type ContentGenre = (typeof CONTENT_GENRE_OPTIONS)[number]["value"];

export const LANGUAGE_OPTIONS = [
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
  { value: "korean", label: "Korean" },
  { value: "chinese", label: "Chinese" },
  { value: "hindi", label: "Hindi" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "portuguese", label: "Portuguese" },
  { value: "italian", label: "Italian" },
] as const;

export type CatalogLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];

export const SONG_GENRE_OPTIONS = [
  { value: "jpop", label: "J-Pop" },
  { value: "kpop", label: "K-Pop" },
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "rnb", label: "R&B" },
  { value: "electronic", label: "Electronic" },
  { value: "ost", label: "Anime OST" },
  { value: "indie", label: "Indie" },
  { value: "ballad", label: "Ballad" },
  { value: "metal", label: "Metal" },
  { value: "jazz", label: "Jazz" },
] as const;

export type SongGenre = (typeof SONG_GENRE_OPTIONS)[number]["value"];

export const ARTIST_GENRE_OPTIONS = [
  { value: "jpop", label: "J-Pop" },
  { value: "kpop", label: "K-Pop" },
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "rnb", label: "R&B" },
  { value: "electronic", label: "Electronic" },
  { value: "indie", label: "Indie" },
  { value: "ballad", label: "Ballad" },
  { value: "metal", label: "Metal" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
] as const;

export type ArtistGenre = (typeof ARTIST_GENRE_OPTIONS)[number]["value"];

const accentSet = new Set(ACCENT_OPTIONS.map((o) => o.value));

export function isAccentColor(value: string | undefined): value is AccentColor {
  return value != null && accentSet.has(value as AccentColor);
}

export function labelForLanguage(value: string): string {
  return LANGUAGE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function labelForContentGenre(value: string): string {
  return CONTENT_GENRE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function labelForSongGenre(value: string): string {
  return SONG_GENRE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function labelForArtistGenre(value: string): string {
  return ARTIST_GENRE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
