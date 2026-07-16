import { mapUserSummary } from "@/lib/mappers/community.mapper";
import { formatChatSentAt } from "@/lib/format-dates";
import type { ChatMessage } from "@/types";

type ChatAuthor = Parameters<typeof mapUserSummary>[0];

export function mapCommunityChatMessage(
  row: {
    id: string;
    content: string;
    createdAt: Date;
    author: ChatAuthor;
  },
  viewerUserId?: string,
): ChatMessage {
  return {
    id: row.id,
    author: mapUserSummary(row.author),
    content: row.content,
    sentAt: formatChatSentAt(row.createdAt),
    own: viewerUserId != null && row.author.id === viewerUserId,
  };
}
