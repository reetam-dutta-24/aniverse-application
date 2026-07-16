import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  chatChannelToPrisma,
  type CommunityChatChannelId,
} from "@/lib/community-chat";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import { listCommunityChatMessages } from "@/lib/services/community-chat.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

function parseChannel(value: string | null): CommunityChatChannelId | null {
  if (value === "general" || value === "anime") return value;
  return null;
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const channel = parseChannel(searchParams.get("channel"));

  if (!channel) {
    return NextResponse.json(
      { error: "Query param channel must be general or anime." },
      { status: 400 },
    );
  }

  const session = await auth();

  try {
    const messages = await listCommunityChatMessages(
      slug,
      chatChannelToPrisma(channel),
      session?.user?.id,
    );
    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community chat GET]", error);
    return NextResponse.json(
      { error: "Could not load chat messages." },
      { status: 500 },
    );
  }
}
