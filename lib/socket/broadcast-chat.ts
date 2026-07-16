import type { CommunityChatChannel } from "@prisma/client";
import {
  getChatRoomId,
  prismaToChatChannel,
} from "@/lib/community-chat";
import { getSocketServer } from "@/lib/socket/io-instance";
import type { ChatMessage } from "@/types";

export function broadcastChatMessage(
  communitySlug: string,
  channel: CommunityChatChannel,
  message: ChatMessage,
) {
  const io = getSocketServer();
  if (!io) return;

  const roomId = getChatRoomId(
    communitySlug,
    prismaToChatChannel(channel),
  );

  io.to(roomId).emit("chat:updated", message);
}

export function broadcastChatDeleted(
  communitySlug: string,
  channel: CommunityChatChannel,
  messageId: string,
) {
  const io = getSocketServer();
  if (!io) return;

  const roomId = getChatRoomId(
    communitySlug,
    prismaToChatChannel(channel),
  );

  io.to(roomId).emit("chat:deleted", { id: messageId });
}
