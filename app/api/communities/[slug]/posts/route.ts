import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapCommunityPost } from "@/lib/mappers/community.mapper";
import {
  CommunityForbiddenError,
  CommunityNotFoundError,
  createCommunityPost,
  listCommunityPosts,
} from "@/lib/services/community.service";
import { communityPostFormSchema } from "@/lib/validators/community";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const posts = await listCommunityPosts(slug, 24);
    return NextResponse.json({ posts: posts.map(mapCommunityPost) });
  } catch (error) {
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[community posts GET]", error);
    return NextResponse.json(
      { error: "Could not load posts." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = communityPostFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const post = await createCommunityPost(auth.userId, slug, parsed.data);
    return NextResponse.json({ post: mapCommunityPost(post) }, { status: 201 });
  } catch (error) {
    if (error instanceof CommunityForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof CommunityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[community posts POST]", error);
    return NextResponse.json({ error: "Could not create post." }, { status: 500 });
  }
}
