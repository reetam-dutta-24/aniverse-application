"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  CircleUserRound,
  Clapperboard,
  Home,
  PlayCircle,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Discover", href: "/dashboard/discover", icon: Search },
  { label: "Collections", href: "/dashboard/collections", icon: BookOpen },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Clapperboard },
  { label: "For You", href: "/dashboard/for-you", icon: PlayCircle },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export interface DashboardSidebarProps {
  userName: string;
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

/** Fixed left rail on desktop; slide-in drawer on mobile. */
export function DashboardSidebar({
  userName,
  mobileOpen = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[min(280px,85vw)] flex-col bg-sidebar px-4 pb-6 pt-5 transition-transform duration-300 ease-out lg:w-[168px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="px-2 text-xl font-semibold tracking-wide text-white"
      >
        AniVerse
      </Link>

      <nav className="mt-8 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white",
                active && "bg-white/15 text-white",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 px-2">
        <CircleUserRound className="size-8 shrink-0 text-white" strokeWidth={1.25} />
        <span className="truncate text-xs font-medium text-white">{userName}</span>
      </div>
    </aside>
  );
}
