"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCardTint } from "@/lib/card-theme";
import { SLOT_H, SLOT_W } from "@/lib/card-dimensions";
import type { ContentItem } from "@/types";
import { Chip, MatchChip, RatingChip } from "@/components/ui/chip";

const typeLabels: Record<ContentItem["type"], string> = {
  anime: "Anime",
  show: "Show",
  movie: "Movie",
  documentary: "Documentary",
  kdrama: "Kdrama",
  song: "Song",
  album: "Album",
  artist: "Artist",
  playlist: "Playlist",
};

export { SLOT_W, SLOT_H } from "@/lib/card-dimensions";

const CARD_W = 160;
const CARD_H = 252;
const HOVER_W = 176;
const HOVER_H = 278;

export interface PosterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ContentItem;
  tintSeed?: number;
  onWatch?: () => void;
  onViewDetails?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

function defaultDescription(title: string) {
  return `${title} — matched to your genres, ratings, and watch history on AniVerse.`;
}

function resolveMeta(item: ContentItem) {
  const meta =
    item.meta ??
    (item.type === "movie" || item.type === "documentary"
      ? "Film"
      : item.type === "show"
        ? "3 Seasons"
        : "2 Seasons");
  const year = item.year ?? 2021;
  return { meta, year };
}

const layerTransition =
  "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Content poster — compact default, fixed-size black expanded panel on hover. */
export function PosterCard({
  item,
  tintSeed = 0,
  onWatch,
  onViewDetails,
  onHoverChange,
  className,
  ...props
}: PosterCardProps) {
  const [hovered, setHovered] = useState(false);
  const tint = getCardTint(item.id, tintSeed);
  const description = item.description ?? defaultDescription(item.title);
  const { meta, year } = resolveMeta(item);

  return (
    <div
      className={cn("relative isolate mx-auto w-full max-w-[160px] shrink-0 overflow-visible", className)}
      style={{ width: SLOT_W, height: SLOT_H }}
      {...props}
      onMouseEnter={() => {
        setHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(false);
      }}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/2 z-10 flex flex-col overflow-hidden rounded-[18px] shadow-card-inner transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          hovered && "z-30 rounded-[20px]",
        )}
        style={{
          width: hovered ? HOVER_W : CARD_W,
          height: hovered ? HOVER_H : CARD_H,
          transform: "translate(-50%, -50%)",
          backgroundColor: hovered ? "#000000" : tint.glass,
        }}
      >
        <div className="relative h-full w-full">
          <div
            className={cn(
              "absolute inset-0 flex flex-col",
              layerTransition,
              hovered
                ? "pointer-events-none scale-[0.98] opacity-0"
                : "scale-100 opacity-100",
            )}
          >
            <div className="flex shrink-0 items-center justify-between px-2 pt-2">
              {item.rating != null ? (
                <RatingChip rating={item.rating} />
              ) : (
                <span className="h-5" />
              )}
              <Chip mediaType={item.type}>{typeLabels[item.type]}</Chip>
            </div>

            <div className="mx-auto mt-1 h-[118px] w-[136px] shrink-0 overflow-hidden rounded-[14px]">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className={cn("size-full", tint.header)} />
              )}
            </div>

            <div className="flex flex-1 flex-col items-center justify-end gap-1.5 px-2 pb-2.5 pt-1.5 text-center">
              <p className="line-clamp-1 text-sm font-semibold text-white">
                {item.title}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {item.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    genreId={genre.id}
                    genreLabel={genre.label}
                  >
                    {genre.label}
                  </Chip>
                ))}
              </div>
              {item.matchScore != null ? (
                <MatchChip score={item.matchScore} />
              ) : null}
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col",
              layerTransition,
              hovered
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-2 scale-[1.02] opacity-0",
            )}
          >
            <div className="relative h-[82px] w-full shrink-0 overflow-hidden">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className={cn("size-full", tint.header)} />
              )}
            </div>

            <div className="flex h-[196px] flex-col items-center gap-1 bg-black px-2.5 pb-2 pt-1.5">
              <p className="line-clamp-1 w-full text-center text-sm font-semibold text-white">
                {item.title}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-1">
                {item.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    genreId={genre.id}
                    genreLabel={genre.label}
                  >
                    {genre.label}
                  </Chip>
                ))}
              </div>

              {item.matchScore != null ? (
                <MatchChip score={item.matchScore} />
              ) : null}

              <p className="h-[34px] w-full overflow-hidden text-left text-[10px] font-normal leading-[11px] text-white/85 line-clamp-3">
                {description}
              </p>

              <p className="flex w-full justify-between text-[10px] font-normal text-white/75">
                <span>{meta}</span>
                <span>{year}</span>
              </p>

              <div className="flex w-full items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onWatch}
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-brand-magenta px-2 py-0.5 text-[10px] font-normal text-white transition-colors hover:bg-brand-magenta/15"
                >
                  <PlayCircle className="size-3.5 text-brand-magenta" />
                  Watch Now
                </button>
                <button
                  type="button"
                  onClick={onViewDetails}
                  className="cursor-pointer rounded-full border border-brand-magenta px-2 py-0.5 text-[10px] font-normal text-white transition-colors hover:bg-brand-magenta/15"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
