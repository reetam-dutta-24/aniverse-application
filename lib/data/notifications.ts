import type { AppNotification } from "@/types";

/**
 * Data layer for notifications.
 *
 * Currently resolves static mock data. When the backend is ready, replace
 * only the function bodies — consuming UI will not need to change.
 */

/** Seed data — also consumed synchronously by the client notification store. */
export const mockNotifications: AppNotification[] = [
  {
    id: "n-1",
    title: "New Episode Available!",
    category: "Episode",
    description:
      "Jujutsu Kaisen S3 Episode 4 \u201cInto Shibuya Again\u201d is now live. Continue right where you left off — you're 3 episodes behind the community watch pace.",
    createdAt: "12min ago",
    read: false,
    imageUrl: "/images/posters/jujutsu-kaisen.jpg",
    href: "/content/jujutsu-kaisen",
  },
  {
    id: "n-2",
    title: "Watch Party Starting!",
    category: "Watch Party",
    description:
      "Global Anime Community watch room opens in 15 minutes — 42 members already waiting in the lobby. Attack On Titan finale rewatch, hosted by Emily Carter.",
    createdAt: "25min ago",
    read: false,
    imageUrl: "/images/posters/attack-on-titan.jpg",
    href: "/community/global-anime-community",
  },
  {
    id: "n-3",
    title: "New Song From TWICE",
    category: "Music Drop",
    description:
      "TWICE just dropped a new single — matched 96% to your taste profile based on your K-Pop listening history and liked tracks.",
    createdAt: "1h ago",
    read: false,
    imageUrl: "/images/artists/twice.jpg",
    href: "/artist/twice",
  },
  {
    id: "n-4",
    title: "AI Match Updated",
    category: "AI Match",
    description:
      "Frieren joined your For You picks with a 94% match score — your highest new match this month, driven by your fantasy and drama watch patterns.",
    createdAt: "2h ago",
    read: false,
    imageUrl: "/images/posters/frieren.jpg",
    href: "/dashboard/for-you",
  },
  {
    id: "n-5",
    title: "Review Got 50 Likes",
    category: "Community",
    description:
      "Your Death Note review \u201cholds up perfectly\u201d crossed 50 likes and is trending in the Global Anime Community this week.",
    createdAt: "4h ago",
    read: true,
    imageUrl: "/images/posters/death-note.jpg",
    href: "/content/death-note",
  },
  {
    id: "n-6",
    title: "Collection Updated",
    category: "Collection",
    description:
      "Anime Masterpieces gained 3 new titles this week — Vinland Saga, Monster, and Frieren were added by collaborators you follow.",
    createdAt: "6h ago",
    read: true,
    imageUrl: "/images/posters/vinland-saga.jpg",
    href: "/collection/anime-masterpieces",
  },
  {
    id: "n-7",
    title: "New Community Post",
    category: "Community",
    description:
      "Emily Carter posted in TWICE Fanverse: \u201cComeback theories \ud83e\uddf5\u201d — already 120 replies and climbing.",
    createdAt: "9h ago",
    read: true,
    imageUrl: "/images/hero-2.png",
    href: "/community/global-anime-community/dashboard/posts",
  },
  {
    id: "n-8",
    title: "Weekly Recap Ready",
    category: "Recap",
    description:
      "You watched 14h and listened 18h this week — up 12% from last week. Your full breakdown is waiting in Analytics.",
    createdAt: "1d ago",
    read: true,
    imageUrl: "/images/posters/your-name.jpg",
    href: "/dashboard/analytics",
  },
  {
    id: "n-9",
    title: "Watchlist Reminder",
    category: "Watchlist",
    description:
      "Chainsaw Man has been pending in your watchlist for 2 weeks — it's leaving the trending row soon.",
    createdAt: "2d ago",
    read: true,
    imageUrl: "/images/posters/chainsaw-man.jpg",
    href: "/dashboard/watchlist",
  },
  {
    id: "n-10",
    title: "New Follower",
    category: "Social",
    description:
      "Lucas Silva started following your profile — you have 3 mutual communities.",
    createdAt: "3d ago",
    read: true,
    imageUrl: "/images/hero-3.png",
    href: "/profile/reetam-dutta",
  },
];

const notifications = mockNotifications;

export async function getNotifications(): Promise<AppNotification[]> {
  return notifications;
}

export async function getUnreadNotificationCount(): Promise<number> {
  return notifications.filter((n) => !n.read).length;
}
