"use client";

import { useMemo } from "react";
import type { AccentColor } from "@/lib/catalog-enums";
import { getPlayAmbientLayers } from "@/lib/play-ambient";

interface PlayAmbientBackgroundProps {
  accent?: AccentColor | string;
  imageUrl?: string;
}

/** Flat accent backdrop — solid gradient wash, no texture or orbs. */
export function PlayAmbientBackground({
  accent,
  imageUrl,
}: PlayAmbientBackgroundProps) {
  const layers = useMemo(
    () => getPlayAmbientLayers(accent, imageUrl),
    [accent, imageUrl],
  );
  const key = `${accent ?? "default"}-${imageUrl ?? "none"}`;

  return (
    <div
      key={key}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-[0.12] blur-[80px] transition-all duration-700 ease-out"
        />
      ) : null}

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
