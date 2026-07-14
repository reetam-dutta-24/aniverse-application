import type { OnboardingRecommendations, OnboardingSelection } from "@/lib/data/onboarding";

const STORAGE_KEY = "aniverse-onboarding";

export interface SavedOnboardingProfile {
  selection: OnboardingSelection;
  recommendations: Pick<
    OnboardingRecommendations,
    "tasteScore" | "tasteBreakdown" | "summaryChips" | "goalLinks"
  >;
  completedAt: string;
}

export function saveOnboardingProfile(
  selection: OnboardingSelection,
  recommendations: OnboardingRecommendations,
) {
  if (typeof window === "undefined") return;
  const payload: SavedOnboardingProfile = {
    selection,
    recommendations: {
      tasteScore: recommendations.tasteScore,
      tasteBreakdown: recommendations.tasteBreakdown,
      summaryChips: recommendations.summaryChips,
      goalLinks: recommendations.goalLinks,
    },
    completedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getOnboardingProfile(): SavedOnboardingProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedOnboardingProfile;
  } catch {
    return null;
  }
}

export function clearOnboardingProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
