"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityPost, MemberRole } from "@/types";

import {
  DeleteCommunityPostButton,
  EditCommunityPostButton,
} from "@/components/forms/community-post-form";

const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Admin",
  admin: "Admin",
  moderator: "Moderator",
  member: "Member",
};

export interface CommunityDashboardFeedPostProps {
  post: CommunityPost;
  communitySlug: string;
  className?: string;
}

/** Figma dashboard feed post — author row, hero image, caption, interactions. */
export function CommunityDashboardFeedPost({
  post,
  communitySlug,
  className,
}: CommunityDashboardFeedPostProps) {
  const initial = post.author.name.trim().charAt(0).toUpperCase();
  const role = post.authorRole ? ROLE_LABELS[post.authorRole] : "Member";

  return (
    <article
      className={cn(
        "mx-auto flex w-full max-w-[460px] flex-col gap-2 rounded-[16px] border border-cyan-400/15 bg-glass-cyan/18 p-3 shadow-[inset_0_0_32px_rgba(0,200,190,0.06)] backdrop-blur-md sm:max-w-[480px] sm:p-3.5",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
          style={{
            backgroundColor: post.author.avatarColor ?? "#ffd000",
          }}
        >
          {post.author.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-xs font-semibold text-white/90">{post.author.name}</p>
            <span className="text-[10px] font-medium text-brand-pink/80">{role}</span>
            <span className="inline-flex items-center gap-1 text-[10px] italic text-white/50">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-emerald-500/70"
              />
              Online
            </span>
          </div>
          {post.createdAt ? (
            <p className="text-[10px] text-white/55">{post.createdAt}</p>
          ) : null}
        </div>
      </div>

      {post.imageUrl ? (
        <div className="relative h-[180px] w-full overflow-hidden rounded-[12px] sm:h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
        </div>
      ) : null}

      <p className="text-sm font-semibold text-white/90">{post.title}</p>
      {post.content && post.content !== post.title ? (
        <p className="text-xs leading-relaxed text-white/65">{post.content}</p>
      ) : null}

      <div className="flex items-center gap-3 text-[11px] font-semibold text-white/55">
        <span className="flex items-center gap-1">
          <Heart className="size-3.5 text-brand-magenta/70" />
          {post.likeCount?.toLocaleString() ?? 0} Likes
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="size-3.5 text-brand-purple/70" />
          {post.commentCount?.toLocaleString() ?? 0} Comments
        </span>
        <span className="flex items-center gap-1">
          <Share2 className="size-3.5 text-brand-fuchsia/70" />
          Share
        </span>
        <div className="ms-auto flex items-center gap-2">
          {post.canEdit ? (
            <EditCommunityPostButton communitySlug={communitySlug} post={post} />
          ) : null}
          {post.canDelete ? (
            <DeleteCommunityPostButton communitySlug={communitySlug} post={post} />
          ) : null}
        </div>
      </div>
    </article>
  );
}
