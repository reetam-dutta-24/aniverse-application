import type { ChipKey } from "@/lib/chip-styles";
import { resolveGenreChip, resolveTypeChip } from "@/lib/chip-styles";
import type { OnboardingSelection } from "@/lib/data/onboarding-config";
import { onboardingSteps } from "@/lib/data/onboarding-config";
import type { MediaType } from "@/types";

export interface ActiveTasteFilter {
  id: string;
  label: string;
  chipKey: ChipKey;
}

function optionLabel(
  stepId: keyof OnboardingSelection,
  optionId: string,
): string | undefined {
  const step = onboardingSteps.find((entry) => entry.id === stepId);
  return step?.options.find((option) => option.id === optionId)?.label;
}

function contentTypeChipKey(id: string): ChipKey {
  const mediaTypes: MediaType[] = [
    "anime",
    "show",
    "movie",
    "documentary",
    "kdrama",
  ];
  if (mediaTypes.includes(id as MediaType)) {
    return resolveTypeChip(id as MediaType);
  }
  return resolveGenreChip(id);
}

/** Map saved onboarding selections to taste chips for the dashboard bar. */
export function selectionsToActiveTasteFilters(
  selection: OnboardingSelection,
  tasteScore?: number | null,
): ActiveTasteFilter[] {
  const filters: ActiveTasteFilter[] = [];

  for (const id of selection.contentTypes) {
    const label = optionLabel("contentTypes", id);
    if (!label) continue;
    filters.push({
      id,
      label,
      chipKey: contentTypeChipKey(id),
    });
  }

  for (const id of selection.genres) {
    const label = optionLabel("genres", id);
    if (!label) continue;
    filters.push({
      id,
      label,
      chipKey: resolveGenreChip(id, label),
    });
  }

  for (const id of selection.musicTastes) {
    const label = optionLabel("musicTastes", id);
    if (!label) continue;
    filters.push({
      id: `music-${id}`,
      label,
      chipKey: resolveGenreChip(id, label),
    });
  }

  if (tasteScore != null && tasteScore > 0) {
    filters.push({
      id: "match",
      label: `${Math.round(tasteScore)}%`,
      chipKey: "aimatch",
    });
  }

  return filters;
}

function parseOnboardingSelection(value: unknown): OnboardingSelection | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<OnboardingSelection>;
  return {
    contentTypes: Array.isArray(row.contentTypes)
      ? row.contentTypes.filter((item): item is string => typeof item === "string")
      : [],
    genres: Array.isArray(row.genres)
      ? row.genres.filter((item): item is string => typeof item === "string")
      : [],
    musicTastes: Array.isArray(row.musicTastes)
      ? row.musicTastes.filter((item): item is string => typeof item === "string")
      : [],
    goals: Array.isArray(row.goals)
      ? row.goals.filter((item): item is string => typeof item === "string")
      : [],
    favoriteTitles: Array.isArray(row.favoriteTitles)
      ? row.favoriteTitles.filter((item): item is string => typeof item === "string")
      : [],
    moods: Array.isArray(row.moods)
      ? row.moods.filter((item): item is string => typeof item === "string")
      : [],
    watchHabits: Array.isArray(row.watchHabits)
      ? row.watchHabits.filter((item): item is string => typeof item === "string")
      : [],
    artists: Array.isArray(row.artists)
      ? row.artists.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export function tasteProfileToActiveFilters(
  selections: unknown,
  tasteScore?: number | null,
): ActiveTasteFilter[] {
  const selection = parseOnboardingSelection(selections);
  if (!selection) return [];
  return selectionsToActiveTasteFilters(selection, tasteScore);
}
