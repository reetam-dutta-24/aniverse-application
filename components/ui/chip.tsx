import { cn } from "@/lib/utils";
import {
  chipClassFor,
  resolveGenreChip,
  resolveLanguageChip,
  resolveMusicKindChip,
  resolveTypeChip,
  type ChipKey,
} from "@/lib/chip-styles";

/** Legacy variant names kept for community/collection cards. */
const legacyVariantMap: Record<string, ChipKey> = {
  blue: "action",
  indigo: "mystery",
  teal: "drama",
  brand: "aimatch",
  magenta: "movie",
  outline: "default",
};

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  chipKey?: ChipKey;
  genreId?: string;
  genreLabel?: string;
  mediaType?: Parameters<typeof resolveTypeChip>[0];
  language?: string;
  musicKind?: string;
  /** @deprecated Use chipKey/genreId/mediaType instead. */
  variant?: keyof typeof legacyVariantMap;
}

/** Small pill — genre-colored gradients, 10px regular weight per Figma. */
export function Chip({
  className,
  chipKey,
  genreId,
  genreLabel,
  mediaType,
  language,
  musicKind,
  variant,
  children,
  ...props
}: ChipProps) {
  let key: ChipKey = chipKey ?? "default";
  if (variant) key = legacyVariantMap[variant] ?? "default";
  else if (genreId) key = resolveGenreChip(genreId, genreLabel);
  else if (mediaType) key = resolveTypeChip(mediaType);
  else if (language) key = resolveLanguageChip(language);
  else if (musicKind) key = resolveMusicKindChip(musicKind);

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center justify-center whitespace-nowrap rounded-chip px-2 text-[10px] font-normal",
        chipClassFor(key),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function RatingChip({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <Chip chipKey="rating" className={cn("min-w-[52px]", className)}>
      ⭐ {rating}
    </Chip>
  );
}

export function MatchChip({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <Chip chipKey="aimatch" className={className}>
      AI Match {score}%
    </Chip>
  );
}
