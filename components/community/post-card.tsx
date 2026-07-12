import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityPost } from "@/types";
import { AvatarStack } from "@/components/ui/avatar-stack";

export interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: CommunityPost;
}

/** Community post card (461×421 in Figma). */
export function PostCard({ post, className, ...props }: PostCardProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[461px] flex-col gap-3 rounded-card bg-glass-purple p-5 shadow-card-inner transition-shadow duration-300 hover:shadow-glow-pink-soft",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <AvatarStack users={[post.author]} />
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-white">{post.author.name}</p>
          {post.createdAt ? (
            <p className="text-xs text-muted">{post.createdAt}</p>
          ) : null}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-white">{post.content}</p>
      {post.imageUrl ? (
        <div className="relative h-[200px] w-full overflow-hidden rounded-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_2px_0px_50px_10px_rgba(0,0,0,0.5)]" />
        </div>
      ) : null}
      <div className="mt-1 flex items-center gap-6 text-xs font-semibold text-muted">
        <span className="flex items-center gap-1.5">
          <Heart className="size-4 text-brand-magenta" />
          {post.likeCount?.toLocaleString() ?? 0}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="size-4 text-brand-purple" />
          {post.commentCount?.toLocaleString() ?? 0}
        </span>
        <span className="flex items-center gap-1.5">
          <Share2 className="size-4 text-brand-fuchsia" />
          {post.shareCount?.toLocaleString() ?? 0}
        </span>
      </div>
    </div>
  );
}
