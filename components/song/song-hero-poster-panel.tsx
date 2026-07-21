"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, PlayCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTrackPreviewUrl } from "@/lib/music-preview";
import {
  detailHeroBtnBase,
  DETAIL_HERO_BTN_ACCENT_SOLID,
  DETAIL_HERO_BTN_GROUP,
} from "@/lib/detail-route-ui";
import { AddToCollectionDialog } from "@/components/forms/add-to-collection-dialog";
import { ToggleSongFavoriteButton } from "@/components/forms/toggle-song-favorite-button";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export interface SongHeroPosterPanelProps {
  songSlug: string;
  title: string;
  artist: string;
  initialFavorited?: boolean;
  resumeLabel?: string;
  durationSeconds?: number;
  audioUrl?: string;
}

/** Right hero panel — inline playback, favourites, and add-to-collection. */
export function SongHeroPosterPanel({
  songSlug,
  title,
  artist,
  resumeLabel,
  durationSeconds,
  initialFavorited,
  audioUrl,
}: SongHeroPosterPanelProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(durationSeconds ?? 0);

  const previewUrl = getTrackPreviewUrl(songSlug, audioUrl);
  const playLabel = resumeLabel ? `Continue from ${resumeLabel}` : "Play Now";

  const syncDuration = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    } else if (durationSeconds) {
      setDuration(durationSeconds);
    }
  }, [durationSeconds]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function onTimeUpdate() {
      setProgress(audio!.currentTime);
    }
    function onPlay() {
      setIsPlaying(true);
    }
    function onPause() {
      setIsPlaying(false);
    }
    function onEnded() {
      setIsPlaying(false);
      setProgress(0);
    }

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [syncDuration]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  }

  function handleSeek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setProgress(value);
  }

  const progressMax = duration || durationSeconds || 1;

  return (
    <>
      <audio ref={audioRef} src={previewUrl} preload="metadata" className="hidden" />

      {isPlaying ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-magenta/25 via-transparent to-transparent"
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-2.5 bg-gradient-to-t from-black/72 via-black/48 to-transparent px-4 pb-4 pt-10 sm:gap-3 sm:px-5 sm:pb-5",
        )}
      >
        {isPlaying ? (
          <div className="space-y-2 rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 text-[10px] text-white/60">
              <span className="truncate font-medium text-white/90">{title}</span>
              <span className="shrink-0">{artist}</span>
            </div>
            <input
              type="range"
              min={0}
              max={progressMax}
              step={1}
              value={progress}
              onChange={(event) => handleSeek(Number(event.target.value))}
              className="h-1 w-full cursor-pointer accent-brand-magenta"
              aria-label="Playback progress"
            />
            <div className="flex justify-between text-[10px] text-white/50">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(progressMax)}</span>
            </div>
          </div>
        ) : null}

        <div className={DETAIL_HERO_BTN_GROUP}>
          <ToggleSongFavoriteButton
            songSlug={songSlug}
            initialFavorited={initialFavorited}
          />
          <button
            type="button"
            onClick={() => setCollectionOpen(true)}
            className={detailHeroBtnBase(
              "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white",
            )}
          >
            <Plus className="size-3.5 shrink-0" />
            <span className="truncate">Add To Collection</span>
          </button>
        </div>

        <div className={DETAIL_HERO_BTN_GROUP}>
          <button
            type="button"
            onClick={() => void togglePlayback()}
            className={detailHeroBtnBase(DETAIL_HERO_BTN_ACCENT_SOLID)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className="size-4 shrink-0 fill-current" />
            ) : (
              <PlayCircle className="size-4 shrink-0" />
            )}
            <span className="truncate">{isPlaying ? "Pause" : playLabel}</span>
          </button>
        </div>
      </div>

      <AddToCollectionDialog
        itemKind="song"
        itemSlug={songSlug}
        itemTitle={title}
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
      />
    </>
  );
}
