/** Logged-in users retake the taste test from dashboard/settings. */
export const ONBOARDING_RETAKE_PATH = "/onboarding?retake=1";

export function isOnboardingRetake(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  const value = searchParams.retake;
  if (Array.isArray(value)) return value[0] === "1" || value[0] === "true";
  return value === "1" || value === "true";
}
