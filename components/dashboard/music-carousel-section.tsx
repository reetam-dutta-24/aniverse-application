"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MusicCard } from "@/components/cards/music-card";
import {
  CarouselCardSlot,
  CarouselRowViewport,
} from "@/components/carousel/carousel-row-viewport";
import { PaginationDots } from "@/components/dashboard/pagination-dots";
import { SearchPill } from "@/components/dashboard/search-pill";
import { useColumnCount } from "@/hooks/use-column-count";
import { getCardTint, sectionTintSeed } from "@/lib/card-theme";
import { CAROUSEL_COLS_BREAKPOINTS } from "@/lib/grid-section-config";
import type { MusicTrack } from "@/types";

export interface MusicCarouselSectionProps {
  title: string;
  subtitle?: string;
  searchPlaceholder: string;
  tracks: MusicTrack[];
  /** Auto-advance pages (ms) — for related-content rows only. */
  autoAdvanceMs?: number;
  emptyMessage?: string;
}

function filterTracks(tracks: MusicTrack[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return tracks;
  return tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.source?.toLowerCase().includes(q) ||
      t.language?.toLowerCase().includes(q),
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size));
  }
  return pages.length ? pages : [[]];
}

/** Paginated music row — responsive columns, strict clip, no bleed. */
export function MusicCarouselSection({
  title,
  subtitle,
  searchPlaceholder,
  tracks,
  autoAdvanceMs,
  emptyMessage = "No related music available yet.",
}: MusicCarouselSectionProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { cols, itemsPerPage } = useColumnCount(CAROUSEL_COLS_BREAKPOINTS, 1);

  const filtered = useMemo(() => filterTracks(tracks, query), [tracks, query]);
  const pages = useMemo(
    () => chunk(filtered, itemsPerPage),
    [filtered, itemsPerPage],
  );
  const tintSeed = sectionTintSeed(title);
  const totalPages = pages.length;
  const safePage = Math.min(page, totalPages - 1);

  const hoveredTintGlass = useMemo(() => {
    if (!hoveredId) return null;
    const track = filtered.find((t) => t.id === hoveredId);
    if (!track) return null;
    return getCardTint(track.id, tintSeed).glass;
  }, [hoveredId, filtered, tintSeed]);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, totalPages - 1)));
  }, [totalPages, itemsPerPage]);

  function goTo(next: number) {
    const wrapped =
      ((next % totalPages) + totalPages) % totalPages;
    setPage(wrapped);
    setHoveredId(null);
  }

  function handleSearch(value: string) {
    setQuery(value);
    setPage(0);
    setHoveredId(null);
  }

  useEffect(() => {
    if (!autoAdvanceMs || totalPages <= 1) return;
    const id = window.setInterval(() => {
      setPage((current) => {
        const safe = Math.min(current, totalPages - 1);
        return (safe + 1) % totalPages;
      });
      setHoveredId(null);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [autoAdvanceMs, totalPages]);

  if (tracks.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="px-2 text-lg font-bold text-white sm:text-heading">{title}</h2>
        <p className="mx-2 rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/65">
          {emptyMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 px-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white sm:text-heading">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm font-normal text-white/90">{subtitle}</p>
          ) : null}
        </div>
        <SearchPill
          placeholder={searchPlaceholder}
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="relative px-2">
        {totalPages > 1 ? (
          <button
            type="button"
            onClick={() => goTo(safePage - 1)}
            aria-label="Previous page"
            className="absolute -left-1 top-1/2 z-20 -translate-y-1/2 cursor-pointer p-1 text-brand-magenta transition-colors hover:text-brand-pink sm:left-0"
          >
            <ChevronLeft className="size-6" strokeWidth={3} />
          </button>
        ) : null}

        <CarouselRowViewport
          active={hoveredId != null}
          tintGlass={hoveredTintGlass}
        >
          <div className="overflow-hidden">
            <div
              className="flex w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${safePage * 100}%)` }}
            >
              {pages.map((pageTracks, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid w-full min-w-full shrink-0 gap-3 overflow-hidden sm:gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  }}
                >
                  {pageTracks.length > 0 ? (
                    pageTracks.map((track) => (
                      <CarouselCardSlot
                        key={track.id}
                        id={track.id}
                        hoveredId={hoveredId}
                      >
                        <MusicCard
                          track={track}
                          tintSeed={tintSeed}
                          onHoverChange={(hovered) =>
                            setHoveredId(hovered ? track.id : null)
                          }
                        />
                      </CarouselCardSlot>
                    ))
                  ) : (
                    <p
                      className="text-sm text-muted"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  )}
                  {pageTracks.length > 0 && pageTracks.length < itemsPerPage
                    ? Array.from({
                        length: itemsPerPage - pageTracks.length,
                      }).map((_, i) => (
                        <div key={`pad-${i}`} aria-hidden />
                      ))
                    : null}
                </div>
              ))}
            </div>
          </div>
        </CarouselRowViewport>

        {totalPages > 1 ? (
          <button
            type="button"
            onClick={() => goTo(safePage + 1)}
            aria-label="Next page"
            className="absolute -right-1 top-1/2 z-20 -translate-y-1/2 cursor-pointer p-1 text-brand-magenta transition-colors hover:text-brand-pink sm:right-0"
          >
            <ChevronRight className="size-6" strokeWidth={3} />
          </button>
        ) : null}
      </div>

      <PaginationDots
        total={totalPages}
        current={safePage}
        onChange={goTo}
      />
    </section>
  );
}
