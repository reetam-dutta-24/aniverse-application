import {
  Eye,
  FolderOpen,
  Headphones,
  Heart,
  Plus,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detailHeroBtnBase,
  DETAIL_HERO_BTN_GROUP,
  DETAIL_HERO_BTN_PAIR,
} from "@/lib/detail-route-ui";
import {
  getCardTint,
  getDetailHeroBoundaryGlow,
} from "@/lib/card-theme";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Chip, MatchChip } from "@/components/ui/chip";
import { ContentHeroActions } from "@/components/content/content-hero-actions";
import type { ContentDetail, ContentEngagementStat, ContentMetadata, Episode, MediaType } from "@/types";

export interface ContentDetailHeroProps {
  content: ContentDetail;
}

const STAT_ICONS: Record<string, LucideIcon> = {
  likes: Heart,
  watching: Users,
  listening: Headphones,
  views: Eye,
  collections: FolderOpen,
  playlists: FolderOpen,
  ranked: FolderOpen,
  favorite: Heart,
};

function isSongMedia(type: MediaType) {
  return type === "song" || type === "album" || type === "playlist";
}

const DETAIL_CHIP =
  "h-7 shrink-0 px-3 text-[11px] font-medium sm:h-8 sm:px-3.5 sm:text-xs";

const CHIP_ROW =
  "flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const TITLE_CLASS =
  "text-2xl font-bold leading-tight text-white sm:text-[30px] lg:text-[34px]";

function StatIcon({ stat }: { stat: ContentEngagementStat }) {
  const Icon = STAT_ICONS[stat.id] ?? Heart;
  return <Icon className="size-5 text-white" strokeWidth={2} />;
}

function totalEpisodes(content: ContentDetail) {
  return content.seasons
    .filter((season) => season.id !== "movie")
    .reduce((sum, season) => sum + season.episodeCount, 0);
}

function seasonCount(content: ContentDetail) {
  return content.seasons.filter((season) => season.id !== "movie").length;
}

/** Hero inner glow matches the card template bg for this item (not accent keys). */
function resolveHeroTint(content: ContentDetail) {
  return getCardTint(content.id, 0);
}

function resolveContinueEpisode(content: ContentDetail): Episode | null {
  if (content.watchProgress) {
    const { seasonNumber, episodeNumber } = content.watchProgress;
    const match = content.episodes.find(
      (ep) =>
        (ep.seasonNumber ?? 1) === seasonNumber && ep.number === episodeNumber,
    );
    if (match) return match;
  }
  return content.episodes.find((ep) => ep.isLastPlayed) ?? null;
}

function buildMetadataChips(metadata: ContentMetadata): React.ReactNode[] {
  const chips: React.ReactNode[] = [];

  if (metadata.ageRating) {
    chips.push(
      <Chip key="age" chipKey="movie" className={DETAIL_CHIP}>
        {metadata.ageRating}
      </Chip>,
    );
  }
  if (metadata.status) {
    chips.push(
      <Chip key="status" chipKey="action" className={DETAIL_CHIP}>
        {metadata.status}
      </Chip>,
    );
  }
  if (metadata.studio) {
    chips.push(
      <Chip key="studio" chipKey="drama" className={DETAIL_CHIP}>
        {metadata.studio}
      </Chip>,
    );
  }
  if (metadata.sourceMaterial) {
    chips.push(
      <Chip key="source" chipKey="mystery" className={DETAIL_CHIP}>
        {metadata.sourceMaterial}
      </Chip>,
    );
  }

  return chips;
}

function buildMetadataRows(
  metadata: ContentMetadata,
  type: MediaType,
): { label: string; value: string }[] {
  if (isSongMedia(type)) {
    return [
      metadata.studio ? { label: "Artist", value: metadata.studio } : null,
      metadata.director ? { label: "Album", value: metadata.director } : null,
      metadata.originalAuthor
        ? { label: "Source", value: metadata.originalAuthor }
        : null,
      metadata.airedFrom ? { label: "Released", value: metadata.airedFrom } : null,
    ].filter(Boolean) as { label: string; value: string }[];
  }

  const aired =
    metadata.airedFrom != null
      ? metadata.airedTo
        ? `${metadata.airedFrom} – ${metadata.airedTo}`
        : metadata.airedFrom
      : null;

  return [
    metadata.imdbRating != null
      ? { label: "IMDB", value: String(metadata.imdbRating) }
      : null,
    metadata.malScore != null
      ? { label: "MyAnimeList", value: String(metadata.malScore) }
      : null,
    metadata.director ? { label: "Director", value: metadata.director } : null,
    metadata.originalAuthor
      ? { label: "Author", value: metadata.originalAuthor }
      : null,
    aired ? { label: "Aired", value: aired } : null,
  ].filter(Boolean) as { label: string; value: string }[];
}

/** Figma hero — full-width, themed inner boundary, neutral poster vignette. */
export function ContentDetailHero({ content }: ContentDetailHeroProps) {
  const tint = resolveHeroTint(content);
  const heroGlow = getDetailHeroBoundaryGlow(tint.glass);
  const titleLine = content.nativeTitle
    ? `${content.title} | ${content.nativeTitle}`
    : content.title;
  const languages = content.metadata.languages ?? [];
  const trailerSeason = content.seasons[0]?.label ?? "Season 1";
  const songMedia = isSongMedia(content.type);
  const metadataChips = buildMetadataChips(content.metadata);
  const metadataRows = buildMetadataRows(content.metadata, content.type);
  const continueEpisode = resolveContinueEpisode(content);

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

      <div className="relative grid w-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,36vw)] lg:min-h-[calc(100dvh-4.5rem)]">
        {/* Left — metadata, actions, stats */}
        <div className="flex flex-col gap-3 px-5 py-5 sm:px-8 sm:py-6 lg:gap-3.5 lg:px-10 lg:py-7 xl:px-14">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={cn("inline-flex items-center gap-2", TITLE_CLASS)}
            >
              <Star className="size-6 shrink-0 fill-yellow-400 text-yellow-400 sm:size-7" />
              {content.rating}
            </span>
            <h1 className={TITLE_CLASS}>{titleLine}</h1>
          </div>

          {content.creditLabel ? (
            <p className="text-sm font-medium text-white/85">
              {content.creditLabel}
            </p>
          ) : null}

          {content.trendingLabel ? (
            <p className="text-sm font-semibold text-brand-pink">
              {content.trendingLabel}
            </p>
          ) : null}

          <div className={CHIP_ROW}>
            <Chip chipKey="default" className={DETAIL_CHIP}>
              {songMedia && content.metadata.sourceMaterial
                ? content.metadata.sourceMaterial
                : content.type === "anime"
                  ? "Anime"
                  : content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </Chip>
            {content.metadata.releaseYear ? (
              <Chip chipKey="movie" className={DETAIL_CHIP}>
                {content.metadata.releaseYear}
              </Chip>
            ) : null}
            {content.genres.map((genre) => (
              <Chip
                key={genre.id}
                genreId={genre.id}
                genreLabel={genre.label}
                className={DETAIL_CHIP}
              >
                {genre.label}
              </Chip>
            ))}
          </div>

          <p className="line-clamp-4 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-[15px] sm:leading-7">
            {content.synopsis}
          </p>

          <div className={CHIP_ROW}>
            {content.matchScore != null ? (
              <MatchChip score={content.matchScore} className={DETAIL_CHIP} />
            ) : null}
            {songMedia ? (
              <>
                {content.metadata.originalAuthor ? (
                  <Chip chipKey="action" className={DETAIL_CHIP}>
                    {content.metadata.originalAuthor}
                  </Chip>
                ) : null}
                {content.metadata.episodeDuration ? (
                  <Chip chipKey="default" className={DETAIL_CHIP}>
                    {content.metadata.episodeDuration}
                  </Chip>
                ) : null}
              </>
            ) : (
              <>
                <Chip chipKey="default" className={DETAIL_CHIP}>
                  {seasonCount(content)} Seasons
                </Chip>
                <Chip chipKey="default" className={DETAIL_CHIP}>
                  {totalEpisodes(content)} Episodes
                </Chip>
                {metadataChips}
              </>
            )}
            {languages.map((lang) => (
              <Chip key={lang} language={lang} className={DETAIL_CHIP}>
                {lang}
              </Chip>
            ))}
          </div>

          {/* Metadata facts + collection/fav buttons */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {metadataRows.length > 0 ? (
              <ul className="grid min-w-0 flex-1 grid-cols-1 gap-x-6 gap-y-0.5 text-xs text-white/85 sm:grid-cols-2 sm:text-sm">
                {metadataRows.map((row) => (
                  <li key={row.label}>
                    <span className="font-semibold text-white">
                      {row.label}
                    </span>
                    <span className="text-white/60"> : </span>
                    {row.value}
                  </li>
                ))}
              </ul>
            ) : (
              <span />
            )}

            <div className={cn(DETAIL_HERO_BTN_PAIR, "shrink-0 sm:justify-end")}>
              <Button
                size="sm"
                className={detailHeroBtnBase(
                  "border-transparent bg-gradient-blue-violet hover:border-brand-magenta hover:bg-transparent hover:[background-image:none]",
                )}
              >
                <Plus className="size-3.5 shrink-0" />
                <span className="truncate">Add To Collection</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={detailHeroBtnBase(
                  "border-brand-magenta text-white",
                )}
              >
                <Heart className="size-3.5 shrink-0 text-brand-magenta" />
                <span className="truncate">Add To Favourites</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {content.engagementStats.map((stat) => (
              <div
                key={stat.id}
                className="bg-gradient-brand flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-center sm:py-3.5"
              >
                <StatIcon stat={stat} />
                <span className="text-xs font-medium leading-tight text-white/95 sm:text-sm">
                  {stat.label}
                </span>
                <span className="text-lg font-bold text-white sm:text-xl">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <ContentHeroActions
            content={content}
            continueEpisode={continueEpisode}
          />
        </div>

        {/* Right — full-bleed poster, neutral vignette only */}
        <div className="relative min-h-[360px] lg:min-h-0">
          <div className="relative size-full overflow-hidden lg:absolute lg:inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.imageUrl}
              alt={content.title}
              className="size-full object-cover object-top"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow:
                  "inset 0 0 140px 85px rgba(0,0,0,0.94), inset -72px 0 110px rgba(0,0,0,0.88), inset 0 -110px 130px rgba(0,0,0,0.96), inset 0 48px 72px rgba(0,0,0,0.55)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-black/75"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/15 to-black/35"
            />

            <div
              className={cn(
                DETAIL_HERO_BTN_GROUP,
                "absolute inset-x-0 bottom-0 justify-center bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pb-4 pt-10 sm:px-5 sm:pb-5",
              )}
            >
              <GradientButton
                size="sm"
                className={detailHeroBtnBase("gap-1.5")}
              >
                <PlayCircle className="size-4 shrink-0" />
                <span className="flex min-w-0 flex-col items-start leading-tight">
                  <span className="truncate text-[10px] font-semibold sm:text-[11px]">
                    {songMedia ? "Play Now" : "Watch Trailer"}
                  </span>
                  <span className="truncate text-[9px] font-normal opacity-90">
                    {songMedia
                      ? (content.metadata.episodeDuration ?? "Full Track")
                      : trailerSeason}
                  </span>
                </span>
              </GradientButton>
              <Button
                variant="outline"
                size="sm"
                className={detailHeroBtnBase(
                  "border-brand-magenta bg-black/60 text-white",
                )}
              >
                <Plus className="size-3.5 shrink-0 text-brand-magenta" />
                <span className="truncate">
                  {songMedia ? "Add To Playlist" : "Add To Watchlist"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
