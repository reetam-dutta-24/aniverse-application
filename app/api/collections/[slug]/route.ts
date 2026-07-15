import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireUserApi } from "@/lib/api-auth";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import {
  CollectionNotFoundError,
  deleteCollection,
  getCollectionDetailBySlug,
  updateCollection,
} from "@/lib/services/collection.service";
import { collectionUpdateSchema } from "@/lib/validators/collection";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const session = await auth();
  const detail = await getCollectionDetailBySlug(slug, session?.user?.id);
  if (!detail) {
    return NextResponse.json({ error: "Collection not found." }, { status: 404 });
  }
  return NextResponse.json({ collection: detail });
}

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireUserApi();
  if (authResult.error) return authResult.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = collectionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const row = await updateCollection(authResult.userId, slug, parsed.data);
    return NextResponse.json({ collection: mapCollectionToCard(row) });
  } catch (error) {
    if (error instanceof CollectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[collections PATCH]", error);
    return NextResponse.json(
      { error: "Could not update collection." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireUserApi();
  if (authResult.error) return authResult.error;

  const { slug } = await context.params;

  try {
    await deleteCollection(authResult.userId, slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CollectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[collections DELETE]", error);
    return NextResponse.json(
      { error: "Could not delete collection." },
      { status: 500 },
    );
  }
}
