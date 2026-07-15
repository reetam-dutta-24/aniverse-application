import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import {
  CollectionConflictError,
  createCollection,
  getCollectionStatsForUser,
  isCollectionConflict,
  listCollectionsForUser,
  listMostLikedCollections,
  listPublicCollections,
  listRecentlyUpdatedCollections,
} from "@/lib/services/collection.service";
import { collectionFormSchema } from "@/lib/validators/collection";

export async function GET(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") ?? "mine";

  if (scope === "public") {
    const collections = await listPublicCollections(24);
    return NextResponse.json({ collections });
  }
  if (scope === "liked") {
    const collections = await listMostLikedCollections(auth.userId, 16);
    return NextResponse.json({ collections });
  }
  if (scope === "recent") {
    const collections = await listRecentlyUpdatedCollections(auth.userId, 18);
    return NextResponse.json({ collections });
  }

  const [stats, collections] = await Promise.all([
    getCollectionStatsForUser(auth.userId),
    listCollectionsForUser(auth.userId),
  ]);

  return NextResponse.json({ stats, collections });
}

export async function POST(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = collectionFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const row = await createCollection(auth.userId, parsed.data);
    return NextResponse.json(
      { collection: mapCollectionToCard(row) },
      { status: 201 },
    );
  } catch (error) {
    if (isCollectionConflict(error)) {
      return NextResponse.json(
        { error: new CollectionConflictError().message },
        { status: 409 },
      );
    }
    console.error("[collections POST]", error);
    return NextResponse.json(
      { error: "Could not create collection." },
      { status: 500 },
    );
  }
}
