import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CollectionFollowForbiddenError,
  CollectionFollowNotFoundError,
  toggleCollectionFollow,
} from "@/lib/services/collection-follow.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const result = await toggleCollectionFollow(auth.userId, slug);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CollectionFollowNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CollectionFollowForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[collection follow POST]", error);
    return NextResponse.json(
      { error: "Could not update follow status." },
      { status: 500 },
    );
  }
}
