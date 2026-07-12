import type { Metadata } from "next";
import { KeyRound, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CommunityGridSection,
  WelcomeBanner,
} from "@/components/dashboard";
import { GradientButton } from "@/components/ui/gradient-button";
import { Button } from "@/components/ui/button";
import {
  getCommunityGenres,
  getCommunityMemberPreview,
  getCommunitySorts,
  getCommunityStats,
  getFavouriteCommunities,
  getGlobalCommunities,
  getMostActiveCommunities,
  getRecommendedCommunities,
  type CommunityStats,
} from "@/lib/data/community";
import { getCurrentUser } from "@/lib/data/user";

export const metadata: Metadata = {
  title: "Community — AniVerse",
  description:
    "Discover communities, join discussions, and connect with anime and media fans.",
};

const statTiles = (stats: CommunityStats) => [
  { emoji: "👥", label: "Communities Joined", value: String(stats.joined) },
  { emoji: "🌐", label: "Total Members", value: stats.totalMembers },
  {
    emoji: "💬",
    label: "Posts Viewed Till Now",
    value: stats.postsViewed.toLocaleString(),
  },
  {
    emoji: "⭐",
    label: "Avg AI Compatibility",
    value: `${stats.avgCompatibility}%`,
  },
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

export default async function CommunityPage() {
  const [
    user,
    stats,
    genres,
    sorts,
    members,
    favourites,
    mostActive,
    recommended,
    global,
  ] = await Promise.all([
    getCurrentUser(),
    getCommunityStats(),
    getCommunityGenres(),
    getCommunitySorts(),
    getCommunityMemberPreview(),
    getFavouriteCommunities(),
    getMostActiveCommunities(),
    getRecommendedCommunities(),
    getGlobalCommunities(),
  ]);

  const activeGenres = new Set(["All", "Anime"]);
  const activeSort = "Recently Updated";

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 sm:gap-8">
      <WelcomeBanner userName={user.name} variant="community" />

      <section className="rounded-2xl bg-surface/40 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <h2 className="text-lg font-bold text-white sm:text-heading">Community Hub</h2>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto">
            <GradientButton size="sm" className="w-full rounded-full px-4 sm:w-auto">
              <Plus className="me-1.5 size-4" />
              Create Community
            </GradientButton>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full border-brand-magenta px-4 sm:w-auto"
            >
              <KeyRound className="me-1.5 size-4 text-brand-magenta" />
              Join Community with Code
            </Button>
          </div>
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

      <CommunityGridSection
        title={`⭐ Your Favourite Communities  (${favourites.length})`}
        searchPlaceholder="Search Communities……. "
        communities={favourites}
        members={members}
        ctaMode="view"
      />

      <CommunityGridSection
        title="🔥 Most Active Communities  (12)"
        searchPlaceholder="Search Communities……. "
        communities={mostActive}
        members={members}
        ctaMode="view"
      />

      <CommunityGridSection
        title="🧁 Recommended For You"
        searchPlaceholder="Search Communities……. "
        communities={recommended}
        members={members}
        ctaMode="view"
      />

      <CommunityGridSection
        title="🌍 Discover Global Communities"
        searchPlaceholder="Search Communities……. "
        communities={global}
        ctaMode="join"
      />
    </div>
  );
}
