"use client";

import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Member, MemberRole } from "@/types";

const ROLE_LABELS: Record<MemberRole, string> = {
  owner: "Admin",
  admin: "Admin",
  moderator: "Moderator",
  member: "Member",
};

export interface CommunityDashboardMemberCardProps {
  member: Member;
  className?: string;
}

/** Figma dashboard member row — avatar, name, role, online, edit. */
export function CommunityDashboardMemberCard({
  member,
  className,
}: CommunityDashboardMemberCardProps) {
  const initial = member.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[14px] border border-white/[0.07] bg-black/35 px-3 py-2.5 shadow-card-inner backdrop-blur-sm",
        className,
      )}
    >
      <div className="relative shrink-0">
        <span
          className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-black"
          style={{
            backgroundColor: member.avatarColor ?? "#ff00cc",
          }}
        >
          {member.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </span>
        {member.online ? (
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface bg-emerald-500/70"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white/85">{member.name}</p>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-[10px] font-medium text-white/50">
            {ROLE_LABELS[member.role]}
          </span>
          {member.online ? (
            <span className="text-[10px] italic text-emerald-400/60">Online</span>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        aria-label={`Edit ${member.name}`}
        className="shrink-0 text-white/55 transition-colors hover:text-white"
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  );
}
