import { cn } from "@/lib/utils";

export interface PageLoaderProps {
  className?: string;
  label?: string;
  /** Full viewport height vs in-content skeleton. */
  variant?: "page" | "section";
}

/** Route-level loading fallback — skeleton + spinner aligned with AniVerse theme. */
export function PageLoader({
  className,
  label = "Loading page…",
  variant = "page",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex w-full flex-col gap-6 animate-pulse",
        variant === "page" ? "min-h-[50vh] px-1 py-8" : "py-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="navigation-spinner size-6 shrink-0 rounded-full border-2 border-brand-magenta/25 border-t-brand-magenta" />
        <span className="text-sm font-medium text-white/75">{label}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: variant === "page" ? 6 : 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/5"
          >
            <div className="h-28 bg-gradient-to-br from-brand-magenta/10 via-purple-500/10 to-transparent" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-2/3 rounded-full bg-white/10" />
              <div className="h-2.5 w-1/2 rounded-full bg-white/8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
