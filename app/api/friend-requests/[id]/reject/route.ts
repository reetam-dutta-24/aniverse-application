import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  isFriendRequestForbidden,
  isFriendRequestNotFound,
  rejectFriendRequest,
} from "@/lib/services/follow.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const result = await rejectFriendRequest(id, auth.userId);
    return NextResponse.json(result);
  } catch (error) {
    if (isFriendRequestNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (isFriendRequestForbidden(error)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[friend-request reject POST]", error);
    return NextResponse.json(
      { error: "Could not decline friend request." },
      { status: 500 },
    );
  }
}
