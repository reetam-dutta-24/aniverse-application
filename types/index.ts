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
