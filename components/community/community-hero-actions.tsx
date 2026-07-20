"use client";

import Link from "next/link";
import {
  CircleDot,
  LayoutGrid,
  MessageCircle,
  Users,
} from "lucide-react";
import {
  DETAIL_HERO_BTN_PAIR_ROW,
  DETAIL_HERO_BTN_ACCENT_SOLID,
  detailHeroBtnBase,
} from "@/lib/detail-route-ui";

interface CommunityHeroActionsProps {
  communityId: string;
}

/** Circle Feed, All Members, New Online, and Stats — links into community dashboard. */
export function CommunityHeroActions({ communityId }: CommunityHeroActionsProps) {
  const base = `/community/${communityId}/dashboard`;

  return (
    <div className={DETAIL_HERO_BTN_PAIR_ROW}>
      <Link
        href={`${base}/posts`}
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white",
        )}
      >
        <MessageCircle className="size-3.5 shrink-0" />
        <span className="truncate">Circle Feed</span>
      </Link>
      <Link
        href={`${base}/analytics`}
        className={detailHeroBtnBase(
          "border-2 border-brand-magenta bg-black/70 text-white",
        )}
      >
        <Users className="size-3.5 shrink-0 text-brand-magenta" />
        <span className="truncate">All Members</span>
      </Link>
      <Link
        href={`${base}/chat`}
        className={detailHeroBtnBase(DETAIL_HERO_BTN_ACCENT_SOLID)}
      >
        <CircleDot className="size-3.5 shrink-0" />
        <span className="truncate">New Online</span>
      </Link>
      <Link
        href={`${base}/analytics`}
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white",
        )}
      >
        <LayoutGrid className="size-3.5 shrink-0" />
        <span className="truncate">Stats</span>
      </Link>
    </div>
  );
}
