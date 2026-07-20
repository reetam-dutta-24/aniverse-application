"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAppRouter } from "@/hooks/use-app-router";
import {
  ArrowLeft,
  Maximize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEpisodeDisplayTitle } from "@/lib/format-episode-title";
import { getContentDetailPath, getContentWatchPath } from "@/lib/content-routes";
import { resolvePlayableVideoUrl } from "@/lib/services/content-play.service";
import { getAccentTint } from "@/lib/card-theme";
import { isMovieContentType } from "@/lib/content-media";
import { HdImage } from "@/components/ui/hd-image";
import type { ContentPlaySession } from "@/types";

interface ContentPlayViewProps {
  session: ContentPlaySession;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function ContentPlayView({ session }: ContentPlayViewProps) {
  const router = useAppRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEpisodeId, setActiveEpisodeId] = useState(session.currentEpisodeId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const tint = getAccentTint(session.accent);
  const isMovie = isMovieContentType(session.contentType);
  const activeEpisode = useMemo(
    () =>
      session.episodes.find((episode) => episode.id === activeEpisodeId) ??
      session.episodes[0],
    [session.episodes, activeEpisodeId],
  );
  const videoUrl = resolvePlayableVideoUrl(session, activeEpisodeId);
  const displayTitle = activeEpisode
    ? formatEpisodeDisplayTitle(activeEpisode.title, activeEpisode.number)
    : session.contentTitle;

  const episodeIndex = session.episodes.findIndex(
    (episode) => episode.id === activeEpisodeId,
  );
  const hasPrevious = episodeIndex > 0;
  const hasNext =
    episodeIndex >= 0 && episodeIndex < session.episodes.length - 1;

  const syncDuration = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
  }, []);

  useEffect(() => {
    setActiveEpisodeId(session.currentEpisodeId);
  }, [session.currentEpisodeId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function onTimeUpdate() {
      setProgress(video!.currentTime);
    }
    function onPlay() {
      setIsPlaying(true);
    }
    function onPause() {
      setIsPlaying(false);
    }
    function onEnded() {
      setIsPlaying(false);
      if (hasNext) {
        const nextEpisode = session.episodes[episodeIndex + 1];
        if (nextEpisode) {
          router.push(getContentWatchPath(session.contentSlug, nextEpisode.id));
        }
      }
    }

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", syncDuration);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", syncDuration);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [
    episodeIndex,
    hasNext,
    router,
    session.contentSlug,
    session.episodes,
    syncDuration,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
  }, [activeEpisodeId, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    let timer: number | undefined;
    if (isPlaying) {
      timer = window.setTimeout(() => setShowControls(false), 2800);
    } else {
      setShowControls(true);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isPlaying, progress]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video || !videoUrl) return;
    if (isPlaying) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      setIsPlaying(false);
    }
  }

  function handleSeek(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setProgress(value);
  }

  function goToEpisode(episodeId: string) {
    if (episodeId === activeEpisodeId) return;
    router.push(getContentWatchPath(session.contentSlug, episodeId));
    setActiveEpisodeId(episodeId);
  }

  function goPrevious() {
    if (!hasPrevious) return;
    const previous = session.episodes[episodeIndex - 1];
    if (previous) goToEpisode(previous.id);
  }

  function goNext() {
    if (!hasNext) return;
    const next = session.episodes[episodeIndex + 1];
    if (next) goToEpisode(next.id);
  }

  async function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await container.requestFullscreen();
  }

  const progressMax = duration > 0 ? duration : 1;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-8 lg:flex-row lg:px-12">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={getContentDetailPath(session.contentSlug)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-brand-magenta"
          >
            <ArrowLeft className="size-4" />
            Back to {session.contentTitle}
          </Link>
          {!isMovie && activeEpisode ? (
            <p className="text-xs font-medium text-white/60 sm:text-sm">
              S{activeEpisode.seasonNumber ?? 1} · E{activeEpisode.number}
            </p>
          ) : null}
        </div>

        <div
          ref={containerRef}
          className="group relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10"
          onMouseMove={() => setShowControls(true)}
          onMouseLeave={() => {
            if (isPlaying) setShowControls(false);
          }}
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="aspect-video w-full bg-black object-contain"
              playsInline
              preload="metadata"
              onClick={() => void togglePlayback()}
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
              <p className="text-lg font-semibold text-white">Video not available yet</p>
              <p className="max-w-md text-sm text-white/65">
                Add an MP4 link in the admin CMS for this{" "}
                {isMovie ? "title" : "episode"} to enable playback.
              </p>
            </div>
          )}

          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 transition-opacity duration-500",
              showControls || !videoUrl ? "opacity-100" : "opacity-0",
            )}
          />

          <div
            className={cn(
              "absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 transition-opacity duration-500",
              showControls || !videoUrl ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white sm:text-base">
                {displayTitle}
              </p>
              <p className="truncate text-xs text-white/70">{session.contentTitle}</p>
            </div>
          </div>

          {videoUrl ? (
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 space-y-3 p-4 transition-opacity duration-500",
                showControls ? "opacity-100" : "opacity-0",
              )}
            >
              <input
                type="range"
                min={0}
                max={progressMax}
                step={0.1}
                value={progress}
                onChange={(event) => handleSeek(Number(event.target.value))}
                className="h-1.5 w-full cursor-pointer accent-brand-magenta"
                aria-label="Playback progress"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {!isMovie ? (
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={!hasPrevious}
                      aria-label="Previous episode"
                      className="cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <SkipBack className="size-5" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void togglePlayback()}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="cursor-pointer rounded-full bg-brand-magenta p-2.5 text-white transition-transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause className="size-5 fill-current" />
                    ) : (
                      <Play className="size-5 fill-current" />
                    )}
                  </button>
                  {!isMovie ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!hasNext}
                      aria-label="Next episode"
                      className="cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <SkipForward className="size-5" />
                    </button>
                  ) : null}
                  <span className="ml-1 text-xs text-white/75">
                    {formatTime(progress)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMuted((current) => !current)}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/10"
                  >
                    {muted ? (
                      <VolumeX className="size-5" />
                    ) : (
                      <Volume2 className="size-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setVolume(next);
                      setMuted(next === 0);
                    }}
                    className="hidden w-20 cursor-pointer accent-brand-magenta sm:block"
                    aria-label="Volume"
                  />
                  <button
                    type="button"
                    onClick={() => void toggleFullscreen()}
                    aria-label="Fullscreen"
                    className="cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/10"
                  >
                    <Maximize className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {!isMovie && session.episodes.length > 1 ? (
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-[320px]">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/70">
            Episodes
          </h2>
          <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
            {session.episodes.map((episode) => {
              const isActive = episode.id === activeEpisodeId;
              const label = formatEpisodeDisplayTitle(
                episode.title,
                episode.number,
              );
              return (
                <button
                  key={episode.id}
                  type="button"
                  onClick={() => goToEpisode(episode.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-300",
                    isActive
                      ? "border-brand-magenta bg-brand-magenta/15"
                      : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10",
                  )}
                >
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-black/50">
                    {episode.thumbnailUrl ? (
                      <HdImage
                        src={episode.thumbnailUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex size-full items-center justify-center text-xs font-bold text-white/70"
                        style={{ background: tint.gradientSoft }}
                      >
                        E{episode.number}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      {label}
                    </span>
                    <span className="block text-xs text-white/55">
                      S{episode.seasonNumber ?? 1} · E{episode.number}
                      {episode.duration ? ` · ${episode.duration}` : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
