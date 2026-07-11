import type { CSSProperties } from "react";

/** Shared theming for AniVerse analytics charts. */

export const chartColors = [
  "#ff00cc",
  "#ae00ff",
  "#2563eb",
  "#2dd4bf",
  "#e5ff00",
  "#00ff8c",
] as const;

export const chartGrid = "rgba(248, 234, 255, 0.12)";
export const chartAxis = "rgba(248, 234, 255, 0.65)";

export const chartTooltipStyle: CSSProperties = {
  backgroundColor: "#120826",
  border: "1px solid #ff00cc",
  borderRadius: 12,
  color: "#ffffff",
};
