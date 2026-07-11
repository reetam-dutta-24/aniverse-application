import { cn } from "@/lib/utils";
import { accentStyles } from "@/lib/accents";
import type { Community, UserSummary } from "@/types";
import { Chip } from "@/components/ui/chip";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Button } from "@/components/ui/button";

const activityLabels: Record<
  NonNullable<Community["activityLevel"]>,
  string
> = {
  "very-active": "🔥 Very Active",
  active: "🔥 Active",
  moderate: "Moderate",
  quiet: "Quiet",
};

function formatCount(count: number) {
  return count >= 1000
    ? `${Math.round(count / 1000)}K`
    : count.toLocaleString();
}

export interface CommunityCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  community: Community;
  members?: UserSummary[];
  onView?: () => void;
}

/** Community card: radial accent header, stats, and View Community CTA. */
export function CommunityCard({
  community,
  members,
  onView,
  className,
  ...props
}: CommunityCardProps) {
  const accent = accentStyles[community.accent ?? "cyan"];

  return (
    <div
      className={cn(
        "flex w-[266px] flex-col items-center overflow-hidden rounded-poster bg-glass-purple transition-shadow duration-300",
        accent.hoverGlow,
        className,
      )}
      {...props}
    >
      <div className={cn("h-[127px] w-full shrink-0", accent.header)} />
      <div className="flex w-full flex-1 flex-col items-center gap-px bg-surface pb-2 shadow-panel">
        <h3 className="p-2.5 text-center text-[22px] font-semibold leading-tight text-white">
          {community.name}
        </h3>
        <div className="flex items-center justify-center gap-4">
          <Chip variant="blue">
            {formatCount(community.memberCount)} Members
          </Chip>
          <Chip variant="indigo">{community.category}</Chip>
        </div>
        {members?.length ? (
          <AvatarStack
            users={members}
            className="py-1.5"
            overflowLabel={`....${formatCount(community.memberCount)}+`}
          />
        ) : null}
        {(community.createdAt || community.lastActiveAt) ? (
          <div className="p-2.5">
            <Chip variant="brand" className="h-[27.5px]">
              {community.lastActiveAt
                ? `Last Active ${community.lastActiveAt}`
                : `Created on ${community.createdAt}`}
            </Chip>
          </div>
        ) : null}
        <div className="w-[202px] p-1 text-center text-white">
          {community.avgMatchScore != null ? (
            <p className="text-xs font-semibold">
              Avg AI Match Score {community.avgMatchScore}%
            </p>
          ) : null}
          <p className="text-base font-bold">
            {activityLabels[community.activityLevel]}
          </p>
        </div>
        <p className="flex w-[178px] justify-between p-2.5 text-xs font-semibold text-white">
          <span>{community.postCount.toLocaleString()} Posts</span>
          <span>
            {community.visibility === "private" ? "🔒 Private" : "🌍 Public"}
          </span>
        </p>
        <Button
          variant="gradient"
          size="sm"
          className="w-[150px]"
          onClick={onView}
        >
          View Community
        </Button>
      </div>
    </div>
  );
}
