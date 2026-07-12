"use client";

import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Bell, CircleUserRound, Menu, Search, X } from "lucide-react";
import { GlobalSearch } from "@/components/search/global-search";

const titles: Record<string, string> = {
  "/dashboard": "Home",
  "/dashboard/discover": "Discover",
  "/dashboard/collections": "Collections",
  "/dashboard/watchlist": "Watchlist",
  "/dashboard/for-you": "For You",
  "/dashboard/analytics": "Analytics",
  "/dashboard/community": "Community",
  "/dashboard/settings": "Settings",
  "/search": "Search",
};

export interface DashboardTopbarProps {
  userName: string;
  onMenuClick?: () => void;
  initialSearchQuery?: string;
}

/** Sticky header — stacks on mobile, full row on desktop. */
export function DashboardTopbar({
  userName,
  onMenuClick,
  initialSearchQuery,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const title =
    titles[pathname] ??
    titles[
      Object.keys(titles)
        .filter((key) => key !== "/dashboard" && pathname.startsWith(key))
        .sort((a, b) => b.length - a.length)[0] ?? "/dashboard"
    ];

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md">
      <div className="flex h-14 flex-col sm:h-[72px]">
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
            <div className="hidden md:block md:w-[280px] lg:w-[340px]">
              <Suspense fallback={<div className="h-10 rounded-full border border-white/25 bg-surface/60" />}>
                <GlobalSearch initialQuery={initialSearchQuery} />
              </Suspense>
            </div>

            <button
              type="button"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              onClick={() => setMobileSearchOpen((open) => !open)}
              className="cursor-pointer rounded-lg p-1.5 text-white transition-colors hover:bg-white/10 md:hidden"
            >
              {mobileSearchOpen ? (
                <X className="size-5" />
              ) : (
                <Search className="size-5" />
              )}
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

        {mobileSearchOpen ? (
          <div className="border-t border-white/8 px-4 pb-3 pt-2 md:hidden">
            <Suspense fallback={<div className="h-10 rounded-full border border-white/25 bg-surface/60" />}>
              <GlobalSearch initialQuery={initialSearchQuery} autoFocus />
            </Suspense>
          </div>
        ) : null}
      </div>
    </header>
  );
}
