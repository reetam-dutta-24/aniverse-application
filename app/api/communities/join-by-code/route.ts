import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
  joinCommunityByCode,
} from "@/lib/services/community.service";
import { joinCommunityByCodeSchema } from "@/lib/validators/community";

export async function POST(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = joinCommunityByCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid room code." },
        { status: 400 },
      );
    }

    const result = await joinCommunityByCode(auth.userId, parsed.data.joinCode);
    return NextResponse.json(
      {
        ok: true,
        slug: result.slug,
        joined: result.joined,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[communities join-by-code POST]", error);
    return NextResponse.json(
      { error: "Could not join with that room code." },
      { status: 500 },
    );
  }
}
