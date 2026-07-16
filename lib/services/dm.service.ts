import { prisma } from "@/lib/prisma";
import { areUsersFriends } from "@/lib/services/follow.service";
import { formatPostedAt } from "@/lib/format-dates";

export class DmNotFoundError extends Error {
  constructor(message = "Conversation not found.") {
    super(message);
    this.name = "DmNotFoundError";
  }
}

export class DmForbiddenError extends Error {
  constructor(message = "You cannot access this conversation.") {
    super(message);
    this.name = "DmForbiddenError";
  }
}

export function normalizeParticipantPair(userAId: string, userBId: string) {
  return userAId < userBId
    ? { participantLowId: userAId, participantHighId: userBId }
    : { participantLowId: userBId, participantHighId: userAId };
}

export async function getOrCreateConversation(userAId: string, userBId: string) {
  if (userAId === userBId) throw new DmForbiddenError("Cannot message yourself.");

  const pair = normalizeParticipantPair(userAId, userBId);
  const existing = await prisma.directConversation.findUnique({
    where: {
      participantLowId_participantHighId: pair,
    },
  });
  if (existing) return existing;

  return prisma.directConversation.create({ data: pair });
}

export async function listConversationsForUser(userId: string) {
  const rows = await prisma.directConversation.findMany({
    where: {
      OR: [{ participantLowId: userId }, { participantHighId: userId }],
    },
    include: {
      participantLow: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarColor: true,
          avatarUrl: true,
        },
      },
      participantHigh: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarColor: true,
          avatarUrl: true,
        },
      },
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return rows.map((row) => {
    const peer =
      row.participantLowId === userId ? row.participantHigh : row.participantLow;
    const last = row.messages[0];
    return {
      id: row.id,
      peer: {
        id: peer.id,
        name: peer.name,
        handle: peer.handle,
        avatarColor: peer.avatarColor,
        avatarUrl: peer.avatarUrl ?? undefined,
      },
      lastMessage: last
        ? {
            id: last.id,
            content: last.content,
            senderId: last.senderId,
            warnNonFriend: last.warnNonFriend,
            createdAt: formatPostedAt(last.createdAt),
          }
        : undefined,
      updatedAt: row.updatedAt,
    };
  });
}

export async function listMessagesForConversation(
  userId: string,
  conversationId: string,
  limit = 80,
) {
  const conversation = await prisma.directConversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) throw new DmNotFoundError();
  if (
    conversation.participantLowId !== userId &&
    conversation.participantHighId !== userId
  ) {
    throw new DmForbiddenError();
  }

  const rows = await prisma.directMessage.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarColor: true,
          avatarUrl: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    sender: {
      id: row.sender.id,
      name: row.sender.name,
      handle: row.sender.handle,
      avatarColor: row.sender.avatarColor,
      avatarUrl: row.sender.avatarUrl ?? undefined,
    },
    content: row.content,
    warnNonFriend: row.warnNonFriend,
    editedAt: row.editedAt ? formatPostedAt(row.editedAt) : undefined,
    createdAt: formatPostedAt(row.createdAt),
    isOwn: row.senderId === userId,
  }));
}

export async function sendDirectMessage(
  senderId: string,
  recipientHandle: string,
  content: string,
) {
  const recipient = await prisma.user.findUnique({
    where: { handle: recipientHandle },
    select: { id: true },
  });
  if (!recipient) throw new DmNotFoundError("User not found.");

  const conversation = await getOrCreateConversation(senderId, recipient.id);
  const friends = await areUsersFriends(senderId, recipient.id);
  const warnNonFriend = !friends;

  const message = await prisma.$transaction(async (tx) => {
    const row = await tx.directMessage.create({
      data: {
        conversationId: conversation.id,
        senderId,
        content: content.trim(),
        warnNonFriend,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            handle: true,
            avatarColor: true,
            avatarUrl: true,
          },
        },
      },
    });
    await tx.directConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });
    return row;
  });

  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      handle: message.sender.handle,
      avatarColor: message.sender.avatarColor,
      avatarUrl: message.sender.avatarUrl ?? undefined,
    },
    content: message.content,
    warnNonFriend: message.warnNonFriend,
    createdAt: formatPostedAt(message.createdAt),
    isOwn: true,
  };
}

export async function editDirectMessage(
  userId: string,
  messageId: string,
  content: string,
) {
  const existing = await prisma.directMessage.findUnique({
    where: { id: messageId },
  });
  if (!existing || existing.deletedAt) throw new DmNotFoundError("Message not found.");
  if (existing.senderId !== userId) throw new DmForbiddenError();

  const updated = await prisma.directMessage.update({
    where: { id: messageId },
    data: { content: content.trim(), editedAt: new Date() },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarColor: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    id: updated.id,
    conversationId: updated.conversationId,
    senderId: updated.senderId,
    content: updated.content,
    warnNonFriend: updated.warnNonFriend,
    editedAt: formatPostedAt(updated.editedAt!),
    createdAt: formatPostedAt(updated.createdAt),
  };
}

export async function deleteDirectMessage(userId: string, messageId: string) {
  const existing = await prisma.directMessage.findUnique({
    where: { id: messageId },
  });
  if (!existing || existing.deletedAt) throw new DmNotFoundError("Message not found.");
  if (existing.senderId !== userId) throw new DmForbiddenError();

  await prisma.directMessage.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
  });

  return { id: messageId, conversationId: existing.conversationId };
}

export function getDmRoomId(conversationId: string) {
  return `dm:${conversationId}`;
}
