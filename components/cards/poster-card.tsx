import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/types";
import { Chip } from "@/components/ui/chip";

const typeLabels: Record<ContentItem["type"], string> = {
  anime: "Anime",
  show: "Show",
  movie: "Movie",
  song: "Song",
  album: "Album",
  artist: "Artist",
  playlist: "Playlist",
};

export interface PosterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ContentItem;
  /**
   * `compact` — 225×350 glass card with rating/type header (Figma default).
   * `detailed` — 248×415 card with description, meta, and action buttons
   * (Figma "Variant3", glows purple on hover).
   */
  variant?: "compact" | "detailed";
  onWatch?: () => void;
  onViewDetails?: () => void;
}

function genreChips(item: ContentItem) {
  const variants = ["blue", "indigo", "teal"] as const;
  return item.genres.map((genre, i) => (
    <Chip key={genre.id} variant={variants[i % variants.length]}>
      {genre.label}
    </Chip>
  ));
}

/** Movie/Show/Anime poster card from the Figma design system. */
export function PosterCard({
  item,
  variant = "compact",
  onWatch,
  onViewDetails,
  className,
  ...props
}: PosterCardProps) {
  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "flex w-[248px] flex-col items-center overflow-hidden rounded-poster bg-glass-magenta transition-shadow duration-300 hover:shadow-glow-purple",
          className,
        )}
        {...props}
      >
        <div className="flex h-[139px] w-full items-center justify-center bg-header-purple">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="size-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex w-full flex-1 flex-col items-center gap-2 bg-surface p-3 shadow-panel">
          <h3 className="text-[22px] font-semibold text-white">{item.title}</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {genreChips(item)}
          </div>
          {item.matchScore != null ? (
            <Chip variant="brand">AI Match {item.matchScore}%</Chip>
          ) : null}
          {item.description ? (
            <p className="w-[202px] text-xs font-semibold text-white">
              {item.description}
            </p>
          ) : null}
          {item.meta || item.year ? (
            <p className="flex w-[202px] justify-between text-xs font-semibold text-white">
              <span>{item.meta}</span>
              <span>{item.year}</span>
            </p>
          ) : null}
          <div className="mt-1 flex items-center gap-3.5 pb-2">
            <button
              type="button"
              onClick={onWatch}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-brand-magenta px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-brand-magenta/15"
            >
              <PlayCircle className="size-5 text-brand-magenta" />
              Watch Now
            </button>
            <button
              type="button"
              onClick={onViewDetails}
              className="cursor-pointer rounded-full border border-brand-magenta px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-brand-magenta/15"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-[225px] flex-col items-center justify-center gap-1 overflow-hidden rounded-card bg-glass-magenta px-2 py-[34px] shadow-card-inner transition-shadow duration-300 hover:shadow-glow-purple",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-between px-2">
        {item.rating != null ? (
          <Chip variant="brand" className="w-[90px]">
            ⭐ {item.rating}
          </Chip>
        ) : (
          <span />
        )}
        <Chip variant="brand">{typeLabels[item.type]}</Chip>
      </div>
      <div className="flex h-[190px] w-full items-center justify-center py-1">
        <div className="relative h-full w-[209px] overflow-hidden rounded-card">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-header-purple" />
          )}
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_2px_0px_50px_10px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2.5 px-4 text-center">
        <div>
          <p className="text-xl font-semibold text-white">{item.title}</p>
          {item.meta ? <p className="text-lg text-white">{item.meta}</p> : null}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {genreChips(item)}
          {item.matchScore != null ? (
            <Chip variant="magenta">AI Match {item.matchScore}%</Chip>
          ) : null}
        </div>
      </div>
    </div>
  );
}
