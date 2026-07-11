/** Shared domain types for the AniVerse application. */

export type MediaType =
  | "anime"
  | "show"
  | "movie"
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
  /** e.g. "Main Character", "Voice: Junya Enoki". */
  role?: string;
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
}

export interface Review {
  id: string;
  author: UserSummary;
  /** Rating out of 10. */
  rating: number;
  content: string;
  createdAt?: string;
  likeCount?: number;
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
