import type { AppNotification } from "@/types";

const POLL_MS = 30_000;

let snapshot: AppNotification[] = [];
const listeners = new Set<() => void>();
let subscriberCount = 0;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let fetching = false;

function emit() {
  for (const listener of listeners) listener();
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    void refreshNotifications();
  }
}

async function refreshNotifications() {
  if (fetching) return;
  fetching = true;

  try {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (response.status === 401) {
      snapshot = [];
      emit();
      return;
    }
    if (!response.ok) return;

    const data = (await response.json()) as {
      notifications?: AppNotification[];
    };
    if (Array.isArray(data.notifications)) {
      snapshot = data.notifications;
      emit();
    }
  } catch {
    // Keep the last good snapshot on transient network errors.
  } finally {
    fetching = false;
  }
}

function startLiveSync() {
  if (pollTimer) return;
  void refreshNotifications();
  pollTimer = setInterval(() => void refreshNotifications(), POLL_MS);
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }
}

function stopLiveSync() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }
}

export function subscribeNotifications(listener: () => void): () => void {
  listeners.add(listener);
  subscriberCount += 1;
  if (subscriberCount === 1) startLiveSync();

  return () => {
    listeners.delete(listener);
    subscriberCount = Math.max(0, subscriberCount - 1);
    if (subscriberCount === 0) stopLiveSync();
  };
}

export function getNotificationsSnapshot(): AppNotification[] {
  return snapshot;
}

/** Hydrate from server-rendered data before the first client poll. */
export function hydrateNotifications(notifications: AppNotification[]) {
  snapshot = notifications;
  emit();
}

export async function markNotificationRead(id: string) {
  if (!snapshot.some((entry) => entry.id === id && !entry.read)) return;

  const previous = snapshot;
  snapshot = snapshot.map((entry) =>
    entry.id === id ? { ...entry, read: true } : entry,
  );
  emit();

  try {
    const response = await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
    });
    if (!response.ok) {
      snapshot = previous;
      emit();
    }
  } catch {
    snapshot = previous;
    emit();
  }
}

export async function markAllNotificationsRead() {
  if (!snapshot.some((entry) => !entry.read)) return;

  const previous = snapshot;
  snapshot = snapshot.map((entry) =>
    entry.read ? entry : { ...entry, read: true },
  );
  emit();

  try {
    const response = await fetch("/api/notifications", { method: "POST" });
    if (!response.ok) {
      snapshot = previous;
      emit();
      return;
    }
    const data = (await response.json()) as {
      notifications?: AppNotification[];
    };
    if (Array.isArray(data.notifications)) {
      snapshot = data.notifications;
      emit();
    }
  } catch {
    snapshot = previous;
    emit();
  }
}
