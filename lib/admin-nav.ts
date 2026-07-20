import type { PlatformRole } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  FolderOpen,
  LayoutDashboard,
  Mic2,
  Music2,
  Users,
} from "lucide-react";
import {
  isArtistAdmin,
  isContentAdmin,
  isMusicAdmin,
  isSuperAdmin,
} from "@/lib/platform-roles";

export type AdminSection = "content" | "music" | "artists" | "collections" | "communities";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  section?: AdminSection;
}

const ALL_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  {
    href: "/admin/content",
    label: "Content",
    icon: Clapperboard,
    section: "content",
  },
  { href: "/admin/music", label: "Music", icon: Music2, section: "music" },
  { href: "/admin/artists", label: "Artists", icon: Mic2, section: "artists" },
  {
    href: "/admin/collections",
    label: "Collections",
    icon: FolderOpen,
    section: "collections",
  },
  {
    href: "/admin/communities",
    label: "Communities",
    icon: Users,
    section: "communities",
  },
];

/** Which catalog areas this role may manage in the CMS UI. */
export function getAdminSections(
  role: PlatformRole | string | undefined,
): AdminSection[] {
  if (isSuperAdmin(role)) return ["content", "music", "artists", "collections", "communities"];
  const sections: AdminSection[] = [];
  if (role === "CONTENT_ADMIN") sections.push("content");
  if (role === "MUSIC_ADMIN") sections.push("music");
  if (role === "ARTIST_ADMIN") sections.push("artists");
  return sections;
}

export function canAccessAdminSection(
  role: PlatformRole | string | undefined,
  section: AdminSection,
): boolean {
  if (section === "content") return isContentAdmin(role);
  if (section === "music") return isMusicAdmin(role);
  if (section === "artists") return isArtistAdmin(role);
  if (section === "collections" || section === "communities") return isSuperAdmin(role);
  return false;
}

export function getVisibleAdminNavItems(
  role: PlatformRole | string | undefined,
): AdminNavItem[] {
  const sections = new Set(getAdminSections(role));
  return ALL_NAV_ITEMS.filter(
    (item) => !item.section || sections.has(item.section),
  );
}
