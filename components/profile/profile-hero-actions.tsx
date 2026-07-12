"use client";

import { Bookmark, MessageCircle, UserPlus } from "lucide-react";
import {
  DETAIL_HERO_BTN_PAIR_ROW,
  detailHeroBtnBase,
} from "@/lib/detail-route-ui";

/** Follow, Message, and Watchlist CTAs in the profile hero. */
export function ProfileHeroActions() {
  return (
    <div className={DETAIL_HERO_BTN_PAIR_ROW}>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white",
        )}
      >
        <UserPlus className="size-3.5 shrink-0" />
        <span className="truncate">Follow</span>
      </button>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-2 border-brand-magenta bg-black/70 text-white",
        )}
      >
        <MessageCircle className="size-3.5 shrink-0 text-brand-magenta" />
        <span className="truncate">Message</span>
      </button>
      <button
        type="button"
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-amber-500 to-yellow-500 font-bold text-black",
        )}
      >
        <Bookmark className="size-3.5 shrink-0" />
        <span className="truncate">Watchlist</span>
      </button>
    </div>
  );
}
