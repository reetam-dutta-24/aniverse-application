import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import {
  createCommunityWatchChannel,
  listCommunityWatchChannels,
} from "@/lib/services/community-channel.service";
import { watchChannelFormSchema } from "@/lib/validators/community";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const channels = await listCommunityWatchChannels(slug);
    return NextResponse.json({ channels });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[watch-channels GET]", error);
    return NextResponse.json({ error: "Could not load watch channels." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = watchChannelFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const channel = await createCommunityWatchChannel(
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
    console.error("[watch-channels POST]", error);
    return NextResponse.json({ error: "Could not create watch channel." }, { status: 500 });
  }
}
