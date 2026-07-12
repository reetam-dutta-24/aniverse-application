"use client";

import { useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchPill } from "@/components/dashboard/search-pill";

export interface SectionCarouselProps {
  /** Section heading, e.g. "🚀 Trending This Week". */
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  /** Hide the decorative expand chevron under the row. */
  hideExpand?: boolean;
  children: React.ReactNode;
}

/**
 * Dashboard content row: heading + search on top, horizontally scrollable
 * cards with arrow controls, and an expand chevron below.
 */
export function SectionCarousel({
  title,
  subtitle,
  searchPlaceholder,
  hideExpand = false,
  children,
}: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    scrollRef.current?.scrollBy({
      left: direction * (scrollRef.current.clientWidth - 100),
      behavior: "smooth",
    });
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-4 px-11">
        <div>
          <h2 className="text-heading font-bold text-white">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/90">{subtitle}</p>
          ) : null}
        </div>
        {searchPlaceholder ? (
          <SearchPill placeholder={searchPlaceholder} />
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer p-1 text-brand-magenta transition-colors hover:text-brand-pink"
        >
          <ChevronLeft className="size-7" strokeWidth={3} />
        </button>
        <div
          ref={scrollRef}
          className="flex items-center gap-7 overflow-x-auto px-11 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer p-1 text-brand-magenta transition-colors hover:text-brand-pink"
        >
          <ChevronRight className="size-7" strokeWidth={3} />
        </button>
      </div>

      {!hideExpand ? (
        <ChevronDown
          className="mx-auto size-5 text-brand-magenta"
          strokeWidth={3}
          aria-hidden
        />
      ) : null}
    </section>
  );
}
