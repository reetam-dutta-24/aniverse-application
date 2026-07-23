"use client";

import { cn } from "@/lib/utils";

export interface DmUserAvatarProps {
  name: string;
  avatarColor: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function DmUserAvatar({
  name,
  avatarColor,
  avatarUrl,
  size = "md",
  className,
}: DmUserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();
  const dim =
    size === "sm" ? "size-9 text-xs" : size === "lg" ? "size-11 text-sm" : "size-10 text-sm";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", dim, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-black",
        dim,
        className,
      )}
      style={{ backgroundColor: avatarColor }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
