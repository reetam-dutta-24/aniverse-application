import type { MediaType } from "@/types";

/** Keys for every chip gradient in the Figma palette. */
export type ChipKey =
  | "action"
  | "adventure"
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
  | "supernatural"
  | "psychological"
  | "slice"
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
  | "jazz"
  | "aimatch"
  | "rating"
  | "default";

/** Tailwind classes per chip key — matches the Figma chip sheet. */
export const chipClasses: Record<ChipKey, string> = {
  action: "bg-gradient-chip-action text-white",
  adventure: "bg-gradient-chip-adventure text-black",
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
  supernatural: "bg-gradient-chip-supernatural text-white",
  psychological: "bg-gradient-chip-psychological text-white",
  slice: "bg-gradient-chip-slice text-white",
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
  jazz: "bg-gradient-chip-jazz text-black",
  aimatch: "bg-gradient-chip-aimatch text-white",
  rating: "bg-gradient-chip-rating text-white",
  default: "bg-gradient-chip-default text-white",
};

/** Every catalog content genre maps to its own vibrant chip. */
const genreMap: Record<string, ChipKey> = {
  action: "action",
  adventure: "adventure",
  comedy: "comedy",
  crime: "crime",
  drama: "drama",
  fantasy: "fantasy",
  horror: "horror",
  mystery: "mystery",
  romance: "romance",
  scific: "scific",
  "sci-fi": "scific",
  scifi: "scific",
  thriller: "thriller",
  sports: "sports",
  love: "love",
  supernatural: "supernatural",
  "slice-of-life": "slice",
  sliceoflife: "slice",
  psychological: "psychological",
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
  indie: "adventure",
  ballad: "romance",
  metal: "horror",
  jazz: "jazz",
};

const artistGenreMap: Record<string, ChipKey> = {
  jpop: "jpop",
  kpop: "kpop",
  pop: "song",
  rock: "action",
  "hip-hop": "crime",
  rnb: "romance",
  electronic: "scific",
  indie: "adventure",
  ballad: "romance",
  metal: "horror",
  jazz: "jazz",
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
  chinese: "kdrama",
  hindi: "action",
  spanish: "comedy",
  french: "romance",
  german: "thriller",
  portuguese: "fantasy",
  italian: "slice",
};

/** Stable vibrant palette — one distinct accent per catalog genre. */
const genrePalette: ChipKey[] = [
  "action",
  "adventure",
  "comedy",
  "crime",
  "drama",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "scific",
  "thriller",
  "sports",
  "supernatural",
  "psychological",
  "slice",
];

const metadataPalette: ChipKey[] = [
  "aimatch",
  "anime",
  "show",
  "movie",
  "documentary",
  "kdrama",
  "ost",
  "kpop",
  "jpop",
  "sports",
  "crime",
  "adventure",
  "supernatural",
  "psychological",
  "slice",
];

function normalizeGenreKey(value: string) {
  return value.toLowerCase().trim().replace(/[\s_]+/g, "-");
}

function hashSeed(seed: string) {
  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function resolveGenreChip(genreId: string, label?: string): ChipKey {
  const key = normalizeGenreKey(genreId);
  if (genreMap[key]) return genreMap[key];

  const fromLabel = label ? normalizeGenreKey(label) : "";
  if (fromLabel && genreMap[fromLabel]) return genreMap[fromLabel];

  const seed = key || fromLabel || "genre";
  return genrePalette[hashSeed(seed) % genrePalette.length] ?? "action";
}

/** Vibrant rotating chip color for neutral metadata labels. */
export function resolveMetadataChip(seed: string): ChipKey {
  return metadataPalette[hashSeed(seed) % metadataPalette.length] ?? "aimatch";
}

export function resolveTypeChip(type: MediaType): ChipKey {
  return typeMap[type] ?? "aimatch";
}

export function resolveSongGenreChip(genreId: string): ChipKey {
  return songGenreMap[normalizeGenreKey(genreId)] ?? "song";
}

export function resolveArtistGenreChip(genreId: string): ChipKey {
  return artistGenreMap[normalizeGenreKey(genreId)] ?? "music";
}

export function resolveLanguageChip(language: string): ChipKey {
  return languageMap[normalizeGenreKey(language)] ?? "jpop";
}

export function resolveMusicKindChip(kind: string): ChipKey {
  if (kind === "ost") return "ost";
  if (kind === "album") return "album";
  return "song";
}

export function chipClassFor(key: ChipKey): string {
  return chipClasses[key];
}
