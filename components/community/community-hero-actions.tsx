"use client";

import {
  CircleDot,
  LayoutGrid,
  MessageCircle,
  Users,
} from "lucide-react";
import {
  DETAIL_HERO_BTN_PAIR_ROW,
  detailHeroBtnBase,
} from "@/lib/detail-route-ui";

/** Circle Feed, All Members, New Online, and Stats CTAs in the community hero. */
export function CommunityHeroActions() {
  return (
    <div className={DETAIL_HERO_BTN_PAIR_ROW}>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white",
        )}
      >
        <MessageCircle className="size-3.5 shrink-0" />
        <span className="truncate">Circle Feed</span>
      </button>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-2 border-brand-magenta bg-black/70 text-white",
        )}
      >
        <Users className="size-3.5 shrink-0 text-brand-magenta" />
        <span className="truncate">All Members</span>
      </button>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-amber-500 to-yellow-500 font-bold text-black",
        )}
      >
        <CircleDot className="size-3.5 shrink-0" />
        <span className="truncate">New Online</span>
      </button>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white",
        )}
      >
        <LayoutGrid className="size-3.5 shrink-0" />
        <span className="truncate">Stats</span>
      </button>
    </div>
  );
}
