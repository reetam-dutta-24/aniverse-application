"use client";

import { PlayCircle, Plus } from "lucide-react";
import type { AccentColor, ContentDetail, Episode } from "@/types";
import { getAccentTint, getTintOuterGlow } from "@/lib/card-theme";
import { ContentPageSection } from "@/components/content/content-page-section";
import { GradientButton } from "@/components/ui/gradient-button";
import { DetailImage } from "@/components/ui/detail-image";

interface ContentMovieSectionProps {
  content: ContentDetail;
  episode?: Episode;
  contentAccent?: AccentColor;
}

/** Single full-movie watch card — replaces episode carousel for films. */
export function ContentMovieSection({
  content,
  episode,
  contentAccent,
}: ContentMovieSectionProps) {
  const tint = getAccentTint(contentAccent ?? content.accent);
  const duration =
    episode?.duration?.replace("m", " Min") ??
    content.metadata.episodeDuration ??
    "Full Movie";

  return (
    <ContentPageSection
      title="🎬 Watch This Movie"
      variant="episode"
      overflowVisible
      itemsCenter
      slides={[
        {
          id: episode?.id ?? `${content.id}-movie`,
          node: (
            <article className="relative mx-auto w-full max-w-[420px]">
              <div
                className="flex flex-col overflow-hidden rounded-2xl bg-black"
                style={{ boxShadow: getTintOuterGlow(tint.glass, 14) }}
              >
                <div className="relative h-[240px] w-full overflow-hidden sm:h-[280px]">
                  <DetailImage
                    src={episode?.thumbnailUrl ?? content.backdropUrl ?? content.imageUrl}
                    alt={content.title}
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-4">
                    <button
                      type="button"
                      className="flex cursor-pointer items-center gap-2 rounded-full border border-brand-magenta bg-black/80 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/20"
                    >
                      <PlayCircle className="size-5 text-brand-magenta" />
                      Watch Now
                    </button>
                    <GradientButton size="sm" className="h-8 rounded-full px-3 text-xs">
                      <Plus className="size-3.5" />
                      Watchlist
                    </GradientButton>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <p className="text-lg font-bold text-white">{content.title}</p>
                  <p className="text-sm text-white/70">{duration}</p>
                  {episode?.description ? (
                    <p className="line-clamp-3 text-sm leading-relaxed text-white/85">
                      {episode.description}
                    </p>
                  ) : (
                    <p className="line-clamp-3 text-sm leading-relaxed text-white/85">
                      {content.synopsis}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ),
        },
      ]}
    />
  );
}
