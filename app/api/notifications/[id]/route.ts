import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapNotificationRow } from "@/lib/mappers/notification.mapper";
import {
  isNotificationNotFound,
  markNotificationReadForUser,
} from "@/lib/services/notification.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const row = await markNotificationReadForUser(auth.userId, id);
    return NextResponse.json({ notification: mapNotificationRow(row) });
  } catch (error) {
    if (isNotificationNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[notifications PATCH]", error);
    return NextResponse.json(
      { error: "Could not update notification." },
      { status: 500 },
    );
  }
}
