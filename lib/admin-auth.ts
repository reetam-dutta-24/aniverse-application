import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPlatformAdmin } from "@/lib/platform-roles";
import { getUserById } from "@/lib/services/user.service";

/** Verify the caller is a platform admin. Returns null when authorized. */
export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isPlatformAdmin(session.user.role)) {
    return null;
  }

  const user = await getUserById(session.user.id);
  if (user && isPlatformAdmin(user.role)) {
    return null;
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
