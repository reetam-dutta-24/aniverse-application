import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  isLikeNotFound,
  LikeNotFoundError,
  toggleReviewLike,
} from "@/lib/services/like.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const result = await toggleReviewLike(auth.userId, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LikeNotFoundError || isLikeNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[review like POST]", error);
    return NextResponse.json(
      { error: "Could not update like." },
      { status: 500 },
    );
  }
}
