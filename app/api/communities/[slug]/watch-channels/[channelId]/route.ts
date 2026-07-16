import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import {
  deleteCommunityWatchChannel,
  joinCommunityWatchChannel,
  leaveCommunityWatchChannel,
  updateCommunityWatchChannel,
} from "@/lib/services/community-channel.service";
import { watchChannelUpdateSchema } from "@/lib/validators/community";

interface RouteContext {
  params: Promise<{ slug: string; channelId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, channelId } = await context.params;

  try {
    const body = await request.json();
    const parsed = watchChannelUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const channel = await updateCommunityWatchChannel(
      auth.userId,
      slug,
      channelId,
      parsed.data,
    );
    return NextResponse.json({ channel });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[watch-channel PATCH]", error);
    return NextResponse.json({ error: "Could not update watch channel." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, channelId } = await context.params;

  try {
    await deleteCommunityWatchChannel(auth.userId, slug, channelId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[watch-channel DELETE]", error);
    return NextResponse.json({ error: "Could not delete watch channel." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, channelId } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action : "join";

    if (action === "leave") {
      const channels = await leaveCommunityWatchChannel(auth.userId, slug, channelId);
      return NextResponse.json({ channels });
    }

    const channels = await joinCommunityWatchChannel(auth.userId, slug, channelId);
    return NextResponse.json({ channels });
  } catch (error) {
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[watch-channel POST]", error);
    return NextResponse.json({ error: "Could not update watch channel membership." }, { status: 500 });
  }
}
