import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapNotificationRow } from "@/lib/mappers/notification.mapper";
import {
  countUnreadNotificationsForUser,
  listNotificationsForUser,
  markAllNotificationsReadForUser,
} from "@/lib/services/notification.service";

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const [rows, unreadCount] = await Promise.all([
      listNotificationsForUser(auth.userId),
      countUnreadNotificationsForUser(auth.userId),
    ]);

    return NextResponse.json({
      notifications: rows.map((row) => mapNotificationRow(row)),
      unreadCount,
    });
  } catch (error) {
    console.error("[notifications GET]", error);
    return NextResponse.json(
      { error: "Could not load notifications." },
      { status: 500 },
    );
  }
}

export async function POST() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    await markAllNotificationsReadForUser(auth.userId);
    const rows = await listNotificationsForUser(auth.userId);
    return NextResponse.json({
      notifications: rows.map((row) => mapNotificationRow(row)),
      unreadCount: 0,
    });
  } catch (error) {
    console.error("[notifications read-all POST]", error);
    return NextResponse.json(
      { error: "Could not mark notifications as read." },
      { status: 500 },
    );
  }
}
