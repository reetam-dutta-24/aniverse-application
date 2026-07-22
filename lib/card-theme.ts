import type { AccentColor } from "@/lib/catalog-enums";
import { isAccentColor } from "@/lib/catalog-enums";

export interface CardTint {
  glass: string;
  header: string;
}

/** Wide palette — visually distinct hues so neighbours never look alike. */
const TINT_POOL: CardTint[] = [
  { glass: "rgba(255, 0, 204, 0.22)", header: "bg-header-pink" },
  { glass: "rgba(128, 0, 255, 0.2)", header: "bg-header-purple" },
  { glass: "rgba(0, 251, 255, 0.16)", header: "bg-header-cyan" },
  { glass: "rgba(255, 208, 0, 0.18)", header: "bg-header-yellow" },
  { glass: "rgba(37, 99, 235, 0.2)", header: "bg-header-blue" },
  { glass: "rgba(16, 185, 129, 0.17)", header: "bg-header-green" },
  { glass: "rgba(220, 38, 38, 0.18)", header: "bg-header-pink" },
  { glass: "rgba(234, 88, 12, 0.17)", header: "bg-header-yellow" },
  { glass: "rgba(236, 72, 153, 0.19)", header: "bg-header-pink" },
  { glass: "rgba(99, 102, 241, 0.2)", header: "bg-header-blue" },
  { glass: "rgba(20, 184, 166, 0.16)", header: "bg-header-cyan" },
  { glass: "rgba(168, 85, 247, 0.19)", header: "bg-header-purple" },
  { glass: "rgba(244, 63, 94, 0.17)", header: "bg-header-pink" },
  { glass: "rgba(59, 130, 246, 0.15)", header: "bg-header-blue" },
  { glass: "rgba(132, 204, 22, 0.15)", header: "bg-header-green" },
  { glass: "rgba(217, 70, 239, 0.18)", header: "bg-header-purple" },
  { glass: "rgba(14, 165, 233, 0.16)", header: "bg-header-cyan" },
  { glass: "rgba(251, 146, 60, 0.17)", header: "bg-header-yellow" },
  { glass: "rgba(100, 0, 239, 0.19)", header: "bg-header-blue" },
  { glass: "rgba(190, 24, 93, 0.16)", header: "bg-header-pink" },
  { glass: "rgba(6, 182, 212, 0.15)", header: "bg-header-cyan" },
  { glass: "rgba(124, 58, 237, 0.18)", header: "bg-header-purple" },
  { glass: "rgba(245, 158, 11, 0.16)", header: "bg-header-yellow" },
  { glass: "rgba(34, 197, 94, 0.14)", header: "bg-header-green" },
];

/** Accent-mapped tints — drives hero inner glow, KPI cards, and themed cards. */
const ACCENT_TINT: Record<AccentColor, CardTint> = {
  pink: { glass: "rgba(255, 0, 204, 0.22)", header: "bg-header-pink" },
  purple: { glass: "rgba(128, 0, 255, 0.2)", header: "bg-header-purple" },
  cyan: { glass: "rgba(0, 251, 255, 0.16)", header: "bg-header-cyan" },
  yellow: { glass: "rgba(255, 208, 0, 0.18)", header: "bg-header-yellow" },
  blue: { glass: "rgba(37, 99, 235, 0.2)", header: "bg-header-blue" },
  green: { glass: "rgba(16, 185, 129, 0.17)", header: "bg-header-green" },
  red: { glass: "rgba(239, 68, 68, 0.2)", header: "bg-header-pink" },
  orange: { glass: "rgba(249, 115, 22, 0.2)", header: "bg-header-yellow" },
  teal: { glass: "rgba(20, 184, 166, 0.18)", header: "bg-header-cyan" },
  indigo: { glass: "rgba(99, 102, 241, 0.2)", header: "bg-header-blue" },
  rose: { glass: "rgba(244, 63, 94, 0.2)", header: "bg-header-pink" },
  lime: { glass: "rgba(132, 204, 22, 0.18)", header: "bg-header-green" },
  amber: { glass: "rgba(245, 158, 11, 0.2)", header: "bg-header-yellow" },
  violet: { glass: "rgba(139, 92, 246, 0.2)", header: "bg-header-purple" },
  fuchsia: { glass: "rgba(217, 70, 239, 0.2)", header: "bg-header-pink" },
  sky: { glass: "rgba(14, 165, 233, 0.18)", header: "bg-header-cyan" },
  emerald: { glass: "rgba(16, 185, 129, 0.2)", header: "bg-header-green" },
};

export function getAccentTint(accent?: AccentColor | string): CardTint {
  if (accent && isAccentColor(accent)) return ACCENT_TINT[accent];
  return ACCENT_TINT.blue;
}

/** KPI stat card background gradient from catalog accent. */
export function getAccentStatBackground(accent?: AccentColor | string): string {
  const { glass } = getAccentTint(accent);
  const [r, g, b] = getTintRgb(glass);
  return `linear-gradient(135deg, rgba(${r},${g},${b},0.92) 0%, rgba(${r},${g},${b},0.58) 55%, rgba(${r},${g},${b},0.38) 100%)`;
}

export function getTintOuterGlow(glass: string, spread = 12): string {
  const [r, g, b] = getTintRgb(glass);
  return `0 0 ${spread}px 4px rgba(${r},${g},${b},0.75), 0 0 ${spread * 2}px 8px rgba(${r},${g},${b},0.35)`;
}

export function getHexOuterGlow(hex: string, spread = 10): string {
  const normalized = hex.replace("#", "");
  if (normalized.length < 6) return getTintOuterGlow("rgba(128, 0, 255, 0.2)", spread);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `0 0 ${spread}px 3px rgba(${r},${g},${b},0.65), 0 0 ${spread * 1.6}px 6px rgba(${r},${g},${b},0.3)`;
}

function hashId(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function getCardTint(id: string, sectionSeed = 0): CardTint {
  const idx = (hashId(id) + sectionSeed * 11) % TINT_POOL.length;
  return TINT_POOL[idx];
}

/** Prefer catalog accent from admin CMS; fall back to deterministic hash tint. */
export function resolveCardTint(
  id: string,
  accent?: AccentColor | string,
  sectionSeed = 0,
): CardTint {
  if (accent && isAccentColor(accent)) {
    return getAccentTint(accent);
  }
  return getCardTint(id, sectionSeed);
}

export function sectionTintSeed(title: string): number {
  return hashId(title) % TINT_POOL.length;
}

export function getTintRgb(glass: string): [number, number, number] {
  const match = glass.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return [138, 56, 245];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function getTintGlowStyles(glass: string) {
  const [r, g, b] = getTintRgb(glass);
  return {
    radial: `radial-gradient(ellipse 72% 64% at 50% 48%, rgba(${r},${g},${b},0.2) 0%, rgba(${r},${g},${b},0.08) 48%, transparent 72%)`,
  };
}

export function getSectionAmbienceStyles(glass: string) {
  const [r, g, b] = getTintRgb(glass);
  return {
    wash: `radial-gradient(ellipse 120% 95% at 50% 42%, rgba(${r},${g},${b},0.2) 0%, rgba(${r},${g},${b},0.08) 42%, transparent 72%)`,
    dim: `linear-gradient(to bottom, rgba(${r},${g},${b},0.05) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.28) 100%)`,
  };
}

export function getHexGlass(hex: string, alpha = 0.2): string {
  const normalized = hex.replace("#", "");
  if (normalized.length < 6) return `rgba(138, 56, 245, ${alpha})`;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function getDetailHeroBoundaryGlow(glass: string) {
  const [r, g, b] = getTintRgb(glass);
  return {
    boxShadow: `inset 0 0 96px 4px rgba(${r},${g},${b},0.09), inset 0 14px 56px rgba(${r},${g},${b},0.055), inset 0 -14px 56px rgba(${r},${g},${b},0.045), inset 14px 0 56px rgba(${r},${g},${b},0.05), inset -14px 0 56px rgba(${r},${g},${b},0.065)`,
    radialBackground: `radial-gradient(ellipse 100% 80% at 0% 0%, rgba(${r},${g},${b},0.038) 0%, transparent 55%), radial-gradient(ellipse 70% 90% at 100% 50%, rgba(${r},${g},${b},0.026) 0%, transparent 60%)`,
  };
}
