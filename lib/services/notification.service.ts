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
  category?: string;
  description?: string;
  imageUrl?: string;
  href?: string;
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
      read: input.read ?? false,
      createdAt: input.createdAt,
    },
  });
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

  await prisma.notification.createMany({
    data: members.map((member) => ({
      userId: member.userId,
      title: "New Community Post",
      category: "Community",
      description: `${post.authorName} posted in ${community.name}: “${post.title}”`,
      imageUrl: community.imageUrl,
      href: `/community/${community.slug}/dashboard/posts`,
    })),
  });
}

export async function notifyReviewPublished(input: {
  userId: string;
  targetLabel: string;
  href: string;
  imageUrl?: string;
  headline?: string;
}) {
  await createNotification({
    userId: input.userId,
    title: "Review Published",
    category: "Community",
    description: input.headline
      ? `Your review “${input.headline}” for ${input.targetLabel} is now live.`
      : `Your review for ${input.targetLabel} is now live.`,
    imageUrl: input.imageUrl,
    href: input.href,
  });
}
