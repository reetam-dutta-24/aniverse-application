"use client";

import { cn } from "@/lib/utils";

export function RouteProgressBar({
  active,
  soft = false,
}: {
  active: boolean;
  soft?: boolean;
}) {
  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? "Loading page" : undefined}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden transition-opacity duration-300",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "route-progress-bar h-full w-full origin-left",
          soft ? "route-progress-bar-soft" : "route-progress-bar-full",
          active && "route-progress-bar-active",
        )}
      />
    </div>
  );
}
