import type { AccentColor } from "@/lib/catalog-enums";
import { getAccentTint, getTintRgb } from "@/lib/card-theme";

export interface PlayAccentTheme {
  rgb: [number, number, number];
  glass: string;
  primary: string;
  primaryMuted: string;
  gradient: string;
  gradientSoft: string;
  glow: string;
  border: string;
  slider: string;
  panelBg: string;
  activeRow: string;
}

export function getPlayAccentTheme(accent?: AccentColor | string): PlayAccentTheme {
  const tint = getAccentTint(accent);
  const [r, g, b] = getTintRgb(tint.glass);
  const r2 = Math.min(255, r + 32);
  const g2 = Math.min(255, g + 20);
  const b2 = Math.min(255, b + 48);

  return {
    rgb: [r, g, b],
    glass: tint.glass,
    primary: `rgb(${r},${g},${b})`,
    primaryMuted: `rgba(${r},${g},${b},0.75)`,
    gradient: `linear-gradient(135deg, rgb(${r},${g},${b}) 0%, rgb(${r2},${g2},${b2}) 100%)`,
    gradientSoft: `rgba(${r},${g},${b},0.22)`,
    glow: `0 4px 18px rgba(${r},${g},${b},0.28)`,
    border: `rgba(${r},${g},${b},0.28)`,
    slider: `rgb(${r},${g},${b})`,
    panelBg: "#100d1a",
    activeRow: `rgba(${r},${g},${b},0.12)`,
  };
}

export function getPlayAmbientLayers(accent?: AccentColor | string) {
  const theme = getPlayAccentTheme(accent);
  const [r, g, b] = theme.rgb;

  return {
    theme,
    solidGradient: `linear-gradient(180deg, rgba(${r},${g},${b},0.48) 0%, rgba(${r},${g},${b},0.2) 22%, rgba(14,10,22,0.96) 58%, rgba(9,7,15,1) 100%)`,
    baseFill: "rgba(9,7,15,0.35)",
  };
}
