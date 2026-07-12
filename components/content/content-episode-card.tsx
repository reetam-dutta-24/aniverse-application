"use client";

import { useState } from "react";
import { Clock, Eye, Heart, PlayCircle, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAccentTint, getCardTint, getTintOuterGlow } from "@/lib/card-theme";
import type { AccentColor, Episode } from "@/types";
import { Chip } from "@/components/ui/chip";
import { GradientButton } from "@/components/ui/gradient-button";

export interface ContentEpisodeCardProps {
  episode: Episode;
  contentId: string;
  contentAccent?: AccentColor;
  onPlay?: () => void;
}

function resolveTint(contentId: string, contentAccent?: AccentColor) {
  if (contentAccent) return getAccentTint(contentAccent);
  return getCardTint(contentId);
}

/** Episode card — compact default; 1.2× scale + detail tint glow on hover. */
export function ContentEpisodeCard({
  episode,
  contentId,
  contentAccent,
  onPlay,
}: ContentEpisodeCardProps) {
  const [hovered, setHovered] = useState(false);
  const season = episode.seasonNumber ?? 1;
  const tint = resolveTint(contentId, contentAccent);
  const durationLabel = episode.duration?.replace("m", " Min") ?? "24 Min";

  return (
    <article
      className={cn(
        "relative mx-auto w-full max-w-[351px] origin-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hovered ? "z-30 scale-[1.2]" : "z-0 scale-100",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex flex-col overflow-visible rounded-2xl bg-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={
          hovered
            ? { boxShadow: getTintOuterGlow(tint.glass, 16) }
            : { boxShadow: "inset 0 0 24px rgba(0,0,0,0.55)" }
        }
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-t-2xl transition-all duration-500",
            hovered ? "h-[190px]" : "h-[168px] sm:h-[178px]",
          )}
        >
          {episode.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={episode.thumbnailUrl}
              alt={episode.title}
              className="size-full object-cover"
            />
          ) : (
            <div className={cn("size-full", tint.header)} />
          )}

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-2.5 pt-8 transition-opacity duration-300",
              hovered ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <div className="flex items-end justify-between gap-2">
              <p className="line-clamp-2 text-xs font-semibold text-white sm:text-sm">
                S{season} | Episode {episode.number} {episode.title}
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-white/80">
                <Clock className="size-3" />
                {durationLabel}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/95 to-transparent px-3 pb-2.5 pt-6 transition-opacity duration-300",
              hovered ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <button
              type="button"
              onClick={onPlay}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-brand-magenta bg-black/80 px-3 py-1 text-[10px] font-medium text-white transition-colors hover:bg-brand-magenta/20"
            >
              <PlayCircle className="size-3.5 text-brand-magenta" />
              Watch Now
            </button>
            <div className="flex items-center gap-2">
              {episode.rating != null ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-white">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  {episode.rating}
                </span>
              ) : null}
              <GradientButton
                size="sm"
                className="h-6 rounded-full px-2.5 text-[9px]"
              >
                <Plus className="size-3" />
                Watchlist
              </GradientButton>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-b-2xl transition-all duration-500",
            hovered ? "max-h-52 gap-2.5 p-4 opacity-100" : "max-h-0 opacity-0",
          )}
          style={
            hovered
              ? {
                  boxShadow: `inset 0 12px 36px ${tint.glass}`,
                  backgroundColor: "rgba(0,0,0,0.92)",
                }
              : undefined
          }
        >
          <p className="text-base font-bold text-white">
            S{season} | E{episode.number} {episode.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {episode.language ? (
              <Chip chipKey="default" className="h-5 text-[10px]">
                {episode.language}
              </Chip>
            ) : null}
            <Chip variant="indigo" className="h-5 gap-1 text-[10px]">
              <Clock className="size-3" />
              {durationLabel}
            </Chip>
            {episode.views ? (
              <Chip variant="indigo" className="h-5 gap-1 text-[10px]">
                <Eye className="size-3" />
                {episode.views}
              </Chip>
            ) : null}
            {episode.likes ? (
              <Chip variant="indigo" className="h-5 gap-1 text-[10px]">
                <Heart className="size-3" />
                {episode.likes}
              </Chip>
            ) : null}
          </div>
          {episode.description ? (
            <p className="line-clamp-3 text-xs leading-relaxed text-white/85">
              {episode.description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
