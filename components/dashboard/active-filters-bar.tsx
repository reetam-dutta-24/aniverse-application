"use client";

import { useRouter } from "next/navigation";
import type { ActiveFilter } from "@/lib/data/discover";
import { resolveGenreChip } from "@/lib/chip-styles";
import { Chip } from "@/components/ui/chip";
import { GradientButton } from "@/components/ui/gradient-button";

export interface ActiveFiltersBarProps {
  filters: ActiveFilter[];
}

/** Taste-test filter strip shown under the Discover welcome banner. */
export function ActiveFiltersBar({ filters }: ActiveFiltersBarProps) {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-surface/40 px-4 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:px-6 lg:px-7">
      <span className="text-sm font-bold text-white">Active Filters:</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            chipKey={
              filter.id === "match"
                ? "aimatch"
                : resolveGenreChip(filter.id, filter.label)
            }
          >
            {filter.label}
          </Chip>
        ))}
      </div>
      <GradientButton
        size="sm"
        className="w-full rounded-full px-5 sm:w-auto"
        onClick={() => router.push("/onboarding")}
      >
        Retake Test
      </GradientButton>
    </section>
  );
}
