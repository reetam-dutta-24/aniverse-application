import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  addCollectionItem,
  CollectionNotFoundError,
} from "@/lib/services/collection.service";
import { collectionItemFormSchema } from "@/lib/validators/collection";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = collectionItemFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const item = await addCollectionItem(auth.userId, slug, parsed.data);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof CollectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[collection items POST]", error);
    return NextResponse.json(
      { error: "Could not add collection item." },
      { status: 500 },
    );
  }
}
