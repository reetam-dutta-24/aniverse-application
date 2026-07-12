"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationDots } from "@/components/dashboard/pagination-dots";
import {
  CAROUSEL_ITEMS_COMMUNITY,
  CAROUSEL_ITEMS_CONTENT,
  CAROUSEL_ITEMS_EPISODE,
  CAROUSEL_ITEMS_REVIEW,
} from "@/lib/grid-section-config";
import { cn } from "@/lib/utils";

export type ContentCarouselVariant =
  | "content"
  | "community"
  | "episode"
  | "review";

const VARIANT_ITEMS: Record<ContentCarouselVariant, number> = {
  content: CAROUSEL_ITEMS_CONTENT,
  community: CAROUSEL_ITEMS_COMMUNITY,
  episode: CAROUSEL_ITEMS_EPISODE,
  review: CAROUSEL_ITEMS_REVIEW,
};

export interface ContentCarouselSectionProps {
  items: React.ReactNode[];
  variant?: ContentCarouselVariant;
  itemsPerPage?: number;
  className?: string;
  overflowVisible?: boolean;
  itemsCenter?: boolean;
  /** Tighter row spacing (episodes). */
  compact?: boolean;
  /** Auto-advance to next page every N ms (reviews). */
  autoAdvanceMs?: number;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    pages.push(arr.slice(i, i + size));
  }
  return pages.length ? pages : [[]];
}

export function ContentCarouselSection({
  items,
  variant = "content",
  itemsPerPage,
  className,
  overflowVisible = false,
  itemsCenter = false,
  compact = false,
  autoAdvanceMs,
}: ContentCarouselSectionProps) {
  const [page, setPage] = useState(0);
  const perPage = itemsPerPage ?? VARIANT_ITEMS[variant];

  const pages = useMemo(() => chunk(items, perPage), [items, perPage]);
  const totalPages = pages.length;
  const safePage = Math.min(page, totalPages - 1);

  function goTo(next: number) {
    const wrapped = ((next % totalPages) + totalPages) % totalPages;
    setPage(wrapped);
  }

  useEffect(() => {
    if (!autoAdvanceMs || totalPages <= 1) return;
    const id = window.setInterval(() => {
      setPage((current) => {
        const safe = Math.min(current, totalPages - 1);
        return (safe + 1) % totalPages;
      });
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [autoAdvanceMs, totalPages]);

  return (
    <div className={cn("flex flex-col", compact ? "gap-1" : "gap-4", className)}>
      <div className={cn("relative", overflowVisible && "overflow-visible")}>
        {totalPages > 1 ? (
          <button
            type="button"
            onClick={() => goTo(safePage - 1)}
            aria-label="Previous page"
            className="absolute -left-1 top-1/2 z-20 -translate-y-1/2 cursor-pointer p-1 text-brand-magenta transition-colors hover:text-brand-pink sm:left-0"
          >
            <ChevronLeft className="size-7" strokeWidth={3} />
          </button>
        ) : null}

        <div
          className={cn(
            compact ? "px-4 sm:px-8 lg:px-10" : "px-6 sm:px-10 lg:px-12",
            overflowVisible ? "overflow-visible" : "overflow-hidden",
          )}
        >
          <div
            className={cn(
              "flex transition-transform duration-700 ease-in-out",
              overflowVisible &&
                (compact
                  ? "min-h-[220px] items-center sm:min-h-[240px]"
                  : variant === "review"
                    ? "min-h-[310px] items-center sm:min-h-[330px]"
                    : "min-h-[420px] items-center sm:min-h-[440px]"),
            )}
            style={{ transform: `translateX(-${safePage * 100}%)` }}
          >
            {pages.map((pageItems, pageIndex) => (
              <div
                key={pageIndex}
                className={cn(
                  "flex w-full min-w-full shrink-0",
                  compact ? "gap-2 sm:gap-2.5" : "gap-4 sm:gap-6",
                  itemsCenter || overflowVisible
                    ? "items-center"
                    : "items-stretch",
                  overflowVisible &&
                    (compact ? "py-1" : variant === "review" ? "py-4" : "py-6"),
                )}
              >
                {pageItems.map((item, i) => (
                  <div key={i} className="flex min-w-0 flex-1 justify-center">
                    {item}
                  </div>
                ))}
                {pageItems.length < perPage
                  ? Array.from({ length: perPage - pageItems.length }).map(
                      (_, i) => (
                        <div
                          key={`pad-${i}`}
                          className="min-w-0 flex-1"
                          aria-hidden
                        />
                      ),
                    )
                  : null}
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 ? (
          <button
            type="button"
            onClick={() => goTo(safePage + 1)}
            aria-label="Next page"
            className="absolute -right-1 top-1/2 z-20 -translate-y-1/2 cursor-pointer p-1 text-brand-magenta transition-colors hover:text-brand-pink sm:right-0"
          >
            <ChevronRight className="size-7" strokeWidth={3} />
          </button>
        ) : null}
      </div>

      <PaginationDots total={totalPages} current={safePage} onChange={goTo} />
    </div>
  );
}
