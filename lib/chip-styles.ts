import type { MediaType } from "@/types";

/** Keys for every chip gradient in the Figma palette. */
export type ChipKey =
  | "action"
  | "comedy"
  | "crime"
  | "drama"
  | "fantasy"
  | "horror"
  | "mystery"
  | "romance"
  | "scific"
  | "thriller"
  | "sports"
  | "love"
  | "anime"
  | "show"
  | "movie"
  | "documentary"
  | "kdrama"
  | "song"
  | "album"
  | "ost"
  | "music"
  | "jpop"
  | "kpop"
  | "aimatch"
  | "rating"
  | "default";

/** Tailwind classes per chip key — matches the Figma chip sheet. */
export const chipClasses: Record<ChipKey, string> = {
  action: "bg-gradient-chip-action text-white",
  comedy: "bg-gradient-chip-comedy text-black",
  crime: "bg-gradient-chip-crime text-white",
  drama: "bg-gradient-chip-drama text-black",
  fantasy: "bg-gradient-chip-fantasy text-white",
  horror: "bg-gradient-chip-horror text-white",
  mystery: "bg-gradient-chip-mystery text-white",
  romance: "bg-gradient-chip-romance text-white",
  scific: "bg-gradient-chip-scific text-black",
  thriller: "bg-gradient-chip-thriller text-white",
  sports: "bg-gradient-chip-sports text-white",
  love: "bg-gradient-chip-romance text-white",
  anime: "bg-gradient-chip-anime text-white",
  show: "bg-gradient-chip-show text-white",
  movie: "bg-gradient-chip-movie text-white",
  documentary: "bg-gradient-chip-documentary text-white",
  kdrama: "bg-gradient-chip-kdrama text-white",
  song: "bg-gradient-chip-song text-white",
  album: "bg-gradient-chip-album text-white",
  ost: "bg-gradient-chip-ost text-white",
  music: "bg-gradient-chip-music text-white",
  jpop: "bg-gradient-chip-jpop text-black",
  kpop: "bg-gradient-chip-kpop text-white",
  aimatch: "bg-gradient-chip-aimatch text-white",
  rating: "bg-gradient-chip-rating text-white",
  default: "bg-gradient-chip-default text-white",
};

const genreMap: Record<string, ChipKey> = {
  action: "action",
  comedy: "comedy",
  crime: "crime",
  drama: "drama",
  fantasy: "fantasy",
  horror: "horror",
  mystery: "mystery",
  romance: "romance",
  scific: "scific",
  "sci-fi": "scific",
  thriller: "thriller",
  sports: "sports",
  love: "love",
  supernatural: "mystery",
  "slice-of-life": "drama",
  psychological: "mystery",
};

const songGenreMap: Record<string, ChipKey> = {
  jpop: "jpop",
  kpop: "kpop",
  pop: "song",
  rock: "action",
  "hip-hop": "crime",
  rnb: "romance",
  electronic: "scific",
  ost: "ost",
  indie: "drama",
  ballad: "romance",
  metal: "horror",
  jazz: "mystery",
};

const artistGenreMap: Record<string, ChipKey> = {
  jpop: "jpop",
  kpop: "kpop",
  pop: "song",
  rock: "action",
  "hip-hop": "crime",
  rnb: "romance",
  electronic: "scific",
  indie: "drama",
  ballad: "romance",
  metal: "horror",
  jazz: "mystery",
  classical: "documentary",
};

const typeMap: Record<MediaType, ChipKey> = {
  anime: "anime",
  show: "show",
  movie: "movie",
  documentary: "documentary",
  kdrama: "kdrama",
  song: "song",
  album: "album",
  artist: "music",
  playlist: "music",
};

const languageMap: Record<string, ChipKey> = {
  jpop: "jpop",
  kpop: "kpop",
  english: "song",
  "english pop": "song",
  japanese: "jpop",
  korean: "kpop",
  chinese: "drama",
  hindi: "action",
  spanish: "comedy",
  french: "romance",
  german: "mystery",
  portuguese: "fantasy",
  italian: "drama",
};

export function resolveGenreChip(genreId: string, label?: string): ChipKey {
  const key = genreId.toLowerCase();
  if (genreMap[key]) return genreMap[key];
  const fromLabel = label?.toLowerCase().replace(/\s+/g, "");
  if (fromLabel && genreMap[fromLabel]) return genreMap[fromLabel];
  return "default";
}

export function resolveTypeChip(type: MediaType): ChipKey {
  return typeMap[type] ?? "default";
}

export function resolveSongGenreChip(genreId: string): ChipKey {
  return songGenreMap[genreId.toLowerCase()] ?? "song";
}

export function resolveArtistGenreChip(genreId: string): ChipKey {
  return artistGenreMap[genreId.toLowerCase()] ?? "music";
}

export function resolveLanguageChip(language: string): ChipKey {
  return languageMap[language.toLowerCase()] ?? "jpop";
}

export function resolveMusicKindChip(kind: string): ChipKey {
  if (kind === "ost") return "ost";
  if (kind === "album") return "album";
  return "song";
}

export function chipClassFor(key: ChipKey): string {
  return chipClasses[key];
}
