import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { completeOnboarding } from "@/lib/services/onboarding.service";

/**
 * POST /api/onboarding/complete
 * Called when the user finishes or skips onboarding.
 * Sets onboardingCompletedAt so future logins go straight to dashboard.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      tasteScore?: number;
    };

    await completeOnboarding(session.user.id, body.tasteScore);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[onboarding/complete]", error);
    return NextResponse.json(
      { error: "Could not save onboarding progress." },
      { status: 500 },
    );
  }
}
