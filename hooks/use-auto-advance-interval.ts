"use client";

import { useEffect } from "react";

interface UseAutoAdvanceIntervalOptions {
  intervalMs?: number;
  /** When false, the timer never runs (e.g. single page / slide). */
  enabled?: boolean;
  /** Pause while the user hovers slider content. */
  paused?: boolean;
  onAdvance: () => void;
}

/** Shared auto-advance timer — pauses cleanly when `paused` is true. */
export function useAutoAdvanceInterval({
  intervalMs,
  enabled = true,
  paused = false,
  onAdvance,
}: UseAutoAdvanceIntervalOptions) {
  useEffect(() => {
    if (!intervalMs || !enabled || paused) return;
    const id = window.setInterval(onAdvance, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled, paused, onAdvance]);
}
