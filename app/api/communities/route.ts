import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapCommunityToCard } from "@/lib/mappers/community.mapper";
import {
  CommunityConflictError,
  createCommunity,
  getCommunityStatsForUser,
  isCommunityConflict,
  listJoinedCommunities,
  listMostActiveCommunities,
  listPublicCommunities,
  listRecommendedCommunities,
} from "@/lib/services/community.service";
import { communityFormSchema } from "@/lib/validators/community";

export async function GET(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") ?? "joined";

  if (scope === "public") {
    const communities = await listPublicCommunities(24);
    return NextResponse.json({ communities });
  }
  if (scope === "recommended") {
    const communities = await listRecommendedCommunities(auth.userId, 12);
    return NextResponse.json({ communities });
  }
  if (scope === "active") {
    const communities = await listMostActiveCommunities(auth.userId, 12);
    return NextResponse.json({ communities });
  }

  const [stats, communities] = await Promise.all([
    getCommunityStatsForUser(auth.userId),
    listJoinedCommunities(auth.userId),
  ]);

  return NextResponse.json({ stats, communities });
}

export async function POST(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = communityFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const row = await createCommunity(auth.userId, parsed.data);
    if (!row) {
      return NextResponse.json(
        { error: "Could not create community." },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { community: mapCommunityToCard(row) },
      { status: 201 },
    );
  } catch (error) {
    if (isCommunityConflict(error)) {
      return NextResponse.json(
        { error: new CommunityConflictError().message },
        { status: 409 },
      );
    }
    console.error("[communities POST]", error);
    return NextResponse.json(
      { error: "Could not create community." },
      { status: 500 },
    );
  }
}
