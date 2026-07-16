import type { CommunityChatChannel } from "@prisma/client";

export type CommunityChatChannelId = "general" | "anime";

export function sectionToChatChannel(
  section: "chat" | "anime-chat",
): CommunityChatChannelId {
  return section === "anime-chat" ? "anime" : "general";
}

export function chatChannelToPrisma(
  channel: CommunityChatChannelId,
): CommunityChatChannel {
  return channel === "anime" ? "ANIME" : "GENERAL";
}

export function prismaToChatChannel(
  channel: CommunityChatChannel,
): CommunityChatChannelId {
  return channel === "ANIME" ? "anime" : "general";
}

export function getChatRoomId(
  communitySlug: string,
  channel: CommunityChatChannelId,
): string {
  return `community:${communitySlug.trim().toLowerCase()}:${channel}`;
}

export function parseChatRoomId(roomId: string): {
  communitySlug: string;
  channel: CommunityChatChannelId;
} | null {
  const match = /^community:([^:]+):(general|anime)$/.exec(roomId);
  if (!match) return null;
  return {
    communitySlug: match[1]!,
    channel: match[2] as CommunityChatChannelId,
  };
}
