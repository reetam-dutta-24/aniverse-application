export type CollectionMediaVariant = "content" | "music";

export const COLLECTION_MEDIA_COPY: Record<
  CollectionMediaVariant,
  {
    itemCount: (count: number) => string;
    spotlightTitle: string;
    resumeCta: string;
    detailsCta: string;
    playOrderCta: string;
    emptySpotlight: string;
    viewAllTitle: string;
    continueTitle: string;
    mostPlayedTitle: string;
    addItemCta: string;
  }
> = {
  content: {
    itemCount: (count) => `${count} Items`,
    spotlightTitle: "❤️ Your Favourite Items In This Collection",
    resumeCta: "Resume Watching",
    detailsCta: "View Show Details",
    playOrderCta: "Watch in Order",
    emptySpotlight: "No favourites match your search.",
    viewAllTitle: "📂 View All Items",
    continueTitle: "⏳ Continue Watching",
    mostPlayedTitle: "🏆 Content You Watched The Most",
    addItemCta: "Add New Item",
  },
  music: {
    itemCount: (count) => `${count} Songs`,
    spotlightTitle: "❤️ Your Favourite Songs In This Collection",
    resumeCta: "Resume Listening",
    detailsCta: "View Song Details",
    playOrderCta: "Play the Playlist",
    emptySpotlight: "No songs match your search.",
    viewAllTitle: "🎵 View All Songs",
    continueTitle: "🎧 Continue Listening",
    mostPlayedTitle: "▶️ Songs You Listened To The Most",
    addItemCta: "Add New Song",
  },
};
