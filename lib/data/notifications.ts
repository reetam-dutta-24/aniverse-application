import { mapNotificationRow } from "@/lib/mappers/notification.mapper";
import {
  countUnreadNotificationsForUser,
  listNotificationsForUser,
} from "@/lib/services/notification.service";
import type { AppNotification } from "@/types";

export async function getNotificationsForUser(
  userId: string,
): Promise<AppNotification[]> {
  const rows = await listNotificationsForUser(userId);
  return rows.map((row) => mapNotificationRow(row));
}

export async function getNotifications(): Promise<AppNotification[]> {
  return [];
}

export async function getUnreadNotificationCount(
  userId?: string,
): Promise<number> {
  if (!userId) return 0;
  return countUnreadNotificationsForUser(userId);
}
