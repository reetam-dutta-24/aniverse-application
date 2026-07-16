"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCommunityDetailPath } from "@/lib/community-routes";
import { getAccentStyle } from "@/lib/accents";
import type { Community, UserSummary } from "@/types";
import { Chip } from "@/components/ui/chip";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Button } from "@/components/ui/button";
import { DeleteCommunityButton } from "@/components/forms/delete-community-button";
import { EditCommunityButton } from "@/components/forms/edit-community-button";
import { cardDeleteActionClass, cardEditActionClass } from "@/lib/form-action-styles";

const activityLabels: Record<
  NonNullable<Community["activityLevel"]>,
  string
> = {
  "very-active": "🔥 Very Active",
  active: "🔥 Active",
  moderate: "Moderate",
  quiet: "Quiet",
};

function formatCount(count: number) {
  return count >= 1000
    ? `${Math.round(count / 1000)}K`
    : count.toLocaleString();
}

export interface CommunityCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  community: Community;
  members?: UserSummary[];
  /** Join for global discover rows; view for joined/favourite rows. */
  ctaMode?: "view" | "join";
  onAction?: () => void;
}

/** Compact community card — flat accent header, accent-colored glow on hover only. */
export function CommunityCard({
  community,
  members,
  ctaMode = "view",
  onAction,
  className,
  ...props
}: CommunityCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const accent = getAccentStyle(community.accent ?? "cyan");
  const ctaLabel =
    hovered || ctaMode === "view" ? "View Community" : "Join Community";
  const showManage = community.canEdit || community.canDelete;

  function handleAction() {
    if (onAction) {
      onAction();
      return;
    }
    router.push(getCommunityDetailPath(community.id));
  }

  const editValues = {
    slug: community.id,
    name: community.name,
    description: community.description,
    category: community.category,
    visibility: community.visibility,
    activityLevel: community.activityLevel,
    accent: community.accent,
    imageUrl: community.imageUrl,
    wallpaperUrl: community.wallpaperUrl,
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[190px] rounded-[20px] transition-shadow duration-500 ease-out",
        hovered && accent.glow,
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <div
        className="flex flex-col items-center overflow-hidden rounded-[20px] bg-glass-purple"
        style={{ height: showManage ? 300 : 272 }}
      >
        <div className="relative h-[84px] w-full shrink-0 overflow-hidden">
          {community.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={community.imageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className={cn("size-full", accent.header)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>
        <div className="flex w-full flex-1 flex-col items-center gap-px overflow-hidden bg-surface pb-2.5 shadow-card-inner">
          <h3 className="line-clamp-2 px-2.5 pt-2.5 text-center text-sm font-semibold leading-tight text-white">
            {community.name}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-1.5 px-1">
            <Chip variant="blue" className="h-5 text-[10px]">
              {formatCount(community.memberCount)} Members
            </Chip>
            <Chip variant="indigo" className="h-5 text-[10px]">
              {community.category}
            </Chip>
          </div>
          {members?.length ? (
            <AvatarStack
              users={members}
              size="sm"
              className="py-1"
              overflowLabel={`+${Math.max(community.memberCount - 3, 0)}....`}
            />
          ) : null}
          {(community.createdAt || community.lastActiveAt) ? (
            <div className="px-2 py-1">
              <Chip variant="brand" className="h-5 text-[10px]">
                {community.lastActiveAt
                  ? `Last Active ${community.lastActiveAt}`
                  : `Created on ${community.createdAt}`}
              </Chip>
            </div>
          ) : null}
          <div className="w-full px-2 py-0.5 text-center text-white">
            {community.avgMatchScore != null ? (
              <p className="text-[10px] font-semibold">
                Avg AI Match Score {community.avgMatchScore}%
              </p>
            ) : null}
            <p className="text-[11px] font-bold">
              {activityLabels[community.activityLevel]}
            </p>
          </div>
          <p className="flex w-[165px] justify-between px-1.5 py-1 text-[10px] font-normal text-white/90">
            <span>{community.postCount.toLocaleString()} Posts</span>
            <span>
              {showManage
                ? "✏️ Manage"
                : community.visibility === "private"
                  ? "🔒 Private"
                  : "🌍 Public"}
            </span>
          </p>
          <div className="flex w-full flex-col items-center gap-1.5 px-2">
            <Button
              variant="gradient"
              size="sm"
              className="h-6 w-[100px] rounded-full px-2 text-[9px] font-normal"
              onClick={handleAction}
            >
              {ctaLabel}
            </Button>
            {showManage ? (
              <div className="flex w-full items-center justify-center gap-2">
                {community.canEdit ? (
                  <EditCommunityButton
                    community={editValues}
                    trigger={
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className={cardEditActionClass}
                      >
                        Edit
                      </button>
                    }
                  />
                ) : null}
                {community.canDelete ? (
                  <DeleteCommunityButton
                    communitySlug={community.id}
                    communityName={community.name}
                    trigger={
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className={cardDeleteActionClass}
                      >
                        Delete
                      </button>
                    }
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
