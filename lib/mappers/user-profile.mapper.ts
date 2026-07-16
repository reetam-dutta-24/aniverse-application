import type { Review as PrismaReview, User } from "@prisma/client";
import type { AccentColor } from "@/lib/catalog-enums";
import { formatCardDate } from "@/lib/format-dates";
import {
  accentToAvatarColor,
  resolveProfileAccent,
} from "@/lib/profile-theme";
import { mapArtistToContentItem } from "@/lib/mappers/artist.mapper";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import { mapCommunityToCard } from "@/lib/mappers/community.mapper";
import { mapContentToItem } from "@/lib/mappers/content.mapper";
import { mapUserSummary } from "@/lib/mappers/community.mapper";
import { mapTrackToMusicTrack } from "@/lib/mappers/music.mapper";
import { formatEngagementCount } from "@/lib/services/content.service";
import type {
  ContentEngagementStat,
  ProfileRecentActivityItem,
  Review,
  UserProfileDetail,
} from "@/types";

type ReviewAuthor = Parameters<typeof mapUserSummary>[0];

export function mapReviewRow(
  row: PrismaReview & { author: ReviewAuthor },
): Review {
  return {
    id: row.id,
    author: mapUserSummary(row.author),
    rating: row.rating,
    headline: row.headline ?? undefined,
    content: row.body,
    likeCount: row.likeCount,
    createdAt: formatCardDate(row.createdAt),
  };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function formatJoinedAt(date: Date): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).replace(String(day), `${day}${suffix}`);
}

export function buildEngagementStats(counts: {
  watchlist: number;
  collections: number;
  reviews: number;
  communities: number;
  favorites: number;
  watchMinutes: number;
}): ContentEngagementStat[] {
  return [
    {
      id: "watchlist",
      label: "Watchlist Titles",
      value: formatEngagementCount(counts.watchlist),
    },
    {
      id: "collections",
      label: "Collections",
      value: formatEngagementCount(counts.collections),
    },
    {
      id: "reviews",
      label: "Reviews",
      value: formatEngagementCount(counts.reviews),
    },
    {
      id: "communities",
      label: "Communities",
      value: formatEngagementCount(counts.communities),
    },
    {
      id: "favorites",
      label: "Favorites",
      value: formatEngagementCount(counts.favorites),
    },
    {
      id: "watchtime",
      label: "Watch Time (min)",
      value: formatEngagementCount(counts.watchMinutes),
    },
  ];
}

export function buildProfileDetail(input: {
  user: Pick<
    User,
    | "id"
    | "handle"
    | "name"
    | "bio"
    | "location"
    | "avatarColor"
    | "avatarUrl"
    | "portraitUrl"
    | "profileAccent"
    | "aiTasteScore"
    | "createdAt"
  >;
  tasteProfile?: {
    summaryChips: unknown;
    selections: unknown;
  } | null;
  counts: {
    watchlist: number;
    collections: number;
    reviews: number;
    communities: number;
    favorites: number;
    watchMinutes: number;
  };
  currentActivity: ReturnType<typeof mapContentToItem>[];
  likedContent: ReturnType<typeof mapContentToItem>[];
  watchedMost: ReturnType<typeof mapContentToItem>[];
  likedSongs: ReturnType<typeof mapTrackToMusicTrack>[];
  mostPlayedSongs: ReturnType<typeof mapTrackToMusicTrack>[];
  likedAlbums: ReturnType<typeof mapTrackToMusicTrack>[];
  topArtists: ReturnType<typeof mapArtistToContentItem>[];
  collections: ReturnType<typeof mapCollectionToCard>[];
  communities: ReturnType<typeof mapCommunityToCard>[];
  reviews: Review[];
  recentActivity: ProfileRecentActivityItem[];
  nowListening?: UserProfileDetail["nowListening"];
  currentlyWatching?: UserProfileDetail["currentlyWatching"];
  activitySubtitle?: string;
}): UserProfileDetail {
  const summaryChips = asStringArray(input.tasteProfile?.summaryChips);
  const selections =
    input.tasteProfile?.selections &&
    typeof input.tasteProfile.selections === "object"
      ? (input.tasteProfile.selections as {
          contentTypes?: string[];
          genres?: string[];
          musicTastes?: string[];
        })
      : null;

  const favoriteTypes = [
    ...(selections?.contentTypes ?? []),
    ...(selections?.musicTastes ?? []),
  ];
  const favoriteGenres = selections?.genres ?? [];

  const profileAccent = resolveProfileAccent(
    input.user.profileAccent,
    input.user.avatarColor,
  );
  const avatarColor = accentToAvatarColor(
    profileAccent,
    input.user.avatarColor,
  );

  const portraitUrl =
    input.user.portraitUrl ??
    input.user.avatarUrl ??
    "/images/hero-1.png";

  return {
    id: input.user.handle,
    name: input.user.name,
    handle: input.user.handle,
    bio: input.user.bio || "No bio yet.",
    avatarColor,
    avatarUrl: input.user.avatarUrl ?? undefined,
    profileAccent,
    portraitUrl,
    location: input.user.location || "Earth",
    online: false,
    followerCount: 0,
    joinedAt: formatJoinedAt(input.user.createdAt),
    activitySubtitle: input.activitySubtitle,
    matchScore: input.user.aiTasteScore || undefined,
    primaryTags:
      summaryChips.length > 0
        ? summaryChips
        : favoriteGenres.slice(0, 5),
    engagementStats: buildEngagementStats(input.counts),
    nowListening: input.nowListening,
    currentlyWatching: input.currentlyWatching,
    favoriteTypes,
    favoriteGenres,
    followers: [],
    followerSummary: undefined,
    recentActivity: input.recentActivity,
    currentActivity: input.currentActivity,
    likedContent: input.likedContent,
    watchedMost: input.watchedMost,
    likedSongs: input.likedSongs,
    mostPlayedSongs: input.mostPlayedSongs,
    likedAlbums: input.likedAlbums,
    topArtists: input.topArtists,
    collections: input.collections,
    communities: input.communities,
    reviews: input.reviews,
  };
}
