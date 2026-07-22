import type { Metadata } from "next";
import { CollectionsDashboard } from "@/components/dashboard/collections-dashboard";
import { getCurrentUser } from "@/lib/data/user";
import {
  getAllCollections,
  getCollectionStats,
  getGenreFilters,
  getGlobalPublicCollections,
  getFollowingCollections,
  getMostLikedCollections,
  getRecentlyUsedCollections,
} from "@/lib/data/collections";

export const metadata: Metadata = {
  title: "Collections — AniVerse",
  description:
    "Organize your favorite anime, movies, shows, songs, and playlists.",
};

export default async function CollectionsPage() {
  const user = await getCurrentUser();
  const [stats, genres, mostLiked, following, recentlyUsed, all, globalPublic] =
    await Promise.all([
      getCollectionStats(user.id),
      getGenreFilters(),
      getMostLikedCollections(user.id),
      getFollowingCollections(user.id),
      getRecentlyUsedCollections(user.id),
      getAllCollections(user.id),
      getGlobalPublicCollections(user.id),
    ]);

  return (
    <CollectionsDashboard
      userName={user.name}
      stats={stats}
      genres={genres}
      mostLiked={mostLiked}
      following={following}
      recentlyUsed={recentlyUsed}
      all={all}
      globalPublic={globalPublic}
    />
  );
}
