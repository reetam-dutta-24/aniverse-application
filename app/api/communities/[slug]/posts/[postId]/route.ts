import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapCommunityPost } from "@/lib/mappers/community.mapper";
import {
  CommunityNotFoundError,
  deleteCommunityPost,
  updateCommunityPost,
} from "@/lib/services/community.service";
import { communityPostUpdateSchema } from "@/lib/validators/community";

interface RouteContext {
  params: Promise<{ slug: string; postId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, postId } = await context.params;

  try {
    const body = await request.json();
    const parsed = communityPostUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const post = await updateCommunityPost(auth.userId, slug, postId, parsed.data);
    return NextResponse.json({ post: mapCommunityPost(post) });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[community post PATCH]", error);
    return NextResponse.json({ error: "Could not update post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, postId } = await context.params;

  try {
    await deleteCommunityPost(auth.userId, slug, postId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[community post DELETE]", error);
    return NextResponse.json({ error: "Could not delete post." }, { status: 500 });
  }
}
