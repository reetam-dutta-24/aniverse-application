import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding";
import { requireIncompleteOnboarding } from "@/lib/auth-guards";
import { getUserById } from "@/lib/services/user.service";

export const metadata: Metadata = {
  title: "Set Up Your Universe — AniVerse",
  description:
    "Tell AniVerse your taste — genres, content, and music — and get instant AI-matched recommendations.",
};

export default async function OnboardingPage() {
  const userId = await requireIncompleteOnboarding();
  const user = await getUserById(userId);
  const userName = user?.name ?? "there";

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-[#0a0416] px-4 py-8 sm:px-6">
      <header className="flex w-full max-w-[1100px] items-center justify-center pb-8 sm:pb-10">
        <span className="text-gradient-brand text-2xl font-semibold">
          AniVerse
        </span>
      </header>
      <OnboardingFlow userName={userName} />
    </main>
  );
}
