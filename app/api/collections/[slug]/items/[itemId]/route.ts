import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CollectionNotFoundError,
  removeCollectionItem,
} from "@/lib/services/collection.service";

interface RouteContext {
  params: Promise<{ slug: string; itemId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug, itemId } = await context.params;

  try {
    await removeCollectionItem(auth.userId, slug, itemId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CollectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[collection item DELETE]", error);
    return NextResponse.json(
      { error: "Could not remove collection item." },
      { status: 500 },
    );
  }
}
