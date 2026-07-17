import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  ArtistFollowNotFoundError,
  toggleArtistFollow,
} from "@/lib/services/artist-follow.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const result = await toggleArtistFollow(auth.userId, slug);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ArtistFollowNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[artist follow POST]", error);
    return NextResponse.json(
      { error: "Could not update follow status." },
      { status: 500 },
    );
  }
}
