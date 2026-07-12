"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getArtistDetailPath } from "@/lib/artist-routes";
import { getContentDetailPath } from "@/lib/content-routes";
import { getProfilePath } from "@/lib/profile-routes";
import { getSongDetailPath } from "@/lib/song-routes";
import { GradientButton } from "@/components/ui/gradient-button";
import { MatchChip, RatingChip } from "@/components/ui/chip";
import type { SearchPageData } from "@/lib/search/types";

export interface SearchTopResultProps {
  data: SearchPageData;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Large featured result card — varies by primary search type. */
export function SearchTopResult({ data }: SearchTopResultProps) {
  const router = useRouter();
  const label = capitalize(data.query);

  if (data.primaryType === "song" && data.topSong) {
    const track = data.topSong;
    return (
      <section className="flex flex-col items-center gap-4 px-2">
        <h2 className="w-full text-lg font-bold text-white sm:text-heading">
          Top Results For {label}
        </h2>
        <div className="w-full max-w-[280px] overflow-hidden rounded-[24px] border border-white/10 bg-glass-purple shadow-card-inner">
          <div className="relative aspect-square w-full">
            {track.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={track.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-xl font-bold text-white">{track.title}</p>
              <p className="text-sm text-white/75">{track.artist}</p>
            </div>
          </div>
          <div className="flex gap-2 p-4">
            <GradientButton
              size="sm"
              className="flex-1 rounded-full"
              onClick={() => router.push(getSongDetailPath(track.id))}
            >
              Play
            </GradientButton>
            <button
              type="button"
              className="flex-1 rounded-full border border-brand-magenta px-3 py-2 text-xs font-semibold text-white"
            >
              Add to Playlist
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (data.primaryType === "artist" && data.topArtist) {
    const artist = data.topArtist;
    return (
      <section className="flex flex-col items-center gap-4 px-2">
        <h2 className="w-full text-lg font-bold text-white sm:text-heading">
          Top Results For {label}
        </h2>
        <button
          type="button"
          onClick={() => router.push(getArtistDetailPath(artist.id))}
          className="w-full max-w-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-glass-purple text-left shadow-card-inner transition-shadow hover:shadow-glow-pink-soft"
        >
          <div className="relative aspect-[4/5] w-full">
            {artist.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artist.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-2xl font-bold text-white">{artist.title}</p>
              <p className="text-sm text-white/70">
                {artist.meta ?? "Artist"} · K-Pop
              </p>
            </div>
          </div>
        </button>
      </section>
    );
  }

  if (data.primaryType === "profile" && data.topProfile) {
    const profile = data.topProfile;
    return (
      <section className="flex flex-col items-center gap-4 px-2">
        <h2 className="w-full text-lg font-bold text-white sm:text-heading">
          Top Results For {label}
        </h2>
        <div className="flex w-full max-w-[420px] flex-col items-center gap-4 rounded-[24px] border border-white/10 bg-glass-purple p-6 text-center shadow-card-inner">
          <span
            className="flex size-20 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-black"
            style={{ backgroundColor: profile.avatarColor }}
          >
            {profile.portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.portraitUrl}
                alt={profile.name}
                className="size-full object-cover"
              />
            ) : (
              profile.name.charAt(0)
            )}
          </span>
          <div>
            <p className="text-xl font-bold text-white">{profile.name}</p>
            <p className="text-sm text-white/60">@{profile.handle}</p>
            {profile.bio ? (
              <p className="mt-2 text-sm text-white/70">{profile.bio}</p>
            ) : null}
          </div>
          <GradientButton
            size="md"
            className="rounded-full px-8"
            onClick={() => router.push(getProfilePath(profile.id))}
          >
            View Profile
          </GradientButton>
        </div>
      </section>
    );
  }

  const item = data.topContent;
  if (!item) return null;

  return (
    <section className="flex flex-col items-center gap-4 px-2">
      <h2 className="w-full text-lg font-bold text-white sm:text-heading">
        Top Results For {label}
      </h2>
      <Link
        href={getContentDetailPath(item.id)}
        className={cn(
          "w-full max-w-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-glass-purple shadow-card-inner transition-shadow hover:shadow-glow-pink-soft",
        )}
      >
        <div className="relative aspect-[2/3] w-full">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {item.rating != null ? (
              <RatingChip rating={item.rating} />
            ) : null}
          </div>
        </div>
        <div className="space-y-2 p-4">
          <p className="text-base font-bold text-white">{item.title}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/75"
              >
                {genre.label}
              </span>
            ))}
          </div>
          {item.matchScore != null ? (
            <MatchChip score={item.matchScore} />
          ) : null}
        </div>
      </Link>
    </section>
  );
}
