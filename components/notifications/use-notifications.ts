"use client";

import { useSyncExternalStore } from "react";
import {
  getNotificationsSnapshot,
  subscribeNotifications,
} from "@/lib/notifications-store";

/** Live notification list — re-renders when read state changes anywhere. */
export function useNotifications() {
  return useSyncExternalStore(
    subscribeNotifications,
    getNotificationsSnapshot,
    getNotificationsSnapshot,
  );
}
