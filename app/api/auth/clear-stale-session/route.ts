import type { NextRequest } from "next/server";
import { signOut } from "@/lib/auth";

/**
 * GET /api/auth/clear-stale-session
 * Signs out JWT sessions whose user id no longer exists in the database.
 * Must run in a Route Handler so auth cookies can be cleared safely.
 */
export async function GET(request: NextRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") ?? "/";
  return signOut({ redirectTo: callbackUrl });
}
