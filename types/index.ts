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

import type { AccentColor } from "@/lib/catalog-enums";

export type { AccentColor };

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
  /** Present on watchlist-backed cards. */
  watchlistItemId?: string;
  watchlistStatus?: "PENDING" | "WATCHING" | "COMPLETED" | "DROPPED";
  watchlistPriority?: "NORMAL" | "HIGH";
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
  description?: string;
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
  wallpaperUrl?: string;
  viewerRole?: MemberRole;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  category?: string;
  collectionKind?: "content" | "music";
  genreLabelIds?: string[];
  itemCount: number;
  favoriteCount: number;
  visibility: CommunityVisibility;
  createdAt?: string;
  updatedAt?: string;
  accent?: AccentColor;
  imageUrl?: string;
}

/** Featured in-progress item shown in the collection hero (right panel). */
export interface CollectionCurrentActivity {
  title: string;
  /** Full line e.g. "Currently Watching Death Note". */
  statusLabel: string;
  progressLabel?: string;
  episodeLabel?: string;
  seasonLabel?: string;
  imageUrl: string;
  contentId: string;
}

/**
 * Full collection detail — every field maps to a future DB/API response.
 * Used by `/collection/[collectionid]`.
 */
export interface CollectionDetail {
  id: string;
  name: string;
  description: string;
  rating: number;
  trendingLabel?: string;
  genres: Genre[];
  category?: string;
  collectionKind?: "content" | "music";
  genreLabelIds?: string[];
  ownerId?: string;
  visibility: CommunityVisibility;
  createdAt: string;
  updatedAt?: string;
  itemCount: number;
  favoriteCount: number;
  /** AI compatibility for the collection as a whole. */
  matchScore?: number;
  highlightTags: string[];
  imageUrl?: string;
  accent?: AccentColor;
  engagementStats: ContentEngagementStat[];
  contributors: UserSummary[];
  /** e.g. "Rahul_89, Lk45_89 and Karan_singh45 are 3 contributors". */
  contributorSummary?: string;
  favoriteItems: ContentItem[];
  currentActivity?: CollectionCurrentActivity;
  allItems: ContentItem[];
  continueWatching: ContentItem[];
  watchedMost: ContentItem[];
  musicTracks: MusicTrack[];
  similarCollections: Collection[];
  communities: Community[];
}

/**
 * Music collection detail — same shape as `CollectionDetail` plus artist roster.
 * Used by `/music-collection/[collectionid]`.
 */
export interface MusicCollectionDetail extends CollectionDetail {
  popularArtists: ContentItem[];
  allTracks: MusicTrack[];
  favoriteTracks: MusicTrack[];
  continueListeningTracks: MusicTrack[];
  mostListenedTracks: MusicTrack[];
  similarVibesSongs: MusicTrack[];
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
  /** Song/OST artist credit line under the title. */
  creditLabel?: string;
  /** Audio resume position label, e.g. "1:24". */
  resumeLabel?: string;
}

export type MemberRole = "owner" | "admin" | "moderator" | "member";

export interface UserSummary {
  id: string;
  name: string;
  /** Public profile handle used in URLs, e.g. reetam_dutta */
  handle?: string;
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
  authorRole?: MemberRole;
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
  /** Notification kind label, e.g. "Episode", "Watch Party". */
  category?: string;
  description?: string;
  createdAt?: string;
  read?: boolean;
  /** Thumbnail shown on the right of the notification. */
  imageUrl?: string;
  /** Related content the notification links out to. */
  href?: string;
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
  imageUrl?: string;
}

export interface VoiceChannel {
  id: string;
  title: string;
  subtitle?: string;
  memberCount?: number;
  participants?: UserSummary[];
  accent?: AccentColor;
  hostName?: string;
}

export interface CommunityDashboardSettings {
  allowMemberPosts: boolean;
  requireApproval: boolean;
  showOnlineStatus: boolean;
  enableWatchParties: boolean;
  enableVoiceChannels: boolean;
}

/** Mini player state shown in the artist hero right panel. */
export interface ArtistNowPlaying {
  title: string;
  album?: string;
  songId?: string;
  progressPercent?: number;
  elapsedLabel?: string;
  durationLabel?: string;
  imageUrl?: string;
}

/**
 * Full artist detail — maps to `/artist/[artistid]`.
 * Reuses shared card/section types for carousels and reviews.
 */
export interface ArtistDetail {
  id: string;
  title: string;
  nativeTitle?: string;
  rating: number;
  /** e.g. "#10 in Kpop music" */
  rankLeft?: string;
  /** e.g. "#1 in your favourite artist" */
  rankRight?: string;
  genres: Genre[];
  synopsis: string;
  /** Row-one hero chips — Dance Pop, K-pop, Since 2015, etc. */
  primaryTags: string[];
  metadata: ContentMetadata;
  /** Hero banner / right-panel group photo */
  imageUrl: string;
  accent?: AccentColor;
  matchScore?: number;
  songCount?: number;
  albumCount?: number;
  engagementStats: ContentEngagementStat[];
  members: Character[];
  nowPlaying?: ArtistNowPlaying;
  /** Social followers shown in the right hero panel. */
  connections: UserSummary[];
  connectionSummary?: string;
  trendingSongs: MusicTrack[];
  allSongs: MusicTrack[];
  mostPlayed: MusicTrack[];
  mostLiked: MusicTrack[];
  albums: MusicTrack[];
  similarArtists: ContentItem[];
  collections: Collection[];
  communities: Community[];
  reviews: Review[];
}

/** Mini player state shown in the profile hero right panel. */
export interface ProfileNowListening {
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  songId?: string;
}

export interface ProfileCurrentlyWatching {
  title: string;
  episodeLabel: string;
  contentId: string;
}

/** Mixed content + music entry for the profile hero activity carousel. */
export type ProfileRecentActivityItem =
  | { kind: "content"; item: ContentItem }
  | { kind: "music"; track: MusicTrack };

/**
 * Full user profile — maps to `/profile/[userid]`.
 * Reuses shared card/section types for carousels and reviews.
 */
export interface UserProfileDetail {
  id: string;
  name: string;
  /** Public handle shown in the hero panel, e.g. Reetam_Dutta_2423 */
  handle: string;
  bio: string;
  avatarColor: string;
  avatarUrl?: string;
  /** Large hero panel portrait */
  portraitUrl: string;
  location: string;
  online: boolean;
  followerCount: number;
  joinedAt: string;
  /** e.g. "Currently Watching Death Note Ep 24" */
  activitySubtitle?: string;
  matchScore?: number;
  primaryTags: string[];
  engagementStats: ContentEngagementStat[];
  nowListening?: ProfileNowListening;
  currentlyWatching?: ProfileCurrentlyWatching;
  favoriteTypes: string[];
  favoriteGenres: string[];
  /** Follower avatars shown in the hero right panel. */
  followers: UserSummary[];
  followerSummary?: string;
  recentActivity: ProfileRecentActivityItem[];
  currentActivity: ContentItem[];
  likedContent: ContentItem[];
  watchedMost: ContentItem[];
  likedSongs: MusicTrack[];
  mostPlayedSongs: MusicTrack[];
  likedAlbums: MusicTrack[];
  topArtists: ContentItem[];
  collections: Collection[];
  communities: Community[];
  reviews: Review[];
}

export interface CommunityDashboardNavItem {
  id: string;
  label: string;
}

/**
 * Full community detail — maps to `/community/[communityid]`.
 * Reuses shared card/section types for carousels and dashboard preview.
 */
export interface CommunityDetail {
  id: string;
  name: string;
  rating: number;
  rankLeft?: string;
  rankRight?: string;
  genres: Genre[];
  description: string;
  primaryTags: string[];
  matchScore?: number;
  category?: string;
  visibility?: CommunityVisibility;
  activityLevel?: ActivityLevel;
  viewerRole?: MemberRole;
  canEdit?: boolean;
  canDelete?: boolean;
  wallpaperUrl: string;
  imageUrl?: string;
  accent?: AccentColor;
  engagementStats: ContentEngagementStat[];
  members: UserSummary[];
  memberSummary?: string;
  collectionCount?: number;
  popularityLabel?: string;
  globalRankLabel?: string;
  favoriteItems: ContentItem[];
  dashboardOnlineCount: number;
  dashboardPostsToday: number;
  dashboardPosts: CommunityPost[];
  onlineMembers: Member[];
  dashboardNav: CommunityDashboardNavItem[];
  dashboardChatMessages: ChatMessage[];
  dashboardAnimeChatMessages: ChatMessage[];
  dashboardWatchParties: WatchParty[];
  dashboardVoiceChannels: VoiceChannel[];
  dashboardAnnouncements: CommunityPost[];
  dashboardAnalytics: ContentEngagementStat[];
  dashboardMembersWatching: number;
  dashboardMembersInVc: number;
  dashboardSettings: CommunityDashboardSettings;
  watchedMost: ContentItem[];
  trending: ContentItem[];
  musicTracks: MusicTrack[];
  collections: Collection[];
  similarCommunities: Community[];
}
