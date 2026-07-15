"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAccentStyle } from "@/lib/accents";
import { GradientButton } from "@/components/ui/gradient-button";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { CommunityDashboardFeedPost } from "@/components/community/community-dashboard-feed-post";
import { ChatMessage } from "@/components/community/chat-message";
import { ChatInput } from "@/components/community/chat-input";
import type { CommunityDashboardSection } from "@/lib/community-routes";
import type { CommunityDetail } from "@/types";

export interface CommunityDashboardSectionContentProps {
  section: CommunityDashboardSection;
  community: CommunityDetail;
}

function SectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-cyan-400/12 bg-black/25 px-4 py-3 backdrop-blur-sm sm:px-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ScrollBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function WatchChannelRow({
  party,
}: {
  party: CommunityDetail["dashboardWatchParties"][number];
}) {
  const accent = getAccentStyle(party.accent ?? "purple");

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-black/35 p-4 shadow-card-inner sm:flex-row sm:items-center sm:p-5">
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-[16px] sm:h-[120px] sm:w-[200px]">
        {party.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={party.imageUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div className={cn("size-full", accent.header)} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-white">{party.title}</h3>
        {party.participants?.length ? (
          <div className="mt-2 flex items-center gap-2">
            <AvatarStack users={party.participants} size="sm" />
            <span className="text-xs text-white/60">
              {party.viewerCount ?? 0} Members watching right now
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
        <GradientButton size="sm" className="rounded-full px-5">
          Join
        </GradientButton>
        <button
          type="button"
          className="rounded-full border border-brand-magenta px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-magenta/10"
        >
          More About The Content
        </button>
      </div>
    </div>
  );
}

function VoiceChannelRow({
  channel,
}: {
  channel: CommunityDetail["dashboardVoiceChannels"][number];
}) {
  const accent = getAccentStyle(channel.accent ?? "purple");

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-black/35 p-4 shadow-card-inner sm:flex-row sm:items-center sm:p-5">
      <div
        className={cn(
          "h-[100px] w-full shrink-0 rounded-[16px] sm:h-[88px] sm:w-[160px]",
          accent.header,
        )}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-white">{channel.title}</h3>
        {channel.subtitle ? (
          <p className="mt-1 text-sm italic text-white/65">{channel.subtitle}</p>
        ) : null}
        {channel.participants?.length ? (
          <div className="mt-2 flex items-center gap-2">
            <AvatarStack users={channel.participants} size="sm" />
            <span className="text-xs text-white/60">
              {channel.memberCount ?? 0} Members in the VC
            </span>
          </div>
        ) : null}
      </div>
      <GradientButton size="sm" className="shrink-0 rounded-full px-6">
        Join VC
      </GradientButton>
    </div>
  );
}

function SettingsToggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-[14px] border border-white/[0.08] bg-black/35 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-white/90">{label}</p>
        <p className="mt-0.5 text-xs text-white/55">{description}</p>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 size-4 accent-brand-magenta"
      />
    </label>
  );
}

/** Renders the active dashboard section inside the cyan glass center panel. */
export function CommunityDashboardSectionContent({
  section,
  community,
}: CommunityDashboardSectionContentProps) {
  switch (section) {
    case "posts":
      return (
        <>
          <SectionHeader>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-white/85">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-emerald-500/75"
                />
                {community.dashboardOnlineCount.toLocaleString()} Online
              </span>
              <span className="text-white/50 italic">
                {community.dashboardPostsToday} Posts Today
              </span>
            </div>
            <GradientButton size="sm" className="h-8 gap-1 rounded-full px-4 text-xs">
              <Plus className="size-3.5" />
              Create Posts
            </GradientButton>
          </SectionHeader>
          <ScrollBody className="flex flex-col items-center gap-3">
            {community.dashboardPosts.map((post) => (
              <CommunityDashboardFeedPost key={post.id} post={post} />
            ))}
          </ScrollBody>
        </>
      );

    case "chat":
      return (
        <>
          <ScrollBody className="flex flex-col gap-4 pb-2">
            {community.dashboardChatMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </ScrollBody>
          <div className="shrink-0 border-t border-cyan-400/12 bg-black/25 px-4 py-3 sm:px-5">
            <ChatInput placeholder="Heyyyy Nice To Meet You All" />
          </div>
        </>
      );

    case "anime-chat":
      return (
        <>
          <ScrollBody className="flex flex-col gap-4 pb-2">
            {community.dashboardAnimeChatMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </ScrollBody>
          <div className="shrink-0 border-t border-cyan-400/12 bg-black/25 px-4 py-3 sm:px-5">
            <ChatInput placeholder="Share your anime hot takes…" />
          </div>
        </>
      );

    case "watch-channel":
      return (
        <>
          <SectionHeader>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-white/85">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-emerald-500/75"
                />
                {community.dashboardOnlineCount.toLocaleString()} Online
              </span>
              <span className="text-white/50 italic">
                {community.dashboardMembersWatching} Members Watching Now
              </span>
            </div>
            <GradientButton size="sm" className="h-8 gap-1 rounded-full px-4 text-xs">
              <Plus className="size-3.5" />
              Create Watch Channel
            </GradientButton>
          </SectionHeader>
          <ScrollBody className="flex flex-col gap-4">
            {community.dashboardWatchParties.map((party) => (
              <WatchChannelRow key={party.id} party={party} />
            ))}
          </ScrollBody>
        </>
      );

    case "voice-channel":
      return (
        <>
          <SectionHeader>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-white/85">
                <span
                  aria-hidden
                  className="size-2 rounded-full bg-emerald-500/75"
                />
                {community.dashboardOnlineCount.toLocaleString()} Online
              </span>
              <span className="text-white/50 italic">
                {community.dashboardMembersInVc} Members in VCs Now
              </span>
            </div>
            <GradientButton size="sm" className="h-8 gap-1 rounded-full px-4 text-xs">
              <Plus className="size-3.5" />
              Create Voice Channel
            </GradientButton>
          </SectionHeader>
          <ScrollBody className="flex flex-col gap-4">
            {community.dashboardVoiceChannels.map((channel) => (
              <VoiceChannelRow key={channel.id} channel={channel} />
            ))}
          </ScrollBody>
        </>
      );

    case "announcements":
      return (
        <>
          <SectionHeader>
            <p className="text-sm text-white/65">
              Only Admins And Mods Can Create Announcements
            </p>
            <GradientButton size="sm" className="h-8 gap-1 rounded-full px-4 text-xs">
              <Plus className="size-3.5" />
              Post Announcement
            </GradientButton>
          </SectionHeader>
          <ScrollBody className="flex flex-col items-center gap-3">
            {community.dashboardAnnouncements.map((post) => (
              <CommunityDashboardFeedPost key={post.id} post={post} />
            ))}
          </ScrollBody>
        </>
      );

    case "analytics":
      return (
        <>
          <SectionHeader>
            <p className="text-sm font-medium text-white/85">📊 Community Analytics</p>
            <span className="text-xs italic text-white/50">Last 7 days</span>
          </SectionHeader>
          <ScrollBody>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {community.dashboardAnalytics.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-[16px] border border-cyan-400/12 bg-glass-cyan/15 p-4 shadow-card-inner backdrop-blur-sm"
                >
                  <p className="text-xs text-white/55">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </ScrollBody>
        </>
      );

    case "settings":
      return (
        <>
          <SectionHeader>
            <p className="text-sm font-medium text-white/85">⚙️ Community Settings</p>
            <span className="text-xs text-white/50">Admin only</span>
          </SectionHeader>
          <ScrollBody className="flex max-w-xl flex-col gap-3">
            <SettingsToggle
              label="Allow member posts"
              description="Let members publish posts in the community feed."
              defaultChecked={community.dashboardSettings.allowMemberPosts}
            />
            <SettingsToggle
              label="Require post approval"
              description="Moderators must approve posts before they go live."
              defaultChecked={community.dashboardSettings.requireApproval}
            />
            <SettingsToggle
              label="Show online status"
              description="Display online indicators on member cards."
              defaultChecked={community.dashboardSettings.showOnlineStatus}
            />
            <SettingsToggle
              label="Enable watch parties"
              description="Allow members to create and join watch channels."
              defaultChecked={community.dashboardSettings.enableWatchParties}
            />
            <SettingsToggle
              label="Enable voice channels"
              description="Allow voice channel creation and joining."
              defaultChecked={community.dashboardSettings.enableVoiceChannels}
            />
          </ScrollBody>
        </>
      );

    default:
      return null;
  }
}
