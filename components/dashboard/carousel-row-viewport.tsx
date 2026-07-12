import { getSectionAmbienceStyles } from "@/lib/card-theme";
import { cn } from "@/lib/utils";

export interface CarouselRowViewportProps {
  /** True when any card in the row is hovered. */
  active: boolean;
  /** Hovered card tint — drives Spotify-style coloured section ambience. */
  tintGlass?: string | null;
  children: React.ReactNode;
  className?: string;
}

/**
 * Spotify-style shelf ambience — soft themed colour wash over the row,
 * no visible outer box around individual cards.
 */
export function CarouselRowViewport({
  active,
  tintGlass,
  children,
  className,
}: CarouselRowViewportProps) {
  const ambience = tintGlass ? getSectionAmbienceStyles(tintGlass) : null;

  return (
    <div className={cn("relative py-6", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{ background: ambience?.wash }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{ background: ambience?.dim }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export interface CarouselCardSlotProps {
  id: string;
  hoveredId: string | null;
  children: React.ReactNode;
}

/** Slot wrapper — z-index + sibling fade only, no outer panel box. */
export function CarouselCardSlot({
  id,
  hoveredId,
  children,
}: CarouselCardSlotProps) {
  const isActive = hoveredId === id;
  const siblingActive = hoveredId != null && !isActive;

  return (
    <div
      className={cn(
        "relative flex justify-center overflow-visible transition-opacity duration-500 ease-out",
        isActive && "z-20",
        siblingActive && "opacity-55",
      )}
    >
      {children}
    </div>
  );
}
