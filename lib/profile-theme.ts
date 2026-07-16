import type { AccentColor } from "@/lib/catalog-enums";
import { ACCENT_OPTIONS } from "@/lib/catalog-enums";

/** Hex colors for the 17 catalog accent options — avatar + profile hero theme. */
export const ACCENT_HEX: Record<AccentColor, string> = {
  pink: "#ff00cc",
  purple: "#ae00ff",
  cyan: "#00e5ff",
  blue: "#2563eb",
  green: "#10b981",
  yellow: "#ffd000",
  red: "#ef4444",
  orange: "#f97316",
  teal: "#14b8a6",
  indigo: "#6366f1",
  rose: "#f43f5e",
  lime: "#84cc16",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  sky: "#0ea5e9",
  emerald: "#059669",
};

export const PROFILE_ACCENT_OPTIONS = ACCENT_OPTIONS.map((option) => ({
  ...option,
  hex: ACCENT_HEX[option.value],
}));

export function resolveProfileAccent(
  accent?: string | null,
  fallbackHex?: string,
): AccentColor {
  if (accent && accent in ACCENT_HEX) return accent as AccentColor;
  return "pink";
}

export function accentToAvatarColor(accent?: string | null, fallbackHex?: string): string {
  const resolved = resolveProfileAccent(accent);
  return ACCENT_HEX[resolved] ?? fallbackHex ?? ACCENT_HEX.pink;
}
