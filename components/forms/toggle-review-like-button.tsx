"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleReviewLikeButtonProps {
  reviewId: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
  className?: string;
  onChange?: (liked: boolean, likeCount: number) => void;
}

export function ToggleReviewLikeButton({
  reviewId,
  initialLiked = false,
  initialLikeCount = 0,
  className,
  onChange,
}: ToggleReviewLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reviews/${encodeURIComponent(reviewId)}/like`,
        { method: "POST" },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return;

      const nextLiked = Boolean(data.liked);
      const nextCount =
        typeof data.likeCount === "number" ? data.likeCount : likeCount;
      setLiked(nextLiked);
      setLikeCount(nextCount);
      onChange?.(nextLiked, nextCount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleToggle()}
      className={cn(
        "flex shrink-0 items-center gap-1 text-xs font-semibold transition-colors",
        liked ? "text-brand-magenta" : "text-muted hover:text-brand-magenta/80",
        className,
      )}
      aria-pressed={liked}
    >
      <Heart className={cn("size-3.5", liked && "fill-current")} />
      {likeCount.toLocaleString()} found this helpful
    </button>
  );
}
