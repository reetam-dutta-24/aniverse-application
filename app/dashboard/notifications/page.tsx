import type { Metadata } from "next";
import { NotificationsView } from "@/components/notifications";

export const metadata: Metadata = {
  title: "Notifications — AniVerse",
  description:
    "All your AniVerse notifications — new episodes, watch parties, community activity, and AI matches.",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
