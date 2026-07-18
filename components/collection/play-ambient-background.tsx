"use client";

import { useMemo } from "react";
import type { AccentColor } from "@/lib/catalog-enums";
import { getPlayAmbientLayers } from "@/lib/play-ambient";

interface PlayAmbientBackgroundProps {
  accent?: AccentColor | string;
}

/** Flat accent backdrop — solid gradient wash, no blurred cover art. */
export function PlayAmbientBackground({ accent }: PlayAmbientBackgroundProps) {
  const layers = useMemo(() => getPlayAmbientLayers(accent), [accent]);
  const key = accent ?? "default";

  return (
    <div
      key={key}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{ background: layers.solidGradient }}
      />
      <div
        className="absolute inset-0"
        style={{ background: layers.baseFill }}
      />
    </div>
  );
}
