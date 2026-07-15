import type {
  AccentColor,
  ArtistGenre,
  CatalogLanguage,
  ContentGenre,
  SongGenre,
} from "@/lib/catalog-enums";

export const poster = (slug: string) => `/images/posters/${slug}.jpg`;

const GENRE_ALIASES: Record<string, ContentGenre> = {
  action: "action",
  adventure: "adventure",
  comedy: "comedy",
  crime: "crime",
  drama: "drama",
  fantasy: "fantasy",
  horror: "horror",
  mystery: "mystery",
  romance: "romance",
  "sci-fi": "sci-fi",
  scifi: "sci-fi",
  thriller: "thriller",
  sports: "sports",
  supernatural: "supernatural",
  "slice-of-life": "slice-of-life",
  psychological: "psychological",
};

export function normalizeContentGenre(label: string): ContentGenre {
  const key = label.trim().toLowerCase().replace(/\s+/g, "-");
  if (key in GENRE_ALIASES) return GENRE_ALIASES[key];
  const titled = label.trim().toLowerCase();
  for (const [alias, value] of Object.entries(GENRE_ALIASES)) {
    if (alias === titled) return value;
  }
  return "drama";
}

export interface EpisodeSeed {
  seasonNumber: number;
  number: number;
  title: string;
  duration?: string;
  description?: string;
  thumbnailUrl?: string;
  language?: CatalogLanguage;
  rating?: number;
}

export interface CharacterSeed {
  name: string;
  role?: string;
  voiceActor?: string;
  imageUrl?: string;
  accent?: AccentColor;
}

export interface CatalogReviewSeed {
  authorName: string;
  authorAvatarColor?: string;
  rating: number;
  headline?: string;
  body: string;
  accent?: AccentColor;
  likeCount?: number;
}

export interface ContentSeedBase {
  slug: string;
  title: string;
  nativeTitle?: string;
  type: "anime" | "show" | "movie" | "documentary" | "kdrama";
  description?: string;
  synopsis?: string;
  imageUrl?: string;
  backdropUrl?: string;
  rating?: number;
  year?: number;
  meta?: string;
  accent?: AccentColor;
  trendingLabel?: string;
  creditLabel?: string;
  genreLabels: ContentGenre[];
  languages?: CatalogLanguage[];
  studio?: string;
  director?: string;
  originalAuthor?: string;
  sourceMaterial?: string;
  status?: string;
  ageRating?: string;
  imdbRating?: number;
  malScore?: number;
  airedFrom?: string;
  airedTo?: string;
  episodeDuration?: string;
  seasonCount?: number;
  episodeCount?: number;
  seasonLabel?: string;
  highlightTags?: string[];
}

export interface ContentNestedSeed {
  seasons?: { label: string; episodeCount: number }[];
  episodes?: EpisodeSeed[];
  characters?: CharacterSeed[];
  relatedSlugs?: string[];
  featuredTrackSlugs?: string[];
  catalogReviews?: CatalogReviewSeed[];
}

export function isMovieType(type: ContentSeedBase["type"]) {
  return type === "movie" || type === "documentary";
}

/** Generate a standard season + episode ladder for series content. */
export function generateSeriesNested(
  slug: string,
  opts: {
    seasonCount?: number;
    episodesPerSeason?: number;
    episodeTitles?: string[];
    prefix?: string;
  } = {},
): ContentNestedSeed {
  const seasonCount = opts.seasonCount ?? 1;
  const episodesPerSeason = opts.episodesPerSeason ?? 12;
  const prefix = opts.prefix ?? "Episode";

  const seasons = Array.from({ length: seasonCount }, (_, i) => ({
    label: `Season ${i + 1}`,
    episodeCount: episodesPerSeason,
  }));

  const episodes: EpisodeSeed[] = [];
  let titleIndex = 0;

  for (let s = 1; s <= seasonCount; s++) {
    for (let e = 1; e <= episodesPerSeason; e++) {
      const customTitle = opts.episodeTitles?.[titleIndex];
      episodes.push({
        seasonNumber: s,
        number: e,
        title: customTitle ?? `${prefix} ${e}`,
        duration: "24 Min",
        description: `${customTitle ?? `${prefix} ${e}`} — watch on AniVerse.`,
        thumbnailUrl: poster(slug),
        language: "japanese",
        rating: 8.2 + (e % 6) * 0.1,
      });
      titleIndex += 1;
    }
  }

  return { seasons, episodes };
}

/** Single watch entry for films. */
export function generateMovieNested(
  slug: string,
  title: string,
  runtime = "Full Movie",
): ContentNestedSeed {
  return {
    episodes: [
      {
        seasonNumber: 1,
        number: 1,
        title,
        duration: runtime,
        description: `Watch ${title} in full on AniVerse.`,
        thumbnailUrl: poster(slug),
        language: "japanese",
        rating: 8.5,
      },
    ],
  };
}

export interface ArtistSeed {
  slug: string;
  title: string;
  nativeTitle?: string;
  synopsis?: string;
  imageUrl?: string;
  accent?: AccentColor;
  rating?: number;
  rankLeft?: string;
  rankRight?: string;
  genreLabels: ArtistGenre[];
  languages: CatalogLanguage[];
  label?: string;
  debutYear?: number;
  isGroup?: boolean;
  primaryTags?: string[];
  members?: { name: string; role?: string }[];
  catalogReviews?: CatalogReviewSeed[];
}

export interface MusicSeed {
  slug: string;
  title: string;
  nativeTitle?: string;
  artist: string;
  artistSlug?: string;
  kind: "song" | "ost" | "album";
  description?: string;
  source?: string;
  contentSlug?: string;
  album?: string;
  language?: CatalogLanguage;
  genreLabels: SongGenre[];
  rating?: number;
  year?: number;
  durationLabel?: string;
  durationSeconds?: number;
  imageUrl?: string;
  accent?: AccentColor;
  trendingLabel?: string;
  creditLabel?: string;
  featuredRank?: number;
  catalogReviews?: CatalogReviewSeed[];
}
