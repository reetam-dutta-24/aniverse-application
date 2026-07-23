import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
  getCommunityJoinCodeStatus,
  regenerateCommunityJoinCode,
} from "@/lib/services/community.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;
  const status = await getCommunityJoinCodeStatus(auth.userId, slug);
  if (!status) {
    return NextResponse.json({ error: "Community not found." }, { status: 404 });
  }
  return NextResponse.json(status);
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const result = await regenerateCommunityJoinCode(auth.userId, slug);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[community join-code POST]", error);
    return NextResponse.json(
      { error: "Could not regenerate room code." },
      { status: 500 },
    );
  }
}
