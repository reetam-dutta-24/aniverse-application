import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  isLikeNotFound,
  LikeNotFoundError,
  toggleCommunityPostLike,
} from "@/lib/services/like.service";

interface RouteContext {
  params: Promise<{ slug: string; postId: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, postId } = await context.params;

  try {
    const result = await toggleCommunityPostLike(auth.userId, slug, postId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LikeNotFoundError || isLikeNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[post like POST]", error);
    return NextResponse.json(
      { error: "Could not update like." },
      { status: 500 },
    );
  }
}
