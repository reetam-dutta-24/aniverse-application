import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/services/onboarding.service";

/** GET /api/auth/redirect-destination — used after login to pick dashboard vs onboarding. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ destination: "/login" }, { status: 401 });
  }

  const destination = await getPostAuthPath(session.user.id);
  if (destination === null) {
    return NextResponse.json({ destination: "/login", stale: true }, { status: 401 });
  }
  return NextResponse.json({ destination });
}
