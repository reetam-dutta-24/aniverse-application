import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  FavoriteNotFoundError,
  toggleArtistFavorite,
} from "@/lib/services/favorite.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const result = await toggleArtistFavorite(auth.userId, slug);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof FavoriteNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[artist favorite POST]", error);
    return NextResponse.json(
      { error: "Could not update favourites." },
      { status: 500 },
    );
  }
}
