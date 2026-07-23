/** Anchor ids for profile page sections — used by KPI smooth-scroll. */
export const PROFILE_SECTION_IDS = {
  recentActivity: "profile-recent-activity",
  favoriteAnime: "profile-favorite-anime",
  favoriteMovies: "profile-favorite-movies",
  artists: "profile-artists",
  favoriteSongs: "profile-favorite-songs",
  favoriteAlbums: "profile-favorite-albums",
  analytics: "profile-analytics",
  collections: "profile-collections",
  friends: "profile-friends",
  communities: "profile-communities",
  reviews: "profile-reviews",
} as const;

export function scrollToProfileSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
