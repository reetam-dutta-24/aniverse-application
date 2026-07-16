import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/data/user";
import {
  getUserProfileByHandle,
  UserProfileNotFoundError,
  UserProfilePrivateError,
} from "@/lib/services/user-profile.service";

interface RouteContext {
  params: Promise<{ handle: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { handle } = await context.params;
  const viewer = await getOptionalUser();

  try {
    const profile = await getUserProfileByHandle(handle, viewer?.id);
    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof UserProfilePrivateError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof UserProfileNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[users GET]", error);
    return NextResponse.json(
      { error: "Could not load user profile." },
      { status: 500 },
    );
  }
}
