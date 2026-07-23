import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
  removeCommunityMember,
  updateCommunityMemberRole,
} from "@/lib/services/community.service";

const roleSchema = z.object({
  role: z.enum(["moderator", "member"]),
});

interface RouteContext {
  params: Promise<{ slug: string; userId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, userId } = await context.params;

  try {
    const body = await request.json();
    const parsed = roleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    await updateCommunityMemberRole(
      auth.userId,
      slug,
      userId,
      parsed.data.role === "moderator" ? "MODERATOR" : "MEMBER",
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community member PATCH]", error);
    return NextResponse.json(
      { error: "Could not update member role." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, userId } = await context.params;

  try {
    await removeCommunityMember(auth.userId, slug, userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community member DELETE]", error);
    return NextResponse.json(
      { error: "Could not remove member." },
      { status: 500 },
    );
  }
}
