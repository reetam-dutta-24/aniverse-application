"use client";

import Link from "next/link";
import {
  Heart,
  Pause,
  PlayCircle,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSongDetailPath } from "@/lib/song-routes";
import {
  detailHeroBtnBase,
  DETAIL_HERO_BTN_GROUP,
  DETAIL_HERO_BTN_PAIR,
} from "@/lib/detail-route-ui";
import { AvatarStack } from "@/components/ui/avatar-stack";
import type { ArtistNowPlaying, UserSummary } from "@/types";

export interface ArtistNowPlayingPanelProps {
  imageUrl: string;
  artistName: string;
  nowPlaying?: ArtistNowPlaying;
  connections: UserSummary[];
  connectionSummary?: string;
}

/** Right hero panel — TWICE banner, player controls, social CTAs. */
export function ArtistNowPlayingPanel({
  imageUrl,
  artistName,
  nowPlaying,
  connections,
  connectionSummary,
}: ArtistNowPlayingPanelProps) {
  const progress = nowPlaying?.progressPercent ?? 0;

  return (
    <aside className="flex h-full min-h-0 max-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden border-l border-cyan-400/20 bg-black shadow-[inset_0_0_40px_rgba(0,255,230,0.08)]">
      <div className="relative min-h-0 flex-[1.1] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={artistName}
          className="size-full object-cover object-center"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-black/25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black to-transparent"
        />
      </div>

      <div className="flex shrink-0 flex-col gap-2.5 px-4 pb-4 pt-3 sm:gap-3 sm:px-5 sm:pb-5">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Previous track"
            className="text-brand-magenta transition-colors hover:text-brand-pink"
          >
            <SkipBack className="size-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Play or pause"
            className="flex size-11 items-center justify-center rounded-full bg-brand-magenta text-white shadow-[0_0_20px_rgba(255,0,204,0.55)]"
          >
            <Pause className="size-5 fill-current" />
          </button>
          <button
            type="button"
            aria-label="Next track"
            className="text-brand-magenta transition-colors hover:text-brand-pink"
          >
            <SkipForward className="size-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Repeat"
            className="text-brand-magenta/80 transition-colors hover:text-brand-pink"
          >
            <Repeat className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Volume"
            className="text-brand-magenta/80 transition-colors hover:text-brand-pink"
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="mx-auto h-1 w-full max-w-[300px] overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mx-auto flex max-w-[300px] justify-between text-[10px] text-white/60">
            <span>{nowPlaying?.elapsedLabel ?? "0:00"}</span>
            <span>{nowPlaying?.durationLabel ?? "3:57"}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-full border border-amber-400/70 bg-amber-500/15 px-3 py-1 text-[10px] font-semibold text-amber-200"
          >
            Lyrics
          </button>
        </div>

        {nowPlaying ? (
          <p className="text-center text-sm font-semibold text-white">
            Currently Playing {nowPlaying.title} By {artistName}
          </p>
        ) : null}

        <div className={DETAIL_HERO_BTN_GROUP}>
          <button
            type="button"
            className={detailHeroBtnBase(
              "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white",
            )}
          >
            <Heart className="size-3.5 shrink-0 fill-current" />
            <span className="truncate">Add To Favourites</span>
          </button>

          {nowPlaying?.songId ? (
            <Link
              href={getSongDetailPath(nowPlaying.songId)}
              className={detailHeroBtnBase(
                "border-transparent bg-gradient-to-r from-amber-500 to-yellow-500 font-bold text-black",
              )}
            >
              <span className="truncate">View Song Details</span>
            </Link>
          ) : null}
        </div>

        {connections.length > 0 ? (
          <div className="flex items-center gap-3 py-0.5">
            <AvatarStack users={connections} max={3} size="md" />
            {connectionSummary ? (
              <p className="min-w-0 flex-1 text-left text-[11px] leading-relaxed text-white/80 sm:text-xs">
                {connectionSummary}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-3 pt-1">
          <div className={cn(DETAIL_HERO_BTN_PAIR, "w-full justify-center")}>
            <button
              type="button"
              className={detailHeroBtnBase(
                "h-10 flex-col gap-0.5 border-transparent bg-gradient-to-r from-blue-600 to-violet-600 py-1.5 text-white sm:h-11",
              )}
            >
              <span className="text-[10px] font-semibold leading-none sm:text-[11px]">
                + Add To
              </span>
              <span className="text-[10px] font-semibold leading-none sm:text-[11px]">
                Collection
              </span>
            </button>
            <button
              type="button"
              className={detailHeroBtnBase(
                "border-2 border-brand-magenta bg-black/70 text-white",
              )}
            >
              <PlayCircle className="size-3.5 shrink-0 text-brand-magenta" />
              <span className="truncate">Play {artistName} Playlist</span>
            </button>
          </div>

          <button
            type="button"
            className={detailHeroBtnBase(
              "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white",
            )}
          >
            <span aria-hidden className="text-sm leading-none">
              🤝
            </span>
            <span className="truncate">Follow {artistName}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
