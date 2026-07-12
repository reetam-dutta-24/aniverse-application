import { Heart, Star } from "lucide-react";
import { getHexOuterGlow } from "@/lib/card-theme";
import type { Review } from "@/types";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Chip } from "@/components/ui/chip";

export interface ContentReviewCardProps {
  review: Review;
}

/** Review card — compact, glow matches author avatar color. */
export function ContentReviewCard({ review }: ContentReviewCardProps) {
  const avatarColor = review.author.avatarColor ?? "#ae00ff";

  return (
    <article
      className="flex h-[260px] w-[min(280px,85vw)] shrink-0 flex-col gap-2.5 overflow-hidden rounded-2xl bg-glass-purple p-4 transition-shadow duration-300 sm:h-[272px] sm:w-[292px] sm:gap-3 sm:p-5"
      style={{
        boxShadow: `${getHexOuterGlow(avatarColor, 8)}, inset 0 0 24px rgba(0,0,0,0.4)`,
      }}
    >
      {review.headline ? (
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-base">
          {review.headline}
        </h3>
      ) : null}
      <p className="line-clamp-4 flex-1 text-xs leading-relaxed text-white/88 sm:line-clamp-5 sm:text-sm">
        {review.content}
      </p>
      <div className="shrink-0 flex items-center gap-2.5 border-t border-white/10 pt-2.5 sm:pt-3">
        <AvatarStack users={[review.author]} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white sm:text-sm">
            {review.author.name}
          </p>
          {review.createdAt ? (
            <p className="text-[10px] text-muted sm:text-xs">{review.createdAt}</p>
          ) : null}
        </div>
        <Chip variant="brand" className="h-5 shrink-0 gap-0.5 text-[10px]">
          <Star className="size-3 fill-current" />
          {review.rating}/10
        </Chip>
      </div>
      {review.likeCount != null ? (
        <p className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted">
          <Heart className="size-3.5 text-brand-magenta" />
          {review.likeCount.toLocaleString()} found this helpful
        </p>
      ) : null}
    </article>
  );
}
