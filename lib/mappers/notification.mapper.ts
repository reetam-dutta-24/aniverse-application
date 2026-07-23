import type { Notification } from "@prisma/client";
import { formatRelativeTime } from "@/lib/format-dates";
import type { AppNotification } from "@/types";

export function mapNotificationRow(row: Notification): AppNotification {
  return {
    id: row.id,
    title: row.title,
    category: row.category ?? undefined,
    description: row.description ?? undefined,
    createdAt: formatRelativeTime(row.createdAt),
    read: row.read,
    imageUrl: row.imageUrl ?? undefined,
    href: row.href ?? undefined,
    actionType: row.actionType ?? undefined,
    actionRefId: row.actionRefId ?? undefined,
  };
}
