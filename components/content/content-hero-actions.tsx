"use client";

import { PlayCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AccentColor, ContentDetail, Episode } from "@/types";

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
    watch:
      "border-transparent bg-gradient-to-r from-amber-500 to-orange-600 hover:border-amber-400 hover:from-transparent hover:to-transparent",
    share: "border-indigo-400/60 bg-indigo-500/10 hover:bg-indigo-500/20",
    shareIcon: "text-indigo-300",
  },
  pink: {
    watch:
      "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:border-fuchsia-400 hover:from-transparent hover:to-transparent",
    share: "border-teal-400/60 bg-teal-500/10 hover:bg-teal-500/20",
    shareIcon: "text-teal-300",
  },
};

export function ContentHeroActions({
  content,
  continueEpisode,
}: ContentHeroActionsProps) {
  const isWatching = continueEpisode != null;
  const season = continueEpisode?.seasonNumber ?? 1;
  const episodeNum = continueEpisode?.number ?? 1;
  const accent = content.accent ?? "blue";
  const cta = CTA_PAIR[accent];

  const watchLabel = isWatching
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
    <div className="mt-3 flex w-full items-center justify-between gap-3">
      <Button
        size="sm"
        className={cn(
          "h-10 min-w-0 shrink gap-2 rounded-full px-4 text-sm sm:px-5",
          cta.watch,
        )}
      >
        <PlayCircle className="size-4 shrink-0" />
        <span className="truncate">{watchLabel}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        className={cn(
          "h-10 shrink-0 gap-2 rounded-full px-5 text-sm text-white",
          cta.share,
        )}
      >
        <Share2 className={cn("size-4 shrink-0", cta.shareIcon)} />
        Share
      </Button>
    </div>
  );
}
