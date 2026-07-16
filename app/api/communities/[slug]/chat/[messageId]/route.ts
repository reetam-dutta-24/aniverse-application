import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { broadcastChatMessage, broadcastChatDeleted } from "@/lib/socket/broadcast-chat";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
} from "@/lib/services/community.service";
import {
  deleteCommunityChatMessage,
  updateCommunityChatMessage,
} from "@/lib/services/community-chat.service";
import { communityChatUpdateSchema } from "@/lib/validators/community-chat";

interface RouteContext {
  params: Promise<{ slug: string; messageId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, messageId } = await context.params;

  try {
    const body = await request.json();
    const parsed = communityChatUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const { message, channel } = await updateCommunityChatMessage(
      auth.userId,
      slug,
      messageId,
      parsed.data,
    );

    broadcastChatMessage(slug, channel, message);

    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community chat PATCH]", error);
    return NextResponse.json(
      { error: "Could not update message." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, messageId } = await context.params;

  try {
    const { id, channel } = await deleteCommunityChatMessage(
      auth.userId,
      slug,
      messageId,
    );

    broadcastChatDeleted(slug, channel, id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community chat DELETE]", error);
    return NextResponse.json(
      { error: "Could not delete message." },
      { status: 500 },
    );
  }
}
