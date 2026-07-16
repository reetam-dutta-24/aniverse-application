import type { CommunityChatAttachmentKind } from "@prisma/client";
import { mapUserSummary } from "@/lib/mappers/community.mapper";
import { formatChatSentAt } from "@/lib/format-dates";
import type { ChatMessage } from "@/types";

type ChatAuthor = Parameters<typeof mapUserSummary>[0];

interface MapChatMessageOptions {
  canEdit?: boolean;
  canDelete?: boolean;
  edited?: boolean;
}

function mapAttachmentKind(
  kind: CommunityChatAttachmentKind | null | undefined,
): "image" | "file" | undefined {
  if (kind === "IMAGE") return "image";
  if (kind === "FILE") return "file";
  return undefined;
}

export function mapCommunityChatMessage(
  row: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    attachmentUrl?: string | null;
    attachmentName?: string | null;
    attachmentKind?: CommunityChatAttachmentKind | null;
    author: ChatAuthor;
  },
  viewerUserId?: string,
  options?: MapChatMessageOptions,
): ChatMessage {
  const isAuthor = viewerUserId != null && row.author.id === viewerUserId;
  const edited =
    options?.edited ??
    (row.updatedAt != null
      ? row.updatedAt.getTime() - row.createdAt.getTime() > 1000
      : false);

  const attachmentKind = mapAttachmentKind(row.attachmentKind);
  const attachment =
    row.attachmentUrl && row.attachmentName && attachmentKind
      ? {
          url: row.attachmentUrl,
          name: row.attachmentName,
          kind: attachmentKind,
        }
      : undefined;

  return {
    id: row.id,
    author: mapUserSummary(row.author),
    content: row.content,
    sentAt: formatChatSentAt(row.createdAt),
    own: isAuthor,
    canEdit: options?.canEdit ?? isAuthor,
    canDelete: options?.canDelete ?? isAuthor,
    edited,
    attachment,
  };
}
