import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapWatchlistItemToContent } from "@/lib/mappers/watchlist.mapper";
import {
  removeWatchlistItem,
  updateWatchlistItem,
  WatchlistNotFoundError,
} from "@/lib/services/watchlist.service";
import { watchlistUpdateSchema } from "@/lib/validators/watchlist";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = watchlistUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const row = await updateWatchlistItem(auth.userId, id, parsed.data);
    return NextResponse.json({ item: mapWatchlistItemToContent(row) });
  } catch (error) {
    if (error instanceof WatchlistNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[watchlist PATCH]", error);
    return NextResponse.json(
      { error: "Could not update watchlist item." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    await removeWatchlistItem(auth.userId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof WatchlistNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[watchlist DELETE]", error);
    return NextResponse.json(
      { error: "Could not remove watchlist item." },
      { status: 500 },
    );
  }
}
