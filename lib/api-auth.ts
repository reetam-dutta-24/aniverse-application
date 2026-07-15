import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/** Require a logged-in user for API routes — returns 401 JSON if missing. */
export async function requireUserApi(): Promise<
  | { userId: string; error?: undefined }
  | { userId?: undefined; error: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }
  return { userId: session.user.id };
}
