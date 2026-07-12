"use client";

import Link from "next/link";
import { Bell, CircleUserRound, Search } from "lucide-react";

export interface ContentTopbarProps {
  userName: string;
}

/** Content detail top bar — logo, search, notifications, user. No dashboard sidebar. */
export function ContentTopbar({ userName }: ContentTopbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-4 px-4 sm:h-[72px] sm:gap-6 sm:px-8 lg:px-12">
        <Link href="/dashboard" className="shrink-0 p-1 sm:p-2">
          <span className="text-gradient-brand text-xl font-semibold leading-none sm:text-[26px]">
            AniVerse
          </span>
        </Link>

        <label className="mx-auto flex h-10 w-full max-w-[340px] items-center gap-2 rounded-full border border-white/25 bg-surface/60 px-4 transition-colors focus-within:border-brand-magenta sm:max-w-[400px]">
          <input
            type="search"
            placeholder="Search Here…………………"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-muted/60 focus:outline-none"
          />
          <Search className="size-4 shrink-0 text-white/80" />
        </label>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="cursor-pointer rounded-lg p-1.5 text-white transition-colors hover:text-brand-pink"
          >
            <Bell className="size-5" />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <CircleUserRound className="size-8 text-white" strokeWidth={1.25} />
            <span className="max-w-[140px] truncate text-sm font-medium text-white">
              {userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
