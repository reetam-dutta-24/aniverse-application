import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { WelcomeBanner } from "@/components/dashboard";
import { CollectionGridSection } from "@/components/dashboard/collection-grid-section";
import { CreateCollectionButton } from "@/components/forms/create-collection-button";
import { getCurrentUser } from "@/lib/data/user";
import {
  getAllCollections,
  getCollectionStats,
  getGenreFilters,
  getGlobalPublicCollections,
  getMostLikedCollections,
  getRecentlyAddedCollections,
  getRecentlyUsedCollections,
  getSortOptions,
  type CollectionStats,
} from "@/lib/data/collections";

export const metadata: Metadata = {
  title: "Collections — AniVerse",
  description:
    "Organize your favorite anime, movies, shows, songs, and playlists.",
};

const statTiles = (stats: CollectionStats) => [
  { emoji: "📒", label: "Collections", value: String(stats.collections) },
  { emoji: "🗂️", label: "Total Items", value: String(stats.totalItems) },
  { emoji: "⭐", label: "Favourites", value: String(stats.favourites) },
  { emoji: "🕐", label: "Last Updated", value: stats.lastUpdated },
];

function FilterChip({ label, active }: { label: string; active: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "h-7 cursor-pointer rounded-full px-4 text-xs font-semibold text-white transition-colors",
        active
          ? "bg-brand-magenta shadow-glow-pink-soft"
          : "border border-brand-magenta/70 bg-transparent hover:bg-brand-magenta/15",
      )}
    >
      {label}
    </button>
  );
}

export default async function CollectionsPage() {
  const user = await getCurrentUser();
  const [stats, genres, sorts, mostLiked, recentlyAdded, recentlyUsed, all, globalPublic] =
    await Promise.all([
      getCollectionStats(user.id),
      getGenreFilters(),
      getSortOptions(),
      getMostLikedCollections(user.id),
      getRecentlyAddedCollections(user.id),
      getRecentlyUsedCollections(user.id),
      getAllCollections(user.id),
      getGlobalPublicCollections(),
    ]);

  // Static UI state until filtering is wired to the backend.
  const activeGenres = new Set(["Anime", "Movies", "Shows"]);
  const activeSort = "Recently Updated";

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 sm:gap-8">
      <WelcomeBanner userName={user.name} variant="collections" />

      {/* Your Collection stats */}
      <section className="rounded-2xl bg-surface/40 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-white sm:text-heading">📒 Your Collection</h2>
          <CreateCollectionButton />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {statTiles(stats).map((tile) => (
            <div
              key={tile.label}
              className="bg-gradient-brand flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center shadow-[0_2px_10px_rgba(255,0,204,0.12)] sm:px-4 sm:py-4"
            >
              <span className="text-[10px] font-semibold text-white sm:text-xs">
                {tile.emoji} {tile.label}
              </span>
              <span className="text-xl font-bold text-white sm:text-2xl">{tile.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Genre + sort filters */}
      <section className="flex flex-col gap-4 rounded-2xl bg-surface/40 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <span className="text-sm font-bold text-white">Select Genre</span>
          <div className="flex flex-wrap items-center gap-4">
            {genres.map((genre) => (
              <FilterChip
                key={genre}
                label={genre}
                active={activeGenres.has(genre)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <span className="text-sm font-bold text-white">Sort By</span>
          <div className="flex flex-wrap items-center gap-4">
            {sorts.map((sort) => (
              <FilterChip key={sort} label={sort} active={sort === activeSort} />
            ))}
          </div>
        </div>
      </section>

      <CollectionGridSection
        title={`⭐ Most Liked Collections  (${stats.collections > 20 ? 20 : stats.collections})`}
        searchPlaceholder="Search Liked Collections……. "
        collections={mostLiked}
        editable
      />

      <CollectionGridSection
        title="🆕 Recently Added  (18)"
        searchPlaceholder="Search Recent Added Collection…… "
        collections={recentlyAdded}
        editable
      />

      <CollectionGridSection
        title="🕐 Recently Used"
        searchPlaceholder="Search Recent Collection……. "
        collections={recentlyUsed}
        editable
      />

      <CollectionGridSection
        title={`📁 Your Collections  (${stats.collections})`}
        searchPlaceholder="Search All Collection…… "
        collections={all}
        editable
      />

      <CollectionGridSection
        title={`🌍 View Global Public Collections  (${globalPublic.length})`}
        searchPlaceholder="Search Public Collections……. "
        collections={globalPublic}
      />
    </div>
  );
}
