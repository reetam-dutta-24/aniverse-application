export const NOTIFICATION_SEEDS = [
  {
    title: "New Episode Available!",
    category: "Episode",
    description:
      "Jujutsu Kaisen S3 Episode 4 \u201cInto Shibuya Again\u201d is now live. Continue right where you left off — you're 3 episodes behind the community watch pace.",
    imageUrl: "/images/posters/jujutsu-kaisen.jpg",
    href: "/content/jujutsu-kaisen",
    read: false,
    minutesAgo: 12,
  },
  {
    title: "Watch Party Starting!",
    category: "Watch Party",
    description:
      "Global Anime Community watch room opens in 15 minutes — 42 members already waiting in the lobby. Attack On Titan finale rewatch, hosted by Emily Carter.",
    imageUrl: "/images/posters/attack-on-titan.jpg",
    href: "/community/global-anime-community",
    read: false,
    minutesAgo: 25,
  },
  {
    title: "New Song From TWICE",
    category: "Music Drop",
    description:
      "TWICE just dropped a new single — matched 96% to your taste profile based on your K-Pop listening history and liked tracks.",
    imageUrl: "/images/artists/twice.jpg",
    href: "/artist/twice",
    read: false,
    minutesAgo: 60,
  },
  {
    title: "AI Match Updated",
    category: "AI Match",
    description:
      "Frieren joined your For You picks with a 94% match score — your highest new match this month, driven by your fantasy and drama watch patterns.",
    imageUrl: "/images/posters/frieren.jpg",
    href: "/dashboard/for-you",
    read: false,
    minutesAgo: 120,
  },
  {
    title: "Review Got 50 Likes",
    category: "Community",
    description:
      "Your Death Note review \u201cholds up perfectly\u201d crossed 50 likes and is trending in the Global Anime Community this week.",
    imageUrl: "/images/posters/death-note.jpg",
    href: "/content/death-note",
    read: true,
    minutesAgo: 240,
  },
  {
    title: "Collection Updated",
    category: "Collection",
    description:
      "Anime Masterpieces gained 3 new titles this week — Vinland Saga, Monster, and Frieren were added by collaborators you follow.",
    imageUrl: "/images/posters/vinland-saga.jpg",
    href: "/collection/anime-masterpieces",
    read: true,
    minutesAgo: 360,
  },
  {
    title: "New Community Post",
    category: "Community",
    description:
      "Emily Carter posted in TWICE Fanverse: \u201cComeback theories \ud83e\uddf5\u201d — already 120 replies and climbing.",
    imageUrl: "/images/hero-2.png",
    href: "/community/global-anime-community/dashboard/posts",
    read: true,
    minutesAgo: 540,
  },
  {
    title: "Weekly Recap Ready",
    category: "Recap",
    description:
      "You watched 14h and listened 18h this week — up 12% from last week. Your full breakdown is waiting in Analytics.",
    imageUrl: "/images/posters/your-name.jpg",
    href: "/dashboard/analytics",
    read: true,
    minutesAgo: 1440,
  },
  {
    title: "Watchlist Reminder",
    category: "Watchlist",
    description:
      "Chainsaw Man has been pending in your watchlist for 2 weeks — it's leaving the trending row soon.",
    imageUrl: "/images/posters/chainsaw-man.jpg",
    href: "/dashboard/watchlist",
    read: true,
    minutesAgo: 2880,
  },
  {
    title: "New Follower",
    category: "Social",
    description:
      "Lucas Silva started following your profile — you have 3 mutual communities.",
    imageUrl: "/images/hero-3.png",
    href: "/profile/reetam_dutta",
    read: true,
    minutesAgo: 4320,
  },
] as const;
