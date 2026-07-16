"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Headphones, PlayCircle } from "lucide-react";
import { getSongDetailPath } from "@/lib/song-routes";
import { useCarouselTintSeed } from "@/components/carousel/carousel-section-context";
import { cn } from "@/lib/utils";
import { getCardTint } from "@/lib/card-theme";
import { SLOT_H, SLOT_W } from "@/lib/card-dimensions";
import { CardAddToCollectionButton } from "@/components/forms/add-to-collection-dialog";
import type { MusicTrack } from "@/types";
import { Chip, MatchChip, RatingChip } from "@/components/ui/chip";

const CARD_W = 160;
const CARD_H = 252;
const HOVER_W = 176;
const HOVER_H = 278;

export interface MusicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  track: MusicTrack;
  tintSeed?: number;
  onListen?: () => void;
  onViewDetails?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

function kindLabel(kind: MusicTrack["kind"]) {
  if (kind === "ost") return "OST";
  if (kind === "album") return "Album";
  return "Song";
}

function trackDescription(track: MusicTrack) {
  return track.source
    ? `Soundtrack from ${track.source} · performed by ${track.artist}.`
    : `${track.artist} — matched to your listening taste on AniVerse.`;
}

const layerTransition =
  "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Music card — compact default, fixed-size black expanded panel on hover. */
export function MusicCard({
  track,
  tintSeed: tintSeedProp,
  onListen,
  onViewDetails,
  onHoverChange,
  className,
  ...props
}: MusicCardProps) {
  const router = useRouter();
  const contextTintSeed = useCarouselTintSeed();
  const tintSeed = tintSeedProp ?? contextTintSeed;
  const [hovered, setHovered] = useState(false);
  const tint = getCardTint(track.id, tintSeed);

  function handleViewDetails() {
    if (onViewDetails) {
      onViewDetails();
      return;
    }
    router.push(getSongDetailPath(track.id));
  }
  const langLabel =
    track.language?.toLowerCase() === "japanese"
      ? "Jpop"
      : track.language?.toLowerCase() === "english pop"
        ? "English"
        : track.language ?? "Jpop";

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
              {track.source ? (
                <Chip chipKey="show" className="max-w-[90px] truncate">
                  {track.source}
                </Chip>
              ) : track.rating != null ? (
                <RatingChip rating={track.rating} />
              ) : (
                <span className="h-5" />
              )}
              <Chip musicKind={track.kind}>{kindLabel(track.kind)}</Chip>
            </div>

            <div className="mx-auto mt-1 h-[118px] w-[136px] shrink-0 overflow-hidden rounded-[14px]">
              {track.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.imageUrl}
                  alt={track.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className={cn("size-full", tint.header)} />
              )}
            </div>

            <div className="flex flex-1 flex-col items-center justify-end gap-1.5 px-2 pb-2.5 pt-1.5 text-center">
              <div>
                <p className="line-clamp-1 text-sm font-semibold text-white">
                  {track.title}
                </p>
                <p className="text-[11px] font-normal text-muted">
                  {track.artist}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <Chip language={langLabel}>{langLabel}</Chip>
                {track.matchScore != null ? (
                  <MatchChip score={track.matchScore} />
                ) : null}
              </div>
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
              {track.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.imageUrl}
                  alt={track.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className={cn("size-full", tint.header)} />
              )}
            </div>

            <div className="flex h-[196px] flex-col items-center gap-1.5 bg-black px-2.5 pb-2 pt-2">
              <div className="w-full text-center">
                <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">
                  {track.title}
                </p>
                <p className="line-clamp-1 text-[11px] font-normal text-muted">
                  {track.artist}
                </p>
              </div>

              <p className="h-[36px] w-full overflow-hidden text-center text-[10px] font-normal leading-[12px] text-white/80 line-clamp-3">
                {trackDescription(track)}
              </p>

              <div className="mt-auto flex w-full flex-col items-center gap-1.5 pt-1">
                <div className="flex w-full items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={onListen}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-brand-magenta px-2 py-0.5 text-[10px] font-normal text-white transition-colors hover:bg-brand-magenta/15"
                  >
                    <Headphones className="size-3.5 text-brand-magenta" />
                    Listen Now
                  </button>
                  <button
                    type="button"
                    onClick={handleViewDetails}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-brand-magenta px-2 py-0.5 text-[10px] font-normal text-white transition-colors hover:bg-brand-magenta/15"
                  >
                    <PlayCircle className="size-3.5 text-brand-magenta" />
                    View Details
                  </button>
                </div>
                <CardAddToCollectionButton
                  itemKind="song"
                  itemSlug={track.id}
                  itemTitle={track.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
