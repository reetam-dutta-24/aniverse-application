"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { markNotificationRead } from "@/lib/notifications-store";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import type { AppNotification } from "@/types";

export interface NotificationItemProps {
  notification: AppNotification;
  /** "panel" = compact dropdown row linking to the notifications page;
   *  "full" = expanded card with category, full text, and content CTA. */
  variant?: "panel" | "full";
  className?: string;
  onNavigate?: () => void;
}

/** Single notification — neon border and glow while unread; clicking an
 *  unread notification marks it read everywhere (bell badge included). */
export function NotificationItem({
  notification,
  variant = "panel",
  className,
  onNavigate,
}: NotificationItemProps) {
  const unread = !notification.read;

  const containerClass = cn(
    "flex w-full overflow-hidden rounded-[14px] bg-glass-purple text-left shadow-card-inner transition-shadow duration-300",
    unread
      ? "border border-brand-magenta/80 shadow-glow-pink-soft hover:shadow-glow-pink"
      : "border border-white/10 hover:shadow-glow-pink-soft",
    className,
  );

  const title = (
    <p
      className={cn(
        "flex items-center gap-1.5 text-sm font-bold text-white",
        unread && "text-brand-pink",
      )}
    >
      {unread ? (
        <span
          className="size-1.5 shrink-0 rounded-full bg-brand-magenta shadow-glow-pink-soft"
          aria-hidden
        />
      ) : null}
      <span className="truncate">{notification.title}</span>
    </p>
  );

  const timestamp = notification.createdAt ? (
    <p className="flex items-center gap-1 text-[11px] text-muted/80">
      <Clock className="size-3 shrink-0" />
      {notification.createdAt}
    </p>
  ) : null;

  const thumbnail = (widthClass: string) =>
    notification.imageUrl ? (
      <div
        className={cn(
          "relative shrink-0 self-stretch overflow-hidden",
          widthClass,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={notification.imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
      </div>
    ) : null;

  if (variant === "panel") {
    return (
      <Link
        href="/dashboard/notifications"
        onClick={() => {
          markNotificationRead(notification.id);
          onNavigate?.();
        }}
        className={containerClass}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-3.5">
          {title}
          {timestamp}
          {notification.description ? (
            <p className="line-clamp-2 text-xs text-white/85">
              {notification.description}
            </p>
          ) : null}
          <p
            className={cn(
              "text-[11px] font-semibold italic",
              unread ? "text-brand-magenta" : "text-muted/70",
            )}
          >
            {unread ? "Unread" : "Read"}
          </p>
        </div>
        {thumbnail("w-[104px]")}
      </Link>
    );
  }

  return (
    <div
      onClick={() => markNotificationRead(notification.id)}
      className={cn(containerClass, unread && "cursor-pointer")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {title}
          {notification.category ? (
            <Chip variant="brand" className="h-5 shrink-0 text-[10px]">
              {notification.category}
            </Chip>
          ) : null}
        </div>
        {timestamp}
        {notification.description ? (
          <p className="text-xs leading-relaxed text-white/85 sm:text-sm">
            {notification.description}
          </p>
        ) : null}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p
            className={cn(
              "text-[11px] font-semibold italic",
              unread ? "text-brand-magenta" : "text-muted/70",
            )}
          >
            {unread ? "Unread — click to mark as read" : "Read"}
          </p>
          {notification.href ? (
            <Link
              href={notification.href}
              onClick={() => markNotificationRead(notification.id)}
              className="flex items-center gap-1 rounded-full border border-brand-magenta px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-brand-magenta/15"
            >
              Open Content
              <ArrowRight className="size-3.5 text-brand-magenta" />
            </Link>
          ) : null}
        </div>
      </div>
      {thumbnail("w-[104px] sm:w-[150px]")}
    </div>
  );
}
