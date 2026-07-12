"use client";

import { useEffect, useState } from "react";

export interface ColumnBreakpoint {
  minWidth: number;
  cols: number;
}

function resolveColumns(
  breakpoints: readonly ColumnBreakpoint[],
  width: number,
): number {
  for (const bp of breakpoints) {
    if (width >= bp.minWidth) return bp.cols;
  }
  return breakpoints[breakpoints.length - 1]?.cols ?? 2;
}

/** Returns responsive column count; updates on viewport resize. */
export function useColumnCount(
  breakpoints: readonly ColumnBreakpoint[],
  rows = 1,
) {
  const [cols, setCols] = useState(() =>
    breakpoints[breakpoints.length - 1]?.cols ?? 2,
  );

  useEffect(() => {
    function update() {
      setCols(resolveColumns(breakpoints, window.innerWidth));
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoints]);

  return { cols, itemsPerPage: cols * rows };
}
