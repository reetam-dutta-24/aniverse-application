"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  AtSign,
  Globe,
  Lock,
  LogOut,
  Mail,
  MapPin,
  RefreshCw,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { AuthInput } from "@/components/auth/auth-input";
import { SettingsSection } from "@/components/settings/settings-section";
import { SettingsToggle } from "@/components/settings/settings-toggle";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  languageOptions,
  type AppPreferences,
  type NotificationPreferences,
  type PrivacyPreferences,
  type SettingsData,
  type SettingsProfile,
} from "@/lib/data/settings";
import { getOnboardingProfile } from "@/lib/onboarding-store";
import { ONBOARDING_RETAKE_PATH } from "@/lib/onboarding-routes";
import { cn } from "@/lib/utils";

const avatarColors = [
  "#ff00cc",
  "#ae00ff",
  "#2563eb",
  "#00e5ff",
  "#00ff8c",
  "#ffd000",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-muted">
      {children}
    </label>
  );
}

function Divider() {
  return <div className="border-t border-white/8" />;
}

export interface SettingsViewProps {
  data: SettingsData;
}

/** Full settings page — profile, notifications, privacy, preferences, account. */
export function SettingsView({ data }: SettingsViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [profile, setProfile] = useState<SettingsProfile>(data.profile);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    data.notifications,
  );
  const [privacy, setPrivacy] = useState<PrivacyPreferences>(data.privacy);
  const [preferences, setPreferences] = useState<AppPreferences>(
    data.preferences,
  );
  const [tasteScore, setTasteScore] = useState(data.tasteScore);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = getOnboardingProfile(userId);
    if (savedProfile?.recommendations.tasteScore) {
      setTasteScore(savedProfile.recommendations.tasteScore);
    }
  }, [userId]);

  function handleSave() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function updateNotification<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ) {
    setNotifications((current) => ({ ...current, [key]: value }));
  }

  function updatePrivacy<K extends keyof PrivacyPreferences>(
    key: K,
    value: PrivacyPreferences[K],
  ) {
    setPrivacy((current) => ({ ...current, [key]: value }));
  }

  function updatePreference<K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K],
  ) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6 sm:gap-8">
      {/* Profile */}
      <SettingsSection
        title="👤 Profile"
        subtitle="How you appear across AniVerse"
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <span
            className="flex size-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white shadow-glow-pink-soft"
            style={{ backgroundColor: profile.avatarColor }}
          >
            {profile.name.charAt(0)}
          </span>
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <FieldLabel>Avatar Color</FieldLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {avatarColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Avatar color ${color}`}
                    onClick={() =>
                      setProfile((current) => ({ ...current, avatarColor: color }))
                    }
                    className={cn(
                      "size-8 cursor-pointer rounded-full border-2 transition-transform hover:scale-110",
                      profile.avatarColor === color
                        ? "border-white shadow-glow-pink-soft"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <Link
              href={profile.profilePath}
              className="text-xs font-semibold text-brand-pink transition-colors hover:text-brand-magenta"
            >
              View public profile →
            </Link>
          </div>
        </div>

        <Divider />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Full Name</FieldLabel>
            <AuthInput
              icon={User}
              value={profile.name}
              onChange={(e) =>
                setProfile((c) => ({ ...c, name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Username</FieldLabel>
            <AuthInput
              icon={AtSign}
              value={profile.handle}
              onChange={(e) =>
                setProfile((c) => ({ ...c, handle: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Bio</FieldLabel>
          <textarea
            value={profile.bio}
            onChange={(e) =>
              setProfile((c) => ({ ...c, bio: e.target.value }))
            }
            rows={3}
            className="w-full resize-none rounded-[10px] border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 focus:border-brand-magenta focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Location</FieldLabel>
          <AuthInput
            icon={MapPin}
            value={profile.location}
            onChange={(e) =>
              setProfile((c) => ({ ...c, location: e.target.value }))
            }
          />
        </div>
      </SettingsSection>

      {/* Account */}
      <SettingsSection
        title="🔑 Account"
        subtitle={`Member since ${data.memberSince}`}
      >
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Email</FieldLabel>
          <AuthInput
            icon={Mail}
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile((c) => ({ ...c, email: e.target.value }))
            }
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>New Password</FieldLabel>
            <AuthInput icon={Lock} type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Confirm Password</FieldLabel>
            <AuthInput icon={Lock} type="password" placeholder="••••••••" />
          </div>
        </div>
      </SettingsSection>

      {/* Taste & AI */}
      <SettingsSection
        title="🧠 Taste & AI"
        subtitle="Your personalized match engine"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-gradient-brand shadow-glow-pink-soft">
              <Sparkles className="size-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                AI Taste Profile
              </p>
              <p className="text-2xl font-bold text-brand-pink">{tasteScore}%</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push(ONBOARDING_RETAKE_PATH)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-magenta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-magenta/15 sm:w-auto"
          >
            <RefreshCw className="size-4" />
            Retake Taste Test
          </button>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        title="🔔 Notifications"
        subtitle="Choose what reaches you in-app and by email"
      >
        <div className="flex flex-col gap-4">
          <SettingsToggle
            label="New Episodes"
            description="When a show you follow drops a new episode"
            checked={notifications.newEpisodes}
            onChange={(v) => updateNotification("newEpisodes", v)}
          />
          <SettingsToggle
            label="Watch Parties"
            description="Invites and reminders for community watch rooms"
            checked={notifications.watchParties}
            onChange={(v) => updateNotification("watchParties", v)}
          />
          <SettingsToggle
            label="Music Drops"
            description="New songs and OSTs matched to your taste"
            checked={notifications.musicDrops}
            onChange={(v) => updateNotification("musicDrops", v)}
          />
          <SettingsToggle
            label="Community Posts"
            description="Replies and mentions in your communities"
            checked={notifications.communityPosts}
            onChange={(v) => updateNotification("communityPosts", v)}
          />
          <SettingsToggle
            label="Weekly Recap"
            description="Your watch & listen summary every Sunday"
            checked={notifications.weeklyRecap}
            onChange={(v) => updateNotification("weeklyRecap", v)}
          />
          <SettingsToggle
            label="Email Digest"
            description="Monthly highlights sent to your inbox"
            checked={notifications.emailDigest}
            onChange={(v) => updateNotification("emailDigest", v)}
          />
        </div>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection
        title="🔒 Privacy"
        subtitle="Control what others can see"
      >
        <div className="flex flex-col gap-4">
          <SettingsToggle
            label="Public Profile"
            description="Anyone can view your profile page"
            checked={privacy.publicProfile}
            onChange={(v) => updatePrivacy("publicProfile", v)}
          />
          <SettingsToggle
            label="Show Activity"
            description="Display what you're watching or listening to"
            checked={privacy.showActivity}
            onChange={(v) => updatePrivacy("showActivity", v)}
          />
          <SettingsToggle
            label="Show Watch History"
            description="Let others see your completed titles"
            checked={privacy.showWatchHistory}
            onChange={(v) => updatePrivacy("showWatchHistory", v)}
          />
          <SettingsToggle
            label="Allow Messages"
            description="Community members can send you DMs"
            checked={privacy.allowMessages}
            onChange={(v) => updatePrivacy("allowMessages", v)}
          />
        </div>
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection
        title="⚙️ Preferences"
        subtitle="Customize how AniVerse behaves"
      >
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Language</FieldLabel>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted/80" />
            <select
              value={preferences.language}
              onChange={(e) => updatePreference("language", e.target.value)}
              className="h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-white/20 bg-white/5 pl-10 pr-4 text-sm text-white focus:border-brand-magenta focus:outline-none"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang} className="bg-[#120826]">
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SettingsToggle
            label="Autoplay Previews"
            description="Auto-play trailers and song previews on hover"
            checked={preferences.autoplayPreviews}
            onChange={(v) => updatePreference("autoplayPreviews", v)}
          />
          <SettingsToggle
            label="Spoiler Warnings"
            description="Blur episode titles and thumbnails you haven't watched"
            checked={preferences.spoilerWarnings}
            onChange={(v) => updatePreference("spoilerWarnings", v)}
          />
          <SettingsToggle
            label="Mature Content"
            description="Include titles rated 18+ in recommendations"
            checked={preferences.matureContent}
            onChange={(v) => updatePreference("matureContent", v)}
          />
          <SettingsToggle
            label="Reduced Motion"
            description="Minimize animations and transitions"
            checked={preferences.reducedMotion}
            onChange={(v) => updatePreference("reducedMotion", v)}
          />
        </div>
      </SettingsSection>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <GradientButton
          size="md"
          className="w-full rounded-full sm:w-auto sm:min-w-[180px]"
          onClick={handleSave}
        >
          {saved ? "Changes Saved ✓" : "Save Changes"}
        </GradientButton>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>

      {/* Danger zone */}
      <SettingsSection
        title="⚠️ Danger Zone"
        subtitle="Irreversible account actions"
        className="border border-red-500/20"
      >
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-red-500/50 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 sm:w-auto"
        >
          <Trash2 className="size-4" />
          Delete Account
        </button>
      </SettingsSection>
    </div>
  );
}
