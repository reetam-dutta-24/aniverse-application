import { cn } from "@/lib/utils";

/**
 * Shared hero CTA sizing for `/content`, `/song`, and `/collection` detail routes.
 * Import these on any future individual route page hero/actions.
 */
export const DETAIL_HERO_BTN_WIDTH = "w-[138px]";

export function detailHeroBtnBase(className?: string) {
  return cn(
    DETAIL_HERO_BTN_WIDTH,
    "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold leading-tight sm:h-10 sm:px-3 sm:text-[11px]",
    className,
  );
}

/** Filled hero CTA — solid teal → light cyan-blue, dark label, no glow. */
export const DETAIL_HERO_BTN_ACCENT_SOLID = cn(
  "border border-transparent bg-gradient-teal-blue font-bold text-black",
  "transition-opacity duration-300 hover:opacity-90",
);

/** Filled hero CTA with play/watch hover — used on content & artist primary actions. */
export const DETAIL_HERO_BTN_ACCENT_PLAY = DETAIL_HERO_BTN_ACCENT_SOLID;

/**
 * Horizontal space between two side-by-side hero CTAs.
 * Uses `.detail-hero-btn-pair` in globals.css so spacing survives glow/shadow bleed.
 */
export const DETAIL_HERO_BTN_PAIR_GAP = "detail-hero-btn-pair";

/** Two consecutive hero CTAs in a horizontal row. */
export const DETAIL_HERO_BTN_PAIR = DETAIL_HERO_BTN_PAIR_GAP;

/** Centered horizontal pair — collection activity panel, poster overlay. */
export const DETAIL_HERO_BTN_GROUP = cn(
  DETAIL_HERO_BTN_PAIR,
  "justify-center",
);

/** Primary pair row under KPI stats (content/song). */
export const DETAIL_HERO_BTN_PAIR_ROW = cn("mt-3", DETAIL_HERO_BTN_PAIR);
