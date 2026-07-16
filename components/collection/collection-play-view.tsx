"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCollectionDetailPath } from "@/lib/collection-routes";
import { getContentDetailPath } from "@/lib/content-routes";
import { getSongDetailPath } from "@/lib/song-routes";
import {
  getLyricWindow,
  getSynopsisWindow,
  parseLyricsText,
} from "@/lib/lyrics-display";
import { getPlayAccentTheme, type PlayAccentTheme } from "@/lib/play-ambient";
import { moveToPlayNext, removeQueueItem } from "@/lib/play-queue-utils";
import { PlayAmbientBackground } from "@/components/collection/play-ambient-background";
import { PlayQueueRowActions } from "@/components/collection/play-queue-row-actions";
import { Chip, RatingChip } from "@/components/ui/chip";
import type {
  CollectionPlayContentItem,
  CollectionPlayQueue,
  CollectionPlayTrack,
} from "@/types";

interface CollectionPlayViewProps {
  collectionSlug: string;
  initialQueue?: CollectionPlayQueue;
}

const PLAY_MIN_H = "min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4.5rem)]";
const PLAY_STICKY_TOP = "lg:sticky lg:top-[4.5rem]";
const PLAY_PANEL_H = "lg:h-[calc(100dvh-4.5rem)]";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function kindLabel(kind: string) {
  if (kind === "ost") return "OST";
  if (kind === "album") return "Album";
  return "Song";
}

function QueueCover({
  imageUrl,
  title,
  size = "md",
  theme,
}: {
  imageUrl?: string;
  title: string;
  size?: "sm" | "md" | "lg";
  theme?: PlayAccentTheme;
}) {
  const sizeClass =
    size === "sm" ? "size-10" : size === "lg" ? "size-16" : "size-12";
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-black/40 shadow-md ring-1 ring-white/10",
        sizeClass,
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <span
          className="flex size-full items-center justify-center text-xs font-bold text-white/70"
          style={{ background: theme?.gradientSoft }}
        >
          {title.charAt(0)}
        </span>
      )}
    </span>
  );
}

function CollectionPlayHeader({
  label,
  name,
  description,
  meta,
  imageUrl,
  theme,
  action,
}: {
  label: string;
  name: string;
  description?: string;
  meta: string;
  imageUrl?: string;
  theme: PlayAccentTheme;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-stretch gap-5 sm:mb-7 sm:gap-6 lg:gap-7">
      <div
        className="relative aspect-[5/4] self-stretch overflow-hidden rounded-md bg-black/40 ring-1 ring-white/10"
        style={{ borderColor: theme.border }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <div
            className="flex size-full items-center justify-center text-2xl font-bold text-white/60 sm:text-3xl"
            style={{ background: theme.gradientSoft }}
          >
            {name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 sm:gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/55 sm:text-xs">
          {label}
        </p>
        <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          {name}
        </h1>
        {description ? (
          <p className="text-sm leading-relaxed text-white/60 sm:text-[15px]">
            {description}
          </p>
        ) : null}
        <p className="text-xs text-white/45 sm:text-sm">{meta}</p>
        {action ? <div className="pt-1 sm:pt-1.5">{action}</div> : null}
      </div>
    </header>
  );
}

function LyricsPanel({
  lyrics,
  progress,
  duration,
  theme,
}: {
  lyrics?: string;
  progress: number;
  duration: number;
  theme: PlayAccentTheme;
}) {
  const lines = useMemo(() => parseLyricsText(lyrics), [lyrics]);
  const window = useMemo(
    () => getLyricWindow(lines, progress, duration, 4),
    [lines, progress, duration],
  );

  if (!lines.length) {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
        <p className="text-xs text-white/40">No lyrics available for this track.</p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 flex flex-col gap-3 rounded-xl border px-4 py-5"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.panelBg,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        Lyrics
      </p>
      <div className="flex min-h-[7rem] flex-col justify-center gap-2">
        {window.map((line) => (
          <p
            key={`${line.text}-${line.active}`}
            className={cn(
              "text-sm leading-relaxed transition-all duration-300",
              line.active ? "scale-[1.03] font-semibold" : line.past ? "text-white/35" : "text-white/55",
            )}
            style={line.active ? { color: theme.primary } : undefined}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function SynopsisPanel({
  synopsis,
  activeIndex,
  theme,
}: {
  synopsis?: string;
  activeIndex: number;
  theme: PlayAccentTheme;
}) {
  const lines = useMemo(
    () => getSynopsisWindow(synopsis, activeIndex, 4),
    [synopsis, activeIndex],
  );

  if (!synopsis?.trim()) {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center">
        <p className="text-xs text-white/40">No synopsis available.</p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 flex flex-col gap-3 rounded-xl border px-4 py-5"
      style={{
        borderColor: theme.border,
        backgroundColor: theme.panelBg,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
        About this title
      </p>
      <div className="flex min-h-[7rem] flex-col justify-center gap-2">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={cn(
              "text-sm leading-relaxed",
              index === 0 ? "font-medium" : "text-white/60",
            )}
            style={index === 0 ? { color: theme.primaryMuted } : undefined}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function MusicPlayQueue({
  queue,
  collectionSlug,
}: {
  queue: CollectionPlayQueue & { tracks: CollectionPlayTrack[] };
  collectionSlug: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState(queue.tracks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const canManage = queue.canManage ?? false;

  useEffect(() => {
    setTracks(queue.tracks);
  }, [queue.tracks]);

  const currentTrack = tracks[currentIndex];

  const playIndex = useCallback(
    async (index: number, autoplay = true) => {
      if (index < 0 || index >= tracks.length) return;
      setCurrentIndex(index);
      setProgress(0);
      const audio = audioRef.current;
      if (!audio) return;

      const track = tracks[index];
      audio.src = track.previewUrl;
      audio.load();
      if (autoplay) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    },
    [tracks],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    function onTimeUpdate() {
      setProgress(audioEl.currentTime);
    }
    function onLoadedMetadata() {
      setDuration(audioEl.duration || currentTrack?.durationSeconds || 0);
    }
    function onEnded() {
      if (currentIndex < tracks.length - 1) {
        void playIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }

    audioEl.addEventListener("timeupdate", onTimeUpdate);
    audioEl.addEventListener("loadedmetadata", onLoadedMetadata);
    audioEl.addEventListener("ended", onEnded);
    return () => {
      audioEl.removeEventListener("timeupdate", onTimeUpdate);
      audioEl.removeEventListener("loadedmetadata", onLoadedMetadata);
      audioEl.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, currentTrack?.durationSeconds, playIndex, tracks.length]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (!audio.src) {
      await playIndex(currentIndex);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }

  function handleStop() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setProgress(0);
    setIsPlaying(false);
  }

  function handleSeek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setProgress(value);
  }

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (index === currentIndex || index === currentIndex + 1) return;
      const { items, newCurrentIndex } = moveToPlayNext(
        tracks,
        index,
        currentIndex,
      );
      setTracks(items);
      setCurrentIndex(newCurrentIndex);
    },
    [tracks, currentIndex],
  );

  const handleRemove = useCallback(
    async (itemId: string, index: number): Promise<boolean> => {
      setDeleteLoadingId(itemId);
      try {
        const response = await fetch(
          `/api/collections/${encodeURIComponent(collectionSlug)}/items/${encodeURIComponent(itemId)}`,
          { method: "DELETE" },
        );
        if (!response.ok) {
          return false;
        }

        const wasCurrent = index === currentIndex;
        const wasPlaying = isPlaying && wasCurrent;
        const { items, newCurrentIndex } = removeQueueItem(
          tracks,
          index,
          currentIndex,
        );
        setTracks(items);

        if (items.length === 0) {
          const audio = audioRef.current;
          if (audio) {
            audio.pause();
            audio.src = "";
          }
          setIsPlaying(false);
          setProgress(0);
          setCurrentIndex(0);
          return true;
        }

        setCurrentIndex(newCurrentIndex);

        if (wasCurrent) {
          const audio = audioRef.current;
          const nextTrack = items[newCurrentIndex];
          if (!audio || !nextTrack) return true;
          audio.src = nextTrack.previewUrl;
          audio.load();
          setProgress(0);
          if (wasPlaying) {
            try {
              await audio.play();
              setIsPlaying(true);
            } catch {
              setIsPlaying(false);
            }
          } else {
            setIsPlaying(false);
          }
        }
        return true;
      } finally {
        setDeleteLoadingId(null);
      }
    },
    [collectionSlug, tracks, currentIndex, isPlaying],
  );

  const progressMax = duration || currentTrack?.durationSeconds || 1;
  const bannerUrl =
    currentTrack?.backdropUrl ?? currentTrack?.imageUrl ?? queue.imageUrl;
  const theme = useMemo(
    () => getPlayAccentTheme(currentTrack?.accent),
    [currentTrack?.accent],
  );

  return (
    <div className={cn("relative w-full", PLAY_MIN_H)}>
      <PlayAmbientBackground
        accent={currentTrack?.accent}
        imageUrl={bannerUrl}
      />

      <div className={cn("relative z-10 grid lg:grid-cols-[7fr_3fr]", PLAY_MIN_H)}>
      <audio ref={audioRef} preload="metadata" className="hidden" />

      {/* Left 70% — queue */}
      <div className="overflow-y-auto border-b border-white/[0.08] px-4 py-4 sm:px-6 sm:py-5 lg:border-b-0 lg:border-r">
        <CollectionPlayHeader
          label="Music playlist"
          name={queue.name}
          description={queue.description}
          meta={`${queue.ownerName} · ${tracks.length} songs`}
          imageUrl={queue.imageUrl}
          theme={theme}
          action={
            <button
              type="button"
              onClick={() => void playIndex(0)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:opacity-95"
              style={{ background: theme.gradient, boxShadow: theme.glow }}
            >
              <Play className="size-4 fill-current" />
              Play all
            </button>
          }
        />

        <div className="mb-2 hidden grid-cols-[40px_52px_minmax(0,1fr)_72px_80px] gap-3 border-b border-white/[0.08] px-2 pb-2 text-[10px] font-medium uppercase tracking-wide text-white/40 sm:grid">
          <span>#</span>
          <span>Cover</span>
          <span>Title</span>
          <span className="text-right">Time</span>
          <span />
        </div>

        <ol className="flex flex-col gap-0.5">
          {tracks.map((track, index) => {
            const active = index === currentIndex;
            return (
              <li key={track.itemId}>
                <div
                  className={cn(
                    "group grid w-full grid-cols-[32px_48px_minmax(0,1fr)_56px_72px] items-center gap-3 rounded-lg px-2 py-2.5 sm:grid-cols-[40px_52px_minmax(0,1fr)_72px_80px]",
                    !active && "hover:bg-white/[0.05]",
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: theme.activeRow,
                          boxShadow: `inset 3px 0 0 ${theme.primary}`,
                        }
                      : undefined
                  }
                >
                  <button
                    type="button"
                    onClick={() => void playIndex(index)}
                    className="contents text-left"
                  >
                    <span className="text-center text-sm text-white/50 group-hover:hidden">
                      {active && isPlaying ? (
                        <span
                          className="inline-block size-2 animate-pulse rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                      ) : (
                        track.position
                      )}
                    </span>
                    <span
                      className="hidden group-hover:inline"
                      style={{ color: theme.primary }}
                    >
                      {active && isPlaying ? (
                        <Pause className="mx-auto size-4" />
                      ) : (
                        <Play className="mx-auto size-4 fill-current" />
                      )}
                    </span>

                    <QueueCover
                      imageUrl={track.imageUrl}
                      title={track.title}
                      theme={theme}
                    />

                    <span className="min-w-0">
                      <span
                        className="block truncate text-sm font-medium"
                        style={active ? { color: theme.primary } : { color: "white" }}
                      >
                        {track.title}
                      </span>
                      <span className="block truncate text-xs text-white/55">
                        {track.artist}
                        {track.source ? ` · ${track.source}` : ""}
                      </span>
                    </span>

                    <span className="text-right text-xs text-white/45">
                      {track.durationLabel}
                    </span>
                  </button>

                  <PlayQueueRowActions
                    onAddToQueue={() => handleAddToQueue(index)}
                    onDelete={() => handleRemove(track.itemId, index)}
                    canDelete={canManage}
                    itemTitle={track.title}
                    collectionName={queue.name}
                    addDisabled={
                      index === currentIndex || index === currentIndex + 1
                    }
                    deleteLoading={deleteLoadingId === track.itemId}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Right 30% — now playing */}
      <aside
        className={cn(
          "flex flex-col overflow-y-auto px-4 py-4 sm:px-5 sm:py-5",
          PLAY_STICKY_TOP,
          PLAY_PANEL_H,
        )}
        style={{
          borderLeft: `1px solid ${theme.border}`,
          backgroundColor: "rgba(12,10,20,0.72)",
        }}
      >
        {currentTrack ? (
          <>
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/40 shadow-2xl ring-1"
              style={{ borderColor: theme.border }}
            >
              {bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bannerUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div
                  className="flex size-full items-center justify-center text-3xl font-bold text-white/60"
                  style={{ background: theme.gradientSoft }}
                >
                  {currentTrack.title.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="truncate text-lg font-bold text-white">
                  {currentTrack.title}
                </p>
                <p className="truncate text-sm text-white/70">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Chip musicKind={currentTrack.kind}>
                {kindLabel(currentTrack.kind)}
              </Chip>
              {currentTrack.source ? (
                <Chip chipKey="show">{currentTrack.source}</Chip>
              ) : null}
              {currentTrack.genreLabels.map((genre) => (
                <Chip key={genre.id} genreId={genre.id} genreLabel={genre.label}>
                  {genre.label}
                </Chip>
              ))}
              {currentTrack.rating ? (
                <RatingChip rating={currentTrack.rating} />
              ) : null}
            </div>

            {currentTrack.description ? (
              <p className="mt-3 line-clamp-2 text-xs text-white/55">
                {currentTrack.description}
              </p>
            ) : null}

            <div className="mt-5 space-y-2">
              <input
                type="range"
                min={0}
                max={progressMax}
                step={1}
                value={progress}
                onChange={(event) => handleSeek(Number(event.target.value))}
                className="h-1.5 w-full cursor-pointer"
                style={{ accentColor: theme.slider }}
                aria-label="Playback progress"
              />
              <div className="flex justify-between text-[10px] text-white/45">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(progressMax)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Previous track"
                disabled={currentIndex === 0}
                onClick={() => void playIndex(currentIndex - 1)}
                className="rounded-full p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <SkipBack className="size-5" />
              </button>
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={() => void togglePlay()}
                className="rounded-full p-3 text-white shadow-lg transition hover:scale-105"
                style={{ background: theme.gradient, boxShadow: theme.glow }}
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5 fill-current" />
                )}
              </button>
              <button
                type="button"
                aria-label="Stop"
                onClick={handleStop}
                className="rounded-full p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Square className="size-4 fill-current" />
              </button>
              <button
                type="button"
                aria-label="Next track"
                disabled={currentIndex >= tracks.length - 1}
                onClick={() => void playIndex(currentIndex + 1)}
                className="rounded-full p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <SkipForward className="size-5" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Volume2 className="size-4 shrink-0 text-white/45" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="h-1 flex-1 cursor-pointer"
                style={{ accentColor: theme.slider }}
                aria-label="Volume"
              />
            </div>

            <Link
              href={getSongDetailPath(currentTrack.id)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs text-white/80 transition hover:bg-white/5"
              style={{ borderColor: theme.border }}
            >
              Open song page
              <ExternalLink className="size-3" />
            </Link>

            <LyricsPanel
              lyrics={currentTrack.lyrics}
              progress={progress}
              duration={progressMax}
              theme={theme}
            />
          </>
        ) : (
          <p className="text-sm text-white/50">Select a track to start listening.</p>
        )}
      </aside>
      </div>
    </div>
  );
}

function ContentPlayQueue({
  queue,
  collectionSlug,
}: {
  queue: CollectionPlayQueue & { items: CollectionPlayContentItem[] };
  collectionSlug: string;
}) {
  const [items, setItems] = useState(queue.items);
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const canManage = queue.canManage ?? false;

  useEffect(() => {
    setItems(queue.items);
  }, [queue.items]);

  const activeItem = items[activeIndex];

  const bannerUrl =
    activeItem?.backdropUrl ?? activeItem?.imageUrl ?? queue.imageUrl;
  const theme = useMemo(
    () => getPlayAccentTheme(activeItem?.accent),
    [activeItem?.accent],
  );

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (index === activeIndex || index === activeIndex + 1) return;
      const { items: nextItems, newCurrentIndex } = moveToPlayNext(
        items,
        index,
        activeIndex,
      );
      setItems(nextItems);
      setActiveIndex(newCurrentIndex);
    },
    [items, activeIndex],
  );

  const handleRemove = useCallback(
    async (itemId: string, index: number): Promise<boolean> => {
      setDeleteLoadingId(itemId);
      try {
        const response = await fetch(
          `/api/collections/${encodeURIComponent(collectionSlug)}/items/${encodeURIComponent(itemId)}`,
          { method: "DELETE" },
        );
        if (!response.ok) {
          return false;
        }

        const { items: nextItems, newCurrentIndex } = removeQueueItem(
          items,
          index,
          activeIndex,
        );
        setItems(nextItems);
        setActiveIndex(
          nextItems.length === 0 ? 0 : Math.min(newCurrentIndex, nextItems.length - 1),
        );
        return true;
      } finally {
        setDeleteLoadingId(null);
      }
    },
    [collectionSlug, items, activeIndex],
  );

  return (
    <div className={cn("relative w-full", PLAY_MIN_H)}>
      <PlayAmbientBackground accent={activeItem?.accent} imageUrl={bannerUrl} />

      <div className={cn("relative z-10 grid lg:grid-cols-[7fr_3fr]", PLAY_MIN_H)}>
      {/* Left 70% — binge queue */}
      <div className="overflow-y-auto border-b border-white/[0.08] px-4 py-4 sm:px-6 sm:py-5 lg:border-b-0 lg:border-r">
        <CollectionPlayHeader
          label="Content collection"
          name={queue.name}
          description={queue.description}
          meta={`${queue.ownerName} · ${items.length} titles`}
          imageUrl={queue.imageUrl}
          theme={theme}
        />

        <div className="mb-2 hidden grid-cols-[40px_52px_minmax(0,1fr)_120px] gap-3 border-b border-white/[0.08] px-2 pb-2 text-[10px] font-medium uppercase tracking-wide text-white/40 sm:grid">
          <span>#</span>
          <span>Cover</span>
          <span>Title</span>
          <span className="text-right">Actions</span>
        </div>

        <ol className="flex flex-col gap-0.5">
          {items.map((item, index) => {
            const active = index === activeIndex;
            return (
              <li key={item.itemId}>
                <div
                  className={cn(
                    "group grid grid-cols-[40px_48px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-2.5 sm:grid-cols-[40px_52px_minmax(0,1fr)_120px]",
                    !active && "hover:bg-white/[0.05]",
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: theme.activeRow,
                          boxShadow: `inset 3px 0 0 ${theme.primary}`,
                        }
                      : undefined
                  }
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="contents text-left"
                  >
                    <span className="text-center text-sm text-white/50">
                      {active ? (
                        <span
                          className="inline-block size-2 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                      ) : (
                        item.position
                      )}
                    </span>

                    <QueueCover
                      imageUrl={item.imageUrl}
                      title={item.title}
                      theme={theme}
                    />

                    <span className="min-w-0">
                      <span
                        className="block truncate text-sm font-medium"
                        style={active ? { color: theme.primary } : { color: "white" }}
                      >
                        {item.title}
                      </span>
                      <span className="block truncate text-xs capitalize text-white/55">
                        {item.type}
                        {item.meta ? ` · ${item.meta}` : ""}
                        {item.year ? ` · ${item.year}` : ""}
                      </span>
                    </span>
                  </button>

                  <div className="flex items-center justify-end gap-1">
                    <PlayQueueRowActions
                      onAddToQueue={() => handleAddToQueue(index)}
                      onDelete={() => handleRemove(item.itemId, index)}
                      canDelete={canManage}
                      itemTitle={item.title}
                      collectionName={queue.name}
                      addDisabled={
                        index === activeIndex || index === activeIndex + 1
                      }
                      deleteLoading={deleteLoadingId === item.itemId}
                    />
                    <Link
                      href={getContentDetailPath(item.id)}
                      className="rounded-full border px-3 py-1 text-center text-xs text-white transition hover:bg-white/5"
                      style={{ borderColor: theme.border }}
                    >
                      Watch
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Right 30% — now watching panel */}
      <aside
        className={cn(
          "flex flex-col overflow-y-auto px-4 py-4 sm:px-5 sm:py-5",
          PLAY_STICKY_TOP,
          PLAY_PANEL_H,
        )}
        style={{
          borderLeft: `1px solid ${theme.border}`,
          backgroundColor: "rgba(12,10,20,0.72)",
        }}
      >
        {activeItem ? (
          <>
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/40 shadow-2xl ring-1"
              style={{ borderColor: theme.border }}
            >
              {bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bannerUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div
                  className="flex size-full items-center justify-center text-3xl font-bold text-white/60"
                  style={{ background: theme.gradientSoft }}
                >
                  {activeItem.title.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="truncate text-lg font-bold text-white">
                  {activeItem.title}
                </p>
                <p className="truncate text-sm capitalize text-white/70">
                  {activeItem.type}
                  {activeItem.year ? ` · ${activeItem.year}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Chip mediaType={activeItem.type}>{activeItem.type}</Chip>
              {activeItem.genres.map((genre) => (
                <Chip key={genre.id} genreId={genre.id} genreLabel={genre.label}>
                  {genre.label}
                </Chip>
              ))}
              {activeItem.highlightTags?.map((tag) => (
                <Chip key={tag} chipKey="default">
                  {tag}
                </Chip>
              ))}
              {activeItem.rating ? (
                <RatingChip rating={activeItem.rating} />
              ) : null}
            </div>

            {activeItem.meta ? (
              <p className="mt-3 text-xs text-white/55">{activeItem.meta}</p>
            ) : null}

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Previous title"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="rounded-full p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <SkipBack className="size-5" />
              </button>
              <Link
                href={getContentDetailPath(activeItem.id)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:opacity-95"
                style={{ background: theme.gradient, boxShadow: theme.glow }}
              >
                <Play className="size-4 fill-current" />
                Watch now
              </Link>
              <button
                type="button"
                aria-label="Next title"
                disabled={activeIndex >= items.length - 1}
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="rounded-full p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <SkipForward className="size-5" />
              </button>
            </div>

            <p className="mt-3 text-center text-[10px] text-white/40">
              {activeIndex + 1} of {items.length} in queue
            </p>

            <Link
              href={getContentDetailPath(activeItem.id)}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs text-white/80 transition hover:bg-white/5"
              style={{ borderColor: theme.border }}
            >
              Open title page
              <ExternalLink className="size-3" />
            </Link>

            <SynopsisPanel
              synopsis={activeItem.synopsis ?? activeItem.description}
              activeIndex={activeIndex}
              theme={theme}
            />
          </>
        ) : (
          <p className="text-sm text-white/50">Select a title to start watching.</p>
        )}
      </aside>
      </div>
    </div>
  );
}

export function CollectionPlayView({
  collectionSlug,
  initialQueue,
}: CollectionPlayViewProps) {
  const [queue, setQueue] = useState<CollectionPlayQueue | null>(
    initialQueue ?? null,
  );
  const [loading, setLoading] = useState(!initialQueue);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (initialQueue) {
      setQueue(initialQueue);
      setLoading(false);
      setError(undefined);
      return;
    }

    setLoading(true);
    setError(undefined);

    fetch(`/api/collections/${encodeURIComponent(collectionSlug)}/play`)
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "Could not load playlist.",
          );
        }
        return response.json() as Promise<{ queue: CollectionPlayQueue }>;
      })
      .then((data) => setQueue(data.queue))
      .catch((fetchError: Error) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, [collectionSlug, initialQueue]);

  const isEmpty = useMemo(() => {
    if (!queue) return false;
    return queue.itemCount === 0;
  }, [queue]);

  return (
    <div className={cn("relative w-full bg-transparent", PLAY_MIN_H)}>
      {loading ? (
        <p className="relative z-10 px-6 py-8 text-sm text-white/55">Loading playlist…</p>
      ) : error ? (
        <p className="relative z-10 px-6 py-8 text-sm text-red-400">{error}</p>
      ) : !queue ? (
        <p className="relative z-10 px-6 py-8 text-sm text-white/55">Playlist not found.</p>
      ) : isEmpty ? (
        <div className="relative z-10 px-6 py-8">
          <p className="text-sm text-white/55">
            This collection has no items yet. Add songs or titles from the
            collection page first.
          </p>
          <Link
            href={getCollectionDetailPath(collectionSlug)}
            className="mt-4 inline-block text-sm font-semibold text-brand-magenta hover:underline"
          >
            Go to collection
          </Link>
        </div>
      ) : queue.collectionKind === "music" && queue.tracks?.length ? (
        <MusicPlayQueue
          queue={{ ...queue, tracks: queue.tracks }}
          collectionSlug={collectionSlug}
        />
      ) : queue.items?.length ? (
        <ContentPlayQueue
          queue={{ ...queue, items: queue.items }}
          collectionSlug={collectionSlug}
        />
      ) : (
        <p className="relative z-10 px-6 py-8 text-sm text-white/55">Nothing to play.</p>
      )}
    </div>
  );
}
