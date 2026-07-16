import type { CommunityChatChannel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapCommunityChatMessage } from "@/lib/mappers/community-chat.mapper";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import type { ChatMessage } from "@/types";

const authorSelect = {
  id: true,
  name: true,
  handle: true,
  avatarColor: true,
  avatarUrl: true,
} as const;

const HISTORY_LIMIT = 80;

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

  const rows = await prisma.communityChatMessage.findMany({
    where: { communityId: community.id, channel },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return rows.map((row) => mapCommunityChatMessage(row, viewerUserId));
}

export async function createCommunityChatMessage(
  userId: string,
  communitySlug: string,
  channel: CommunityChatChannel,
  content: string,
): Promise<ChatMessage> {
  const membership = await assertCommunityChatMember(userId, communitySlug);
  const trimmed = content.trim();

  if (!trimmed) {
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
    },
    include: { author: { select: authorSelect } },
  });

  return mapCommunityChatMessage(row, userId);
}
