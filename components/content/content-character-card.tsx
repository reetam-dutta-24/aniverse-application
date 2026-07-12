"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { accentStyles } from "@/lib/accents";
import { getAccentTint, getTintOuterGlow } from "@/lib/card-theme";
import type { AccentColor, Character } from "@/types";

export interface ContentCharacterCardProps {
  character: Character;
  contentId: string;
  contentAccent?: AccentColor;
}

/** Character portrait — name only by default; voice actor + detail tint glow on hover. */
export function ContentCharacterCard({
  character,
  contentAccent = "purple",
}: ContentCharacterCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = accentStyles[character.accent ?? "purple"];
  const tint = getAccentTint(contentAccent);
  const shortName = character.name.split(" ")[0];

  return (
    <article
      className={cn(
        "relative mx-auto shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hovered ? "z-20 w-[210px] scale-[1.03]" : "z-0 w-[168px] sm:w-[180px]",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        style={{
          height: hovered ? 322 : 268,
          backgroundColor: hovered ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.55)",
          boxShadow: hovered
            ? `${getTintOuterGlow(tint.glass, 12)}, inset 0 -48px 56px ${tint.glass}`
            : "inset 0 -32px 40px rgba(0,0,0,0.65), inset 0 0 20px rgba(0,0,0,0.35)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {character.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={character.imageUrl}
              alt={character.name}
              className={cn(
                "size-full object-cover object-top transition-transform duration-500",
                hovered && "scale-105",
              )}
            />
          ) : (
            <div className={cn("size-full", accent.header)} />
          )}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              boxShadow: hovered
                ? `inset 0 -72px 60px rgba(0,0,0,0.75)`
                : "inset 0 -48px 36px rgba(0,0,0,0.75)",
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-3 pb-3 pt-12">
          <p
            className={cn(
              "font-bold text-white transition-all duration-300",
              hovered ? "text-lg" : "text-base",
            )}
          >
            {shortName}
          </p>
          <p
            className={cn(
              "text-white/85 transition-all duration-300",
              hovered
                ? "mt-1 max-h-8 text-xs opacity-100"
                : "max-h-0 overflow-hidden text-[10px] opacity-0",
            )}
          >
            {character.voiceActor
              ? `Played by ${character.voiceActor}`
              : character.role}
          </p>
        </div>
      </div>
    </article>
  );
}
