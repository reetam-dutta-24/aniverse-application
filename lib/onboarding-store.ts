import type { OnboardingRecommendations, OnboardingSelection } from "@/lib/data/onboarding";

const LEGACY_STORAGE_KEY = "aniverse-onboarding";

function storageKey(userId: string) {
  return `aniverse-onboarding-${userId}`;
}

export interface SavedOnboardingProfile {
  selection: OnboardingSelection;
  recommendations: Pick<
    OnboardingRecommendations,
    "tasteScore" | "tasteBreakdown" | "summaryChips" | "goalLinks"
  >;
  completedAt: string;
}

/** Remove pre-user-scoping key so new accounts never inherit another user's picks. */
export function clearLegacyOnboardingProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function saveOnboardingProfile(
  userId: string,
  selection: OnboardingSelection,
  recommendations: OnboardingRecommendations,
) {
  if (typeof window === "undefined" || !userId) return;
  clearLegacyOnboardingProfile();
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
  window.localStorage.setItem(storageKey(userId), JSON.stringify(payload));
}

export function getOnboardingProfile(
  userId: string | undefined,
): SavedOnboardingProfile | null {
  if (typeof window === "undefined" || !userId) return null;
  const raw = window.localStorage.getItem(storageKey(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedOnboardingProfile;
  } catch {
    return null;
  }
}

/** One-time migration for pre-user-scoping local cache (retake flow only). */
export function getOnboardingProfileWithLegacyMigration(
  userId: string,
): SavedOnboardingProfile | null {
  const scoped = getOnboardingProfile(userId);
  if (scoped) return scoped;

  if (typeof window === "undefined") return null;
  const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacyRaw) return null;

  try {
    const legacy = JSON.parse(legacyRaw) as SavedOnboardingProfile;
    window.localStorage.setItem(storageKey(userId), legacyRaw);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return legacy;
  } catch {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return null;
  }
}

export function clearOnboardingProfile(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(userId));
}
