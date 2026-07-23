import type { PrismaClient } from "@prisma/client";

/** Remove every row from the application database (fresh seed). */
export async function wipeDatabase(prisma: PrismaClient) {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "DirectMessage",
      "DirectConversationRead",
      "DirectConversation",
      "CollectionCollaborator",
      "ReviewLike",
      "CommunityPostLike",
      "UserFollow",
      "FriendRequest",
      "Review",
      "CatalogReview",
      "Notification",
      "WatchEvent",
      "ListenEvent",
      "Rating",
      "CommunityChatMessage",
      "CommunityVoiceChannelMember",
      "CommunityWatchChannelMember",
      "CommunityVoiceChannel",
      "CommunityWatchChannel",
      "CommunityPost",
      "CommunityMember",
      "CollectionItem",
      "CollectionFavorite",
      "ContentFavorite",
      "WatchlistItem",
      "ContentRelated",
      "ContentFeaturedTrack",
      "ContentCharacter",
      "ContentEpisode",
      "ContentSeason",
      "ContentGenre",
      "MusicTrack",
      "Content",
      "ArtistMember",
      "Artist",
      "Collection",
      "Community",
      "Genre",
      "TasteProfile",
      "UserPreferences",
      "Account",
      "User"
    RESTART IDENTITY CASCADE;
  `);
}
