import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import {
  deleteCommunityVoiceChannel,
  joinCommunityVoiceChannel,
  leaveCommunityVoiceChannel,
  updateCommunityVoiceChannel,
} from "@/lib/services/community-channel.service";
import { voiceChannelUpdateSchema } from "@/lib/validators/community";

interface RouteContext {
  params: Promise<{ slug: string; channelId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, channelId } = await context.params;

  try {
    const body = await request.json();
    const parsed = voiceChannelUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const channel = await updateCommunityVoiceChannel(
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
    console.error("[voice-channel PATCH]", error);
    return NextResponse.json({ error: "Could not update voice channel." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, channelId } = await context.params;

  try {
    await deleteCommunityVoiceChannel(auth.userId, slug, channelId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[voice-channel DELETE]", error);
    return NextResponse.json({ error: "Could not delete voice channel." }, { status: 500 });
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
      const channels = await leaveCommunityVoiceChannel(auth.userId, slug, channelId);
      return NextResponse.json({ channels });
    }

    const channels = await joinCommunityVoiceChannel(auth.userId, slug, channelId);
    return NextResponse.json({ channels });
  } catch (error) {
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[voice-channel POST]", error);
    return NextResponse.json({ error: "Could not update voice channel membership." }, { status: 500 });
  }
}
