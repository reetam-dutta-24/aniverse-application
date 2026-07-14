import { cn } from "@/lib/utils";
import {
  getCardTint,
  getDetailHeroBoundaryGlow,
} from "@/lib/card-theme";
import { Chip } from "@/components/ui/chip";
import { ProfileHeroActivitySlider } from "@/components/profile/profile-hero-activity-slider";
import { ProfileListeningPanel } from "@/components/profile/profile-listening-panel";
import type { UserProfileDetail } from "@/types";

export interface ProfileDetailHeroProps {
  profile: UserProfileDetail;
}

const DETAIL_CHIP =
  "h-7 shrink-0 px-3 text-[11px] font-medium sm:h-8 sm:px-3.5 sm:text-xs";

const CHIP_ROW =
  "flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const TITLE_CLASS =
  "text-2xl font-bold leading-tight text-white sm:text-[28px] lg:text-[30px]";

function ProfileAvatar({
  name,
  color,
  imageUrl,
}: {
  name: string;
  color: string;
  imageUrl?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <span
      className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full text-3xl font-bold text-black sm:size-20 sm:text-4xl lg:size-[72px] lg:text-3xl"
      style={{ backgroundColor: color }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          className="size-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}

function OnlineIndicator({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-sm italic text-white",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
      />
      Online
    </span>
  );
}

/** Figma profile hero — avatar + bio + activity slider left; listening panel right. */
export function ProfileDetailHero({ profile }: ProfileDetailHeroProps) {
  const tint = getCardTint(profile.id, 0);
  const heroGlow = getDetailHeroBoundaryGlow(tint.glass);

  return (
    <section
      className="relative w-full lg:max-h-[calc(100dvh-4.5rem)]"
      style={{ boxShadow: heroGlow.boxShadow }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: heroGlow.radialBackground }}
      />

      <div className="relative grid w-full grid-cols-1 items-stretch overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(300px,34vw)] lg:h-[calc(100dvh-4.5rem)] lg:max-h-[calc(100dvh-4.5rem)]">
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden px-5 py-5 sm:px-8 sm:py-6 lg:gap-2.5 lg:px-10 lg:py-5 xl:px-14">
          <div className="flex shrink-0 items-start gap-3 sm:gap-4">
            <ProfileAvatar
              name={profile.name}
              color={profile.avatarColor}
              imageUrl={profile.avatarUrl}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-3">
                <h1 className={cn(TITLE_CLASS, "min-w-0")}>{profile.name}</h1>
                {profile.online ? <OnlineIndicator /> : null}
              </div>
              <p className="text-sm text-white/75 sm:text-[15px]">
                Username:{" "}
                <span className="font-medium text-white/90">{profile.handle}</span>
              </p>
            </div>
          </div>

          <div className={cn(CHIP_ROW, "shrink-0")}>
            <Chip variant="indigo" className={DETAIL_CHIP}>
              {profile.location}
            </Chip>
            {profile.online ? (
              <Chip variant="blue" className={cn(DETAIL_CHIP, "gap-1.5")}>
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full bg-emerald-400"
                />
                Online
              </Chip>
            ) : null}
            <Chip chipKey="movie" className={DETAIL_CHIP}>
              {profile.followerCount} Followers
            </Chip>
            <Chip variant="brand" className={DETAIL_CHIP}>
              Joined {profile.joinedAt}
            </Chip>
          </div>

          <div className="flex shrink-0 flex-col gap-1">
            <h2 className="text-sm font-bold text-white sm:text-base">📝 Bio</h2>
            <p className="line-clamp-2 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-[15px] sm:leading-6">
              {profile.bio}
            </p>
          </div>

          <ProfileHeroActivitySlider
            userName={profile.name}
            activitySubtitle={profile.activitySubtitle}
            items={profile.recentActivity}
          />
        </div>

        <ProfileListeningPanel
          portraitUrl={profile.portraitUrl}
          userName={profile.name}
          handle={profile.handle}
          nowListening={profile.nowListening}
          currentlyWatching={profile.currentlyWatching}
          followers={profile.followers}
          followerSummary={profile.followerSummary}
          favoriteTypes={profile.favoriteTypes}
          favoriteGenres={profile.favoriteGenres}
        />
      </div>
    </section>
  );
}
