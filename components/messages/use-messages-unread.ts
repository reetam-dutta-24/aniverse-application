"use client";

import { useSyncExternalStore } from "react";
import {
  getMessagesUnreadSnapshot,
  subscribeMessagesUnread,
  type DmUnreadSummary,
} from "@/lib/messages-store";

const EMPTY: DmUnreadSummary = { unreadChatCount: 0, totalUnreadMessages: 0 };

export function useMessagesUnread(): DmUnreadSummary {
  return useSyncExternalStore(
    subscribeMessagesUnread,
    getMessagesUnreadSnapshot,
    () => EMPTY,
  );
}
