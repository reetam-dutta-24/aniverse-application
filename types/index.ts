/** Shared domain types for the AniVerse application. */

export type MediaType =
  | "anime"
  | "show"
  | "movie"
  | "documentary"
  | "kdrama"
  | "song"
  | "album"
  | "artist"
  | "playlist";

export type CommunityVisibility = "public" | "private";

export type ActivityLevel = "very-active" | "active" | "moderate" | "quiet";

/** Accent palette used for card glows and header gradients. */
export type AccentColor =
  | "pink"
  | "purple"
  | "cyan"
  | "blue"
  | "green"
  | "yellow";

export interface Genre {
  id: string;
  label: string;
}

/** A piece of content (anime, show, movie, or music) shown on cards. */
export interface ContentItem {
  id: string;
  title: string;
  type: MediaType;
  description?: string;
  imageUrl?: string;
  genres: Genre[];
  rating?: number;
  /** AI compatibility score, 0–100. */
  matchScore?: number;
  /** e.g. "4 Seasons", "2019", "Chase Atlantic". */
  meta?: string;
  year?: number;
  accent?: AccentColor;
}

/** A song/OST/track shown on music cards. */
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  kind: "ost" | "song" | "album";
  /** Source show the track belongs to, e.g. "Demon Slayer". */
  source?: string;
  /** e.g. "Japanese", "Jpop", "English". */
  language?: string;
  rating?: number;
  /** AI compatibility score, 0–100. */
  matchScore?: number;
  imageUrl?: string;
}

export interface Community {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  postCount: number;
  visibility: CommunityVisibility;
  activityLevel: ActivityLevel;
  /** Average AI match score of members, 0–100. */
  avgMatchScore?: number;
  createdAt?: string;
  lastActiveAt?: string;
  accent?: AccentColor;
  imageUrl?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  favoriteCount: number;
  visibility: CommunityVisibility;
  createdAt?: string;
  updatedAt?: string;
  accent?: AccentColor;
  imageUrl?: string;
}

/** A single metric shown in the analytics/stats strip. */
export interface StatMetric {
  id: string;
  label: string;
  value: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Character {
  id: string;
  name: string;
  /** e.g. "Role: Main Character". */
  role?: string;
  /** Voice actor display name, e.g. "Junya Enoki". */
  voiceActor?: string;
  imageUrl?: string;
  accent?: AccentColor;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration?: string;
  description?: string;
  thumbnailUrl?: string;
  releaseDate?: string;
  /** Season number, e.g. 1 for S1. */
  seasonNumber?: number;
  /** Resume / continue-watching marker. */
  isLastPlayed?: boolean;
  tags?: string[];
  /** Episode rating out of 10. */
  rating?: number;
  /** Display views, e.g. "2.4M". */
  views?: string;
  /** Display likes, e.g. "15k". */
  likes?: string;
  /** Primary audio language label. */
  language?: string;
}

export interface Review {
  id: string;
  author: UserSummary;
  /** Rating out of 10. */
  rating: number;
  content: string;
  /** Short pull-quote shown above the body. */
  headline?: string;
  createdAt?: string;
  likeCount?: number;
  accent?: AccentColor;
}

/** Engagement stat tile on a content detail page. */
export interface ContentEngagementStat {
  id: string;
  label: string;
  value: string;
}

/** Structured metadata block — maps 1:1 to DB columns. */
export interface ContentMetadata {
  studio?: string;
  airingDay?: string;
  languages?: string[];
  seasonLabel?: string;
  lastUpdate?: string;
  imdbRating?: number;
  malScore?: number;
  ageRating?: string;
  composer?: string;
  director?: string;
  originalAuthor?: string;
  sourceMaterial?: string;
  producers?: string;
  network?: string;
  country?: string;
  status?: string;
  airedFrom?: string;
  airedTo?: string;
  broadcast?: string;
  episodeDuration?: string;
  releaseYear?: number;
}

export interface ContentSeason {
  id: string;
  label: string;
  episodeCount: number;
}

/**
 * Full content detail — every field maps to a future DB/API response.
 * Used by `/content/[contentid]`.
 */
export interface ContentDetail {
  id: string;
  title: string;
  nativeTitle?: string;
  type: MediaType;
  rating: number;
  trendingLabel?: string;
  genres: Genre[];
  synopsis: string;
  /** e.g. "AI Match 98%", "All Seasons". */
  highlightTags: string[];
  metadata: ContentMetadata;
  imageUrl: string;
  backdropUrl?: string;
  matchScore?: number;
  /** Card accent — drives hero section inner-boundary glow. */
  accent?: AccentColor;
  engagementStats: ContentEngagementStat[];
  seasons: ContentSeason[];
  episodes: Episode[];
  characters: Character[];
  featuredOsts: MusicTrack[];
  relatedContent: ContentItem[];
  collections: Collection[];
  communities: Community[];
  reviews: Review[];
  /** User watch progress — drives Continue Watching vs Watch Now CTA. */
  watchProgress?: {
    seasonNumber: number;
    episodeNumber: number;
    episodeTitle?: string;
  };
}

export type MemberRole = "owner" | "admin" | "moderator" | "member";

export interface UserSummary {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Fallback avatar circle color when no image. */
  avatarColor?: string;
}

export interface Member extends UserSummary {
  role: MemberRole;
  online?: boolean;
  joinedAt?: string;
}

export interface CommunityPost {
  id: string;
  author: UserSummary;
  content: string;
  imageUrl?: string;
  createdAt?: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

export interface ChatMessage {
  id: string;
  author: UserSummary;
  content: string;
  sentAt?: string;
  /** True when the message belongs to the current user. */
  own?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  read?: boolean;
}

export interface WatchParty {
  id: string;
  title: string;
  /** Content being watched, e.g. "Jujutsu Kaisen — S2 E14". */
  nowPlaying?: string;
  live?: boolean;
  viewerCount?: number;
  participants?: UserSummary[];
  accent?: AccentColor;
}
