import type {
  Collection,
  Community,
  CommunityDetail,
  CommunityPost,
  ContentItem,
  Member,
  MusicTrack,
  UserSummary,
  VoiceChannel,
  WatchParty,
} from "@/types";
import { normalizeCommunitySlug } from "@/lib/community-routes";
import { formatDetailSynopsis } from "@/lib/data/content-detail";
import {
  getContinueWatching,
  getTrendingMusic,
  getTrendingThisWeek,
} from "@/lib/data/discover";
import { getGlobalCommunities } from "@/lib/data/community";

/**
 * Mock data layer — community detail (`/community/[communityid]`).
 */

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;

const communityMembers: UserSummary[] = [
  { id: "cm1", name: "R", avatarColor: "#ff00cc" },
  { id: "cm2", name: "L", avatarColor: "#b8ff00" },
  { id: "cm3", name: "K", avatarColor: "#00ff8c" },
];

const onlineMembers: Member[] = [
  { id: "om1", name: "Emily Carter", role: "moderator", online: true, avatarColor: "#ff00cc" },
  { id: "om2", name: "Reetam Dutta", role: "admin", online: true, avatarColor: "#ffd000" },
  { id: "om3", name: "Lucas Silva", role: "member", online: true, avatarColor: "#00e5ff" },
  { id: "om4", name: "Sophia Lee", role: "member", online: true, avatarColor: "#b8ff00" },
  { id: "om5", name: "Noah Williams", role: "member", online: true, avatarColor: "#4c9aff" },
  { id: "om6", name: "Aanya Rao", role: "moderator", online: true, avatarColor: "#ae00ff" },
  { id: "om7", name: "Karan Singh", role: "member", online: false, avatarColor: "#00ff8c" },
];

const dashboardPosts: CommunityPost[] = [
  {
    id: "cp-1",
    author: { id: "p1", name: "Reetam Dutta", avatarColor: "#ffd000" },
    authorRole: "admin",
    content: "New anime poster has just been posted",
    imageUrl: poster("oshi-no-ko"),
    createdAt: "Posted 3hrs ago",
    likeCount: 876,
    commentCount: 50,
    shareCount: 12,
  },
  {
    id: "cp-2",
    author: { id: "p2", name: "Noah Williams", avatarColor: "#4c9aff" },
    authorRole: "member",
    content: "Tokyo Ghoul rewatch night — who is joining the voice channel later?",
    imageUrl: poster("tokyo-ghoul"),
    createdAt: "Posted 5hrs ago",
    likeCount: 412,
    commentCount: 28,
    shareCount: 6,
  },
  {
    id: "cp-3",
    author: { id: "p3", name: "Emily Carter", avatarColor: "#ff00cc" },
    authorRole: "moderator",
    content: "Weekly recommendation thread is live — drop your hidden gems below!",
    imageUrl: poster("chainsaw-man"),
    createdAt: "Posted 8hrs ago",
    likeCount: 624,
    commentCount: 94,
    shareCount: 18,
  },
];

const chatAuthor = { id: "p1", name: "Reetam Dutta", avatarColor: "#ffd000" };

const dashboardChatMessages = [
  {
    id: "gc-1",
    author: chatAuthor,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sentAt: "17:35",
  },
  {
    id: "gc-2",
    author: chatAuthor,
    content: "Heyyyy Everyone!",
    sentAt: "17:35",
  },
  {
    id: "gc-3",
    author: chatAuthor,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sentAt: "17:35",
  },
  {
    id: "gc-4",
    author: chatAuthor,
    content: "Heyyyy Nice To Meet You All",
    sentAt: "17:36",
    own: true,
  },
];

const dashboardAnimeChatMessages = [
  {
    id: "ac-1",
    author: chatAuthor,
    content: "Anyone watching the new seasonal premieres this week?",
    sentAt: "18:02",
  },
  {
    id: "ac-2",
    author: { id: "p3", name: "Emily Carter", avatarColor: "#ff00cc" },
    content: "Spy x Family S3 hype is real — drop your episode 1 takes!",
    sentAt: "18:04",
  },
  {
    id: "ac-3",
    author: chatAuthor,
    content: "Chainsaw Man movie watch party later tonight?",
    sentAt: "18:06",
    own: true,
  },
];

const watchParticipants: UserSummary[] = [
  { id: "wp1", name: "R", avatarColor: "#ff00cc" },
  { id: "wp2", name: "L", avatarColor: "#ffd000" },
  { id: "wp3", name: "K", avatarColor: "#00ff8c" },
];

const dashboardWatchParties: WatchParty[] = [
  {
    id: "wc-1",
    title: "Watch Naruto Ep 100 Live!",
    nowPlaying: "Naruto — Episode 100",
    live: true,
    viewerCount: 8,
    participants: watchParticipants,
    accent: "green",
    imageUrl: poster("jujutsu-kaisen"),
  },
  {
    id: "wc-2",
    title: "Watch Death Parade Ep 1 Live!",
    nowPlaying: "Death Parade — Episode 1",
    live: true,
    viewerCount: 12,
    participants: watchParticipants,
    accent: "cyan",
    imageUrl: poster("death-note"),
  },
  {
    id: "wc-3",
    title: "Watch Tokyo Ghoul Ep 5 Live!",
    nowPlaying: "Tokyo Ghoul — Episode 5",
    live: true,
    viewerCount: 6,
    participants: watchParticipants,
    accent: "purple",
    imageUrl: poster("tokyo-ghoul"),
  },
  {
    id: "wc-4",
    title: "Watch Re:Zero Ep 12 Live!",
    nowPlaying: "Re:Zero — Episode 12",
    live: true,
    viewerCount: 15,
    participants: watchParticipants,
    accent: "blue",
    imageUrl: poster("demon-slayer"),
  },
];

const dashboardVoiceChannels: VoiceChannel[] = [
  {
    id: "vc-1",
    title: "Join Reetam's VC",
    subtitle: "Late night anime talks",
    memberCount: 10,
    participants: watchParticipants,
    accent: "green",
    hostName: "Reetam Dutta",
  },
  {
    id: "vc-2",
    title: "Join Emily's VC",
    subtitle: "Seasonal anime rankings",
    memberCount: 7,
    participants: watchParticipants,
    accent: "cyan",
    hostName: "Emily Carter",
  },
  {
    id: "vc-3",
    title: "Join Lucas's VC",
    subtitle: "Manga vs anime debates",
    memberCount: 5,
    participants: watchParticipants,
    accent: "purple",
    hostName: "Lucas Silva",
  },
];

const dashboardAnnouncements: CommunityPost[] = [
  {
    id: "ann-1",
    author: chatAuthor,
    authorRole: "admin",
    content: "New anime poster has just been posted",
    imageUrl: poster("oshi-no-ko"),
    createdAt: "Posted 3hrs ago",
    likeCount: 876,
    commentCount: 50,
  },
  {
    id: "ann-2",
    author: chatAuthor,
    authorRole: "admin",
    content: "Community watch party this Friday — vote for the title in comments!",
    imageUrl: poster("demon-slayer"),
    createdAt: "Posted 1 day ago",
    likeCount: 1204,
    commentCount: 186,
  },
];

const favoriteItems: ContentItem[] = [
  {
    id: "death-note",
    title: "Death Note",
    type: "anime",
    imageUrl: poster("death-note"),
    genres: [g("thriller", "Thriller"), g("mystery", "Mystery")],
    rating: 9.7,
    matchScore: 98,
    meta: "1 Season",
    year: 2006,
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    type: "anime",
    imageUrl: poster("jujutsu-kaisen"),
    genres: [g("action", "Action"), g("thriller", "Thriller")],
    rating: 9.5,
    matchScore: 96,
    meta: "4 Seasons",
    year: 2019,
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    type: "anime",
    imageUrl: poster("spy-x-family"),
    genres: [g("action", "Action"), g("comedy", "Comedy")],
    rating: 9.1,
    matchScore: 94,
    meta: "2 Seasons",
    year: 2022,
  },
];

const publicCollections: Collection[] = [
  {
    id: "anime-masterpieces",
    name: "Anime Masterpieces",
    itemCount: 42,
    favoriteCount: 18,
    visibility: "public",
    accent: "cyan",
    imageUrl: poster("death-note"),
  },
  {
    id: "profile-col-3",
    name: "Late Night OSTs",
    itemCount: 31,
    favoriteCount: 11,
    visibility: "public",
    accent: "pink",
    imageUrl: poster("demon-slayer"),
  },
  {
    id: "profile-col-4",
    name: "Weekend Binge",
    itemCount: 24,
    favoriteCount: 9,
    visibility: "public",
    accent: "purple",
    imageUrl: poster("your-name"),
  },
  {
    id: "kpop-essentials",
    name: "K-Pop Magic",
    itemCount: 48,
    favoriteCount: 22,
    visibility: "public",
    accent: "blue",
    imageUrl: "/images/artists/twice.jpg",
  },
];

const globalAnimeCommunity: CommunityDetail = {
  id: "global-anime-community",
  name: "Global Anime Community",
  rating: 9.5,
  rankLeft: "#1 Ranked Global Anime Community",
  rankRight: "+2M Members",
  genres: [g("anime", "Anime"), g("global", "Global")],
  description: formatDetailSynopsis(
    "The world's largest anime discussion hub — rankings, recommendations, watch parties, and deep-dive debates on everything from classics to seasonal premieres. Join millions of fans sharing reviews, fan art, and curated lists daily.",
  ),
  primaryTags: ["Global", "Anime Lovers", "Otaku"],
  matchScore: 97,
  wallpaperUrl: poster("suzume"),
  accent: "cyan",
  engagementStats: [
    { id: "posts", label: "Posts", value: "12.8k" },
    { id: "members", label: "Members", value: "782" },
    { id: "friends", label: "Friends", value: "385" },
    { id: "rank", label: "Global Rank", value: "#1" },
    { id: "likes", label: "Likes", value: "54" },
  ],
  members: communityMembers,
  memberSummary: "6.3m+ members",
  collectionCount: 42,
  popularityLabel: "Popular",
  globalRankLabel: "Global Rank #1",
  favoriteItems,
  dashboardOnlineCount: 824,
  dashboardPostsToday: 23,
  dashboardPosts,
  onlineMembers,
  dashboardNav: [
    { id: "posts", label: "Posts" },
    { id: "chat", label: "General Chat" },
    { id: "watch-channel", label: "Watch Channel" },
    { id: "voice-channel", label: "Voice Channel" },
    { id: "announcements", label: "Announcements" },
    { id: "analytics", label: "Analytics" },
    { id: "anime-chat", label: "Anime Chat" },
    { id: "settings", label: "Settings" },
  ],
  dashboardChatMessages,
  dashboardAnimeChatMessages,
  dashboardWatchParties,
  dashboardVoiceChannels,
  dashboardAnnouncements,
  dashboardAnalytics: [
    { id: "active", label: "Active Members", value: "824" },
    { id: "posts-week", label: "Posts This Week", value: "312" },
    { id: "watch-hours", label: "Watch Hours", value: "1.2k" },
    { id: "voice-mins", label: "Voice Minutes", value: "4.8k" },
    { id: "growth", label: "Weekly Growth", value: "+12%" },
    { id: "engagement", label: "Engagement Rate", value: "68%" },
  ],
  dashboardMembersWatching: 154,
  dashboardMembersInVc: 554,
  dashboardSettings: {
    allowMemberPosts: true,
    requireApproval: false,
    showOnlineStatus: true,
    enableWatchParties: true,
    enableVoiceChannels: true,
  },
  watchedMost: [],
  trending: [],
  musicTracks: [],
  collections: publicCollections,
  similarCommunities: [],
};

const communities: Record<string, CommunityDetail> = {
  "global-anime-community": globalAnimeCommunity,
};

async function hydrateCommunity(
  base: CommunityDetail,
): Promise<CommunityDetail> {
  const [watchedMost, trending, musicTracks, similarCommunities] =
    await Promise.all([
      getContinueWatching(),
      getTrendingThisWeek(),
      getTrendingMusic(),
      getGlobalCommunities(),
    ]);

  return {
    ...base,
    watchedMost: watchedMost.slice(0, 8),
    trending: trending.slice(0, 8),
    musicTracks: musicTracks.slice(0, 8),
    similarCommunities: similarCommunities
      .filter((c) => normalizeCommunitySlug(c.id) !== base.id)
      .slice(0, 4),
  };
}

export async function getAllCommunityIds(): Promise<string[]> {
  return Object.keys(communities);
}

export async function getCommunityDetail(
  communityId: string,
): Promise<CommunityDetail | null> {
  const slug = normalizeCommunitySlug(communityId);
  const base = communities[slug];
  if (!base) return null;
  return hydrateCommunity(base);
}
