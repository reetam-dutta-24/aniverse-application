import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
  addFriendToCommunity,
} from "@/lib/services/community.service";

const addMemberSchema = z.object({
  userId: z.string().min(1),
});

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = addMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const result = await addFriendToCommunity(
      auth.userId,
      slug,
      parsed.data.userId,
    );
    return NextResponse.json({ ok: true, joined: result.joined }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community members POST]", error);
    return NextResponse.json(
      { error: "Could not add member." },
      { status: 500 },
    );
  }
}
