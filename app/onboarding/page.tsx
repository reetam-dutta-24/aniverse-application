import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding";
import { requireOnboardingAccess } from "@/lib/auth-guards";
import { isOnboardingRetake } from "@/lib/onboarding-routes";
import { getUserById } from "@/lib/services/user.service";

export const metadata: Metadata = {
  title: "Set Up Your Universe — AniVerse",
  description:
    "Tell AniVerse your taste — genres, content, and music — and get instant AI-matched recommendations.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const userId = await requireOnboardingAccess();
  const user = await getUserById(userId);
  const userName = user?.name ?? "there";
  const params = await searchParams;
  const isRetake = isOnboardingRetake(params);

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-[#0a0416] px-4 py-8 sm:px-6">
      <header className="flex w-full max-w-[1100px] items-center justify-center pb-8 sm:pb-10">
        <span className="text-gradient-brand text-2xl font-semibold">
          AniVerse
        </span>
      </header>
      <OnboardingFlow
        userId={userId}
        userName={userName}
        isRetake={isRetake}
      />
    </main>
  );
}
