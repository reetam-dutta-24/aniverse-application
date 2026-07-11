import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Episode } from "@/types";
import { Chip } from "@/components/ui/chip";

export interface EpisodeCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  episode: Episode;
  onPlay?: () => void;
}

/**
 * Episode card. Description and the watch action expand on hover
 * (Figma "Normal State" / "Hover" Episode Card variants).
 */
export function EpisodeCard({
  episode,
  onPlay,
  className,
  ...props
}: EpisodeCardProps) {
  return (
    <div
      className={cn(
        "group flex w-[351px] flex-col overflow-hidden rounded-card bg-glass-magenta shadow-card-inner transition-shadow duration-300 hover:shadow-glow-purple",
        className,
      )}
      {...props}
    >
      <div className="relative h-[190px] w-full overflow-hidden">
        {episode.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={episode.thumbnailUrl}
            alt={episode.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-header-purple" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Play episode ${episode.number}`}
            className="cursor-pointer text-brand-magenta transition-transform hover:scale-110"
          >
            <PlayCircle className="size-14" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold text-white">
            E{episode.number} · {episode.title}
          </p>
          {episode.duration ? (
            <Chip variant="indigo">{episode.duration}</Chip>
          ) : null}
        </div>
        {episode.releaseDate ? (
          <p className="text-xs font-semibold text-muted">
            {episode.releaseDate}
          </p>
        ) : null}
        {episode.description ? (
          <p className="max-h-0 overflow-hidden text-xs font-semibold text-white transition-[max-height] duration-300 group-hover:max-h-40">
            {episode.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
