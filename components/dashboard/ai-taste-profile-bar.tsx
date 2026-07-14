"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOnboardingProfile } from "@/lib/onboarding-store";

export interface AiTasteProfileBarProps {
  score: number;
}

/** AI taste profile summary — uses onboarding score when available. */
export function AiTasteProfileBar({ score: fallbackScore }: AiTasteProfileBarProps) {
  const router = useRouter();
  const [score, setScore] = useState(fallbackScore);

  useEffect(() => {
    const profile = getOnboardingProfile();
    if (profile?.recommendations.tasteScore) {
      setScore(profile.recommendations.tasteScore);
    }
  }, []);

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-glass-purple px-4 py-4 shadow-card-inner sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-sm font-normal text-white/90">Your AI Taste Profile</p>
        <p className="text-2xl font-bold text-white">{score}%</p>
      </div>
      <button
        type="button"
        onClick={() => router.push("/onboarding")}
        className="w-full cursor-pointer rounded-full border border-brand-magenta px-5 py-2 text-sm font-normal text-white transition-colors hover:bg-brand-magenta/15 sm:w-auto"
      >
        Retake Test
      </button>
    </section>
  );
}
