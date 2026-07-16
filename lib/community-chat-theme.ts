import type { CSSProperties } from "react";
import type { AccentColor } from "@/lib/catalog-enums";
import { getPlayAccentTheme, type PlayAccentTheme } from "@/lib/play-ambient";

export interface CommunityChatTheme {
  accent: PlayAccentTheme;
  bubbleOwn: CSSProperties;
  bubbleOther: CSSProperties;
  composer: CSSProperties;
  composerButton: CSSProperties;
  panelAmbient: CSSProperties;
  footer: CSSProperties;
  emptyState: CSSProperties;
  accentText: string;
  bodyText: string;
  mutedText: string;
}

export function getCommunityChatTheme(
  accent?: AccentColor | string,
): CommunityChatTheme {
  const t = getPlayAccentTheme(accent);
  const [r, g, b] = t.rgb;

  return {
    accent: t,
    bubbleOwn: {
      background: t.gradient,
      border: `1px solid rgba(${r},${g},${b},0.45)`,
      boxShadow: `${t.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
    },
    bubbleOther: {
      background: `linear-gradient(145deg, rgba(14,11,24,0.82) 0%, rgba(${r},${g},${b},0.16) 100%)`,
      border: `1px solid ${t.border}`,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.07), 0 6px 20px rgba(0,0,0,0.28)",
    },
    composer: {
      background: `linear-gradient(135deg, rgba(14,11,24,0.78) 0%, rgba(${r},${g},${b},0.14) 100%)`,
      border: `1px solid ${t.border}`,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
    },
    composerButton: {
      background: t.gradient,
      border: `1px solid rgba(${r},${g},${b},0.4)`,
      boxShadow: t.glow,
    },
    panelAmbient: {
      background: `radial-gradient(ellipse 90% 55% at 50% -10%, rgba(${r},${g},${b},0.18) 0%, transparent 72%)`,
    },
    footer: {
      borderTop: `1px solid ${t.border}`,
      background: `linear-gradient(180deg, rgba(14,11,24,0.55) 0%, rgba(${r},${g},${b},0.1) 100%)`,
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
    },
    emptyState: {
      background: `rgba(14,11,24,0.55)`,
      border: `1px solid ${t.border}`,
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
    accentText: t.primary,
    bodyText: "rgba(255,255,255,0.96)",
    mutedText: "rgba(255,255,255,0.68)",
  };
}
