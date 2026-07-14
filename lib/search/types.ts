export type SearchResultType =
  | "content"
  | "song"
  | "artist"
  | "profile"
  | "collection"
  | "community";

export type SearchPrimaryType = "content" | "song" | "artist" | "profile";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  href: string;
  score: number;
}

export interface ProfileSearchItem {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  portraitUrl?: string;
  followerCount?: number;
  bio?: string;
}

export interface SearchPageData {
  query: string;
  primaryType: SearchPrimaryType;
  topContent?: import("@/types").ContentItem;
  topSong?: import("@/types").MusicTrack;
  topArtist?: import("@/types").ContentItem;
  topProfile?: ProfileSearchItem;
  /** All ranked matches for the query (best first), not just the single top hit. */
  topContentMatches: import("@/types").ContentItem[];
  topSongMatches: import("@/types").MusicTrack[];
  topArtistMatches: import("@/types").ContentItem[];
  similarContent: import("@/types").ContentItem[];
  similarSongs: import("@/types").MusicTrack[];
  similarArtists: import("@/types").ContentItem[];
  similarProfiles: ProfileSearchItem[];
  artistSongs: import("@/types").MusicTrack[];
  collections: import("@/types").Collection[];
  communities: import("@/types").Community[];
}
