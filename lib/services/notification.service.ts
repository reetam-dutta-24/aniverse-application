import { prisma } from "@/lib/prisma";

export class NotificationNotFoundError extends Error {
  constructor() {
    super("Notification not found.");
    this.name = "NotificationNotFoundError";
  }
}

export function isNotificationNotFound(
  error: unknown,
): error is NotificationNotFoundError {
  return error instanceof NotificationNotFoundError;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  category?: string | null;
  description?: string;
  imageUrl?: string;
  href?: string;
  actionType?: string | null;
  actionRefId?: string | null;
  read?: boolean;
  createdAt?: Date;
}

export async function listNotificationsForUser(
  userId: string,
  limit = 50,
) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function countUnreadNotificationsForUser(
  userId: string,
): Promise<number> {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      category: input.category ?? null,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null,
      href: input.href ?? null,
      actionType: input.actionType ?? null,
      actionRefId: input.actionRefId ?? null,
      read: input.read ?? false,
      createdAt: input.createdAt,
    },
  });
}

type NotificationPreferenceKey =
  | "newEpisodes"
  | "watchParties"
  | "musicDrops"
  | "communityPosts"
  | "weeklyRecap";

const CATEGORY_PREF_MAP: Record<string, NotificationPreferenceKey | null> = {
  Episode: "newEpisodes",
  "Watch Party": "watchParties",
  "Music Drop": "musicDrops",
  Community: "communityPosts",
  Recap: "weeklyRecap",
  Social: null,
  "Friend Request": null,
  "Friend Request Accepted": null,
  Watchlist: null,
  Collection: null,
  "AI Match": null,
};

export async function shouldNotifyUser(
  userId: string,
  category?: string | null,
): Promise<boolean> {
  if (!category) return true;
  const prefKey = CATEGORY_PREF_MAP[category];
  if (!prefKey) return true;

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId },
    select: {
      newEpisodes: true,
      watchParties: true,
      musicDrops: true,
      communityPosts: true,
      weeklyRecap: true,
    },
  });

  if (!prefs) {
    return prefKey !== "communityPosts";
  }

  return prefs[prefKey];
}

export async function createNotificationIfAllowed(
  input: CreateNotificationInput,
) {
  if (!(await shouldNotifyUser(input.userId, input.category))) return null;
  return createNotification(input);
}

export async function markNotificationReadForUser(
  userId: string,
  notificationId: string,
) {
  const row = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!row) throw new NotificationNotFoundError();

  if (row.read) return row;

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsReadForUser(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function syncNotificationsForUser(
  userId: string,
  seeds: CreateNotificationInput[],
) {
  await prisma.notification.deleteMany({ where: { userId } });

  for (const seed of seeds) {
    await createNotification({ ...seed, userId });
  }
}

export async function notifyCommunityPost(
  community: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string | null;
  },
  post: {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
  },
) {
  const members = await prisma.communityMember.findMany({
    where: {
      communityId: community.id,
      userId: { not: post.authorId },
    },
    select: { userId: true },
    take: 100,
  });

  if (members.length === 0) return;

  const allowedMembers: string[] = [];
  for (const member of members) {
    if (await shouldNotifyUser(member.userId, "Community")) {
      allowedMembers.push(member.userId);
    }
  }
  if (allowedMembers.length === 0) return;

  await prisma.notification.createMany({
    data: allowedMembers.map((userId) => ({
      userId,
      title: "New Community Post",
      category: "Community",
      description: `${post.authorName} posted in ${community.name}: “${post.title}”`,
      imageUrl: community.imageUrl,
      href: `/community/${community.slug}/dashboard/posts`,
    })),
  });
}

export async function notifyFriendRequest(input: {
  requestId: string;
  requesterId: string;
  requesterName: string;
  requesterHandle: string;
  requesterAvatarUrl?: string;
  recipientId: string;
  recipientHandle: string;
}) {
  if (input.requesterId === input.recipientId) return;

  const existing = await prisma.notification.findFirst({
    where: {
      userId: input.recipientId,
      actionType: "friend_request",
      actionRefId: input.requestId,
    },
    select: { id: true },
  });
  if (existing) return;

  await createNotification({
    userId: input.recipientId,
    title: "Friend Request",
    category: "Friend Request",
    description: `${input.requesterName} sent you a friend request.`,
    imageUrl: input.requesterAvatarUrl,
    href: `/profile/${input.requesterHandle}`,
    actionType: "friend_request",
    actionRefId: input.requestId,
  });
}

export async function notifyFriendRequestAccepted(input: {
  accepterId: string;
  accepterName: string;
  accepterHandle: string;
  requesterId: string;
}) {
  if (input.accepterId === input.requesterId) return;

  await createNotification({
    userId: input.requesterId,
    title: "Friend Request Accepted",
    category: "Friend Request Accepted",
    description: `${input.accepterName} accepted your friend request. You can now message each other.`,
    href: `/profile/${input.accepterHandle}`,
  });
}

/** Create notifications for pending friend requests that pre-date notification delivery fixes. */
export async function backfillFriendRequestNotifications() {
  const pending = await prisma.friendRequest.findMany({
    where: { status: "PENDING" },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarUrl: true,
        },
      },
      recipient: { select: { id: true } },
    },
  });

  for (const request of pending) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: request.recipient.id,
        actionType: "friend_request",
        actionRefId: request.id,
      },
      select: { id: true },
    });
    if (existing) continue;

    await notifyFriendRequest({
      requestId: request.id,
      requesterId: request.requester.id,
      requesterName: request.requester.name,
      requesterHandle: request.requester.handle,
      requesterAvatarUrl: request.requester.avatarUrl ?? undefined,
      recipientId: request.recipient.id,
      recipientHandle: "",
    });
  }
}

/** @deprecated Instant follow — replaced by friend request flow. */
export async function notifyUserFollow(input: {
  followerId: string;
  followerName: string;
  followingId: string;
  followingHandle: string;
}) {
  if (input.followerId === input.followingId) return;
  if (!(await shouldNotifyUser(input.followingId, "Social"))) return;

  await createNotification({
    userId: input.followingId,
    title: "New Friend",
    category: "Social",
    description: `${input.followerName} added you as a friend.`,
    href: `/profile/${input.followingHandle}`,
  });
}

export async function notifyReviewPublished(input: {
  userId: string;
  targetLabel: string;
  href: string;
  imageUrl?: string;
  headline?: string;
}) {
  await createNotificationIfAllowed({
    userId: input.userId,
    title: "Review Published",
    description: input.headline
      ? `Your review “${input.headline}” for ${input.targetLabel} is now live.`
      : `Your review for ${input.targetLabel} is now live.`,
    imageUrl: input.imageUrl,
    href: input.href,
  });
}
