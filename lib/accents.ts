import type { AccentColor } from "@/lib/catalog-enums";
import { ACCENT_OPTIONS } from "@/lib/catalog-enums";

const HEADER_CLASS: Record<AccentColor, string> = {
  pink: "bg-header-pink",
  purple: "bg-header-purple",
  cyan: "bg-header-cyan",
  blue: "bg-header-blue",
  green: "bg-header-green",
  yellow: "bg-header-yellow",
  red: "bg-header-pink",
  orange: "bg-header-yellow",
  teal: "bg-header-cyan",
  indigo: "bg-header-blue",
  rose: "bg-header-pink",
  lime: "bg-header-green",
  amber: "bg-header-yellow",
  violet: "bg-header-purple",
  fuchsia: "bg-header-pink",
  sky: "bg-header-cyan",
  emerald: "bg-header-green",
};

const GLOW_CLASS: Record<AccentColor, string> = {
  pink: "shadow-glow-pink",
  purple: "shadow-glow-purple",
  cyan: "shadow-glow-cyan",
  blue: "shadow-glow-blue",
  green: "shadow-glow-green",
  yellow: "shadow-glow-yellow",
  red: "shadow-glow-pink",
  orange: "shadow-glow-yellow",
  teal: "shadow-glow-cyan",
  indigo: "shadow-glow-blue",
  rose: "shadow-glow-pink",
  lime: "shadow-glow-green",
  amber: "shadow-glow-yellow",
  violet: "shadow-glow-purple",
  fuchsia: "shadow-glow-pink",
  sky: "shadow-glow-cyan",
  emerald: "shadow-glow-green",
};

export const accentStyles: Record<
  AccentColor,
  { header: string; glow: string; hoverGlow: string }
> = Object.fromEntries(
  ACCENT_OPTIONS.map(({ value }) => [
    value,
    {
      header: HEADER_CLASS[value],
      glow: GLOW_CLASS[value],
      hoverGlow: `hover:${GLOW_CLASS[value]}`,
    },
  ]),
) as Record<AccentColor, { header: string; glow: string; hoverGlow: string }>;

export function getAccentStyle(accent?: string | null) {
  if (accent && accent in accentStyles) {
    return accentStyles[accent as AccentColor];
  }
  return accentStyles.blue;
}

export const avatarColors = ["#ff00cc", "#e5ff00", "#00ff8c"] as const;
