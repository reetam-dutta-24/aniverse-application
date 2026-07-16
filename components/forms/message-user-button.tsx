"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { detailHeroBtnBase } from "@/lib/detail-route-ui";

interface MessageUserButtonProps {
  handle: string;
  name: string;
  className?: string;
}

export function MessageUserButton({
  handle,
  name,
  className,
}: MessageUserButtonProps) {
  return (
    <Link
      href={`/dashboard/messages?user=${encodeURIComponent(handle)}`}
      className={detailHeroBtnBase(
        "border-2 border-brand-magenta bg-black/70 text-white",
        className,
      )}
    >
      <MessageCircle className="size-3.5 shrink-0 text-brand-magenta" />
      <span className="truncate">Message {name.split(" ")[0]}</span>
    </Link>
  );
}
