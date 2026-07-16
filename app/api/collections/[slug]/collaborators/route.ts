import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  addCollectionCollaborator,
  CollaboratorForbiddenError,
  CollaboratorNotFoundError,
  listCollectionCollaborators,
} from "@/lib/services/collection-collaborator.service";
import { z } from "zod";

const bodySchema = z.object({
  handle: z.string().trim().min(1, "Handle is required."),
});

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  try {
    const collaborators = await listCollectionCollaborators(slug);
    return NextResponse.json({ collaborators });
  } catch (error) {
    console.error("[collection collaborators GET]", error);
    return NextResponse.json(
      { error: "Could not load collaborators." },
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
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const result = await addCollectionCollaborator(
      auth.userId,
      slug,
      parsed.data.handle,
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (
      error instanceof CollaboratorNotFoundError ||
      error instanceof CollaboratorForbiddenError
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[collection collaborators POST]", error);
    return NextResponse.json(
      { error: "Could not add collaborator." },
      { status: 500 },
    );
  }
}
