import type { Collection, Community, ContentItem, MusicTrack } from "@/types";
import { mapArtistToContentItem } from "@/lib/mappers/artist.mapper";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import { mapCommunityToCard } from "@/lib/mappers/community.mapper";
import { mapContentToItem } from "@/lib/mappers/content.mapper";
import { mapTrackToMusicTrack } from "@/lib/mappers/music.mapper";
import { listUserJoinedCommunities } from "@/lib/services/community.service";
import {
  listUserFavoriteArtists,
  listUserFavoriteCollections,
  listUserFavoriteContent,
  listUserFavoriteTracks,
} from "@/lib/services/favorite.service";

export interface UserFavoritesCatalog {
  anime: ContentItem[];
  shows: ContentItem[];
  movies: ContentItem[];
  documentaries: ContentItem[];
  songs: MusicTrack[];
  artists: ContentItem[];
  collections: Collection[];
  communities: Community[];
}

function bucketContent(items: ContentItem[]): Pick<
  UserFavoritesCatalog,
  "anime" | "shows" | "movies" | "documentaries"
> {
  return {
    anime: items.filter((item) => item.type === "anime"),
    shows: items.filter((item) => item.type === "show" || item.type === "kdrama"),
    movies: items.filter((item) => item.type === "movie"),
    documentaries: items.filter((item) => item.type === "documentary"),
  };
}

export async function getUserFavoritesCatalog(
  userId: string,
): Promise<UserFavoritesCatalog> {
  const [contentRows, trackRows, artistRows, collectionRows, communityRows] =
    await Promise.all([
      listUserFavoriteContent(userId),
      listUserFavoriteTracks(userId),
      listUserFavoriteArtists(userId),
      listUserFavoriteCollections(userId),
      listUserJoinedCommunities(userId),
    ]);

  const contentItems = contentRows.map((row) => mapContentToItem(row));
  const buckets = bucketContent(contentItems);

  return {
    ...buckets,
    songs: trackRows.map((row) => mapTrackToMusicTrack(row)),
    artists: artistRows.map((row) => mapArtistToContentItem(row)),
    collections: collectionRows.map((row) => mapCollectionToCard(row)),
    communities: communityRows.map((row) => mapCommunityToCard(row)),
  };
}

export function countFavorites(catalog: UserFavoritesCatalog): number {
  return (
    catalog.anime.length +
    catalog.shows.length +
    catalog.movies.length +
    catalog.documentaries.length +
    catalog.songs.length +
    catalog.artists.length +
    catalog.collections.length +
    catalog.communities.length
  );
}

export function labelForFavoriteSection(
  type: keyof UserFavoritesCatalog | ContentItem["type"],
) {
  switch (type) {
    case "anime":
      return "Anime";
    case "shows":
      return "Shows & Series";
    case "movies":
      return "Movies";
    case "documentaries":
      return "Documentaries";
    case "songs":
      return "Songs";
    case "artists":
      return "Artists";
    case "collections":
      return "Collections";
    case "communities":
      return "Communities";
    default:
      return "Favourites";
  }
}
