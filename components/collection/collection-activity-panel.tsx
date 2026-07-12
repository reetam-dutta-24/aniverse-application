import Link from "next/link";
import { Heart, PlayCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContentDetailPath } from "@/lib/content-routes";
import { getSongDetailPath } from "@/lib/song-routes";
import {
  COLLECTION_MEDIA_COPY,
  type CollectionMediaVariant,
} from "@/lib/collection-media-copy";
import {
  detailHeroBtnBase,
  DETAIL_HERO_BTN_GROUP,
} from "@/lib/detail-route-ui";
import { AvatarStack } from "@/components/ui/avatar-stack";
import type { CollectionCurrentActivity, UserSummary } from "@/types";

export interface CollectionActivityPanelProps {
  activity?: CollectionCurrentActivity;
  fallbackImageUrl?: string;
  fallbackTitle?: string;
  contributors: UserSummary[];
  contributorSummary?: string;
  variant?: CollectionMediaVariant;
}

/** Right hero panel — image + CTAs capped to hero height. */
export function CollectionActivityPanel({
  activity,
  fallbackImageUrl,
  fallbackTitle,
  contributors,
  contributorSummary,
  variant = "content",
}: CollectionActivityPanelProps) {
  const copy = COLLECTION_MEDIA_COPY[variant];
  const imageUrl = activity?.imageUrl ?? fallbackImageUrl ?? "";
  const title = activity?.title ?? fallbackTitle ?? "Featured";

  return (
    <aside className="flex h-full min-h-0 max-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden bg-black">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="size-full object-cover object-top"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/25 via-transparent to-black/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-black to-transparent"
        />
      </div>

      <div className="flex shrink-0 flex-col gap-2.5 px-4 pb-4 pt-2 sm:gap-3 sm:px-5 sm:pb-5">
        {activity ? (
          <div className="space-y-1.5 text-center">
            <h2 className="text-base font-bold leading-snug text-white sm:text-lg">
              {activity.statusLabel}
            </h2>
            <p className="text-sm text-white/85">
              {activity.episodeLabel && activity.seasonLabel
                ? `${activity.episodeLabel}  ${activity.seasonLabel}`
                : activity.progressLabel}
            </p>
          </div>
        ) : null}

        <div className={DETAIL_HERO_BTN_GROUP}>
          <button
            type="button"
            className={detailHeroBtnBase(
              "border-2 border-brand-magenta bg-black text-white shadow-[0_0_14px_rgba(255,0,204,0.45)]",
            )}
          >
            <PlayCircle className="size-4 shrink-0 text-brand-magenta" />
            <span className="truncate">{copy.resumeCta}</span>
          </button>

          <button
            type="button"
            className={detailHeroBtnBase(
              "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white",
            )}
          >
            <Plus className="size-3.5 shrink-0" />
            <span className="truncate">Add Collaborators</span>
          </button>
        </div>

        {contributors.length > 0 ? (
          <div className="flex items-center gap-3 py-1">
            <AvatarStack users={contributors} max={3} size="md" />
            {contributorSummary ? (
              <p className="min-w-0 flex-1 text-left text-[11px] leading-relaxed text-white/80 sm:text-xs">
                {contributorSummary}
              </p>
            ) : null}
          </div>
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

          {activity ? (
            <Link
              href={
                variant === "music"
                  ? getSongDetailPath(activity.contentId)
                  : getContentDetailPath(activity.contentId)
              }
              className={detailHeroBtnBase(
                "border-transparent bg-gradient-to-r from-amber-500 to-yellow-500 font-bold text-black",
              )}
            >
              <span className="truncate">{copy.detailsCta}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
