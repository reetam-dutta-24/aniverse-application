import { cn } from "@/lib/utils";
import { getAccentStyle } from "@/lib/accents";
import type { Character } from "@/types";
import { Chip } from "@/components/ui/chip";

export interface CharacterCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  character: Character;
}

/** Character portrait card (225×322 in Figma). */
export function CharacterCard({
  character,
  className,
  ...props
}: CharacterCardProps) {
  const accent = getAccentStyle(character.accent ?? "purple");

  return (
    <div
      className={cn(
        "flex w-[210px] flex-col items-center gap-2.5 overflow-hidden rounded-card bg-glass-magenta px-2 py-5 shadow-card-inner transition-shadow duration-300",
        accent.hoverGlow,
        className,
      )}
      {...props}
    >
      <div className="relative h-[170px] w-[186px] overflow-hidden rounded-card">
        {character.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={character.imageUrl}
            alt={character.name}
            className="size-full object-cover"
          />
        ) : (
          <div className={cn("size-full", accent.header)} />
        )}
        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_2px_0px_50px_10px_rgba(0,0,0,0.5)]" />
      </div>
      <p className="text-center text-base font-semibold text-white">
        {character.name}
      </p>
      {character.role ? <Chip variant="indigo">{character.role}</Chip> : null}
    </div>
  );
}
