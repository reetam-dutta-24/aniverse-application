import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import {
  createCommunityVoiceChannel,
  listCommunityVoiceChannels,
} from "@/lib/services/community-channel.service";
import { voiceChannelFormSchema } from "@/lib/validators/community";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const channels = await listCommunityVoiceChannels(slug);
    return NextResponse.json({ channels });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[voice-channels GET]", error);
    return NextResponse.json({ error: "Could not load voice channels." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = voiceChannelFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const channel = await createCommunityVoiceChannel(
      auth.userId,
      slug,
      parsed.data,
    );
    return NextResponse.json({ channel }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[voice-channels POST]", error);
    return NextResponse.json({ error: "Could not create voice channel." }, { status: 500 });
  }
}
