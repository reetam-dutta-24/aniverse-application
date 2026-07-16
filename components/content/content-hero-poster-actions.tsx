"use client";

import Link from "next/link";
import { PlayCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { isMovieContentType } from "@/lib/content-media";
import {
  detailHeroBtnBase,
  DETAIL_HERO_BTN_GROUP,
  DETAIL_HERO_BTN_ACCENT_SOLID,
} from "@/lib/detail-route-ui";
import { ToggleContentFavoriteButton } from "@/components/forms/toggle-content-favorite-button";
import type { ContentDetail, Episode, MediaType } from "@/types";

function isSongMedia(type: MediaType) {
  return type === "song" || type === "album" || type === "playlist";
}

export interface ContentHeroPosterActionsProps {
  content: ContentDetail;
  continueEpisode: Episode | null;
  initialFavorited?: boolean;
}

export function ContentHeroPosterActions({
  content,
  continueEpisode,
  initialFavorited,
}: ContentHeroPosterActionsProps) {
  const songMedia = isSongMedia(content.type);
  const isMovie = isMovieContentType(content.type);
  const isWatching = continueEpisode != null;
  const season = continueEpisode?.seasonNumber ?? 1;
  const episodeNum = continueEpisode?.number ?? 1;

  const watchLabel = songMedia
    ? content.resumeLabel
      ? `Continue from ${content.resumeLabel}`
      : "Play Now"
    : isMovie
      ? "Watch Movie"
      : isWatching
        ? `Continue S${season} E${episodeNum}`
        : "Watch Now";

  const watchHref = songMedia
    ? `#player`
    : isMovie
      ? "#watch"
      : continueEpisode
        ? `#episode-${continueEpisode.id}`
        : "#episodes";

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 flex flex-col gap-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pb-4 pt-10 sm:gap-3 sm:px-5 sm:pb-5",
      )}
    >
      <div className={DETAIL_HERO_BTN_GROUP}>
        <ToggleContentFavoriteButton
          contentSlug={content.id}
          initialFavorited={initialFavorited}
        />
        <button
          type="button"
          className={detailHeroBtnBase(
            "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white",
          )}
        >
          <Plus className="size-3.5 shrink-0" />
          <span className="truncate">Add To Collection</span>
        </button>
      </div>

      <div className={DETAIL_HERO_BTN_GROUP}>
        <Link
          href={watchHref}
          className={detailHeroBtnBase(DETAIL_HERO_BTN_ACCENT_SOLID)}
        >
          <PlayCircle className="size-4 shrink-0" />
          <span className="truncate">{watchLabel}</span>
        </Link>
      </div>
    </div>
  );
}
