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

function hashId(id: string): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * Stable tint per card. `sectionSeed` offsets the palette per slider section
 * so the same title gets a different color in different rows.
 */
export function getCardTint(id: string, sectionSeed = 0): CardTint {
  const idx = (hashId(id) + sectionSeed * 11) % TINT_POOL.length;
  return TINT_POOL[idx];
}

/** Hash a section title into a numeric seed for tint offsetting. */
export function sectionTintSeed(title: string): number {
  return hashId(title) % TINT_POOL.length;
}

/** Parse RGB from a tint glass string e.g. `rgba(255, 0, 204, 0.22)`. */
export function getTintRgb(glass: string): [number, number, number] {
  const match = glass.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return [138, 56, 245];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Soft ambient wash derived from each card's theme tint (Spotify-style). */
export function getTintGlowStyles(glass: string) {
  const [r, g, b] = getTintRgb(glass);
  return {
    radial: `radial-gradient(ellipse 72% 64% at 50% 48%, rgba(${r},${g},${b},0.2) 0%, rgba(${r},${g},${b},0.08) 48%, transparent 72%)`,
  };
}

/** Spotify-style section ambience when a card in the row is hovered. */
export function getSectionAmbienceStyles(glass: string) {
  const [r, g, b] = getTintRgb(glass);
  return {
    wash: `radial-gradient(ellipse 120% 95% at 50% 42%, rgba(${r},${g},${b},0.2) 0%, rgba(${r},${g},${b},0.08) 42%, transparent 72%)`,
    dim: `linear-gradient(to bottom, rgba(${r},${g},${b},0.05) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.28) 100%)`,
  };
}

/** Figma drop shadow — use getTintGlowStyles for themed cards. */
