import type { AccentColor } from "@/types";

/**
 * Maps an accent color to the utility classes that implement it:
 * radial header gradient, outer glow, and hover glow (Figma card variants).
 */
export const accentStyles: Record<
  AccentColor,
  { header: string; glow: string; hoverGlow: string }
> = {
  pink: {
    header: "bg-header-pink",
    glow: "shadow-glow-pink",
    hoverGlow: "hover:shadow-glow-pink",
  },
  purple: {
    header: "bg-header-purple",
    glow: "shadow-glow-purple",
    hoverGlow: "hover:shadow-glow-purple",
  },
  cyan: {
    header: "bg-header-cyan",
    glow: "shadow-glow-cyan",
    hoverGlow: "hover:shadow-glow-cyan",
  },
  blue: {
    header: "bg-header-blue",
    glow: "shadow-glow-blue",
    hoverGlow: "hover:shadow-glow-blue",
  },
  green: {
    header: "bg-header-green",
    glow: "shadow-glow-green",
    hoverGlow: "hover:shadow-glow-green",
  },
  yellow: {
    header: "bg-header-yellow",
    glow: "shadow-glow-yellow",
    hoverGlow: "hover:shadow-glow-yellow",
  },
};

/** Cycle of avatar circle colors from the Figma avatar stack. */
export const avatarColors = ["#ff00cc", "#e5ff00", "#00ff8c"] as const;
