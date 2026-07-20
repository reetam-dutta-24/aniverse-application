"use client";

import { cn } from "@/lib/utils";

export function NavigationPageOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-live="polite"
      aria-busy={visible}
      className={cn(
        "pointer-events-none fixed inset-0 z-[190] flex items-start justify-center pt-[18vh] transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-white/10 bg-black/75 px-5 py-3 shadow-[0_8px_32px_rgba(255,0,204,0.15)] backdrop-blur-md transition-transform duration-300",
          visible ? "translate-y-0 scale-100" : "-translate-y-2 scale-95",
        )}
      >
        <span className="navigation-spinner size-5 shrink-0 rounded-full border-2 border-brand-magenta/30 border-t-brand-magenta" />
        <span className="text-sm font-medium text-white/90">Loading…</span>
      </div>
    </div>
  );
}
