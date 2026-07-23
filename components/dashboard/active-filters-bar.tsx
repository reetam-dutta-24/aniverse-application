"use client";

import { useAppRouter } from "@/hooks/use-app-router";
import type { ActiveTasteFilter } from "@/lib/mappers/active-taste.mapper";
import { ONBOARDING_RETAKE_PATH } from "@/lib/onboarding-routes";
import { Chip } from "@/components/ui/chip";
import { GradientButton } from "@/components/ui/gradient-button";

export interface ActiveFiltersBarProps {
  filters: ActiveTasteFilter[];
}

/** Onboarding taste chips shown under the Discover welcome banner. */
export function ActiveFiltersBar({ filters }: ActiveFiltersBarProps) {
  const router = useAppRouter();

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-surface/40 px-4 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:px-6 lg:px-7">
      <span className="text-sm font-bold text-white">Active Taste:</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        {filters.length > 0 ? (
          filters.map((filter) => (
            <Chip key={filter.id} chipKey={filter.chipKey}>
              {filter.label}
            </Chip>
          ))
        ) : (
          <span className="text-sm text-white/60">
            Complete the taste test to personalize your picks.
          </span>
        )}
      </div>
      <GradientButton
        size="sm"
        className="w-full rounded-full px-5 sm:w-auto"
        onClick={() => router.push(ONBOARDING_RETAKE_PATH)}
      >
        Retake Test
      </GradientButton>
    </section>
  );
}
