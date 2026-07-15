"use client";

import { PlayCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DETAIL_HERO_BTN_PAIR_ROW,
  DETAIL_HERO_BTN_ACCENT_PLAY,
  detailHeroBtnBase,
} from "@/lib/detail-route-ui";
import type { AccentColor, ContentDetail, Episode, MediaType } from "@/types";
import { isMovieContentType } from "@/lib/content-media";

function isSongMedia(type: MediaType) {
  return type === "song" || type === "album" || type === "playlist";
}

export interface ContentHeroActionsProps {
  content: ContentDetail;
  continueEpisode: Episode | null;
}

/** Watch + share CTAs — accent-tinted, distinct from brand-magenta KPI chips. */
const CTA_PAIR: Record<
  AccentColor,
  { watch: string; share: string; shareIcon: string }
> = {
  blue: {
    watch:
      "border-transparent bg-gradient-blue-violet hover:border-blue-400 hover:bg-transparent hover:[background-image:none]",
    share: "border-cyan-400/70 bg-cyan-500/10 hover:bg-cyan-500/20",
    shareIcon: "text-cyan-300",
  },
  purple: {
    watch:
      "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 hover:border-violet-400 hover:from-transparent hover:to-transparent",
    share: "border-amber-400/60 bg-amber-500/10 hover:bg-amber-500/20",
    shareIcon: "text-amber-300",
  },
  cyan: {
    watch:
      "border-transparent bg-gradient-to-r from-cyan-500 to-teal-600 hover:border-cyan-400 hover:from-transparent hover:to-transparent",
    share: "border-violet-400/60 bg-violet-500/10 hover:bg-violet-500/20",
    shareIcon: "text-violet-300",
  },
  green: {
    watch:
      "border-transparent bg-gradient-to-r from-emerald-600 to-teal-600 hover:border-emerald-400 hover:from-transparent hover:to-transparent",
    share: "border-sky-400/60 bg-sky-500/10 hover:bg-sky-500/20",
    shareIcon: "text-sky-300",
  },
  yellow: {
    watch: DETAIL_HERO_BTN_ACCENT_PLAY,
    share: "border-indigo-400/60 bg-indigo-500/10 hover:bg-indigo-500/20",
    shareIcon: "text-indigo-300",
  },
  pink: {
    watch:
      "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:border-fuchsia-400 hover:from-transparent hover:to-transparent",
    share: "border-teal-400/60 bg-teal-500/10 hover:bg-teal-500/20",
    shareIcon: "text-teal-300",
  },
  red: {
    watch:
      "border-transparent bg-gradient-to-r from-red-600 to-rose-600 hover:border-red-400 hover:from-transparent hover:to-transparent",
    share: "border-cyan-400/60 bg-cyan-500/10 hover:bg-cyan-500/20",
    shareIcon: "text-cyan-300",
  },
  orange: {
    watch:
      "border-transparent bg-gradient-to-r from-orange-500 to-amber-600 hover:border-orange-400 hover:from-transparent hover:to-transparent",
    share: "border-indigo-400/60 bg-indigo-500/10 hover:bg-indigo-500/20",
    shareIcon: "text-indigo-300",
  },
  teal: {
    watch:
      "border-transparent bg-gradient-to-r from-teal-500 to-cyan-600 hover:border-teal-400 hover:from-transparent hover:to-transparent",
    share: "border-fuchsia-400/60 bg-fuchsia-500/10 hover:bg-fuchsia-500/20",
    shareIcon: "text-fuchsia-300",
  },
  indigo: {
    watch:
      "border-transparent bg-gradient-to-r from-indigo-600 to-blue-600 hover:border-indigo-400 hover:from-transparent hover:to-transparent",
    share: "border-amber-400/60 bg-amber-500/10 hover:bg-amber-500/20",
    shareIcon: "text-amber-300",
  },
  rose: {
    watch:
      "border-transparent bg-gradient-to-r from-rose-600 to-pink-600 hover:border-rose-400 hover:from-transparent hover:to-transparent",
    share: "border-sky-400/60 bg-sky-500/10 hover:bg-sky-500/20",
    shareIcon: "text-sky-300",
  },
  lime: {
    watch:
      "border-transparent bg-gradient-to-r from-lime-500 to-green-600 hover:border-lime-400 hover:from-transparent hover:to-transparent",
    share: "border-violet-400/60 bg-violet-500/10 hover:bg-violet-500/20",
    shareIcon: "text-violet-300",
  },
  amber: {
    watch:
      "border-transparent bg-gradient-to-r from-amber-500 to-orange-600 hover:border-amber-400 hover:from-transparent hover:to-transparent",
    share: "border-blue-400/60 bg-blue-500/10 hover:bg-blue-500/20",
    shareIcon: "text-blue-300",
  },
  violet: {
    watch:
      "border-transparent bg-gradient-to-r from-violet-600 to-purple-600 hover:border-violet-400 hover:from-transparent hover:to-transparent",
    share: "border-emerald-400/60 bg-emerald-500/10 hover:bg-emerald-500/20",
    shareIcon: "text-emerald-300",
  },
  fuchsia: {
    watch:
      "border-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:border-fuchsia-400 hover:from-transparent hover:to-transparent",
    share: "border-teal-400/60 bg-teal-500/10 hover:bg-teal-500/20",
    shareIcon: "text-teal-300",
  },
  sky: {
    watch:
      "border-transparent bg-gradient-to-r from-sky-500 to-blue-600 hover:border-sky-400 hover:from-transparent hover:to-transparent",
    share: "border-rose-400/60 bg-rose-500/10 hover:bg-rose-500/20",
    shareIcon: "text-rose-300",
  },
  emerald: {
    watch:
      "border-transparent bg-gradient-to-r from-emerald-600 to-teal-600 hover:border-emerald-400 hover:from-transparent hover:to-transparent",
    share: "border-fuchsia-400/60 bg-fuchsia-500/10 hover:bg-fuchsia-500/20",
    shareIcon: "text-fuchsia-300",
  },
};

const CTA_FALLBACK = CTA_PAIR.blue;

function getCtaPair(accent?: AccentColor) {
  if (accent && accent in CTA_PAIR) return CTA_PAIR[accent];
  return CTA_FALLBACK;
}

export function ContentHeroActions({
  content,
  continueEpisode,
}: ContentHeroActionsProps) {
  const isWatching = continueEpisode != null;
  const season = continueEpisode?.seasonNumber ?? 1;
  const episodeNum = continueEpisode?.number ?? 1;
  const accent = content.accent ?? "blue";
  const cta = getCtaPair(accent);
  const songMedia = isSongMedia(content.type);
  const isMovie = isMovieContentType(content.type);
  const hasResume = songMedia
    ? Boolean(content.resumeLabel)
    : isWatching;

  const watchLabel = songMedia
    ? hasResume
      ? `Continue Listening from ${content.resumeLabel}`
      : "Play Now"
    : isMovie
      ? "Watch Movie"
      : isWatching
        ? `Continue Watching from S${season} E${episodeNum}`
        : "Watch Now";

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: content.title,
      text: `Check out ${content.title} on AniVerse`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled or unsupported payload */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={DETAIL_HERO_BTN_PAIR_ROW}>
      <Button
        size="sm"
        className={cn(detailHeroBtnBase("min-w-0"), cta.watch)}
      >
        <PlayCircle className="size-4 shrink-0" />
        <span className="truncate">{watchLabel}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        className={cn(detailHeroBtnBase(), "text-white", cta.share)}
      >
        <Share2 className={cn("size-4 shrink-0", cta.shareIcon)} />
        Share
      </Button>
    </div>
  );
}
