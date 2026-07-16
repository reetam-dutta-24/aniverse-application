"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { shareCurrentUrl } from "@/lib/share-url";
import { detailHeroBtnBase } from "@/lib/detail-route-ui";

interface ShareUrlButtonProps {
  label?: string;
  className?: string;
  iconClassName?: string;
  title?: string;
  text?: string;
}

export function ShareUrlButton({
  label = "Share",
  className,
  iconClassName,
  title,
  text,
}: ShareUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const ok = await shareCurrentUrl({
      title,
      text,
      preferClipboard: true,
    });
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className={cn(
        detailHeroBtnBase(
          "border-2 border-brand-magenta bg-black text-white",
        ),
        className,
      )}
    >
      <Share2 className={cn("size-3.5 shrink-0 text-brand-magenta", iconClassName)} />
      <span className="truncate">{copied ? "Link Copied!" : label}</span>
    </button>
  );
}
