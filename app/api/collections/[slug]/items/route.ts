import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  addCollectionItem,
  CollectionItemDuplicateError,
  CollectionNotFoundError,
  isCollectionItemDuplicate,
} from "@/lib/services/collection.service";
import {
  formatEngagementCount,
  getContentEngagementStats,
  getContentRecordBySlug,
} from "@/lib/services/content.service";
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

    let collections: number | undefined;
    if (parsed.data.contentSlug) {
      const record = await getContentRecordBySlug(parsed.data.contentSlug);
      if (record) {
        collections = (await getContentEngagementStats(record.id)).collections;
      }
    }

    return NextResponse.json(
      {
        item,
        ...(collections != null
          ? {
              collections,
              formattedCollections: formatEngagementCount(collections),
            }
          : {}),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CollectionNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (isCollectionItemDuplicate(error)) {
      return NextResponse.json(
        { error: (error as CollectionItemDuplicateError).message },
        { status: 409 },
      );
    }
    console.error("[collection items POST]", error);
    return NextResponse.json(
      { error: "Could not add collection item." },
      { status: 500 },
    );
  }
}
