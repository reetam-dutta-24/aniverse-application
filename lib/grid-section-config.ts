/** Standard dashboard grid — up to 6 columns × 2 rows per page. */
export const GRID_COLS = 6;
export const GRID_ROWS = 2;
export const GRID_ITEMS_PER_PAGE = GRID_COLS * GRID_ROWS;

/** Community / collection grid — up to 5 columns × 2 rows per page. */
export const COMMUNITY_GRID_COLS = 5;
export const COMMUNITY_GRID_ROWS = 2;
export const COMMUNITY_GRID_ITEMS_PER_PAGE =
  COMMUNITY_GRID_COLS * COMMUNITY_GRID_ROWS;

/** Carousel row — scales from 2 cols (mobile) to 6 cols (desktop). */
export const CAROUSEL_COLS_BREAKPOINTS = [
  { minWidth: 1200, cols: 6 },
  { minWidth: 1024, cols: 4 },
  { minWidth: 768, cols: 3 },
  { minWidth: 0, cols: 2 },
] as const;

/** Watchlist / poster grid — same breakpoints as carousel. */
export const POSTER_GRID_COLS_BREAKPOINTS = CAROUSEL_COLS_BREAKPOINTS;

/** Community / collection card grid — scales from 2 to 5 cols. */
export const CARD_GRID_COLS_BREAKPOINTS = [
  { minWidth: 1280, cols: 5 },
  { minWidth: 1024, cols: 4 },
  { minWidth: 768, cols: 3 },
  { minWidth: 0, cols: 2 },
] as const;
