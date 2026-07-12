"use client";

import { usePathname } from "next/navigation";
import { Bell, CircleUserRound, Menu, Search } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard": "Home",
  "/dashboard/discover": "Discover",
  "/dashboard/collections": "Collections",
  "/dashboard/watchlist": "Watchlist",
  "/dashboard/for-you": "For You",
  "/dashboard/analytics": "Analytics",
  "/dashboard/community": "Community",
  "/dashboard/settings": "Settings",
};

export interface DashboardTopbarProps {
  userName: string;
  onMenuClick?: () => void;
}

/** Sticky header — stacks on mobile, full row on desktop. */
export function DashboardTopbar({ userName, onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();
  const title =
    titles[pathname] ??
    titles[
      Object.keys(titles)
        .filter((key) => key !== "/dashboard" && pathname.startsWith(key))
        .sort((a, b) => b.length - a.length)[0] ?? "/dashboard"
    ];

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:h-[72px] sm:gap-4 sm:px-6 lg:gap-6 lg:px-8">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          className="cursor-pointer rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <h1 className="text-gradient-brand min-w-0 shrink-0 text-xl font-bold sm:text-[26px]">
          {title}
        </h1>

        <div className="ms-auto flex items-center gap-3 sm:gap-4">
          <label className="hidden h-10 w-full max-w-[280px] items-center gap-2 rounded-full border border-white/25 bg-surface/60 px-4 transition-colors focus-within:border-brand-magenta md:flex lg:max-w-[340px]">
            <input
              type="search"
              placeholder="Search Here…………………"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-muted/60 focus:outline-none"
            />
            <Search className="size-4 shrink-0 text-white/80" />
          </label>

          <button
            type="button"
            aria-label="Search"
            className="cursor-pointer rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            <Search className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="cursor-pointer rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 hover:text-brand-pink"
          >
            <Bell className="size-5" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <CircleUserRound className="size-8 text-white" strokeWidth={1.25} />
            <span className="max-w-[120px] truncate text-sm font-medium text-white lg:max-w-none">
              {userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
