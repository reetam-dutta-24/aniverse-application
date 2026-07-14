import { mockNotifications } from "@/lib/data/notifications";
import type { AppNotification } from "@/types";

/**
 * Tiny client-side store so the bell badge, dropdown panel, and the full
 * notifications page share one read/unread state. In-memory only for now —
 * swap `markNotificationRead` internals for an API call later.
 */

let snapshot: AppNotification[] = mockNotifications.map((n) => ({ ...n }));
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeNotifications(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getNotificationsSnapshot(): AppNotification[] {
  return snapshot;
}

export function markNotificationRead(id: string) {
  if (!snapshot.some((n) => n.id === id && !n.read)) return;
  snapshot = snapshot.map((n) => (n.id === id ? { ...n, read: true } : n));
  emit();
}

export function markAllNotificationsRead() {
  if (!snapshot.some((n) => !n.read)) return;
  snapshot = snapshot.map((n) => (n.read ? n : { ...n, read: true }));
  emit();
}
