import { labelForArtistGenre, labelForLanguage, labelForSongGenre } from "@/lib/catalog-enums";
import type { TrackRecordFull } from "@/lib/services/music.service";
import type {
  AccentColor,
  Character,
  ContentDetail,
  ContentEngagementStat,
  MusicTrack,
  Review,
} from "@/types";
import { formatDetailSynopsis } from "@/lib/format-detail-synopsis";
import { roundRating } from "@/lib/format-rating";
import { formatEngagementCount } from "@/lib/services/content.service";
import { mapTrackToMusicTrack } from "./music.mapper";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapCatalogReviews(row: TrackRecordFull): Review[] {
  return row.catalogReviews.map((r) => ({
    id: r.id,
    author: {
      id: `catalog-${r.id}`,
      name: r.authorName,
      avatarColor: r.authorAvatarColor ?? "#ff00cc",
    },
    rating: roundRating(r.rating) ?? 0,
    headline: r.headline ?? undefined,
    content: r.body,
    likeCount: r.likeCount,
    createdAt: r.createdAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    accent: (r.accent as AccentColor) ?? undefined,
  }));
}

function buildCharacters(row: TrackRecordFull): Character[] {
  const chars: Character[] = [
    {
      id: `${row.slug}-artist`,
      name: row.artist,
      role: "Artist",
      imageUrl: row.imageUrl ?? undefined,
      accent: (row.accent as AccentColor) ?? "pink",
    },
  ];
  if (row.source) {
    chars.push({
      id: `${row.slug}-source`,
      name: row.source,
      role: row.kind === "ost" ? "Anime" : "Source",
      imageUrl: row.imageUrl ?? undefined,
      accent: "cyan",
    });
  }
  return chars;
}

const poster = (slug: string) => `/images/posters/${slug}.jpg`;

export function mapTrackRecordToSongDetail(
  row: TrackRecordFull,
  engagement: {
    reviews: number;
    listening: number;
    listenEvents: number;
    collections: number;
  },
  similarTracks: MusicTrack[] = [],
): ContentDetail {
  const slug = row.slug;
  const genreSlugs = asStringArray((row as { genres?: unknown }).genres);
  const genres = genreSlugs.map((id) => ({
    id,
    label: labelForSongGenre(id),
  }));
  const languages = row.language ? [row.language] : [];

  const engagementStats: ContentEngagementStat[] = [
    { id: "likes", label: "Liked By", value: formatEngagementCount(engagement.reviews) },
    { id: "listening", label: "Currently Listening", value: formatEngagementCount(engagement.listening) },
    { id: "views", label: "Played By", value: formatEngagementCount(engagement.listenEvents) },
    { id: "collections", label: "Included in Collections", value: formatEngagementCount(engagement.collections) },
  ];

  return {
    id: slug,
    title: row.title,
    nativeTitle: row.nativeTitle ?? undefined,
    type: "song",
    rating: roundRating(row.rating) ?? 0,
    creditLabel: row.creditLabel ?? `By ${row.artist}`,
    trendingLabel:
      row.trendingLabel ?? `Trending on AniVerse · ${row.kind.toUpperCase()}`,
    genres,
    synopsis: formatDetailSynopsis(
      row.description ?? `${row.title} by ${row.artist} on AniVerse.`,
    ),
    highlightTags: [
      row.kind === "ost" ? "OST" : "Song",
      ...(row.year ? [String(row.year)] : []),
      ...genreSlugs.map((g) => labelForSongGenre(g)),
      ...(row.language ? [labelForLanguage(row.language)] : []),
    ],
    metadata: {
      sourceMaterial: row.kind === "ost" ? "Anime OST" : "Song",
      releaseYear: row.year ?? undefined,
      languages,
      episodeDuration: row.durationLabel ?? undefined,
      studio: row.artist,
      director: row.album ?? row.source ?? "Single",
      originalAuthor: row.source ?? row.artist,
      airedFrom: row.year ? String(row.year) : undefined,
      status: "Released",
    },
    imageUrl: row.imageUrl ?? poster(slug),
    backdropUrl: row.backdropUrl ?? row.imageUrl ?? poster(slug),
    accent: (row.accent as AccentColor) ?? undefined,
    matchScore: undefined,
    engagementStats,
    seasons: [],
    episodes: [],
    characters: buildCharacters(row),
    featuredOsts: similarTracks.filter((t) => t.id !== slug).slice(0, 6),
    relatedContent: [],
    collections: [],
    communities: [],
    reviews: mapCatalogReviews(row),
  };
}

export { mapTrackToMusicTrack };
