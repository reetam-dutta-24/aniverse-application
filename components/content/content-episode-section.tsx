"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AccentColor, ContentSeason, Episode } from "@/types";
import { ContentEpisodeCard } from "@/components/content/content-episode-card";
import { ContentPageSection } from "@/components/content/content-page-section";

export interface ContentEpisodeSectionProps {
  episodes: Episode[];
  seasons: ContentSeason[];
  contentId: string;
  contentAccent?: AccentColor;
}

/** Watch All Episodes — season filter + paginated carousel. */
export function ContentEpisodeSection({
  episodes,
  seasons,
  contentId,
  contentAccent,
}: ContentEpisodeSectionProps) {
  const [seasonId, setSeasonId] = useState(seasons[0]?.id ?? "s1");

  const filtered = useMemo(() => {
    if (seasonId === "movie") {
      return episodes.filter((ep) => ep.seasonNumber === 0 || ep.number === 0);
    }
    const seasonNum = Number.parseInt(seasonId.replace(/\D/g, ""), 10) || 1;
    return episodes.filter((ep) => (ep.seasonNumber ?? 1) === seasonNum);
  }, [episodes, seasonId]);

  const seasonAction = (
    <label className="relative inline-flex items-center">
      <select
        value={seasonId}
        onChange={(e) => setSeasonId(e.target.value)}
        aria-label="Select season"
        className="cursor-pointer appearance-none rounded-full bg-brand-purple py-2 pe-9 ps-4 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brand-magenta"
      >
        {seasons.map((season) => (
          <option key={season.id} value={season.id} className="bg-surface">
            {season.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-white" />
    </label>
  );

  const items = filtered.map((episode) => (
    <ContentEpisodeCard
      key={episode.id}
      episode={episode}
      contentId={contentId}
      contentAccent={contentAccent}
    />
  ));

  return (
    <ContentPageSection
      title="Watch All Episodes"
      action={seasonAction}
      items={items}
      variant="episode"
      overflowVisible
      itemsCenter
      compact
    />
  );
}
