import type { CommunityChatAttachmentKind, CommunityChatChannel, MemberRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapCommunityChatMessage } from "@/lib/mappers/community-chat.mapper";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import type { CommunityChatSendInput, CommunityChatUpdateInput } from "@/lib/validators/community-chat";
import type { ChatMessage } from "@/types";

const authorSelect = {
  id: true,
  name: true,
  handle: true,
  avatarColor: true,
  avatarUrl: true,
} as const;

const HISTORY_LIMIT = 80;

function isStaffRole(role: MemberRole) {
  return role === "ADMIN" || role === "MODERATOR";
}

function chatPermissions(
  viewerUserId: string | undefined,
  authorId: string,
  viewerRole?: MemberRole,
) {
  const isAuthor = viewerUserId === authorId;
  const isStaff = viewerRole ? isStaffRole(viewerRole) : false;
  return {
    canEdit: isAuthor,
    canDelete: isAuthor || isStaff,
  };
}

export async function assertCommunityChatMember(
  userId: string,
  communitySlug: string,
) {
  const membership = await prisma.communityMember.findFirst({
    where: { userId, community: { slug: communitySlug } },
    include: { community: { select: { id: true, slug: true } } },
  });

  if (!membership) {
    throw new CommunityForbiddenError("Join the community to use chat.");
  }

  return membership;
}

export async function listCommunityChatMessages(
  communitySlug: string,
  channel: CommunityChatChannel,
  viewerUserId?: string,
  limit = HISTORY_LIMIT,
): Promise<ChatMessage[]> {
  const community = await prisma.community.findUnique({
    where: { slug: communitySlug },
    select: { id: true, visibility: true },
  });
  if (!community) throw new CommunityNotFoundError("Community not found.");

  if (community.visibility === "PRIVATE" && viewerUserId) {
    await assertCommunityChatMember(viewerUserId, communitySlug);
  }

  const viewerMembership = viewerUserId
    ? await prisma.communityMember.findFirst({
        where: { userId: viewerUserId, communityId: community.id },
        select: { role: true },
      })
    : null;

  const rows = await prisma.communityChatMessage.findMany({
    where: { communityId: community.id, channel },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return rows.map((row) =>
    mapCommunityChatMessage(row, viewerUserId, {
      ...chatPermissions(
        viewerUserId,
        row.authorId,
        viewerMembership?.role,
      ),
    }),
  );
}

function chatAttachmentKindToPrisma(
  kind: "image" | "file",
): CommunityChatAttachmentKind {
  return kind === "image" ? "IMAGE" : "FILE";
}

export async function createCommunityChatMessage(
  userId: string,
  communitySlug: string,
  channel: CommunityChatChannel,
  input: CommunityChatSendInput,
): Promise<ChatMessage> {
  const membership = await assertCommunityChatMember(userId, communitySlug);
  const trimmed = input.content.trim();

  if (!trimmed && !input.attachment) {
    throw new CommunityForbiddenError("Message cannot be empty.");
  }

  if (trimmed.length > 2000) {
    throw new CommunityForbiddenError("Message is too long (max 2000 characters).");
  }

  const row = await prisma.communityChatMessage.create({
    data: {
      communityId: membership.community.id,
      authorId: userId,
      channel,
      content: trimmed,
      attachmentUrl: input.attachment?.url,
      attachmentName: input.attachment?.name,
      attachmentKind: input.attachment
        ? chatAttachmentKindToPrisma(input.attachment.kind)
        : undefined,
    },
    include: { author: { select: authorSelect } },
  });

  return mapCommunityChatMessage(row, userId, {
    canEdit: true,
    canDelete: true,
  });
}

export async function updateCommunityChatMessage(
  userId: string,
  communitySlug: string,
  messageId: string,
  input: CommunityChatUpdateInput,
): Promise<{ message: ChatMessage; channel: CommunityChatChannel }> {
  const message = await prisma.communityChatMessage.findFirst({
    where: {
      id: messageId,
      authorId: userId,
      community: { slug: communitySlug },
    },
    include: {
      author: { select: authorSelect },
      community: { select: { slug: true } },
    },
  });

  if (!message) throw new CommunityNotFoundError("Message not found.");

  const row = await prisma.communityChatMessage.update({
    where: { id: messageId },
    data: { content: input.content.trim() },
    include: { author: { select: authorSelect } },
  });

  return {
    message: mapCommunityChatMessage(row, userId, {
      canEdit: true,
      canDelete: true,
      edited: true,
    }),
    channel: message.channel,
  };
}

export async function deleteCommunityChatMessage(
  userId: string,
  communitySlug: string,
  messageId: string,
): Promise<{ id: string; channel: CommunityChatChannel }> {
  const message = await prisma.communityChatMessage.findFirst({
    where: {
      id: messageId,
      community: { slug: communitySlug },
      OR: [
        { authorId: userId },
        {
          community: {
            members: {
              some: {
                userId,
                role: { in: ["ADMIN", "MODERATOR"] },
              },
            },
          },
        },
      ],
    },
    select: { id: true, channel: true },
  });

  if (!message) throw new CommunityNotFoundError("Message not found.");

  await prisma.communityChatMessage.delete({ where: { id: messageId } });

  return { id: message.id, channel: message.channel };
}
