import {
  BarChart3,
  LayoutList,
  Megaphone,
  MessageCircle,
  Mic,
  Settings,
  Sparkles,
  Tv,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const COMMUNITY_DASHBOARD_NAV_ICONS: Record<string, LucideIcon> = {
  posts: LayoutList,
  chat: MessageCircle,
  "watch-channel": Tv,
  "voice-channel": Mic,
  announcements: Megaphone,
  analytics: BarChart3,
  "anime-chat": Sparkles,
  settings: Settings,
};
